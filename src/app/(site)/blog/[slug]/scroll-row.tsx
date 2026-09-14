"use client";

import { cn } from "cn";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

export function ScrollRow({
  heading,
  className,
  children,
}: {
  heading: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      const max = element.scrollWidth - element.clientWidth;
      setEdges({ start: element.scrollLeft > 1, end: element.scrollLeft < max - 1 });
    };

    update();
    element.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      element.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  const scrollByCard = (direction: -1 | 1) => {
    const element = ref.current;
    if (!element) return;
    const card = element.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
    const step = card ? card.offsetWidth + gap : element.clientWidth;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollBy({ left: direction * step, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <>
      <div className="flex shrink-0 flex-col gap-6 lg:w-1/6">
        {heading}
        {(edges.start || edges.end) && (
          <div className="hidden gap-2 lg:flex">
            <ArrowButton direction={-1} disabled={!edges.start} onClick={scrollByCard}>
              Previous posts
            </ArrowButton>
            <ArrowButton direction={1} disabled={!edges.end} onClick={scrollByCard}>
              Next posts
            </ArrowButton>
          </div>
        )}
      </div>

      <div className={cn("relative", className)}>
        <ul
          ref={ref}
          className="flex flex-col gap-4 lg:-m-1 lg:snap-x lg:scroll-px-1 lg:scrollbar-none lg:flex-row lg:overflow-x-auto lg:p-1 lg:after:w-px lg:after:shrink-0 lg:after:content-['']"
        >
          {children}
        </ul>
        <Fade side="start" visible={edges.start} />
        <Fade side="end" visible={edges.end} />
      </div>
    </>
  );
}

function ArrowButton({
  direction,
  disabled,
  onClick,
  children,
}: {
  direction: -1 | 1;
  disabled: boolean;
  onClick: (direction: -1 | 1) => void;
  children: string;
}) {
  return (
    <Button
      variant="secondaryGrey"
      aria-label={children}
      disabled={disabled}
      focusableWhenDisabled
      onClick={() => onClick(direction)}
      className="size-6 p-0 transition-opacity aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
    >
      <span aria-hidden="true">{direction < 0 ? "←" : "→"}</span>
    </Button>
  );
}

function Fade({ side, visible }: { side: "start" | "end"; visible: boolean }) {
  const direction = side === "start" ? "right" : "left";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -inset-y-1 hidden w-104 transition-opacity lg:block",
        side === "start" ? "-left-1" : "-right-1",
        visible ? "opacity-100" : "opacity-0",
      )}
      style={{
        backgroundImage: `linear-gradient(to ${direction}, var(--color-basement-black), transparent)`,
      }}
    >
      <div
        className="bg-noise absolute inset-0 opacity-20"
        style={{ maskImage: `linear-gradient(to ${direction}, black, transparent)` }}
      />
    </div>
  );
}
