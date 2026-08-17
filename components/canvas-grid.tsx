/**
 * The page sits on a design-canvas backdrop: a fine square grid, fading out at
 * the bottom so the sections below can breathe. Decorative and purely CSS, so
 * it costs nothing at runtime and stays crisp at any zoom.
 */
export function CanvasGrid({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      {/* square grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(9,9,9,0.055) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(9,9,9,0.055) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* soften the grid towards the bottom so sections below can breathe */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />
    </div>
  );
}
