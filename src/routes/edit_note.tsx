import { useNavigate, useParams } from "react-router-dom";
import useStore from "../lib/store";
import NoteForm, { FormData } from "../components/note_form";

function EditNote() {
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };

  const updateNote = useStore((state) => state.updateNote);
  const notes = useStore((state) => state.notes);
  const note = notes.find((n) => n.id === id);

  if (note == null) {
    return <p className="p-6 font-bold text-xl">Note not found</p>;
  }

  const onSubmit = (data: FormData) => {
    updateNote({ ...data, id: note.id });
    navigate(`/notes/${id}`, { replace: true });
  };

  return <NoteForm defaultValues={note} onSubmit={onSubmit} />;
}

export default EditNote;
