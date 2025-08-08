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
                <DialogTitle></DialogTitle>
                <DialogContent className="flex flex-col h-[85vh] max-w-[500px] p-0 bg-yellow-50 border-2 border-black overflow-hidden shadow-lg">
                    {/* Notepad Header with holes */}
                    <div className="bg-yellow-100 border-b-2 border-black p-3 flex items-center">
                        <div className="flex space-x-2 mr-3">
                            <div className="w-3 h-3 bg-gray-400 rounded-full border border-gray-500"></div>
                            <div className="w-3 h-3 bg-gray-400 rounded-full border border-gray-500"></div>
                        </div>
                        <h2 className="text-xl font-bold uppercase">Image Details</h2>
                    </div>

                    {/* Scrollable Content Area with ruled paper effect */}
                    <div className="flex-1 overflow-y-auto relative">
                        {/* Vertical line */}
                        <div className="absolute left-8 top-0 bottom-0 w-px bg-yellow-300"></div>

                        <div className="pl-10 pr-4 py-4">
                            {/* Image Display */}
                            <div className="bg-white p-4 mb-4 border-2 border-black flex justify-center items-center min-h-[200px]">
                                <img
                                    src={image.imageUrl}
                                    alt={String(image.id)}
                                    className="max-h-[250px] max-w-full object-contain"
                                />
                            </div>

                            {/* Details Section */}
                            <div className="space-y-4">
                                <div className="bg-white p-4 border-2 border-black rounded-sm shadow-sm justify-center ">
                                    <h3 className="font-bold text-yellow-700 mb-2 border-b border-yellow-200 pb-1 text-center">Title</h3>
                                    <ul className="space-y-2 text-black">
                                        <li className="flex justify-center">
                                            <span className="text-center font-bold">{image.imageName || image.filename}</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Description Card with max-height and scrolling */}
                                <div className="bg-white p-4 border-2 border-black rounded-sm shadow-sm">
                                    <h3 className="font-bold text-yellow-700 mb-2 border-b border-yellow-200 pb-1">Description</h3>
                                    <div className="max-h-[200px] overflow-y-auto text-black whitespace-pre-wrap pr-2">
                                        {image.description || "No description available"}
                                    </div>
                                </div>


                                {/* Properties Card */}
                                <div className="bg-white p-4 border-2 border-black rounded-sm shadow-sm">
                                    <h3 className="font-bold text-yellow-700 mb-2 border-b border-yellow-200 pb-1">Properties</h3>
                                    <ul className="space-y-2 text-black">
                                        <li className="flex">
                                            <span className="font-semibold w-28">Uploaded by:</span>
                                            <span>{isLoading ? "Loading..." : uploaderInfo?.fullName}</span>
                                        </li>
                                        <li className="flex">
                                            <span className="font-semibold w-28">Created:</span>
                                            <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                                        </li>
                                    </ul>
                                </div>




                            </div>
                        </div>
                    </div>

                    {/* Fixed Footer */}
                    <div className="bg-yellow-100 p-3 border-t-2 border-black flex justify-between items-center sticky bottom-0">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-gray-400 rounded-full border border-gray-500"></div>
                            <div className="w-3 h-3 bg-gray-400 rounded-full border border-gray-500"></div>
                        </div>
                        <DeleteButton idAsNumber={image.id} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}