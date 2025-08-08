"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { deleteNote } from "~/server/queries";

export function DeleteButton({ idAsNumber }: { idAsNumber: number }) {
    const router = useRouter();
    // Function to handle the delete action
    async function handleDelete() {
        try {
            // Call the deleteNote function from the server queries
            await deleteNote(idAsNumber);
            toast.success("Image deleted successfully");
            router.push("/"); // Redirect to the home page or refresh the current page
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