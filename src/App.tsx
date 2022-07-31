import { Routes, Route } from "react-router-dom";
import {
  Notes,
  Note,
  NewNote,
  EditNote,
  Collection,
  Register,
  Login,
  NotFound,
  PrivateRoute,
} from "./routes";
import AuthProvider from "./contexts/auth_context";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route index element={<Notes />} />
          <Route path="collections/:id" element={<Collection />} />
          <Route path="notes">
            <Route index element={<Notes />} />
            <Route path=":id" element={<Note />} />
            <Route path="new" element={<NewNote />} />
            <Route path="edit/:id" element={<EditNote />} />
          </Route>
        </Route>

        <Route path="sign_up" element={<Register />} />
        <Route path="sign_in" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
