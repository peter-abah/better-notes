import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { MdArrowBackIos as MdArrowBack, MdDone } from "react-icons/md";
import TextareaAutoSize from "react-textarea-autosize";
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

  const goBack = () => {
    const shouldClose = window.confirm("Discard changes?");
    if (!shouldClose) return;
    navigate(-1);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex justify-between p-4 sticky top-0 bg-white">
        <button type="button" className="mr-4" onClick={goBack}>
          <MdArrowBack className="text-2xl" />
        </button>
        <h1 className="text-xl font-bold"> Create Note </h1>
        <button
          type="submit"
          disabled={isSubmitting}
          form="note-form"
          className="ml-4 disabled:text-neutral-600"
        >
          <MdDone className="text-2xl" />
          <span className="sr-only">Save</span>
        </button>
      </header>

      <form
        id="note-form"
        className="flex flex-col grow p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor="title" className="sr-only">
          Title
        </label>
        <input
          type="text"
          placeholder="Title"
          id="title"
          className="w-full px-1 py-2 font-bold text-lg border-black focus:outline-none"
          aria-label="Title"
          {...register("title", { required: true })}
        />

        <label htmlFor="content" className="sr-only">
          Content
        </label>
        <TextareaAutoSize
          id="content"
          aria-label="Body"
          placeholder="Body..."
          className="w-full grow px-1 py-2 border-black focus:outline-none"
          {...register("content", { required: true })}
        />
      </form>
    </main>
  );
}

export default NewNote;
