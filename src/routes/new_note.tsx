import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useStore from "../lib/store";
import { Note } from "../lib/types";

type FormData = Omit<Note, "id">;

function NewNote() {
  const navigate = useNavigate();
  const createNote = useStore((state) => state.createNote);
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const note = await createNote(data);
    navigate(`/notes/${note.id}`, { replace: true });
  };

  return (
    <main className="h-screen flex flex-col p-4">
      <h1 className="text-xl font-bold my-4"> Create Note </h1>
      <form className="flex flex-col grow" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="title" className="sr-only">
          Title
        </label>
        <input
          type="text"
          placeholder="Title"
          id="title"
          className="w-full px-1 py-2 font-bold text-lg focus:border-l-2 border-black focus:outline-none"
          aria-label="Title"
          {...register("title", { required: true })}
        />

        <label htmlFor="content" className="sr-only">
          Content
        </label>
        <textarea
          id="content"
          aria-label="Body"
          placeholder="Body..."
          className="w-full grow px-1 py-2 focus:border-l-2 border-black focus:outline-none overflow-auto"
          {...register("content", { required: true })}
        />

        <div className="py-2">
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-full ml-auto"
            disabled={isSubmitting}
          >
            Save
          </button>
        </div>
      </form>
    </main>
  );
}

export default NewNote;
