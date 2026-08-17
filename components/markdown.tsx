import ReactMarkdown from "react-markdown";

type MarkdownProps = {
  children: string;
  className?: string;
};

export function Markdown({ children, className = "" }: MarkdownProps) {
  return (
    <div
      className={`[&_a]:underline [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_li]:ml-4 [&_ol]:list-decimal [&_p+p]:mt-3 [&_ul]:list-disc ${className}`}
    >
      <ReactMarkdown
        components={{
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
