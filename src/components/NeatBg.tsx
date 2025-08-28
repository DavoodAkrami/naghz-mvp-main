"use client"; 

import React, { useEffect, useRef } from "react";
import { NeatGradient } from "@firecms/neat";
import { neatConfig } from "@/config/neatConfig";

const NeatBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gradientRef = useRef<NeatGradient | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    gradientRef.current = new NeatGradient({
      ref: canvasRef.current,
      ...neatConfig
    });

    return () => {
      gradientRef.current?.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="gradient"
      className="fixed top-0 left-0 w-[100vw] h-[100vh] -z-10"
    />
  );
};

export default NeatBackground;
