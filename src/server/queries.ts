"use server";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { notes } from "./db/schema";
import { and, desc, eq, or } from "drizzle-orm";

export async function getMyNotes() {
  const user = await auth();

  if (!user?.userId) throw new Error("Invalid userId");

  const notes = await db.query.notes.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.id),
  });

  return notes;
}

export async function deleteNote(Id: number) {
  const user = await auth();

  if (!user?.userId) throw new Error("Invalid userId");

  const note = await db.query.notes.findFirst({
    where: (model, { eq }) => eq(model.id, Id),
  }); 

  if (!note) throw new Error("Note not found");

  if (note.userId !== user.userId) {
    throw new Error("You are not authorized to delete this note");
  }

  const fileKey = note.imageUrl?.split("/").pop();
  if (!fileKey) throw new Error("Invalid file key");
  await db
  .delete(notes)
  .where(and(eq(notes.id, Id),
  eq(notes.userId, user.userId)));
}