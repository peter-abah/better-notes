import create from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { nanoid } from "nanoid";
import { Note, Collection, Tag, ThemeOptions } from "./types";

interface Store {
  notes: Note[];
  collections: Collection[];
  tags: Tag[];
  theme: ThemeOptions;
  createNote: (
    noteData: Omit<Note, "id" | "created_at" | "updated_at">
  ) => Note;
  deleteNote: (id: Note["id"]) => void;
  updateNote: (note: Note) => Note;
  createCollection: (collectionData: Pick<Collection, "name">) => Collection;
  deleteCollection: (id: Collection["id"]) => void;
  updateCollection: (collection: Collection) => Collection;
  createTag: (tagData: Pick<Tag, "name">) => Tag;
  deleteTag: (id: Tag["id"]) => void;
  updateTag: (tag: Tag) => Tag;
  updateTheme: (theme: ThemeOptions) => void;
  resetStore: () => void;
}

const initialState = {
  notes: [],
  collections: [],
  tags: [],
  theme: ThemeOptions.LIGHT,
};

const useStore = create<Store>()(
  persist(
    immer((set) => ({
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
        set((state) => {
          state.notes.push(note);
        });
        return note;
      },
      updateNote: (note) => {
        const noteWithUpdatedTimestamp = {
          ...note,
          updated_at: new Date().toISOString(),
        };
        set((state) => {
          const filtered = state.notes.filter(
            ({ id }) => id !== noteWithUpdatedTimestamp.id
          );
          return { notes: [...filtered, noteWithUpdatedTimestamp] };
        });
        return noteWithUpdatedTimestamp;
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
        set((state) => {
          state.collections.push(collection);
        });
        return collection;
      },
      updateCollection: (collection) => {
        // eslint-disable-next-line no-param-reassign
        const collectionWithUpdatedTimestamp = {
          ...collection,
          updated_at: new Date().toISOString(),
        };
        set((state) => {
          const filtered = state.collections.filter(
            ({ id }) => id !== collection.id
          );
          state.collections = [...filtered, collectionWithUpdatedTimestamp];
        });
        return collectionWithUpdatedTimestamp;
      },
      deleteCollection: (id) => {
        set((state) => {
          state.collections = state.collections.filter(
            (collection) => collection.id !== id
          );

          // Remove collection notes
          state.notes = state.notes.filter((note) => note.collection_id !== id);
        });
      },

      // TAGS
      createTag: (tagData) => {
        const isoDate = new Date().toISOString();
        const tag = {
          ...tagData,
          id: nanoid(),
          created_at: isoDate,
          updated_at: isoDate,
        };
        set((state) => {
          state.tags.push(tag);
        });
        return tag;
      },
      updateTag: (tag) => {
        // eslint-disable-next-line no-param-reassign
        const tagWithUpdatedTimestamp = {
          ...tag,
          updated_at: new Date().toISOString(),
        };
        set((state) => {
          const filtered = state.tags.filter(
            ({ id }) => id !== tagWithUpdatedTimestamp.id
          );
          state.tags = [...filtered, tagWithUpdatedTimestamp];
        });
        return tag;
      },
      deleteTag: (id) => {
        set((state) => {
          const filtered = state.tags.filter((tag) => tag.id !== id);

          // Remove tag from notes
          state.notes.forEach((note) => {
            note.tags = note.tags.filter((tagId) => tagId !== id);
          });
          state.tags = filtered;
        });
      },

      // MISC
      updateTheme: (theme) => set({ theme }),
      resetStore: () => set(initialState),
    })),
    { name: "betternotes-storage" }
  )
);

export default useStore;
