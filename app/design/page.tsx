"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface Project {
  title: string;
  url?: string;
  startYear: number;
  endYear?: number;
  count: number;
  folder: string;
  videos: number[];
  description: string;
}

const projects: Project[] = [
  {
    title: "NARROW MARGIN",
    url: "https://narrowmarginquarterly.com",
    startYear: 2025,
    count: 16,
    folder: "NM",
    videos: [4, 7],
    description:
      "is an internationally based quarterly cinema magazine dedicated to filmmakers historically neglected by mainstream and academic film discourse\n\nWhile serving on the editorial board, I built and designed the publication's website and visual identity across multiple print issues, social media graphics, and posters for events I have helped organize at institutions like MoMA, Anthology Film Archives, the ICA, and TIFF.",
  },

  {
    title: "PEEL STREET CINEMA",
    url: "https://peelstcinema.com",
    startYear: 2026,
    count: 5,
    folder: "peel",
    videos: [1, 2],
    description: "is a film society in Montréal which presents and contextualizes work across audiovisual history — from major historical films to marginalized or lesser-known works and contemporary local pieces.\n\nI led the redesign of their social media and art directed the logo redesign (illustrated by Kate Sianos, who also drew the site's calligraphy), and created their website.",
  },
  {
    title: "Heimdal Satellite Technologies Ltd",
    startYear: 2025,
    endYear: 2026,
    count: 7,
    folder: "hsat",
    videos: [],
    description:
      "HSAT is a London-based agricultural data science firm turning satellite imagery, weather data, and on-the-ground field intelligence into forecasts and reports relied on by farmers, local governments, and food and beverage companies.\n\nI spent a year as a full-time software engineer building the data pipelines powering these reports and leading a full redesign of the platform.",
  },
  {
    title: "PETAL MAG",
    startYear: 2025,
    endYear: 2026,
    count: 5,
    folder: "Petal",
    videos: [2, 3, 5],
    description: "is an independently run, print-first arts and culture magazine, publishing an annual themed volume of essays, fiction, poetry, photography, and art from emerging and established women creatives.\n\nWorking closely with the founders I built and designed the publications website, translating their editorial vision into the site itself.",
  },
];

const SLIDE_MS = 650;
const SLIDE_DISTANCE = 14;

type SlidePhase = "idle" | "exit" | "enter-start" | "enter";

