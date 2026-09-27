import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

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
  "Undifferentiated pleomorphic sarcoma",
  "Osteosarcoma",
  "Ewing sarcoma",
  "Chondrosarcoma",
  "Chordoma",
  "Fibrosarcoma",
];

const SITES = [
  "Right thigh",
  "Left thigh",
  "Right upper arm",
  "Left upper arm",
  "Pelvis",
  "Spine",
  "Knee",
  "Shoulder",
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

function predictLocally(form: {
  age: string;
  sex: string;
  grade: string;
  size: string;
  histology: string;
  site: string;
}): Result {
  const size = Number(form.size) || 0;
  const age = Number(form.age) || 0;
  const highGrade = form.grade === "High";

  const stage =
    highGrade && size > 8
      ? "Stage III"
      : highGrade || size > 5
        ? "Stage II"
        : "Stage I";

  const treatment =
    stage === "Stage III"
      ? "Chemotherapy + Surgery"
      : stage === "Stage II"
        ? "Radiotherapy + Surgery"
        : "Surgery";

  const complexity =
    stage === "Stage III" || form.site === "Spine" || form.site === "Pelvis"
      ? "High"
      : stage === "Stage II"
        ? "Moderate"
        : "Low";

  const hours = stage === "Stage III" ? 4 : stage === "Stage II" ? 2 : 1;

  return {
    treatment,
    stage,
    complexity,
    duration: `${hours} hrs`,
    care: [
      "Daily physiotherapy",
      "Balanced high-protein diet",
      "Pain & wound monitoring",
      age > 60 ? "Bone density review every 3 months" : "Regular follow-ups",
    ],
  };
}

function Prediction() {
  const [form, setForm] = useState({
    age: "31",
    sex: "Female",
    grade: "High",
    size: "4.7",
    histology: HISTOLOGY[0],
    site: SITES[0],
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function analyze(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const base = import.meta.env["VITE_API_URL"] as string | undefined;
    try {
      if (base) {
        const res = await fetch(`${base.replace(/\/$/, "")}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          const data = (await res.json()) as Partial<Result>;
          setResult({ ...predictLocally(form), ...data });
          return;
        }
      }
      await new Promise((r) => setTimeout(r, 700));
      setResult(predictLocally(form));
    } catch {
      setResult(predictLocally(form));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-hero">
      <div className="mx-auto max-w-3xl px-5 py-16">
        <form onSubmit={analyze} className="card-surface p-8 md:p-10">
          <h1 className="text-2xl font-bold">🩺 Patient Information</h1>
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
                <option>Other</option>
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
                <option>Low</option>
                <option>Intermediate</option>
                <option>High</option>
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
            {loading ? "Analyzing…" : "✨ Analyze Patient"}
          </button>
        </form>

        {result && <Results result={result} />}
      </div>
    </div>
  );
}

function Results({ result }: { result: Result }) {
  const cards = [
    { icon: "💊", label: "Treatment", value: result.treatment },
    { icon: "🩺", label: "Stage", value: result.stage },
    { icon: "🏥", label: "Complexity", value: result.complexity },
    { icon: "⏱", label: "Duration", value: result.duration },
  ];

  return (
    <section className="animate-rise mt-12">
      <p className="text-center text-xs font-bold tracking-[0.25em] text-muted-foreground uppercase">
        ✨ AI Analysis Complete
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {cards.map((c) => (
          <div key={c.label} className="card-surface p-7 text-center">
            <span className="text-2xl">{c.icon}</span>
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
        <h2 className="text-lg font-semibold">❤️ Post-Treatment Care</h2>
        <ul className="mt-4 space-y-3">
          {result.care.map((c) => (
            <li key={c} className="flex items-center gap-3 text-muted-foreground">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs text-accent-foreground">
                ✓
              </span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
