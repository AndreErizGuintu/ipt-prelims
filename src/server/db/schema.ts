// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `ipt-prelims_${name}`,
);

export const notes = createTable(
  "note",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    filename: d.varchar({ length: 256 }),
    imageName: d.varchar({ length: 256 }),
    description: d.varchar({ length: 1200 }),
    imageUrl: d.varchar({ length: 1200 }).notNull(),
    userId: d.varchar({ length: 64 }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  // (t) => [index("name_idx").on(t.name)],
);
