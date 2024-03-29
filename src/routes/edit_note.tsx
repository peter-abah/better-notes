import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import useStore from "../lib/store";
import useDocumentTitle from "../hooks/use_document_title";
import NoteForm, { FormData } from "../components/note_form";
import ResourceNotFound from "../components/resource_not_found";

function EditNote() {
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };

  const updateNote = useStore((state) => state.updateNote);
  const notes = useStore((state) => state.notes);
  const note = notes.find((n) => n.id === id);

  useDocumentTitle("BetterNotes | Edit Note");
  if (note == null) {
    return <ResourceNotFound resource="note" />;
  }

  const onSubmit = (data: FormData) => {
    updateNote({ ...data, id: note.id });
    toast.success("Note updated");
    navigate(`/notes/${id}`, { replace: true });
  };

  return <NoteForm defaultValues={note} onSubmit={onSubmit} />;
}

export default EditNote;
