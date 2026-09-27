import { createFileRoute, Link } from "@tanstack/react-router";
import heroBone from "@/assets/hero-bone.png";
import { Zap, Brain, HeartPulse, Stethoscope, Pill, ScanLine } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BoneCare AI — AI-Powered Bone Cancer Prediction" },
      {
        name: "description",
        content:
          "Enter patient details and get AI-assisted treatment, stage, complexity and recovery insights in seconds.",
      },
      { property: "og:title", content: "BoneCare AI — AI-Powered Bone Cancer Prediction" },
      {
        property: "og:description",
        content:
          "Early insights. Smarter treatment decisions. AI-assisted bone cancer analysis for clinicians.",
      },
    ],
  }),
  component: Index,
});

const highlights = [
  {
    Icon: Zap,
    title: "Instant analysis",
    text: "Six clinical inputs, a full recommendation set in seconds.",
  },
  {
    Icon: Brain,
    title: "Trained on patterns",
    text: "Grade, size, histology and site are weighed together.",
  },
  {
    Icon: HeartPulse,
    title: "Care planning",
    text: "Post-treatment guidance alongside every prediction.",
  },
];

function Index() {
  return (
    <>
      <section className="bg-hero">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:py-28">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <ScanLine className="size-4" /> Clinical decision support
            </span>
            <h1 className="mt-6 text-4xl leading-[1.05] font-extrabold md:text-6xl">
              AI-Powered <span className="text-gradient">Bone Cancer</span>{" "}
              Prediction
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Early insights. Smarter treatment decisions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/prediction"
                className="rounded-full bg-gradient-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-elevated transition-transform hover:-translate-y-0.5"
              >
                Start Prediction →
              </Link>
              <Link
                to="/how-it-works"
                className="rounded-full border border-border bg-card px-7 py-3.5 font-semibold transition-colors hover:bg-secondary"
              >
                How it works
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute inset-10 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
            <img
              src={heroBone}
              alt="Glowing medical scan of a femur bone"
              width={1024}
              height={1024}
              className="animate-float relative w-64 drop-shadow-2xl md:w-80"
            />
            <div className="card-surface absolute top-6 left-0 px-4 py-3 text-sm font-semibold">
              <span className="inline-flex items-center gap-2"><Stethoscope className="size-4 text-primary" /> Stage detection</span>
            </div>
            <div className="card-surface absolute right-0 bottom-10 px-4 py-3 text-sm font-semibold">
              <span className="inline-flex items-center gap-2"><Pill className="size-4 text-primary" /> Treatment plan</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {highlights.map((h) => (
            <div key={h.title} className="card-surface p-7">
              <h.Icon className="size-7 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{h.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{h.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
