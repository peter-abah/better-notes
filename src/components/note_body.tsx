import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  content: string;
}

// Renders note body in markdown
function NoteContent({ content }: Props) {
  return (
    <ReactMarkdown className="markdown-body" remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
}

export default NoteContent;
