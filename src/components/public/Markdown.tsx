import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/** Server-rendered Markdown. Raw HTML is not enabled (react-markdown escapes it), so post bodies are safe. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-td">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children: c }) => (
            <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
              {c}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
