"use client";

import Image from "next/image";
import Link from "next/link";

import { MobileMenu } from "./mobile-menu";
import type { NavLinkItem } from "./navbar";
import { Navbar } from "./navbar";

type HeaderProps = {
  logo?: string | null;
  logoAlt?: string;
  nav: NavLinkItem[];
  ctaText?: string;
  ctaHref?: string;
  hideNavigation?: boolean;
};

export function Header({
  logo,
  logoAlt = "Logo",
  nav,
  ctaText,
  ctaHref,
  hideNavigation = false,
}: HeaderProps) {
  if (hideNavigation) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.07] bg-page-bg/85 text-[#171310] backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-9">
        <div className="relative z-60 flex items-center">
          {logo && (
            <Link href="/">
              {/* Intrinsic size matches the cropped artwork, so the wordmark
                  sits at the same height as the toolbar beside it. */}
              <Image
                src={logo}
                alt={logoAlt}
                width={962}
                height={135}
                className="relative z-60 h-5 w-auto object-contain object-left sm:h-6"
                draggable={false}
              />
            </Link>
          )}
        </div>

        <Navbar nav={nav} ctaText={ctaText} ctaHref={ctaHref} />
        <div className="md:hidden">
          <MobileMenu nav={nav} ctaText={ctaText} ctaHref={ctaHref} />
        </div>
      </div>
    </header>
  );
}
