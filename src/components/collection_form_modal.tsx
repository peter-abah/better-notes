import { useForm } from "react-hook-form";
import Modal from "./modal";
import { Collection } from "../lib/types";

export type FormData = Pick<Collection, "name">;
interface Props {
  title: string;
  defaultValues?: FormData;
  onSubmit: (data: FormData) => void;
  isOpen: boolean;
  onClose: () => void;
}
function CollectionFormModal({
  title,
  defaultValues,
  onSubmit,
  isOpen,
  onClose,
}: Props) {
  const { register, handleSubmit } = useForm<FormData>({ defaultValues });
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2 className="text-lg mb-6">{title}</h2>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name" className="text-sm mb-2">
          Name:
        </label>
        <input
          type="text"
          id="name"
          className="border px-4 py-2 bg-transparent rounded-lg"
          {...register("name", { required: true })}
        />
        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="px-4 py-2 bg-red-700 text-white rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CollectionFormModal;
