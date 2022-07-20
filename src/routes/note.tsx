import { useParams, useNavigate, Link } from "react-router-dom";
import { MdArrowBackIos as MdBack, MdEdit, MdDelete } from "react-icons/md";
import useStore from "../lib/store";

function Note() {
  const navigate = useNavigate();
  const { id: idStr } = useParams() as { id: string };
  const id = parseInt(idStr, 10);

  const deleteNote = useStore((state) => state.deleteNote);
  const notes = useStore((state) => state.notes);
  const note = notes.find((n) => n.id === id);

  if (note == null) {
    return <div className="p-8 text-xl font-bold">Note not found</div>;
  }

  const handleDelete = async () => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this note"
    );
    if (!shouldDelete) return;
    await deleteNote(id);
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
        <p>{note.content}</p>
      </section>
    </main>
  );
}

export default Note;
