import create from "zustand";

interface Note {
  id: number;
  title: string;
  content: string;
}

const defaultNotes = [
  {
    id: 1,
    title: "First Note",
    content: "This is my first note. It is a default",
  },
  {
    id: 2,
    title: "Read",
    content: "I learnt about smartphones screens and how they work",
  },
];
interface State {
  notes: Note[];
  createNote: (note: Note) => void;
  deleteNote: (id: number) => void;
  updateNote: (note: Note) => void;
}

const useStore = create<State>()((set) => ({
  notes: defaultNotes,
  createNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
  updateNote: (note) =>
    set((state) => {
      const filtered = state.notes.filter(({ id }) => id !== note.id);
      return { notes: [...filtered, note] };
    }),
  deleteNote: (id) =>
    set((state) => {
      const filtered = state.notes.filter((note) => note.id !== id);
      return { notes: filtered };
    }),
}));

export default useStore;
