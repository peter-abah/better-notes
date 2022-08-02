import { Link } from "react-router-dom";
import { Note } from "../lib/types";

const CHAR_LIMIT = 300;

interface Props {
  note: Note;
}
function NotePreview({ note }: Props) {
  const isMoreThanLimit = note.content.length > CHAR_LIMIT;
  const content = isMoreThanLimit
    ? note.content.substring(0, CHAR_LIMIT)
    : note.content;

  return (
    <Link to={`/notes/${note.id}`}>
      <div className="p-4 my-4 bg-gray-1 rounded-lg">
        <h2 className="font-bold mb-2">{note.title}</h2>
        <p className="whitespace-pre-wrap">
          {content} {isMoreThanLimit && <span>...</span>}
        </p>
      </div>
    </Link>
  );
}

export default NotePreview;
