import { Link } from "react-router-dom";
import NoteContent from "./note_content";
import useStore from "../lib/store";
import { Note } from "../lib/types";

const CHAR_LIMIT = 300;

interface Props {
  note: Note;
}
function NotePreview({ note }: Props) {
  const tags = useStore((store) => store.tags);
  const noteTags = tags.filter((tag) => note.tag_ids.includes(tag.id));

  const isMoreThanLimit = note.content.length > CHAR_LIMIT;
  const content = isMoreThanLimit
    ? note.content.substring(0, CHAR_LIMIT)
    : note.content;

  return (
    <Link to={`/notes/${note.id}`}>
      <div className="p-4 my-4 max-w-[40rem] mx-auto bg-gray-1 rounded-lg">
        <h2 className="font-bold mb-2">{note.title}</h2>

        <div>
          <NoteContent content={content} />
          {isMoreThanLimit && <span>...</span>}
        </div>

        <ul className="flex flex-wrap mt-2 gap-2">
          {noteTags.map((tag) => (
            <li
              key={tag.id}
              className="text-xs px-2 py-1 rounded-lg bg-primary text-on-primary"
            >
              {tag.name}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}

export default NotePreview;
