"use client";

import { useEffect } from "react";

const STORAGE_KEY = "bsmnt:console-banner";

const BANNER = `
██████╗ ███████╗███╗   ███╗███╗   ██╗████████╗
██╔══██╗██╔════╝████╗ ████║████╗  ██║╚══██╔══╝
██████╔╝███████╗██╔████╔██║██╔██╗ ██║   ██║
██╔══██╗╚════██║██║╚██╔╝██║██║╚██╗██║   ██║
██████╔╝███████║██║ ╚═╝ ██║██║ ╚████║   ██║
╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝  ╚═══╝   ╚═╝
Making cool shit that performs.
`;

export function ConsoleBanner() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    console.log(BANNER);
  }, []);

  return null;
}
