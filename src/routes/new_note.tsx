import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import useStore from "../lib/store";
import NoteForm, { FormData } from "../components/note_form";

function NewNote() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const createNote = useStore((state) => state.createNote);

  const collectionId = searchParams.get("collection_id") || undefined;
  const onSubmit = (data: FormData) => {
    const note = createNote(data);
    toast.success("Note created");
    navigate(`/notes/${note.id}`, { replace: true });
  };

  return (
    <NoteForm
      onSubmit={onSubmit}
      defaultValues={{ collection_id: collectionId }}
    />
  );
}

export default NewNote;
