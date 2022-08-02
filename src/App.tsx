import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  Notes,
  Note,
  NewNote,
  EditNote,
  Collection,
  Search,
  Register,
  Login,
  NotFound,
  PrivateRoute,
} from "./routes";
import AuthProvider from "./contexts/auth_context";
import useTheme from "./hooks/use_theme";
import { ThemeOptions } from "./lib/types";

function App() {
  const { theme } = useTheme();

  // Set document class to dark theme if dark theme at first render
  // The updateTheme function from useTheme hook changes the theme on every other toggle of theme
  // That is why the dependency array is empty
  useEffect(() => {
    if (theme !== ThemeOptions.DARK) return;

    document.documentElement.classList.add("theme-dark");
  }, []);

  return (
    <AuthProvider>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route index element={<Notes />} />
          <Route path="collections/:id" element={<Collection />} />
          <Route path="search" element={<Search />} />
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
      <Toaster />
    </AuthProvider>
  );
}

export default App;
