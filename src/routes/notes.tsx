import { Link } from "react-router-dom";
import { MdAdd } from "react-icons/md";

import { useAuth } from "../contexts/auth_context";
import useStore from "../lib/store";

function Notes() {
  const { logout } = useAuth();
  const notes = useStore((state) => state.notes);

  return (
    <main className="p-4">
      <header className="flex justify-between items-center">
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
          <div key={note.id} className="p-4 my-4 bg-neutral-100 rounded-lg">
            <h2 className="font-bold mb-2">{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>

      <Link
        to="/notes/new"
        className="fixed bottom-4 right-4 w-16 h-16 grid place-items-center rounded-full bg-black text-white"
      >
        <MdAdd className="text-2xl" />
      </Link>
    </main>
  );
}

export default Notes;
