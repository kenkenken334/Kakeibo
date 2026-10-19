import { sql } from "void/db";
import { integer, sqliteTable, text } from "void/schema-d1";

export const expenses = sqliteTable("expenses", {
  userId: text("user_id"),
  id:integer("id").primaryKey({autoIncrement: true}),
  amount:integer("amount").notNull(),
  memo:text("memo").notNull(),
  createdAt:text("created_at").notNull().default(sql`(datetime('now'))`), 
})

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
