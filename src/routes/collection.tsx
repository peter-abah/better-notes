import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MdAdd, MdMenu } from "react-icons/md";

import useStore from "../lib/store";
import NotePreview from "../components/note_preview";
import SideBar from "../components/sidebar";
import ResourceNotFound from "../components/resource_not_found";

function Collection() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const { id } = useParams() as { id: string };
  const collection = useStore((state) =>
    state.collections.find((c) => c.id === id)
  );
  const notes = useStore((state) =>
    state.notes.filter((n) => n.collection_id === id)
  );

  if (!collection) return <ResourceNotFound resource="collection" />;

  const toggleSideBar = () => setIsSideBarOpen((state) => !state);

  return (
    <main className="p-4">
      <header className="flex justify-between items-center">
        <button type="button" onClick={toggleSideBar}>
          <span className="sr-only">Menu</span>
          <MdMenu className="text-2xl" />
        </button>

        <h1 className="text-xl font-bold my-4">{collection.name}</h1>
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
    </main>
  );
}

export default Collection;
