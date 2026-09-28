import { createFileRoute, Link } from "@tanstack/react-router";
import howInput from "@/assets/how-input.jpg";
import predictionReview from "@/assets/prediction-review.jpg";
import aboutTheater from "@/assets/about-theater.jpg";
import planXray from "@/assets/plan-xray.png.asset.json";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  {
    n: "01",
    title: "Enter patient details",
    text: "Age, sex, grade, tumour size, histological type and primary site.",
    image: howInput,
    alt: "Doctor entering patient information during a consultation",
  },
  {
    n: "02",
    title: "Run the analysis",
    text: "The model weighs grade and tumour burden against histology and site.",
    image: predictionReview,
    alt: "Doctors reviewing a bone X-ray on a monitor",
  },
  {
    n: "03",
    title: "Review the plan",
    text: "Treatment, stage, complexity, duration and post-treatment care.",
    image: planXray.url,
    alt: "Two X-ray views of a femur and knee on a radiology lightbox",
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

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="card-surface overflow-hidden">
              <img src={s.image} alt={s.alt} width={1024} height={1024} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <div className="p-6">
                <span className="text-gradient font-display text-3xl font-extrabold">{s.n}</span>
                <h2 className="mt-3 text-xl font-semibold">{s.title}</h2>
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
