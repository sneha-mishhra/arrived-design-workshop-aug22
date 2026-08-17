import type { PublicEventData } from "@/lib/happily/types";

import ChromaGrid from "./chroma-grid";
import { ordered } from "./helpers";

type SpeakersGridProps = {
  speakers: PublicEventData["speakers"];
};

const BRAND_BORDER = "#163EE8";
const BRAND_GRADIENT = "linear-gradient(180deg, #163EE8 0%, #000 100%)";

export function SpeakersGrid({ speakers }: SpeakersGridProps) {
  const items = ordered(speakers)
    .filter((s) => !!s.image_url)
    .map((s) => {
      const socials = [
        ...(s.website_url ? [s.website_url] : []),
        ...s.social_urls,
      ].filter(Boolean);
      return {
        image: s.image_url ?? "",
        title: s.name,
        subtitle: [s.title, s.company].filter(Boolean).join(", "),
        borderColor: BRAND_BORDER,
        gradient: BRAND_GRADIENT,
        socials,
        url: socials[0],
      };
    });

  return (
    <div className="relative min-h-[480px]">
      <ChromaGrid
        items={items}
        columns={4}
        radius={220}
        damping={0.5}
        fadeOut={0.5}
      />
    </div>
  );
}
