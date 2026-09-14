import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "404 | basement.studio",
  description: "The page you are looking for does not exist.",
};

// Manual catch-all instead of root `not-found.tsx` so site layout can render
export default function CatchAll() {
  notFound();
}
