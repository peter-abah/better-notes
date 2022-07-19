import { useAuth } from "../contexts/auth_context";

function Notes() {
  const { user, logout } = useAuth();

  return (
    <div className="text-3xl font-bold p-12">
      Better Notes {JSON.stringify(user)}
      <button type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Notes;
