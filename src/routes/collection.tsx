import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MdAdd, MdMenu } from "react-icons/md";

import useStore from "../lib/store";
import NotePreview from "../components/note_preview";
import SideBar from "../components/sidebar";
import ResourceNotFound from "../components/resource_not_found";
import OptionsMenu from "../components/options_menu";
import CollectionFormModal, {
  FormData,
} from "../components/collection_form_modal";

function Collection() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);
  const { id } = useParams() as { id: string };
  const navigate = useNavigate();

  const collection = useStore((state) =>
    state.collections.find((c) => c.id === id)
  );
  const notes = useStore((state) =>
    state.notes.filter((n) => n.collection_id === id)
  );
  const updateCollection = useStore((state) => state.updateCollection);
  const deleteCollection = useStore((state) => state.deleteCollection);

  if (!collection) return <ResourceNotFound resource="collection" />;

  const saveCollection = (collectionData: FormData) => {
    updateCollection({ ...collection, ...collectionData });
  };

  const handleDeleteCollection = () => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this collection? All notes in the collection will also be deleted."
    );
    if (!shouldDelete) return;

    deleteCollection(collection.id);
    navigate("/");
  };

  const toggleSideBar = () => setIsSideBarOpen((state) => !state);

  return (
    <main className="p-6">
      <header className="flex justify-between items-center mb-6">
        <button type="button" onClick={toggleSideBar}>
          <span className="sr-only">Menu</span>
          <MdMenu className="text-2xl" />
        </button>

        <h1 className="text-xl font-bold grow text-center">
          {collection.name}
        </h1>

        <OptionsMenu
          items={[
            { node: "Edit", onClick: () => setIsCollectionFormOpen(true) },
            { node: "Delete", onClick: handleDeleteCollection },
          ]}
        />
      </header>

      <div>
        {notes.map((note) => (
          <NotePreview key={note.id} note={note} />
        ))}
      </div>

      {/* Sends follection id to note form so it will ve the default selection */}
      <Link
        to={`/notes/new?collection_id=${collection.id}`}
        className="fixed bottom-4 right-4 w-16 h-16 grid place-items-center rounded-full bg-black text-white"
      >
        <MdAdd className="text-2xl" />
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
    </main>
  );
}

export default Collection;
