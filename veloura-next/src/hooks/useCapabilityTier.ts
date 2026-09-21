"use client";

import { useEffect, useState } from "react";

export type CapabilityTier = "A" | "B" | "C";

type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

export function useCapabilityTier() {
  const [tier, setTier] = useState<CapabilityTier>("C");

  useEffect(() => {
    const nav = navigator as NavigatorHints;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean(nav.connection?.saveData);
    const cores = navigator.hardwareConcurrency || 4;
    const memory = nav.deviceMemory || 4;
    const finePointer = window.matchMedia("(pointer:fine)").matches;

    if (reduced || saveData || cores <= 4 || memory <= 4) {
      setTier("C");
      return;
    }
    if (finePointer && cores >= 8 && memory >= 8 && window.innerWidth >= 980) {
      setTier("A");
      return;
    }
    setTier("B");
  }, []);

  return tier;
}
