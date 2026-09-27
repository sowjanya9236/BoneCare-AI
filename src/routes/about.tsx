import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — BoneCare AI" },
      {
        name: "description",
        content:
          "BoneCare AI is a decision-support interface for bone cancer treatment planning, built for clinicians and students.",
      },
      { property: "og:title", content: "About — BoneCare AI" },
      {
        property: "og:description",
        content:
          "Why BoneCare AI exists, what it does, and the limits of its predictions.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="bg-hero">
      <div className="mx-auto max-w-3xl px-5 py-20">
        <h1 className="text-4xl font-extrabold md:text-5xl">About BoneCare AI</h1>
        <div className="card-surface mt-10 space-y-5 p-8 text-muted-foreground">
          <p>
            BoneCare AI turns routine clinical inputs into a structured view of
            likely treatment path, stage, procedure complexity and recovery
            time — so conversations with patients start from something concrete.
          </p>
          <p>
            It is built as a support layer, not a replacement for imaging,
            biopsy or an oncologist's judgement. Every prediction should be read
            alongside the full clinical picture.
          </p>
          <p>
            The interface is intentionally quiet: one card for patient data, one
            set of cards for the result, and clear post-treatment guidance.
          </p>
        </div>
      </div>
    </div>
  );
}
