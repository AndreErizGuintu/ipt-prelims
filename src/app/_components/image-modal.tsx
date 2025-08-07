'use client';
import { useUser } from "@clerk/nextjs";
import { use, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import { DeleteButton } from "./delete-button";
import { notes } from "~/server/db/schema";


interface ImageModalProps {
    image: {
        id: number;
        filename: string | null;
        imageName: string | null;
        description: string | null;
        imageUrl: string;
        userId: string;
        createdAt: Date;
    };
    children: React.ReactNode;
}

export function ImageModal({ image, children }: ImageModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [uploaderInfo, setUploaderInfo] = useState<{ fullName: string } | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();
    const [forceRefresh, setForceRefresh] = useState(0);


    useEffect(() => {
        if (isOpen && !uploaderInfo) {
            setIsLoading(true);
            fetch(`/api/user/${image.userId}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        throw new Error(data.error);
                    }
                    setUploaderInfo({
                        fullName: data.fullName,
                    });
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching uploader info:", error);
                    setUploaderInfo({ fullName: "Unknown User" });
                    setIsLoading(false);
                });

        }
    }, [isOpen, uploaderInfo, image.userId]);

    return (
        <div>
            <div onClick={() => setIsOpen(true)} className="cursor-pointer">
                {children}
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="min-h-[90vh] min-w-[90vw] overflow-hidden p-0">
                    <div className="flex h-full flex-col md:flex-row">
                        {/* Image Container */}
                        <div className="flex flex-1 items-center justify-center bg-black p-4">
                            <img
                                src={image.imageUrl}
                                alt={String(image.id)}
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>
                        {/* Details Container */}
                        <div className="flex w-full flex-col md:w-80 bg ">
                            <DialogHeader className="border-b p-4">
                                <DialogTitle className="text-center">
                                    {image.imageName || image.filename}
                                </DialogTitle>
                            </DialogHeader>

                            <div className="flex flex-1 flex-col space-y-4 p-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-black">
                                        Uploaded By:
                                    </span>
                                    <span>
                                        {isLoading ? "Loading..." : uploaderInfo?.fullName}
                                    </span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-black">
                                        Description:
                                    </span>
                                    <span>
                                        {image.description || "No description"}
                                    </span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-black">
                                        Created At:
                                    </span>
                                    <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                                </div>

                                <div className="space-y-2">
                                    <DeleteButton idAsNumber={image.id} />
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}