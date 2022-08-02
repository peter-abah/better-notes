import { ReactNode } from "react";
import Modal from "./modal";

interface Props {
  title?: string;
  isOpen: boolean;
  items: {
    node: ReactNode;
    onClick: () => void;
  }[];
  onClose: () => void;
}
function OptionsModal({ title, isOpen, items, onClose }: Props) {
  const withCloseModal = (func: () => void) => () => {
    func();
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="!px-0">
      {title && <h2 className="mb-3 text-lg px-4">{title}</h2>}
      <ul>
        {items.map(({ node, onClick }) => (
          <li key={node?.toString()}>
            <button
              type="button"
              className="px-4 py-2 w-full hover:bg-gray-2"
              onClick={withCloseModal(onClick)}
            >
              {node}
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}

export default OptionsModal;
