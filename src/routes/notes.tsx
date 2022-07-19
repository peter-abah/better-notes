import { useAuth } from "../contexts/auth_context";
import useStore from "../lib/store";

function Notes() {
  const { logout } = useAuth();
  const notes = useStore((state) => state.notes);

  return (
    <>
      <h1 className="text-3xl font-bold p-12">Better Notes</h1>

      <button type="button" onClick={logout}>
        Log out
      </button>

      <div className="m-4">
        {notes.map((note) => (
          <div key={note.id} className="p-4 my-4 bg-neutral-100 rounded-lg">
            <h2 className="font-bold mb-2">{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Notes;
