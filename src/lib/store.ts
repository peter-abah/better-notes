import create from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { v4 as uuidv4 } from "uuid";
import { customFetch } from "../api";
import { requestsHandler } from "./offline_requests_handler";
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
          id: uuidv4(),
          created_at: isoDate,
          updated_at: isoDate,
        };

        // Send to server
        requestsHandler.addRequest({
          resource: "/notes",
          options: {
            method: "POST",
            body: JSON.stringify(note),
          },
        });
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

        requestsHandler.addRequest({
          resource: `/notes/${note.id}`,
          options: {
            method: "PUT",
            body: JSON.stringify(noteWithUpdatedTimestamp),
          },
        });

        set((state) => {
          const filtered = state.notes.filter(
            ({ id }) => id !== noteWithUpdatedTimestamp.id
          );
          return { notes: [...filtered, noteWithUpdatedTimestamp] };
        });
        return noteWithUpdatedTimestamp;
      },

      deleteNote: (id) => {
        requestsHandler.addRequest({
          resource: `/notes/${id}`,
          options: {
            method: "DELETE",
          },
        });

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
          id: uuidv4(),
          created_at: isoDate,
          updated_at: isoDate,
        };

        requestsHandler.addRequest({
          resource: "/collections",
          options: {
            method: "POST",
            body: JSON.stringify(collection),
          },
        });

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

        requestsHandler.addRequest({
          resource: `/collections/${collection.id}`,
          options: {
            method: "PUT",
            body: JSON.stringify(collectionWithUpdatedTimestamp),
          },
        });

        set((state) => {
          const filtered = state.collections.filter(
            ({ id }) => id !== collection.id
          );
          state.collections = [...filtered, collectionWithUpdatedTimestamp];
        });
        return collectionWithUpdatedTimestamp;
      },

      deleteCollection: (id) => {
        requestsHandler.addRequest({
          resource: `/collections/${id}`,
          options: {
            method: "DELETE",
          },
        });

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
          id: uuidv4(),
          created_at: isoDate,
          updated_at: isoDate,
        };

        requestsHandler.addRequest({
          resource: "/tags/",
          options: {
            method: "POST",
            body: JSON.stringify(tag),
          },
        });

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

        requestsHandler.addRequest({
          resource: `/tags/${tag.id}`,
          options: {
            method: "PUT",
            body: JSON.stringify(tagWithUpdatedTimestamp),
          },
        });

        set((state) => {
          const filtered = state.tags.filter(
            ({ id }) => id !== tagWithUpdatedTimestamp.id
          );
          state.tags = [...filtered, tagWithUpdatedTimestamp];
        });
        return tag;
      },

      deleteTag: (id) => {
        requestsHandler.addRequest({
          resource: `/tags/${id}`,
          options: {
            method: "DELETE",
          },
        });

        set((state) => {
          const filtered = state.tags.filter((tag) => tag.id !== id);

          // Remove tag from notes
          state.notes.forEach((note) => {
            note.tag_ids = note.tag_ids.filter((tagId) => tagId !== id);
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

async function loadDataToStore() {
  const notesPromise = customFetch("/notes");
  const collectionsPromise = customFetch("/collections");
  const tagsPromise = customFetch("/tags");

  const [notesData, collectionsData, tagsData] = await Promise.all([
    notesPromise,
    collectionsPromise,
    tagsPromise,
  ]);

  // TODO: Merge with existing state, rather than overwriting
  useStore.setState({
    notes: notesData.notes,
    collections: collectionsData.collections,
    tags: tagsData.tags,
  });
}

export async function loadApp() {
  // Fetch pending requests and load data
  if (requestsHandler.requests.length === 0) {
    await loadDataToStore();
  } else {
    requestsHandler.retryRequests();
  }
}

export function resetApp() {
  useStore.getState().resetStore();
  requestsHandler.reset();
  window.localStorage.clear();
}

export default useStore;
