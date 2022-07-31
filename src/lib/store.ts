import create from "zustand";
import { nanoid } from "nanoid";
import { Note } from "./types";

interface State {
  notes: Note[];
  createNote: (noteData: Omit<Note, "id">) => Note;
  deleteNote: (id: string) => void;
  updateNote: (note: Note) => Note;
}

const useStore = create<State>()((set) => ({
  notes: [],
  createNote: (noteData) => {
    const note = { ...noteData, id: nanoid() };
    set((state) => ({ notes: [...state.notes, note] }));
    return note;
  },
  updateNote: (note) => {
    set((state) => {
      const filtered = state.notes.filter(({ id }) => id !== note.id);
      return { notes: [...filtered, note] };
    });
    return note;
  },
  deleteNote: (id) => {
    set((state) => {
      const filtered = state.notes.filter((note) => note.id !== id);
      return { notes: filtered };
    });
  },
}));

export default useStore;
