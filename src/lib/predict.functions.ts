import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import meta from "./model/meta.json";
import treatmentModel from "./model/Treatment.json";
import stageModel from "./model/Predicted_Stage.json";
import durationModel from "./model/Surgical_Duration.json";
import { gunzipSync } from "zlib";
import complexityGz from "./model/Surgical_Complexity.json.gz?inline";
import careGz from "./model/Post_Treatment_Care_Instructions.json.gz?inline";

type TreeNode = {
  nodeid: number;
  split?: string;
  split_condition?: number;
  yes?: number;
  no?: number;
  missing?: number;
  leaf?: number;
  children?: TreeNode[];
};

type ModelFile = {
  trees: TreeNode[];
  base_score: number;
  n_classes: number;
};

const FEATURE_COLS = [
  "Age",
  "Sex",
  "Grade",
  "Histological type",
  "Site of primary STS",
  "Tumor_Size",
] as const;

const inputSchema = z.object({
  Age: z.coerce.number(),
  Sex: z.string(),
  Grade: z.string(),
  "Histological type": z.string(),
  "Site of primary STS": z.string(),
  Tumor_Size: z.coerce.number(),
});

function encodeFeatures(input: z.infer<typeof inputSchema>): number[] {
  const encoders = meta.feature_encoders as Record<string, string[]>;
  return FEATURE_COLS.map((col) => {
    const raw = input[col];
    if (col === "Age" || col === "Tumor_Size") return Number(raw);
    const classes = encoders[col];
    if (!classes) throw new Error(`No encoder for ${col}`);
    const idx = classes.indexOf(String(raw));
    if (idx === -1)
      throw new Error(`Unknown value "${raw}" for ${col}. Expected one of: ${classes.join(", ")}`);
    return idx;
  });
}

function traverse(node: TreeNode, features: number[]): number {
  if (node.leaf !== undefined) return node.leaf;
  const colIdx = FEATURE_COLS.indexOf(node.split as (typeof FEATURE_COLS)[number]);
  const value = features[colIdx];
  const goYes = value !== undefined && value < (node.split_condition ?? 0);
  const nextId = goYes ? node.yes : node.no;
  const child = node.children?.find((c) => c.nodeid === nextId);
  if (!child) return 0;
  return traverse(child, features);
}

function predict(model: ModelFile, features: number[]): number {
  const n = model.n_classes;
  // base_score 0.5 -> logit(0.5) = 0 base margin
  const base = model.base_score > 0 && model.base_score < 1
    ? Math.log(model.base_score / (1 - model.base_score))
    : 0;
  const margins = new Array<number>(n).fill(base);
  model.trees.forEach((tree, i) => {
    margins[i % n]! += traverse(tree, features);
  });
  const max = Math.max(...margins);
  const exps = margins.map((m) => Math.exp(m - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  let best = 0;
  let bestP = -1;
  exps.forEach((e, i) => {
    const p = e / sum;
    if (p > bestP) {
      bestP = p;
      best = i;
    }
  });
  return best;
}

function loadGzModel(dataUri: string): ModelFile {
  const base64 = dataUri.slice(dataUri.indexOf(",") + 1);
  const buf = gunzipSync(Buffer.from(base64, "base64"));
  return JSON.parse(buf.toString("utf-8")) as ModelFile;
}

export const predictPatient = createServerFn({ method: "POST" })
  .inputValidator((data) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const features = encodeFeatures(data);
    const complexityModel = loadGzModel(complexityGz);
    const careModel = loadGzModel(careGz);

    const models: Record<string, ModelFile> = {
      Treatment: treatmentModel as ModelFile,
      Predicted_Stage: stageModel as ModelFile,
      Surgical_Duration: durationModel as ModelFile,
      Surgical_Complexity: complexityModel,
      Post_Treatment_Care_Instructions: careModel,
    };

    const encoders = meta.target_encoders as Record<string, string[]>;
    const predictions: Record<string, string> = {};
    for (const [target, model] of Object.entries(models)) {
      const idx = predict(model, features);
      predictions[target] = encoders[target]![idx]!;
    }
    return predictions;
  });
