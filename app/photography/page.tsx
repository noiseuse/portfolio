"use client";

import Link from "next/link";
import { useState, useRef, useCallback, useEffect } from "react";

const projects = [
  { title: "TRADE WINDS", year: 2026, count: 20, folder: "tradewinds" },
  { title: "THE COLOUR OF THE HEAVY HEMLOCKS", year: 2025, count: 17, folder: "hemlocks" },
  { title: "TRACTION", year: 2025, count: 20, folder: "traction" },
  { title: "LEARNING TO RUN", year: 2024, count: 17, folder: "run" },
];

const SLIDE_MS = 650;      // was 400 — slower, more deliberate
const SLIDE_DISTANCE = 14; // was 28 — smaller, more subtle movement // px the content travels

type SlidePhase = "idle" | "exit" | "enter-start" | "enter";

export default function Photography() {
  const [projectIndex, setProjectIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [showBio, setShowBio] = useState(false);
  const [fadeOut, setFadeOut] = useState(false); // used for in-project (click/auto) image changes only

  const [slidePhase, setSlidePhase] = useState<SlidePhase>("idle");
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const isAnimatingProject = useRef(false);

  const autoAdvanceTimer = useRef<NodeJS.Timeout | null>(null);

  // --- In-project image navigation (click) — unchanged fade behavior ---
  const advanceImage = useCallback(
    (direction: 1 | -1) => {
      setFadeOut(true);
      setTimeout(() => {
        setProjectIndex((prevProjectIndex) => {
          const currentProject = projects[prevProjectIndex];
          setImageIndex((prevImageIndex) => {
            let newImageIndex = prevImageIndex + direction;
            let newProjectIndex = prevProjectIndex;

            if (newImageIndex >= currentProject.count) {
              newProjectIndex = (prevProjectIndex + 1) % projects.length;
              newImageIndex = 0;
            } else if (newImageIndex < 0) {
              newProjectIndex = (prevProjectIndex - 1 + projects.length) % projects.length;
              newImageIndex = projects[newProjectIndex].count - 1;
            }
            if (newProjectIndex !== prevProjectIndex) setProjectIndex(newProjectIndex);
            setFadeOut(false);
            return newImageIndex;
          });
          return prevProjectIndex;
        });
      }, 0);
    },
    []
  );

  // Auto-advance within the current project every 4500ms
  useEffect(() => {
    const timer = setInterval(() => {
      setImageIndex((prevImageIndex) => {
        const currentProject = projects[projectIndex];
        const nextImageIndex = (prevImageIndex + 1) % currentProject.count;
        return nextImageIndex;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [projectIndex]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeftHalf = e.clientX - rect.left < rect.width / 2;
    advanceImage(isLeftHalf ? -1 : 1);
  };

  // --- Scroll-driven project change — slide animation ---
  const changeProject = useCallback(
    (direction: 1 | -1) => {
      if (isAnimatingProject.current) return;
      isAnimatingProject.current = true;

      setSlideDirection(direction);
      setSlidePhase("exit"); // current content slides out + fades

      setTimeout(() => {
        setProjectIndex((prev) => (prev + direction + projects.length) % projects.length);
        setImageIndex(0);
        setSlidePhase("enter-start"); // new content placed off-screen, no transition

        // double rAF ensures the browser paints the "enter-start" position
        // before we flip to "enter", so the transition actually animates
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setSlidePhase("enter");
          });
        });

        setTimeout(() => {
          setSlidePhase("idle");
          isAnimatingProject.current = false;
        }, SLIDE_MS);
      }, SLIDE_MS);
    },
    []
  );

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isAnimatingProject.current) return;
    changeProject(e.deltaY > 0 ? 1 : -1);
  };

  const currentProject = projects[projectIndex];
  const currentImage = `/photography/${currentProject.folder}/${imageIndex + 1}.jpg`;

  // Shared transform/opacity/transition for the sliding elements
  const slideStyle = {
  transform:
    slidePhase === "exit"
      ? `translateY(${slideDirection * -SLIDE_DISTANCE}px)`
      : slidePhase === "enter-start"
      ? `translateY(${slideDirection * SLIDE_DISTANCE}px)`
      : "translateY(0px)",
  opacity: slidePhase === "idle" || slidePhase === "enter" ? 1 : 0,
  transition:
    slidePhase === "enter-start"
      ? "none"
      : `transform ${SLIDE_MS}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${SLIDE_MS}ms ease-out`,
};

  return (
    <div className="h-screen w-full bg-background overflow-hidden relative" onWheel={handleWheel}>
      {/* LORE SCHWARTZ Label — fixed, no slide animation */}
      <Link 
        href="/"
        className="text-sm fixed cursor-pointer hover:underline top-4 left-1/2 -translate-x-1/2 lg:left-4 lg:translate-x-0 lg:top-[56%] lg:-translate-y-1/2 font-light tracking-widest text-gray-700 z-10">
        LORE SCHWARTZ
      </Link>

      {/* Title/Year — clipped wrapper so the slide is contained */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 lg:bottom-auto lg:left-auto lg:translate-x-0 lg:top-[55%] lg:right-4 overflow-hidden">
        <div
          className="text-sm flex flex-row gap-2 font-light tracking-widest text-dark text-center lg:text-right items-start"
          style={slideStyle}
        >
          <div
            className="cursor-pointer h-4 w-4 bg-dark hidden lg:block flex-shrink-0 mt-1"
            onClick={() => setShowBio(!showBio)}
          />
          <span className="break-words max-w-[200px]">
            {currentProject.title} • {projectIndex + 1}/{projects.length}
          </span>
        </div>
      </div>

      {/* Project List — only visible when toggle is clicked, fades in like home bio */}
      <div className={`absolute flex flex-col gap-2 bottom-12 left-1/2 -translate-x-1/2 lg:bottom-auto lg:left-auto lg:translate-x-0 lg:top-[65%] lg:right-4 font-light tracking-widest text-dark text-xs text-center lg:text-right transition-opacity duration-500 ease-in-out ${
        showBio ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}>
          {projects.map(
            (project, idx) =>
              idx !== projectIndex && (
                <button
                  key={idx}
                  onClick={() => {
                    setProjectIndex(idx);
                    setImageIndex(0);
                  }}
                  className="cursor-pointer opacity-50 text-center md:text-right hover:opacity-100 duration-500 transition-opacity"
                >
                  {project.title}
                </button>
              )
          )}
        </div>
      

      {/* Image Container — clipped wrapper so the slide is contained */}
      <div className="h-full w-full flex items-center justify-center p-4 md:p-8 overflow-hidden">
        <div
          className="w-full max-w-[600px] xl:max-w-[900px] h-auto flex items-center justify-center group cursor-pointer"
          onClick={handleImageClick}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const isLeftHalf = e.clientX - rect.left < rect.width / 2;
            const svg = isLeftHalf
              ? `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="%23FFFFFF" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>') 0 16, auto`
              : `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="%23FFFFFF" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>') 32 16, auto`;
            e.currentTarget.style.cursor = svg;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.cursor = "default";
          }}
          style={slideStyle}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage}
            alt={`${currentProject.title} - Image ${imageIndex + 1}`}
            className="max-w-full max-h-[80vh] md:max-h-[92vh] object-contain transition-opacity duration-500 ease-in-out"
          />
        </div>
      </div>
    </div>
  );
}