export default function Design() {
  const [projectIndex, setProjectIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [showBio, setShowBio] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const [slidePhase, setSlidePhase] = useState<SlidePhase>("idle");
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const isAnimatingProject = useRef(false);
  const autoAdvanceTimer = useRef<NodeJS.Timeout | null>(null);
  const projectIndexRef = useRef(projectIndex);
  const imageIndexRef = useRef(imageIndex);

  // Keep refs in sync with state after render
  useEffect(() => {
    projectIndexRef.current = projectIndex;
    imageIndexRef.current = imageIndex;
  }, [projectIndex, imageIndex]);

  // Auto-advance: 4500ms for images, wait for video end for videos
  useEffect(() => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);

    const currentNumber = imageIndexRef.current + 1;
    const currentProject = projects[projectIndexRef.current];
    const isVideo = currentProject.videos.includes(currentNumber);

    if (!isVideo) {
      autoAdvanceTimer.current = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          const currentProject = projects[projectIndexRef.current];
          let newImageIndex = imageIndexRef.current + 1;
          let newProjectIndex = projectIndexRef.current;

          if (newImageIndex >= currentProject.count) {
            newProjectIndex = (projectIndexRef.current + 1) % projects.length;
            newImageIndex = 0;
          }

          setProjectIndex(newProjectIndex);
          setImageIndex(newImageIndex);
          setFadeOut(false);
        }, 0);
      }, 4500);
    }

    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, [imageIndex, projectIndex]);

  // In-project image navigation (click)
  const advanceImage = (direction: 1 | -1) => {
    setFadeOut(true);
    setTimeout(() => {
      const currentProject = projects[projectIndexRef.current];
      let newImageIndex = imageIndexRef.current + direction;
      let newProjectIndex = projectIndexRef.current;

      if (newImageIndex >= currentProject.count) {
        newProjectIndex = (projectIndexRef.current + 1) % projects.length;
        newImageIndex = 0;
      } else if (newImageIndex < 0) {
        newProjectIndex = (projectIndexRef.current - 1 + projects.length) % projects.length;
        newImageIndex = projects[newProjectIndex].count - 1;
      }

      setProjectIndex(newProjectIndex);
      setImageIndex(newImageIndex);
      setFadeOut(false);
    }, 0);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeftHalf = e.clientX - rect.left < rect.width / 2;
    advanceImage(isLeftHalf ? -1 : 1);
  };

  // Scroll-driven project change — slide animation
  const changeProject = (direction: 1 | -1) => {
    if (isAnimatingProject.current) return;
    isAnimatingProject.current = true;

    setSlideDirection(direction);
    setSlidePhase("exit");

    setTimeout(() => {
      setProjectIndex((prev) => (prev + direction + projects.length) % projects.length);
      setImageIndex(0);
      setSlidePhase("enter-start");

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
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isAnimatingProject.current) return;
    changeProject(e.deltaY > 0 ? 1 : -1);
  };

  const currentProject = projects[projectIndex];
  const currentNumber = imageIndex + 1;
  const isVideo = currentProject.videos?.includes(currentNumber) ?? false;
  const currentMedia = isVideo
    ? `/design/${currentProject.folder}/${currentNumber}.mov`
    : `/design/${currentProject.folder}/${currentNumber}.png` ||
      `/design/${currentProject.folder}/${currentNumber}.mp4` ||
      `/design/${currentProject.folder}/${currentNumber}.jpg` ||
      `/design/${currentProject.folder}/${currentNumber}.webp`;

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
    <div
      className="h-screen w-full bg-background overflow-hidden relative max-lg:flex max-lg:flex-col"
      onWheel={handleWheel}
    >
      {/* LORE SCHWARTZ Label — fixed, no slide animation */}
      <Link
        href="/"
        className="text-sm fixed cursor-pointer hover:underline top-4 left-1/2 -translate-x-1/2 lg:left-4 lg:translate-x-0 lg:top-[55%] font-light tracking-widest text-gray-700 z-10"
      >
        LORE SCHWARTZ
      </Link>

      {/* Image/Video — positioned left on desktop, centered on mobile */}
      <div className="h-full w-full flex items-center lg:justify-start p-4 lg:p-8 lg:pl-[16%] xl:pl-[13%] overflow-hidden max-lg:flex-1 max-lg:order-2 max-lg:px-4 max-lg:pt-12 max-lg:pb-2 max-lg:justify-center">
        <div
          className="w-full max-w-[500px] h-auto flex items-center justify-center group cursor-pointer"
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
          {isVideo ? (
            <video
              key={currentMedia}
              src={currentMedia}
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              className={`max-w-full max-h-[80vh] lg:max-h-[92vh] max-lg:max-h-[72vh] object-contain transition-opacity duration-500 ease-in-out ${
                fadeOut ? "opacity-0" : "opacity-100"
              }`}
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={currentMedia}
              alt={`${currentProject.title} - Image ${currentNumber}`}
              className={`max-w-full max-h-[80vh] lg:max-h-[92vh] max-lg:max-h-[50vh] object-contain transition-opacity duration-500 ease-in-out ${
                fadeOut ? "opacity-0" : "opacity-100"
              }`}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `/design/${currentProject.folder}/${currentNumber}.jpg` ||
                  `/design/${currentProject.folder}/${currentNumber}.png` ||
                  `/design/${currentProject.folder}/${currentNumber}.webp`;
              }}
            />
          )}
        </div>
      </div>

      {/* Title + toggle box — center column on desktop, stacked on mobile */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 lg:bottom-auto lg:hidden xl:block xl:left-[55%] 2xl:left-[48%] lg:translate-x-0 lg:top-[55%] overflow-hidden max-lg:static max-lg:translate-x-0 max-lg:w-full max-lg:px-4 max-lg:pt-3 max-lg:pb-3 max-lg:order-3">
        <div
          className="text-lg lg:text-sm flex flex-row gap-2 font-light tracking-widest text-dark text-center lg:text-left items-start max-lg:justify-center max-lg:items-center"
          style={slideStyle}
        >
          <div
            className="cursor-pointer h-4 w-4 bg-dark hidden text-lg lg:block flex-shrink-0 mt-1"
            onClick={() => setShowBio(!showBio)}
          />
          
          <span className="break-words max-w-[200px] uppercase">
            {currentProject.title} • {projectIndex + 1}/{projects.length}
          </span>
        </div>
      </div>

      {/* Project List — only visible when toggle is clicked */}
      <div
        className={`absolute flex flex-col gap-2 bottom-2 left-1/2 max-w-[150px]  xl:left-[55%] 2xl:left-[48%] -translate-x-1/2 lg:bottom-auto lg:left-[48%] lg:translate-x-0 lg:top-[60%] font-light tracking-widest text-dark text-xs text-center lg:text-left transition-opacity duration-500 ease-in-out max-lg:inset-x-0 max-lg:left-0 max-lg:right-0 max-lg:translate-x-0 max-lg:bottom-auto max-lg:top-1/2 max-lg:-translate-y-1/2 max-lg:z-20 max-lg:bg-background max-lg:px-6 max-lg:py-8 max-lg:gap-4 ${
          showBio ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {projects.map(
          (project, idx) =>
            idx !== projectIndex && (
              <button
                key={idx}
                onClick={() => {
                  setProjectIndex(idx);
                  setImageIndex(0);
                }}
                className="cursor-pointer uppercase opacity-50 text-center lg:text-left hover:opacity-100 transition-opacity"
              >
                {project.title} 
              </button>
            )
        )}
      </div>

      {/* Description + Year wrapper — year at far right, description 16 gap to its left */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 lg:bottom-auto lg:right-4 lg:left-auto lg:translate-x-0 lg:top-[55%] flex flex-col lg:flex-row gap-4 lg:gap-16 items-center lg:items-start transition-opacity duration-500 ease-in-out max-lg:static max-lg:translate-x-0 max-lg:w-full max-lg:px-6 max-lg:pb-6 max-lg:gap-0 max-lg:flex-none max-lg:order-4 max-lg:mt-auto ${
          showBio ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={slideStyle}
      >
        <div className="text-xs text-center lg:text-right max-w-[80%] lg:max-w-[220px] max-lg:max-w-full max-lg:w-full">
          <div className="flex items-center justify-between gap-2 pb-4 block xl:hidden max-lg:hidden">
            <div
              className="cursor-pointer h-4 w-4 bg-dark hidden text-lg lg:block flex-shrink-0 mt-1"
              onClick={() => setShowBio(!showBio)}
            />
            <span className="break-words max-w-[200px] text-sm">
              {currentProject.title}
            </span>
          </div>
          <p className="font-light text-justify tracking-widest text-dark whitespace-pre-line ">
            {currentProject.url ? (
              <>
                <a
                  href={currentProject.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
                >
                  {currentProject.title}
                </a>
                {" "}{currentProject.description}
              </>
            ) : (
              `${currentProject.title} ${currentProject.description}`
            )}
          </p>
        </div>

        <div className="hidden lg:block text-sm font-light tracking-widest text-dark">
          {currentProject.endYear
            ? currentProject.endYear === currentProject.startYear
              ? `${currentProject.startYear}`
              : `${currentProject.startYear} — ${currentProject.endYear}`
            : `${currentProject.startYear} —`}
        </div>
      </div>
    </div>
  );
}
