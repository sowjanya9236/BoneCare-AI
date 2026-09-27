import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — BoneCare AI" },
      {
        name: "description",
        content:
          "Three steps: enter patient details, run the AI analysis, review treatment, stage, complexity and recovery guidance.",
      },
      { property: "og:title", content: "How It Works — BoneCare AI" },
      {
        property: "og:description",
        content:
          "See how BoneCare AI turns six clinical inputs into a full treatment insight card set.",
      },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  {
    n: "01",
    title: "Enter patient details",
    text: "Age, sex, grade, tumour size, histological type and primary site.",
  },
  {
    n: "02",
    title: "Run the analysis",
    text: "The model weighs grade and tumour burden against histology and site.",
  },
  {
    n: "03",
    title: "Review the plan",
    text: "Treatment, stage, complexity, duration and post-treatment care.",
  },
];

function HowItWorks() {
  return (
    <div className="bg-hero">
      <div className="mx-auto max-w-4xl px-5 py-20">
        <h1 className="text-4xl font-extrabold md:text-5xl">How it works</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          A short clinical workflow designed to fit between consultation and
          treatment planning.
        </p>

        <div className="mt-12 space-y-5">
          {steps.map((s) => (
            <div key={s.n} className="card-surface flex gap-5 p-7">
              <span className="text-gradient font-display text-3xl font-extrabold">
                {s.n}
              </span>
              <div>
                <h2 className="text-xl font-semibold">{s.title}</h2>
                <p className="mt-2 text-muted-foreground">{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        <Link
          to="/prediction"
          className="mt-10 inline-block rounded-full bg-gradient-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-elevated transition-transform hover:-translate-y-0.5"
        >
          Start Prediction →
        </Link>
      </div>
    </div>
  );
}
