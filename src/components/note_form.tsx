import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextareaAutoSize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { MdClose, MdDone } from "react-icons/md";
import useStore from "../lib/store";
import { Note } from "../lib/types";
import ConfirmModal from "./confirm_modal";

export type FormData = Omit<Note, "id">;

interface Props {
  defaultValues?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
}
function NoteForm({ defaultValues, onSubmit }: Props) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm<FormData>({ defaultValues });
  const collections = useStore((state) => state.collections);

  return (
    <main className="min-h-full flex flex-col">
      <header className="flex justify-between px-6 py-4 sticky top-0 bg-bg">
        <button
          type="button"
          className="mr-4"
          onClick={() => setIsConfirmModalOpen(true)}
        >
          <MdClose className="text-2xl" />
          <span className="sr-only">Cancel</span>
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          form="note-form"
          className="ml-4 disabled:text-text/80"
        >
          <MdDone className="text-2xl" />
          <span className="sr-only">Save</span>
        </button>
      </header>

      <form
        id="note-form"
        className="flex flex-col grow px-6 pb-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor="title" className="sr-only">
          Title
        </label>
        <input
          type="text"
          placeholder="Title"
          id="title"
          className="w-full text-xl mb-2 bg-transparent focus:outline-none placeholder:text-text/80"
          aria-label="Title"
          {...register("title", { required: true })}
        />

        <label htmlFor="content" className="sr-only">
          Content
        </label>
        <TextareaAutoSize
          id="content"
          aria-label="Body"
          placeholder="Body"
          className="w-full bg-transparent focus:outline-none placeholder:text-text/80"
          minRows={20}
          {...register("content", { required: true })}
        />

        <div className="flex gap-2 items-center mt-auto py-4 bg-bg sticky bottom-0">
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
      </form>

      <ConfirmModal
        text="Discard changes"
        isOpen={isConfirmModalOpen}
        onConfirm={() => navigate(-1)}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </main>
  );
}

export default NoteForm;
