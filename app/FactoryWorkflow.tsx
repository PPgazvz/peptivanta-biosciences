"use client";

import { useEffect, useRef, useState } from "react";

const workflowMedia = [
  { video: "/media/factory-prepare.mp4", poster: "/media/factory-prepare.webp" },
  { video: "/media/factory-process.mp4", poster: "/media/factory-process.webp" },
  { video: "/media/factory-label.mp4", poster: "/media/factory-label.webp" },
  { video: "/media/factory-pack.mp4", poster: "/media/factory-pack.webp" },
  { video: "/media/factory-inventory.mp4", poster: "/media/factory-inventory.webp" },
] as const;

type FactoryWorkflowProps = {
  tag: string;
  title: string;
  text: string;
  mediaLabel: string;
  hint: string;
  steps: readonly (readonly [string, string, string, string])[];
};

export default function FactoryWorkflow({
  tag,
  title,
  text,
  mediaLabel,
  hint,
  steps,
}: FactoryWorkflowProps) {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const active = steps[activeStep];
  const media = workflowMedia[activeStep];

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 821px)");
    let observer: IntersectionObserver | null = null;

    function updateObserver() {
      observer?.disconnect();
      observer = null;

      // Desktop keeps the scroll-led story. On phones the stage only changes
      // after an intentional tap, so the video cannot change while it is off-screen.
      if (!desktopQuery.matches) return;

      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

          if (visible) {
            setActiveStep(Number((visible.target as HTMLElement).dataset.workflowStep));
          }
        },
        {
          rootMargin: "-26% 0px -48% 0px",
          threshold: [0.15, 0.35, 0.6],
        },
      );

      stepRefs.current.forEach((step) => {
        if (step) observer?.observe(step);
      });
    }

    updateObserver();
    desktopQuery.addEventListener("change", updateObserver);

    return () => {
      desktopQuery.removeEventListener("change", updateObserver);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoRef.current?.pause();
    }
  }, [activeStep]);

  return (
    <section className="factory-workflow" id="factory-workflow">
      <div className="section-shell">
        <div className="factory-workflow-heading">
          <div>
            <p className="section-tag">{tag}</p>
            <h2>{title}</h2>
          </div>
          <p>{text}</p>
        </div>

        <div className="factory-workflow-layout">
          <div className="factory-workflow-visual">
            <div className="factory-workflow-screen">
              <video
                key={media.video}
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={media.poster}
                aria-hidden="true"
              >
                <source src={media.video} type="video/mp4" />
              </video>
              <div className="factory-screen-grid" aria-hidden="true" />
              <div className="factory-screen-top">
                <span>{mediaLabel}</span>
                <i aria-hidden="true"><b />0{activeStep + 1} / 05</i>
              </div>
              <div className="factory-screen-caption" aria-live="polite">
                <span>{active[0]}</span>
                <div>
                  <small>{active[3]}</small>
                  <strong>{active[1]}</strong>
                </div>
              </div>
            </div>
            <p className="factory-workflow-hint">{hint}</p>
          </div>

          <div className="factory-workflow-steps" aria-label={hint}>
            {steps.map(([number, stepTitle, description, status], index) => (
              <button
                type="button"
                className={activeStep === index ? "active" : ""}
                data-workflow-step={index}
                aria-pressed={activeStep === index}
                key={number}
                ref={(element) => {
                  stepRefs.current[index] = element;
                }}
                onClick={() => setActiveStep(index)}
                onMouseEnter={() => setActiveStep(index)}
              >
                <span>{number}</span>
                <div>
                  <small>{status}</small>
                  <h3>{stepTitle}</h3>
                  <p>{description}</p>
                </div>
                <b aria-hidden="true">↗</b>
              </button>
            ))}
          </div>

          <div className="factory-workflow-mobile-detail" aria-live="polite">
            <small>{active[3]}</small>
            <div>
              <span>{active[0]}</span>
              <h3>{active[1]}</h3>
            </div>
            <p>{active[2]}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
