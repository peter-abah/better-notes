import { useNavigate } from "react-router-dom";
import useStore from "../lib/store";
import NoteForm, { FormData } from "../components/note_form";

function NewNote() {
  const navigate = useNavigate();
  const createNote = useStore((state) => state.createNote);

  const onSubmit = (data: FormData) => {
    const note = createNote(data);
    navigate(`/notes/${note.id}`, { replace: true });
  };

  return <NoteForm onSubmit={onSubmit} />;
}

export default NewNote;
