"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

import { scrollToTargetAdjusted } from "@/lib/utils";

type ScrollLinkProps = ComponentProps<typeof Link> & {
  onAfterScroll?: () => void;
};

export function ScrollLink({
  onAfterScroll,
  onClick,
  ...props
}: ScrollLinkProps) {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const url = new URL(e.currentTarget.href);

    if (url.pathname === pathname && url.hash) {
      scrollToTargetAdjusted(e, onAfterScroll);
    }

    onClick?.(e);
  };

  return <Link {...props} onClick={handleClick} />;
}
