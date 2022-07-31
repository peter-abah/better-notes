import { Link } from "react-router-dom";
import { MdClose } from "react-icons/md";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
}
function SideBar({ isOpen, handleClose }: Props) {
  if (!isOpen) {
    return null;
  }
  return (
    <aside className="fixed z-50 h-screen top-0 left-0 w-80 overflow-auto flex flex-col bg-white">
      <header className="p-6 flex justify-between">
        <h1 className="text-lg font-bold">BetterNotes</h1>
        <button type="button" onClick={handleClose}>
          <MdClose className="text-2xl" />
        </button>
      </header>

      <section className="flex flex-col border-y">
        <h2 className="font-bold px-6 py-3">Collections</h2>
        <Link to="/" className="px-6 py-3">
          Sample
        </Link>
        <Link to="/" className="px-6 py-3">
          Sample
        </Link>
        <Link to="/" className="px-6 py-3">
          Sample
        </Link>
        <Link to="/" className="px-6 py-3">
          Sample
        </Link>
        <Link to="/" className="px-6 py-3">
          Sample
        </Link>
      </section>

      <Link to="/" className="py-3 px-6">
        Settings: TODO
      </Link>
      <button
        type="button"
        className="py-3 px-6 text-left"
        onClick={() => alert("TODO")}
      >
        Theme
      </button>
    </aside>
  );
}

export default SideBar;
