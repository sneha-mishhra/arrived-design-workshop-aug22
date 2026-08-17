import { Markdown } from "./markdown";

type SectionHeadingProps = {
  title: string;
  description?: string | null;
};

export function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <div className="text-left">
      {/* Matches the registration heading, so every section title on the page
          lands with the same weight. */}
      <h2 className="text-4xl font-extrabold uppercase tracking-[-0.02em] sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <div className="mt-3 text-base opacity-80 md:text-lg">
          <Markdown>{description}</Markdown>
        </div>
      ) : null}
    </div>
  );
}
