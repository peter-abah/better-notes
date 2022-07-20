import create from "zustand";
import { customFetch } from "../api";

interface Note {
  id: number;
  title: string;
  content: string;
}

interface State {
  notes: Note[];
  createNote: (noteData: Omit<Note, "id">) => Promise<Note>;
  deleteNote: (id: number) => void;
  updateNote: (note: Note) => Promise<Note>;
  fetchNotes: () => void;
}

const useStore = create<State>()((set) => ({
  notes: [],
  createNote: async (noteData) => {
    const res = await customFetch("/notes", {
      method: "POST",
      body: JSON.stringify({ note: noteData }),
    });
    const { note } = await res.json();
    set((state) => ({ notes: [...state.notes, note] }));
    return note;
  },
  updateNote: async (note) => {
    const res = await customFetch(`/notes/${note.id}`, {
      method: "PATCH",
      body: JSON.stringify({ note }),
    });
    const { note: updated } = await res.json();
    set((state) => {
      const filtered = state.notes.filter(({ id }) => id !== updated.id);
      return { notes: [...filtered, updated] };
    });
    return updated;
  },
  deleteNote: async (id) => {
    await customFetch(`/notes/${id}`, { method: "DELETE" });
    set((state) => {
      const filtered = state.notes.filter((note) => note.id !== id);
      return { notes: filtered };
    });
  },
  fetchNotes: async () => {
    // TODO: Handle errors
    const res = await customFetch("/notes");
    const data = await res.json();
    set({ notes: data.notes });
  },
}));

export default useStore;
