import { useNavigate } from "react-router-dom";
import TextareaAutoSize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { MdClose, MdDone } from "react-icons/md";
import useStore from "../lib/store";
import { Note } from "../lib/types";

export type FormData = Omit<Note, "id">;

interface Props {
  defaultValues?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
}
function NoteForm({ defaultValues, onSubmit }: Props) {
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm<FormData>({ defaultValues });
  const collections = useStore((state) => state.collections);

  const goBack = () => {
    const shouldClose = window.confirm("Discard changes?");
    if (!shouldClose) return;
    navigate(-1);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex justify-between p-4 sticky top-0 bg-white">
        <button type="button" className="mr-4" onClick={goBack}>
          <MdClose className="text-2xl" />
          <span className="sr-only">Cancel</span>
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
        className="flex flex-col grow px-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor="title" className="sr-only">
          Title
        </label>
        <input
          type="text"
          placeholder="Title"
          id="title"
          className="w-full font-bold text-lg focus:outline-none"
          aria-label="Title"
          {...register("title", { required: true })}
        />

        <div className="flex gap-2 items-center py-2">
          <label htmlFor="collection">Collection: </label>
          <select
            id="collection"
            className="px-2 py-1 bg-transparent"
            {...register("collection_id")}
          >
            <option>None</option>
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>

        <label htmlFor="content" className="sr-only">
          Content
        </label>
        <TextareaAutoSize
          id="content"
          aria-label="Body"
          placeholder="Body"
          className="w-full focus:outline-none"
          minRows={20}
          {...register("content", { required: true })}
        />
      </form>
    </main>
  );
}

export default NoteForm;
