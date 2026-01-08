import Dexie, { type EntityTable } from 'dexie';

interface Task {
  id: number;
  title: string;
  lane: 'red' | 'yellow' | 'green' | 'gray';
  dueDate: Date | null;
  createdAt: Date;
}

// Initialize the database
const db = new Dexie('NeuroFlowDB') as Dexie & {
  tasks: EntityTable<Task, 'id'>;
};

// Define the schema (columns to index)
db.version(1).stores({
  tasks: '++id, lane, dueDate, createdAt'
});

export { db };
export type { Task };

/* 
# npm
npm install dexie

# or yarn
yarn add dexie

# or pnpm
pnpm add dexie
*/