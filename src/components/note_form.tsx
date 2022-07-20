import { useNavigate } from "react-router-dom";
import TextareaAutoSize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { MdArrowBackIos as MdBack, MdDone } from "react-icons/md";
import { Note } from "../lib/types";

export type FormData = Omit<Note, "id">;

interface Props {
  defaultValues?: FormData;
  onSubmit: (data: FormData) => void;
}
function NoteForm({ defaultValues, onSubmit }: Props) {
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm<FormData>({ defaultValues });

  const goBack = () => {
    const shouldClose = window.confirm("Discard changes?");
    if (!shouldClose) return;
    navigate(-1);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex justify-between p-4 sticky top-0 bg-white">
        <button type="button" className="mr-4" onClick={goBack}>
          <MdBack className="text-2xl" />
          <span className="sr-only">Back</span>
        </button>
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

export default NoteForm;
