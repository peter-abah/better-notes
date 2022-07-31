import ReactModal from "react-modal";
import clsx from "clsx";

type Props = React.ComponentProps<typeof ReactModal>;

// Applys default styles to react modal
function Modal({ className, overlayClassName, ...props }: Props) {
  return (
    <ReactModal
      className={clsx(
        className,
        "rounded-lg p-5 mx-8 z-50 max-w-sm bg-neutral-100"
      )}
      overlayClassName={clsx(
        overlayClassName,
        "fixed top-0 left-0 right-0 bottom-0 z-50 grid place-items-center bg-black/50"
      )}
      {...props}
    />
  );
}

export default Modal;
