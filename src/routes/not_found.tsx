import { Link } from "react-router-dom";
import useDocumentTitle from "../hooks/use_document_title";

function NotFound() {
  useDocumentTitle("BetterNotes | 404");
  return (
    <main className="h-screen flex flex-col justify-center items-center">
      <header className="flex mb-12">
        <h1 className="pr-4 border-r text-xl font-bold">404</h1>
        <h2 className="pl-4">This page could not be found</h2>
      </header>

      <Link to="/" className="px-8 py-3 bg-primary text-on-primary">
        Back to Home
      </Link>
    </main>
  );
}

export default NotFound;
