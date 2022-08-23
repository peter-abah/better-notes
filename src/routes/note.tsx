import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MdArrowBack as MdBack, MdEdit, MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import useStore from "../lib/store";
import useDocumentTitle from "../hooks/use_document_title";
import ResourceNotFound from "../components/resource_not_found";
import ConfirmModal from "../components/confirm_modal";

function formatDate(isoDate: string) {
  const date = dayjs(isoDate);
  const isToday = date.isSame(dayjs(), "day");
  if (isToday) return date.format("h:mm A");

  const isYesterday = date.isSame(dayjs().subtract(1, "day"), "day");
  if (isYesterday) return date.format("[Yesterday] h:mm A");

  const isThisYear = date.isSame(dayjs(), "year");
  if (isThisYear) return date.format("MMM d");

  return date.format("MMM d, YYYY");
}

function Note() {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const navigate = useNavigate();
  useDocumentTitle("BetterNotes | Note");
  const { id } = useParams() as { id: string };

  const deleteNote = useStore((state) => state.deleteNote);
  const note = useStore((state) => state.notes.find((n) => n.id === id));
  const tags = useStore((state) => state.tags);

  if (note == null) {
    return <ResourceNotFound resource="note" />;
  }

  const noteTags = tags.filter((t) => note.tag_ids.includes(t.id));

  const handleDeleteNote = () => {
    deleteNote(id);
    toast.success("Note deleted");
    navigate("/");
  };

  return (
    <main className="flex flex-col min-h-full">
      <header className="px-6 py-4 sticky top-0 flex bg-bg">
        <button className="mr-auto" type="button" onClick={() => navigate(-1)}>
          <MdBack className="text-2xl" />
        </button>

        <Link className="mr-4" to={`/notes/edit/${note.id}`}>
          <MdEdit className="text-2xl" />
        </Link>

        <button type="button" onClick={() => setIsConfirmModalOpen(true)}>
          <MdDelete className="text-2xl" />
        </button>
      </header>

      <section className="px-6 mb-4">
        <h1 className="text-xl mb-2">{note.title}</h1>
        <p className="whitespace-pre-wrap">{note.content}</p>
      </section>

      <ul className="flex flex-wrap gap-2 px-6 mb-4 mt-8">
        {noteTags.map((tag) => (
          <li key={tag.id}>
            <Link
              to={`/tags/${tag.id}`}
              className="px-4 py-1 text-sm font-medium rounded-lg bg-primary text-on-primary"
            >
              {tag.name}
            </Link>
          </li>
        ))}
      </ul>

      <section className="px-6 mt-auto mb-6">
        <p>
          Edited{" "}
          <time dateTime={note.updated_at}>{formatDate(note.updated_at)}</time>
        </p>
      </section>

      <ConfirmModal
        text="Are you sure you want to delete this note"
        isOpen={isConfirmModalOpen}
        onCancel={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDeleteNote}
      />
    </main>
  );
}

export default Note;
