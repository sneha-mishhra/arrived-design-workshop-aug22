import type { ReactNode } from "react";

/**
 * Wraps content in a design-tool selection box: a thin accent outline with four
 * corner handles, and an optional size chip underneath. Decorative only, so the
 * whole thing is hidden from assistive tech and never intercepts pointer input.
 *
 * The handles sit on the corners via negative offsets rather than inside the
 * box, which is what keeps the outline flush with the content it frames.
 */
export function SelectionFrame({
  children,
  label,
  className = "",
  inset = "-inset-x-3 -inset-y-2",
}: {
  children: ReactNode;
  /** Small chip under the bottom-left handle, e.g. a dimension readout. */
  label?: string;
  className?: string;
  /** Tailwind inset utilities controlling how far the frame sits off the content. */
  inset?: string;
}) {
  return (
    <div className={`relative inline-block ${className}`}>
      <div
        data-selection-frame
        aria-hidden="true"
        className={`pointer-events-none absolute ${inset} border border-[#38BDF8]`}
      >
        {[
          "-left-[5px] -top-[5px]",
          "-right-[5px] -top-[5px]",
          "-bottom-[5px] -left-[5px]",
          "-bottom-[5px] -right-[5px]",
        ].map((position) => (
          <span
            key={position}
            data-selection-handle
            className={`absolute size-[9px] rounded-[1px] border border-[#38BDF8] bg-white ${position}`}
          />
        ))}
        {label ? (
          <span
            data-selection-label
            className="absolute -bottom-7 left-0 rounded-sm bg-[#38BDF8] px-1.5 py-0.5 text-[10px] leading-none text-white"
          >
            {label}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}
