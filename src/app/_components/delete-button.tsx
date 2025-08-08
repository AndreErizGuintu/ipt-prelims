"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { deleteNote } from "~/server/queries";

export function DeleteButton({ idAsNumber }: { idAsNumber: number }) {
    const router = useRouter();

    async function handleDelete() {
        try {
            await deleteNote(idAsNumber);
            toast.success("Image deleted successfully");
            router.push("/");
        } catch (error) {
            console.error("Error deleting image:", error);

        }
    }

    return (
        <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            className="cursor-pointer">
            Delete
        </Button>
    );
}