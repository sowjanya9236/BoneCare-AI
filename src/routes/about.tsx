import { createFileRoute } from "@tanstack/react-router";
import scanTumor from "@/assets/scan-tumor.png";
import scanKnee from "@/assets/scan-knee.png";
import scanSpine from "@/assets/scan-spine.png";

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

        <h2 className="mt-12 text-2xl font-bold">Bone cancer in imaging</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <figure className="card-surface overflow-hidden">
            <img
              src={scanTumor}
              alt="Radiograph of a femur showing an osteosarcoma near the knee"
              width={1024}
              height={1024}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
            <figcaption className="p-4 text-xs text-muted-foreground">
              Osteosarcoma visible on a femur radiograph
            </figcaption>
          </figure>
          <figure className="card-surface overflow-hidden">
            <img
              src={scanKnee}
              alt="X-ray style scan of a knee joint with a tumour highlighted in red"
              width={1024}
              height={1024}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
            <figcaption className="p-4 text-xs text-muted-foreground">
              Lesion highlighted at the knee joint
            </figcaption>
          </figure>
          <figure className="card-surface overflow-hidden">
            <img
              src={scanSpine}
              alt="X-ray style scan of the spine and pelvis with a vertebra highlighted"
              width={1024}
              height={1024}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
            <figcaption className="p-4 text-xs text-muted-foreground">
              Affected vertebra in the lower spine
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
