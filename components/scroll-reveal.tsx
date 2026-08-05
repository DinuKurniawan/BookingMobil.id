"use client";

import React from "react";
import { useScrollAnimation } from "@/lib/use-scroll-animation";

type AnimationVariant = "up" | "scale" | "left" | "right";

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: AnimationVariant;
  className?: string;
  delay?: number;
  stagger?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
  staggerDelay?: number;
}

const variantClass: Record<AnimationVariant, string> = {
  up: "",
  scale: "reveal-scale",
  left: "reveal-left",
  right: "reveal-right",
};

export function ScrollReveal({
  children,
  variant = "up",
  className = "",
  delay = 0,
  stagger = false,
  staggerDelay = 150,
  as: asTag = "div",
}: ScrollRevealProps) {
  if (stagger && React.Children.count(children) > 0) {
    return (
      <>
        {React.Children.map(children, (child, i) => (
          <ScrollReveal
            key={i}
            variant={variant}
            delay={delay + i * staggerDelay}
            className={className}
            as={asTag}
          >
            {child}
          </ScrollReveal>
        ))}
      </>
    );
  }

  return <ScrollRevealInner variant={variant} delay={delay} className={className} asTag={asTag}>{children}</ScrollRevealInner>;
}

function ScrollRevealInner({
  children,
  variant = "up",
  delay = 0,
  className = "",
  asTag: Tag = "div",
}: {
  children: React.ReactNode;
  variant: AnimationVariant;
  delay: number;
  className: string;
  asTag: keyof React.JSX.IntrinsicElements;
}) {
  const { ref, isVisible } = useScrollAnimation({ once: true });
  const variantSuffix = variantClass[variant] ?? "";

  return React.createElement(
    Tag,
    {
      ref,
      className: `animate-reveal ${variantSuffix} ${isVisible ? "reveal-visible" : ""} ${className}`.trim(),
      style: delay > 0 ? { animationDelay: `${delay}ms` } : undefined,
    },
    children
  );
}
