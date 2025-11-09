"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchBar } from "@/components/search-bar";
import { NowPlayingTopBar } from "@/components/now-playing-topbar";

export const StickySearchAndMini = () => {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const target = document.getElementById("now-playing");
    if (!target) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const ratio = entry.intersectionRatio; // portion visible [0..1]
        // Show mini bar when the large card is ~87% hidden (13% visible)
        setCompact(ratio <= 0.13);
      },
      { threshold: Array.from({ length: 101 }, (_, i) => i / 100) }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="sticky top-6 z-30">
      <div className="flex items-center gap-8">
        <motion.div
          layout="position"
          initial={false}
          transition={{ type: "tween", duration: 0.2 }}
          className={compact ? "flex-none w-full max-w-md" : "basis-full"}
        >
          <SearchBar compact={compact} />
        </motion.div>
        <AnimatePresence>{compact && (
          <div className="flex-1">
            <div className="ml-auto" style={{ width: "calc(100% - 100px)" }}>
              <NowPlayingTopBar className="w-full" animated />
            </div>
          </div>
        )}</AnimatePresence>
      </div>
    </div>
  );
};
