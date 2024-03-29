import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MdAdd, MdMenu, MdSearch } from "react-icons/md";
import toast from "react-hot-toast";

import useStore from "../lib/store";
import useDocumentTitle from "../hooks/use_document_title";
import NotePreview from "../components/note_preview";
import SideBar from "../components/sidebar";
import ResourceNotFound from "../components/resource_not_found";
import OptionsMenu from "../components/options_menu";
import ConfirmModal from "../components/confirm_modal";
import CollectionFormModal, { FormData } from "../components/name_form_modal";

const confirmDeleteMessage =
  "Are you sure you want to delete this collection? All notes in the collection will also be deleted.";

function Collection() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const { id } = useParams() as { id: string };
  const navigate = useNavigate();

  const collection = useStore((state) =>
    state.collections.find((c) => c.id === id)
  );
  const notes = useStore((state) =>
    state.getNotes().filter((n) => n.collection_id === id)
  );
  const updateCollection = useStore((state) => state.updateCollection);
  const deleteCollection = useStore((state) => state.deleteCollection);

  useDocumentTitle(`BetterNotes | ${collection?.name || "Not found"}`);

  if (!collection) return <ResourceNotFound resource="collection" />;

  const saveCollection = (collectionData: FormData) => {
    toast.success("Collection updated");
    updateCollection({ ...collection, ...collectionData });
  };

  const handleDeleteCollection = () => {
    deleteCollection(collection.id);
    toast.success("Collection deleted");
    navigate("/");
  };

  const toggleSideBar = () => setIsSideBarOpen((state) => !state);
  const searchLabelText = `Search within "${collection.name}"`;

  return (
    <main>
      <header className="sticky top-0 flex justify-between items-center px-6 py-4 md:px-12 bg-bg">
        <button
          type="button"
          className="mr-4 p-2 rounded-full hover:bg-gray-1"
          onClick={toggleSideBar}
        >
          <span className="sr-only">Menu</span>
          <MdMenu className="text-2xl" />
        </button>

        <h1 className="text-xl font-bold w-full truncate text-center">
          {collection.name}
        </h1>

        <div className="flex items-center">
          <Link
            to={`/search/?collection_id=${collection.id}&label=${searchLabelText}`}
            className="p-2 rounded-full hover:bg-gray-1 mr-2"
          >
            <span className="sr-only">Search</span>
            <MdSearch className="text-2xl" />
          </Link>
          <OptionsMenu
            options={[
              { node: "Edit", onClick: () => setIsCollectionFormOpen(true) },
              { node: "Delete", onClick: () => setIsConfirmModalOpen(true) },
            ]}
          />
        </div>
      </header>

      <ul className="px-6 md:px-12 pb-6">
        {notes.map((note) => (
          <li key={note.id}>
            <NotePreview note={note} />
          </li>
        ))}
      </ul>

      {/* Sends collection id to note form so it will ve the default selection */}
      <Link
        to={`/notes/new?collection_id=${collection.id}`}
        className="fixed bottom-4 right-6 w-16 h-16 grid place-items-center rounded-full bg-primary text-on-primary hover:bg-primary/70"
      >
        <MdAdd className="text-3xl" />
      </Link>

      {isSideBarOpen && (
        <SideBar
          isOpen={isSideBarOpen}
          handleClose={() => setIsSideBarOpen(false)}
        />
      )}

      {isCollectionFormOpen && (
        <CollectionFormModal
          defaultValues={collection}
          onSubmit={saveCollection}
          onClose={() => setIsCollectionFormOpen(false)}
          isOpen={isCollectionFormOpen}
          title="Edit Collection"
        />
      )}

      <ConfirmModal
        text={confirmDeleteMessage}
        isOpen={isConfirmModalOpen}
        onConfirm={handleDeleteCollection}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </main>
  );
}

export default Collection;
