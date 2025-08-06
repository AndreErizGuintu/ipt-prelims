import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { notes } from "./db/schema";
import { desc, eq, or } from "drizzle-orm";

export async function getMyNotes() {
  const user = await auth();

  if (!user?.userId) throw new Error("Invalid userId");

  const notes = await db.query.notes.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.id),
  });

  return notes;
}