import { Routes, Route } from "react-router-dom";
import { Notes, Register, Login, PrivateRoute } from "./routes";

function App() {
  return (
    <Routes>
      <Route element={<PrivateRoute isAuthorized={false} />}>
        <Route index element={<Notes />} />
      </Route>
      <Route path="sign_up" element={<Register />} />
      <Route path="sign_in" element={<Login />} />
    </Routes>
  );
}

export default App;
