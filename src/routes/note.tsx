import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MdArrowBack as MdBack, MdEdit, MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import useStore from "../lib/store";
import ResourceNotFound from "../components/resource_not_found";
import ConfirmModal from "../components/confirm_modal";

function Note() {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };

  const deleteNote = useStore((state) => state.deleteNote);
  const note = useStore((state) => state.notes.find((n) => n.id === id));

  if (note == null) {
    return <ResourceNotFound resource="note" />;
  }

  const handleDeleteNote = () => {
    deleteNote(id);
    toast.success("Note deleted");
    navigate("/");
  };

  return (
    <main>
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

      <section className="px-6 pb-6">
        <h1 className="text-xl mb-2">{note.title}</h1>
        <p className="whitespace-pre-wrap">{note.content}</p>
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
