import Image from "next/image";

import { Container } from "./container";
import { SectionHeading } from "./section-heading";

type ContentSectionProps = {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  wrapperClassName?: string;
};

export function ContentSection({
  id,
  title,
  description,
  image,
  wrapperClassName,
}: ContentSectionProps) {
  return (
    <Container
      id={id}
      wrapperClassName={wrapperClassName}
      className={`grid max-w-7xl gap-8 ${image ? "lg:grid-cols-2 lg:items-center" : ""}`}
    >
      <div>
        <SectionHeading title={title} description={description} />
      </div>
      {image ? (
        <Image
          src={image}
          alt=""
          width={800}
          height={600}
          className="aspect-4/3 w-full rounded-none object-cover"
        />
      ) : null}
    </Container>
  );
}
