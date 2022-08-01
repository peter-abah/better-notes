import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import toast from "react-hot-toast";
import { MdClose, MdAdd, MdFolder, MdExpandMore } from "react-icons/md";

import { useAuth } from "../contexts/auth_context";
import useStore from "../lib/store";
import CollectionFormModal, { FormData } from "./collection_form_modal";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
}
function SideBar({ isOpen, handleClose }: Props) {
  const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);
  const [isCollectionSectionOpen, setIsCollectionSectionOpen] = useState(true);

  const createCollection = useStore((state) => state.createCollection);
  const collections = useStore((state) => state.collections);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleCollectionSection = () =>
    setIsCollectionSectionOpen((state) => !state);
  if (!isOpen) return null;

  const saveCollection = (data: FormData) => {
    const collection = createCollection(data);
    toast.success("Collection created");
    handleClose();
    navigate(`/collections/${collection.id}`);
  };
  return (
    <aside className="fixed z-50 h-full top-0 left-0 w-80 py-6 overflow-auto flex flex-col bg-white">
      <header className="px-6 pb-6 flex justify-between">
        <h1 className="text-lg font-bold">BetterNotes</h1>
        <button type="button" onClick={handleClose}>
          <MdClose className="text-2xl" />
        </button>
      </header>

      <Link to="/notes" className="px-6 py-3">
        All Notes
      </Link>
      <section className="py-2 border-y">
        <h2 className="font-bold px-6 py-3">
          <button
            type="button"
            onClick={toggleCollectionSection}
            className="flex justify-between items-center w-full"
          >
            Collections{" "}
            <MdExpandMore
              className={clsx("text-lg", {
                "rotate-180": isCollectionSectionOpen,
              })}
            />
          </button>
        </h2>

        {isCollectionSectionOpen && (
          <ul className="flex flex-col">
            {collections.map((collection) => (
              <li key={collection.id}>
                <Link
                  className="flex items-center py-3 px-6"
                  to={`/collections/${collection.id}`}
                  onClick={handleClose}
                >
                  <MdFolder className="text-lg mr-3" />
                  {collection.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          className="flex items-center px-6 py-3"
          onClick={() => setIsCollectionFormOpen(true)}
        >
          <MdAdd className="text-lg mr-3" />
          Add new collection
        </button>
      </section>

      <Link to="/" className="py-3 px-6">
        Settings
      </Link>
      <button type="button" className="py-3 px-6 text-left">
        Theme
      </button>

      <button type="button" className="py-3 px-6 text-left" onClick={logout}>
        Logout
      </button>

      {isCollectionFormOpen && (
        <CollectionFormModal
          title="Create collection"
          onSubmit={saveCollection}
          isOpen={isCollectionFormOpen}
          onClose={() => setIsCollectionFormOpen(false)}
        />
      )}
    </aside>
  );
}

export default SideBar;
