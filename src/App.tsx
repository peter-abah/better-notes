import { Routes, Route } from "react-router-dom";
import { Notes, Register } from "./routes";

function App() {
  return (
    <Routes>
      <Route index element={<Notes />} />
      <Route path="register" element={<Register />} />
    </Routes>
  );
}

export default App;
