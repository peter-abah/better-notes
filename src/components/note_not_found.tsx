import { Link } from "react-router-dom";

function NoteNotFound() {
  return (
    <main className="h-screen flex flex-col">
      <h1 className="p-4 text-lg text-xl font-bold">Better Notes</h1>
      <div className="flex flex-col items-center justify-center grow">
        <p className="mb-10 px-4">
          Whoops, looks like this note does not exist
        </p>
        <Link to="/notes" className="px-6 py-2 bg-black text-white">
          Go back
        </Link>
      </div>
    </main>
  );
}

export default NoteNotFound;
