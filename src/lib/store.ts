import create from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import { Note, Collection, ThemeOptions } from "./types";

interface Store {
  notes: Note[];
  collections: Collection[];
  theme: ThemeOptions;
  createNote: (
    noteData: Omit<Note, "id" | "created_at" | "updated_at">
  ) => Note;
  deleteNote: (id: Note["id"]) => void;
  updateNote: (note: Note) => Note;
  createCollection: (collectionData: Pick<Collection, "name">) => Collection;
  deleteCollection: (id: Collection["id"]) => void;
  updateCollection: (collection: Collection) => Collection;
  updateTheme: (theme: ThemeOptions) => void;
  resetStore: () => void;
}

const initialState = {
  notes: [],
  collections: [],
  theme: ThemeOptions.LIGHT,
};

const useStore = create<Store>()(
  persist(
    (set) => ({
      ...initialState,

      // NOTES
      createNote: (noteData) => {
        const isoDate = new Date().toISOString();
        const note = {
          ...noteData,
          id: nanoid(),
          created_at: isoDate,
          updated_at: isoDate,
        };
        set((state) => ({ notes: [...state.notes, note] }));
        return note;
      },
      updateNote: (note) => {
        // eslint-disable-next-line no-param-reassign
        note = { ...note, updated_at: new Date().toISOString() };
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

      // COLLECTIONS
      createCollection: (collectionData) => {
        const isoDate = new Date().toISOString();
        const collection = {
          ...collectionData,
          id: nanoid(),
          created_at: isoDate,
          updated_at: isoDate,
        };
        set((state) => ({ collections: [...state.collections, collection] }));
        return collection;
      },
      updateCollection: (collection) => {
        // eslint-disable-next-line no-param-reassign
        collection = { ...collection, updated_at: new Date().toISOString() };
        set((state) => {
          const filtered = state.collections.filter(
            ({ id }) => id !== collection.id
          );
          return { collections: [...filtered, collection] };
        });
        return collection;
      },
      deleteCollection: (id) => {
        set((state) => {
          const filteredCollections = state.collections.filter(
            (collection) => collection.id !== id
          );
          const filteredNotes = state.notes.filter(
            (note) => note.collection_id !== id
          );
          return { collections: filteredCollections, notes: filteredNotes };
        });
      },

      // MISC
      updateTheme: (theme) => set({ theme }),
      resetStore: () => set(initialState),
    }),
    { name: "betternotes-storage" }
  )
);

export default useStore;
