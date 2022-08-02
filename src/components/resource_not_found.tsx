import { Link } from "react-router-dom";

interface Props {
  resource: string;
  resourceLink?: string;
}

function ResourceNotFound({ resource, resourceLink = `/${resource}s` }: Props) {
  return (
    <main className="h-screen flex flex-col">
      <h1 className="p-4 text-lg text-xl font-bold">Better Notes</h1>
      <div className="flex flex-col items-center justify-center grow">
        <p className="mb-10 px-4">
          Whoops, looks like this {resource} does not exist
        </p>
        <Link
          to={resourceLink}
          className="pxr6 py-2 bg-primary text-on-primary"
        >
          Go back
        </Link>
      </div>
    </main>
  );
}

export default ResourceNotFound;
