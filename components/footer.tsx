import Image from "next/image";

import { FacebookIcon, InstagramIcon, LinkedInIcon } from "./icons";

type FooterProps = {
  baseTextColor: string;
};

// Each tile fills with its own network colour on hover. Instagram's is a
// gradient, which is what makes the row read as three brands rather than three
// grey squares.
const SOCIALS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/teamhappily/",
    icon: <InstagramIcon />,
    fill: "linear-gradient(45deg,#F9CE34 0%,#EE2A7B 45%,#6228D7 100%)",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/happily",
    icon: <LinkedInIcon />,
    fill: "#0A66C2",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/teamhappily",
    icon: <FacebookIcon />,
    fill: "#1877F2",
  },
];

export function Footer({ baseTextColor: _baseTextColor }: FooterProps) {
  return (
    <footer className="relative z-10 mt-auto bg-black text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-9 py-12">
        <p className="text-[11px] uppercase tracking-[0.16em] text-white/55">
          Connect with us
        </p>
        <div className="flex items-center gap-3">
          {SOCIALS.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="group relative grid size-12 place-items-center overflow-hidden rounded-[14px] border border-white/15 transition-transform duration-300 hover:-translate-y-1"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 scale-90 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
                style={{ background: social.fill }}
              />
              <span className="relative text-white/70 transition-colors duration-300 group-hover:text-white">
                {social.icon}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Powered-by Arrived (Happily attribution) */}
      <div className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-9 py-6">
          <a
            href="https://app.happily.events/signup?utm_source=event-page&utm_medium=footer&utm_campaign=signup"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Powered by Happily Arrived"
            className="opacity-90 transition-opacity hover:opacity-100"
          >
            <Image
              src="/powered-by-happily-arrived-alt.svg"
              width={292}
              height={55}
              className="h-16 w-auto object-contain"
              alt="Powered by Happily Arrived"
              draggable={false}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
