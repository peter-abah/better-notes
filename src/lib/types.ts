export interface User {
  email: string;
  token: string;
}

export interface Tag {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  collection_id?: Collection["id"];
  tag_ids: Tag["id"][];
  created_at: string;
  updated_at: string;
}

export enum ThemeOptions {
  LIGHT = "light",
  DARK = "dark",
}
