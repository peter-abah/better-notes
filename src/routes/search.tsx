import { useState, ChangeEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import useStore from "../lib/store";
import useDocumentTitle from "../hooks/use_document_title";
import NotePreview from "../components/note_preview";

function Search() {
  const [query, setQuery] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useDocumentTitle("BetterNotes | Search");

  const notes = useStore((state) => state.notes);
  const filteredNotes = notes.filter((note) => {
    if (!query) return false;
    const collectionId = searchParams.get("collection_id");
    const belongsToCollection = collectionId
      ? note.collection_id === collectionId
      : true;

    const queryLowerCase = query.toLocaleLowerCase();
    return (
      belongsToCollection &&
      (note.title.toLocaleLowerCase().includes(queryLowerCase) ||
        note.content.toLowerCase().includes(queryLowerCase))
    );
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setQuery(value);
  };

  const labelText = searchParams.get("label") || "Search your notes";
  return (
    <main>
      <section className="flex py-6 pl-4 pr-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-2 mr-2"
        >
          <span className="sr-only">Go back</span>
          <MdArrowBack className="text-2xl" />
        </button>
        <label htmlFor="query" className="sr-only">
          Search
        </label>
        <input
          id="query"
          className="w-full rounded-2xl bg-gray-1 px-4 py-2 placeholder:text-text/90 focus:outline-none"
          type="search"
          placeholder={labelText}
          arial-label={labelText}
          value={query}
          onChange={handleChange}
        />
      </section>

      <ul className="px-6">
        {filteredNotes.map((note) => (
          <li>
            <NotePreview key={note.id} note={note} />
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Search;
