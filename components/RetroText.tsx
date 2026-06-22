/* =====================================================================
 * RetroText — texto con fuente retro "Press Start 2P"
 * ===================================================================== */

import type { CSSProperties, ReactNode } from "react";

interface RetroTextProps {
  children: ReactNode;
  className?: string;
  /** Sombra pixelada para legibilidad sobre el canvas */
  pixelShadow?: boolean;
  style?: CSSProperties;
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3";
  id?: string;
  "aria-label"?: string;
}

export default function RetroText({
  children,
  className = "",
  pixelShadow = false,
  style,
  as = "span",
  id,
  ...rest
}: RetroTextProps) {
  const Tag = as;
  const classes = [
    "font-retro",
    pixelShadow ? "text-shadow-pixel" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={classes} style={style} id={id} {...rest}>
      {children}
    </Tag>
  );
}
