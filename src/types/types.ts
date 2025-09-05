import type { Timestamp } from "firebase/firestore";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Timestamp;
  userId: string;
  dueDate?: Timestamp | null;
  listId?: string | null;
  important?: boolean;
}

export interface List {
  id: string;
  name: string;
  userId: string;
  createdAt: Timestamp;
}

export type FilterType =
  | "inbox"
  | "today"
  | "completed"
  | "calendar"
  | "important"
  | string;