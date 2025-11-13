import { Database } from '@nozbe/watermelondb';
import { mySchema } from './schema';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import Note from './Note';

const adapter = new SQLiteAdapter({
  schema: mySchema,
});

export const database = new Database({
  adapter,
  modelClasses: [Note],
//   actionEnabled: true,
});
