// TODO: The naming of this component is wrong and has code smell
// I don't know how to fix it now since the modals for tag and collection are
// the same, so I am putting a name for now then I will come to fix it later

import { useForm } from "react-hook-form";
import Modal from "./modal";

export type FormData = { name: string };
interface Props {
  title: string;
  defaultValues?: FormData;
  onSubmit: (data: FormData) => void;
  isOpen: boolean;
  onClose: () => void;
}
function NameFormModal({
  title,
  defaultValues,
  onSubmit: onSubmitParent,
  isOpen,
  onClose,
}: Props) {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues,
  });

  const onSubmit = (data: FormData) => {
    onSubmitParent(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2 className="text-lg mb-6">{title}</h2>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name" className="text-sm mb-2">
          Name
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
            className="px-4 py-2 bg-red text-white rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-on-primary rounded-lg"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default NameFormModal;
