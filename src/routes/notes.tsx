import { useAuth } from "../contexts/auth_context";

function Notes() {
  const { user } = useAuth();

  return (
    <div className="text-3xl font-bold p-12">
      Better Notes {user?.toString()}
    </div>
  );
}

export default Notes;
