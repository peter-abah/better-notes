import { Routes, Route } from "react-router-dom";
import { Notes, Note, NewNote, Register, Login, PrivateRoute } from "./routes";
import useStore from "./lib/store";
import AuthProvider from "./contexts/auth_context";

// Fetch notes from server on page load
if (typeof window !== "undefined") {
  useStore.getState().fetchNotes();
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route index element={<Notes />} />
          <Route path="/notes/:id" element={<Note />} />
          <Route path="/notes/new" element={<NewNote />} />
        </Route>
        <Route path="sign_up" element={<Register />} />
        <Route path="sign_in" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
