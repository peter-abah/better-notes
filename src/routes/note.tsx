import { useParams, useNavigate, Link } from "react-router-dom";
import { MdArrowBackIos as MdBack, MdEdit, MdDelete } from "react-icons/md";
import useStore from "../lib/store";
import ResourceNotFound from "../components/resource_not_found";

function Note() {
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };

  const deleteNote = useStore((state) => state.deleteNote);
  const notes = useStore((state) => state.notes);
  const note = notes.find((n) => n.id === id);

  if (note == null) {
    return <ResourceNotFound resource="note" />;
  }

  const handleDelete = () => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this note"
    );
    if (!shouldDelete) return;
    deleteNote(id);
    // TODO: Add alert here
    navigate("/");
  };

  return (
    <main>
      <header className="p-4 sticky top-0 flex bg-white">
        <button className="mr-auto" type="button" onClick={() => navigate(-1)}>
          <MdBack className="text-2xl" />
        </button>

        <Link className="mr-4" to={`/notes/edit/${note.id}`}>
          <MdEdit className="text-2xl" />
        </Link>

        <button type="button" onClick={handleDelete}>
          <MdDelete className="text-2xl" />
        </button>
      </header>

      <section className="px-4 py-2">
        <h1 className="text-lg font-bold mb-3">{note.title}</h1>
        <p className="whitespace-pre-wrap">{note.content}</p>
      </section>
    </main>
  );
}

export default Note;
