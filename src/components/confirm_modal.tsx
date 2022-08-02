import Modal from "./modal";

interface Props {
  text: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
function ConfirmModal({ text, isOpen, onConfirm, onCancel }: Props) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onCancel}>
      <h2 className="mb-4">{text}</h2>
      <div className="flex justify-between">
        <button
          type="button"
          className="px-4 py-2 bg-red text-white text-sm rounded-lg"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-primary text-on-primary text-sm rounded-lg"
          onClick={onConfirm}
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
