import { useState } from "react";
import { Link } from "react-router-dom";
import { MdAdd, MdMenu, MdSearch } from "react-icons/md";

import useStore from "../lib/store";
import useDocumentTitle from "../hooks/use_document_title";
import NotePreview from "../components/note_preview";
import SideBar from "../components/sidebar";

function Notes() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const notes = useStore((state) => state.notes);
  useDocumentTitle("BetterNotes | Notes");

  const toggleSideBar = () => setIsSideBarOpen((state) => !state);

  return (
    <main>
      <header className="sticky top-0 flex justify-between items-center p-6 md:px-12 bg-bg">
        <button
          type="button"
          className="p-2 rounded-full hover:bg-gray-1"
          onClick={toggleSideBar}
        >
          <span className="sr-only">Menu</span>
          <MdMenu className="text-2xl" />
        </button>

        <h1 className="text-xl font-bold grow text-center">Notes</h1>

        <Link className="p-2 rounded-full hover:bg-gray-1" to="/search">
          <span className="sr-only">Search</span>
          <MdSearch className="text-2xl" />
        </Link>
      </header>

      <ul className="px-6 md:px-12 pb-6">
        {notes.map((note) => (
          <li key={note.id}>
            <NotePreview note={note} />
          </li>
        ))}
      </ul>

      <Link
        to="/notes/new"
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
    </main>
  );
}

export default Notes;
