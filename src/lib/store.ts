import create from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import { Note, Collection } from "./types";

interface State {
  notes: Note[];
  createNote: (noteData: Omit<Note, "id">) => Note;
  deleteNote: (id: Note["id"]) => void;
  updateNote: (note: Note) => Note;
  collections: Collection[];
  createCollection: (collectionData: Pick<Collection, "name">) => Collection;
  deleteCollection: (id: Collection["id"]) => void;
  updateCollection: (collection: Collection) => Collection;
}

const useStore = create<State>()(
  persist(
    (set) => ({
      notes: [],
      collections: [],
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
          const filtered = state.collections.filter(
            (collection) => collection.id !== id
          );
          return { collections: filtered };
        });
      },
    }),
    { name: "betternotes-storage" }
  )
);

export default useStore;
