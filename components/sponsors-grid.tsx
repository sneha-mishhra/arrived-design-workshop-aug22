import Image from "next/image";

import type { PublicEventData } from "@/lib/happily/types";

import { ordered } from "./helpers";

type SponsorTier = NonNullable<PublicEventData["sponsors"][number]["tier"]>;

type SponsorsGridProps = {
  sponsors: PublicEventData["sponsors"];
};

function calculateLogoHeight(tierOrder: number) {
  const baseSize = 50;
  const scalingFactor = 0.85;
  return baseSize * Math.pow(scalingFactor, tierOrder);
}

function calculateMaxWidth(logoHeight: number) {
  return logoHeight * 5;
}

function SponsorCard({
  sponsor,
  tierIndex = 0,
}: {
  sponsor: PublicEventData["sponsors"][number];
  tierIndex?: number;
}) {
  const logoHeight = calculateLogoHeight(tierIndex);
  const maxWidth = calculateMaxWidth(logoHeight);

  const content = (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: `${logoHeight}px`, maxWidth: `${maxWidth}px` }}
    >
      {sponsor.logo_url ? (
        <Image
          src={sponsor.logo_url}
          alt={sponsor.name}
          width={Math.round(maxWidth)}
          height={Math.round(logoHeight)}
          className="h-full object-contain"
        />
      ) : (
        <p className="text-lg">{sponsor.name}</p>
      )}
    </div>
  );

  if (sponsor.website) {
    return (
      <a href={sponsor.website} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
}

function extractTiers(sponsors: PublicEventData["sponsors"]): SponsorTier[] {
  const seen = new Map<number, SponsorTier>();
  for (const sponsor of sponsors) {
    if (sponsor.tier && !seen.has(sponsor.tier.id)) {
      seen.set(sponsor.tier.id, sponsor.tier);
    }
  }
  return ordered([...seen.values()]);
}

export function SponsorsGrid({ sponsors }: SponsorsGridProps) {
  const tiers = extractTiers(sponsors);

  if (tiers.length === 0) {
    return (
      <div className="flex flex-col items-center gap-x-4 gap-y-10 pt-12">
        <div className="flex flex-col items-center justify-center gap-10 sm:flex-row">
          {ordered(sponsors).map((sponsor) => (
            <SponsorCard key={sponsor.id} sponsor={sponsor} />
          ))}
        </div>
      </div>
    );
  }

  const sponsorsByTier = new Map<number, PublicEventData["sponsors"]>();
  const untiered: PublicEventData["sponsors"] = [];

  for (const sponsor of ordered(sponsors)) {
    if (sponsor.tier_id != null) {
      const group = sponsorsByTier.get(sponsor.tier_id) ?? [];
      group.push(sponsor);
      sponsorsByTier.set(sponsor.tier_id, group);
    } else {
      untiered.push(sponsor);
    }
  }

  return (
    <div className="flex flex-col items-center gap-x-4 gap-y-10 pt-12">
      {tiers.map((tier, tierIndex) => {
        const tierSponsors = sponsorsByTier.get(tier.id);
        if (!tierSponsors?.length) return null;

        return (
          <div key={tier.id}>
            {/* <h3 className="mb-4 text-lg font-semibold text-center">
              {tier.name}
            </h3> */}
            <div className="flex flex-col items-center justify-center gap-10 sm:flex-row">
              {tierSponsors.map((sponsor) => (
                <SponsorCard
                  key={sponsor.id}
                  sponsor={sponsor}
                  tierIndex={tierIndex}
                />
              ))}
            </div>
          </div>
        );
      })}
      {untiered.length > 0 && (
        <div className="flex flex-col items-center justify-center gap-10 sm:flex-row">
          {untiered.map((sponsor) => (
            <SponsorCard key={sponsor.id} sponsor={sponsor} />
          ))}
        </div>
      )}
    </div>
  );
}
