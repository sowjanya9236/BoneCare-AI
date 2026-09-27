import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Stethoscope, Pill, Hospital, Timer, HeartPulse, Sparkles, Check, TriangleAlert, ScanLine } from "lucide-react";
import { predictPatient } from "@/lib/predict.functions";
import doctor from "@/assets/doctor.png";
import scanKnee from "@/assets/scan-knee.png";

export const Route = createFileRoute("/prediction")({
  head: () => ({
    meta: [
      { title: "Prediction — BoneCare AI" },
      {
        name: "description",
        content:
          "Enter patient age, sex, grade, tumour size, histology and primary site for an AI-assisted treatment insight.",
      },
      { property: "og:title", content: "Prediction — BoneCare AI" },
      {
        property: "og:description",
        content:
          "AI-assisted treatment, stage, complexity and recovery insights from six clinical inputs.",
      },
    ],
  }),
  component: Prediction,
});

const HISTOLOGY = [
  "epithelioid sarcoma",
  "leiomyosarcoma",
  "malignant solitary fibrous tumor",
  "myxofibrosarcoma",
  "myxoid fibrosarcoma",
  "pleiomorphic leiomyosarcoma",
  "pleiomorphic spindle cell undifferentiated",
  "pleomorphic sarcoma",
  "poorly differentiated synovial sarcoma",
  "sclerosing epithelioid fibrosarcoma",
  "synovial sarcoma",
  "undifferentiated - pleiomorphic",
  "undifferentiated pleomorphic liposarcoma",
];

const SITES = [
  "left biceps",
  "left buttock",
  "left thigh",
  "parascapusular",
  "right buttock",
  "right parascapusular",
  "right thigh",
];

type Result = {
  treatment: string;
  stage: string;
  complexity: string;
  duration: string;
  care: string[];
};

const inputClass =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground shadow-soft outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring";
const labelClass = "mb-2 block text-sm font-semibold text-foreground";

function Prediction() {
  const runPrediction = useServerFn(predictPatient);
  const [form, setForm] = useState({
    age: "31",
    sex: "Female",
    grade: "High",
    size: "4.7",
    histology: HISTOLOGY[0]!,
    site: SITES[0]!,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function analyze(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await runPrediction({
        data: {
          Age: Number(form.age),
          Sex: form.sex,
          Grade: form.grade,
          "Histological type": form.histology,
          "Site of primary STS": form.site,
          Tumor_Size: Number(form.size),
        },
      });
      setResult({
        treatment: data["Treatment"]!,
        stage: data["Predicted_Stage"]!,
        complexity: data["Surgical_Complexity"]!,
        duration: data["Surgical_Duration"]!,
        care: data["Post_Treatment_Care_Instructions"]!
          .split(";")
          .map((s) => s.trim())
          .filter(Boolean),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prediction failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-hero">
      <div className="mx-auto max-w-5xl px-5 py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <form onSubmit={analyze} className="card-surface p-8 md:p-10">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Stethoscope className="size-6 text-primary" /> Patient Information
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter patient details for AI analysis
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="age">
                Age
              </label>
              <input
                id="age"
                type="number"
                min={0}
                max={120}
                required
                className={inputClass}
                value={form.age}
                onChange={(e) => set("age")(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="sex">
                Sex
              </label>
              <select
                id="sex"
                className={inputClass}
                value={form.sex}
                onChange={(e) => set("sex")(e.target.value)}
              >
                <option>Female</option>
                <option>Male</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="grade">
                Grade
              </label>
              <select
                id="grade"
                className={inputClass}
                value={form.grade}
                onChange={(e) => set("grade")(e.target.value)}
              >
                <option>High</option>
                <option>Intermediate</option>
                <option>Low</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="size">
                Tumor Size (cm)
              </label>
              <input
                id="size"
                type="number"
                step="0.1"
                min={0}
                max={60}
                required
                className={inputClass}
                value={form.size}
                onChange={(e) => set("size")(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="histology">
                Histological Type
              </label>
              <select
                id="histology"
                className={inputClass}
                value={form.histology}
                onChange={(e) => set("histology")(e.target.value)}
              >
                {HISTOLOGY.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="site">
                Primary Site
              </label>
              <select
                id="site"
                className={inputClass}
                value={form.site}
                onChange={(e) => set("site")(e.target.value)}
              >
                {SITES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-full bg-gradient-primary py-4 font-semibold text-primary-foreground shadow-elevated transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Sparkles className="size-5" />
              {loading ? "Analyzing…" : "Analyze Patient"}
            </span>
          </button>

          {error && (
            <p className="mt-4 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <TriangleAlert className="size-4 shrink-0" /> {error}
            </p>
          )}
        </form>

        {result && <Results result={result} />}
      </div>
    </div>
  );
}

function Results({ result }: { result: Result }) {
  const cards = [
    { Icon: Pill, label: "Treatment", value: result.treatment },
    { Icon: Stethoscope, label: "Stage", value: result.stage },
    { Icon: Hospital, label: "Complexity", value: result.complexity },
    { Icon: Timer, label: "Duration", value: result.duration },
  ];

  return (
    <section className="animate-rise mt-12">
      <p className="text-center text-xs font-bold tracking-[0.25em] text-muted-foreground uppercase">
        AI Analysis Complete
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {cards.map((c) => (
          <div key={c.label} className="card-surface p-7 text-center">
            <c.Icon className="mx-auto size-7 text-primary" />
            <p className="mt-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              {c.label}
            </p>
            <p className="text-gradient mt-2 font-display text-2xl font-bold">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <div className="card-surface mt-5 p-7">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <HeartPulse className="size-5 text-primary" /> Post-Treatment Care
        </h2>
        <ul className="mt-4 space-y-3">
          {result.care.map((c) => (
            <li key={c} className="flex items-center gap-3 text-muted-foreground">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs text-accent-foreground">
                <Check className="size-3.5" />
              </span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
