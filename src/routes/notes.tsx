import { useState } from "react";
import { Link } from "react-router-dom";
import { MdAdd, MdMenu } from "react-icons/md";

import { useAuth } from "../contexts/auth_context";
import useStore from "../lib/store";
import NotePreview from "../components/note_preview";
import SideBar from "../components/sidebar";

function Notes() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const { logout } = useAuth();
  const notes = useStore((state) => state.notes);

  const toggleSideBar = () => setIsSideBarOpen((state) => !state);

  return (
    <main className="p-4">
      <header className="flex justify-between items-center">
        <button type="button" onClick={toggleSideBar}>
          <span className="sr-only">Menu</span>
          <MdMenu className="text-2xl" />
        </button>

        <h1 className="text-xl font-bold my-4">Better Notes</h1>

        <button
          type="button"
          className="border rounded-lg px-4 py-2"
          onClick={logout}
        >
          Log out
        </button>
      </header>

      <div>
        {notes.map((note) => (
          <NotePreview key={note.id} note={note} />
        ))}
      </div>

      <Link
        to="/notes/new"
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

export default Notes;
