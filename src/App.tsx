import { Routes, Route } from "react-router-dom";
import {
  Notes,
  Note,
  NewNote,
  EditNote,
  Register,
  Login,
  PrivateRoute,
} from "./routes";
import AuthProvider from "./contexts/auth_context";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route index element={<Notes />} />
          <Route path="/notes/:id" element={<Note />} />
          <Route path="/notes/new" element={<NewNote />} />
          <Route path="/notes/edit/:id" element={<EditNote />} />
        </Route>
        <Route path="sign_up" element={<Register />} />
        <Route path="sign_in" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
