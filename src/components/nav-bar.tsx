"use client";

import { cn } from "cn";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { stegaClean } from "next-sanity";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { Logo } from "@/components/logo";
import { NewTabHint } from "@/components/new-tab-hint";
import { Button } from "@/components/ui/button";
import { TRANSITION } from "@/modules/motion";
import type { LAYOUT_QUERY_RESULT } from "@/modules/sanity/types";
import { isExternal } from "@/modules/utils";

type NavLinkData = NonNullable<NonNullable<LAYOUT_QUERY_RESULT>["navLinks"]>[number];
type NavCtaData = Omit<
  NonNullable<NonNullable<LAYOUT_QUERY_RESULT>["navCtas"]>[number],
  "variant"
> & { variant: string };

const CTA_VARIANT: Record<string, "primaryDark" | "primaryLight"> = {
  dark: "primaryDark",
  light: "primaryLight",
};

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavBar({ links, ctas }: { links: NavLinkData[]; ctas: NavCtaData[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close on Escape (returning focus to the toggle so keyboard users don't lose their place),
  // on pointer down outside the bar + panel, or when focus tabs out of the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onFocusOut = (e: FocusEvent) => {
      const next = e.relatedTarget as Node | null;
      if (next && !rootRef.current?.contains(next)) setOpen(false);
    };
    const root = rootRef.current;
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    root?.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      root?.removeEventListener("focusout", onFocusOut);
    };
  }, [open]);

  return (
    <MotionConfig reducedMotion="user" transition={TRANSITION.normal}>
      <header className="sticky top-0 z-50 w-full p-3 lg:p-6">
        <div ref={rootRef} className="relative mx-auto w-full max-w-343">
          <div
            className={cn(GLASS, "flex h-10 items-center justify-between gap-6 px-1.75 lg:h-12.5")}
          >
            <Link
              href="/"
              aria-label="basement.studio home"
              className="flex shrink-0 items-center px-2 text-white"
            >
              <Logo className="fill-basement-white" />
            </Link>

            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center justify-end gap-2">
                {links.map((link) => (
                  <li key={link._key}>
                    <NavLink link={link} active={isActive(pathname, stegaClean(link.href))} />
                  </li>
                ))}
              </ul>
            </nav>

            {ctas.length > 0 && (
              <div className="hidden items-center gap-2 lg:flex">
                {ctas.map((cta) => (
                  <NavCta key={cta._key} cta={cta} />
                ))}
              </div>
            )}

            <button
              ref={toggleRef}
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
              className="text-basement-white flex h-9 w-12 shrink-0 cursor-pointer items-center justify-center lg:hidden"
            >
              <MenuIcon open={open} />
            </button>
          </div>

          <AnimatePresence>
            {open && (
              <motion.nav
                id="mobile-nav"
                aria-label="Main"
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                style={{ transformOrigin: "top center" }}
                className={cn(
                  GLASS,
                  "absolute inset-x-0 top-[calc(100%+0.5rem)] flex flex-col gap-4 pt-2 pb-4 lg:hidden",
                )}
              >
                <ul className="flex flex-col">
                  {links.map((link, i) => (
                    <MenuItem key={link._key} index={i}>
                      <NavLink
                        link={link}
                        active={isActive(pathname, stegaClean(link.href))}
                        onClick={() => setOpen(false)}
                      />
                    </MenuItem>
                  ))}
                </ul>
                {ctas.length > 0 && (
                  <MenuItem
                    index={links.length}
                    className="ml-4 flex flex-col flex-wrap items-start justify-center gap-2"
                  >
                    {ctas.map((cta) => (
                      <NavCta key={cta._key} cta={cta} onClick={() => setOpen(false)} />
                    ))}
                  </MenuItem>
                )}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>
    </MotionConfig>
  );
}

const GLASS = cn(
  "glass-dark relative isolate rounded-xl backdrop-blur-md",
  "bg-[linear-gradient(90deg,rgba(153,153,153,0.25)_0%,rgba(74,74,74,0.25)_100%)]",
  "before:bg-noise before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:opacity-10 before:content-['']",
);

function MenuItem({
  index,
  className,
  children,
}: {
  index: number;
  className?: string;
  children: ReactNode;
}) {
  const Tag = className ? motion.div : motion.li;
  return (
    <Tag
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...TRANSITION.fast, delay: 0.01 + index * 0.015 }}
      className={className}
    >
      {children}
    </Tag>
  );
}

function NavLink({
  link,
  active,
  onClick,
}: {
  link: NavLinkData;
  active: boolean;
  onClick?: () => void;
}) {
  const href = stegaClean(link.href);
  const external = isExternal(href, link.openInNewTab);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "typography-body-emphasized inline-flex items-center px-4 py-2",
        "text-basement-white transition-colors hover:text-basement-white/60",
        active && "text-basement-orange hover:text-basement-orange",
      )}
    >
      {link.label}
      {external && <NewTabHint />}
    </Link>
  );
}

function NavCta({
  cta,
  className,
  onClick,
}: {
  cta: NavCtaData;
  className?: string;
  onClick?: () => void;
}) {
  const href = stegaClean(cta.href);
  const external = isExternal(href, cta.openInNewTab);
  const variant = CTA_VARIANT[stegaClean(cta.variant)] ?? "primaryDark";

  return (
    <Button
      variant={variant}
      nativeButton={false}
      render={
        <Link
          href={href}
          onClick={onClick}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        />
      }
      className={cn(variant === "primaryDark" && "bg-none", className)}
    >
      {cta.label}
      {external && <NewTabHint />}
    </Button>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <motion.svg
      width={40}
      height={11}
      viewBox="0 0 40 11"
      fill="none"
      aria-hidden="true"
      initial={false}
      animate={open ? "open" : "closed"}
      strokeLinecap={open ? "round" : "butt"}
      className="overflow-visible"
    >
      <motion.line
        stroke="currentColor"
        strokeWidth={1}
        x1={0}
        y1={0.5}
        variants={{ closed: { x2: 40, y2: 0.5 }, open: { x2: 40, y2: 10.5 } }}
      />
      <motion.line
        x1={0}
        y1={5.5}
        x2={40}
        y2={5.5}
        stroke="currentColor"
        strokeWidth={1}
        variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
        transition={TRANSITION.fast}
      />
      <motion.line
        stroke="currentColor"
        strokeWidth={1}
        x1={0}
        y1={10.5}
        variants={{ closed: { x2: 40, y2: 10.5 }, open: { x2: 40, y2: 0.5 } }}
      />
    </motion.svg>
  );
}
