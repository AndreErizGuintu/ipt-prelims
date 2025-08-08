import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { UploadButton } from "~/utils/uploadthing";
import { UploadDialog } from "./_components/upload-dialog";
import { getMyNotes } from "~/server/queries";
import { ImageModal } from "./_components/image-modal";

export const dynamic = "force-dynamic";


async function Images() {

  const notes = await getMyNotes(); // Fetching notes from the server

  return (
    <div>
      <UploadDialog />
      <div className="flex flex-wrap justify-center gap-6 p-4">
        {notes.map((note) => (
          <div key={note.id} className="w-64 flex flex-col bg-white shadow-md rounded-lg overflow-hidden p-2">
            <ImageModal image={note}>
              <div className="relative aspect-video bg-white  overflow-hidden">
                <img
                  src={note.imageUrl}
                  alt={`Image ${note.id}`}
                  className="h-full w-full object-contain object-center"
                />
              </div>
            </ImageModal>
            <div className="text-center mt-2 font-sans font-bold text-black ">{note.imageName}</div>
          </div>
        ))}
      </div>
    </div>

  );

};

export default async function HomePage() {
  return (
    <main className="">
      <SignedOut>
        <div className="min-h-screen bg-yellow-50">
          {/* Notepad Paper */}
          <div className="relative h-full w-full mx-auto p-8 max-w-6xl">
            {/* Notepad Binding */}
            <div className="absolute left-0 top-0 h-full w-8 bg-yellow-200 border-r-2 border-yellow-300 flex flex-col items-center py-8 space-y-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-5 h-1 bg-yellow-400 rounded-full"></div>
              ))}
            </div>

            {/* Notebook Holes */}
            <div className="absolute left-6 top-8 flex flex-col space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-white border-2 border-yellow-400 rounded-full"></div>
              ))}
            </div>

            {/* Main Content */}
            <div className="ml-12 pl-6 border-l-2 border-yellow-200">
              {/* Title Section */}
              <div className="text-center mb-12">
                <h1 className="text-6xl lg:text-7xl font-serif text-gray-800 mb-4 underline decoration-yellow-300 decoration-wavy">
                  Note.me
                </h1>
                <div className="w-full h-0.5 bg-yellow-200 my-6"></div>
              </div>

              {/* Welcome Content */}
              <div className="space-y-8">
                <div className="bg-white p-6 border-2 border-gray-300 shadow-sm">
                  <h2 className="text-3xl font-light text-gray-700 mb-4">
                    Welcome to your digital notebook
                  </h2>
                  <div className="space-y-4 text-gray-600">
                    <p className="leading-relaxed">
                      Capture your thoughts, ideas, and memories in a simple, elegant space.
                    </p>
                    <p className="leading-relaxed">
                      Sign in to access your notes or create an account to get started.
                    </p>
                  </div>
                </div>

                {/* Ruled Paper Effect */}
                <div className="relative bg-white p-6 border-2 border-gray-300">
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-yellow-200"></div>
                  <div className="space-y-6 ml-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-px bg-gray-100"></div>
                    ))}
                  </div>
                  <div className="relative z-10 text-center py-8">
                    <p className="text-gray-500 italic">
                      Your next great idea starts here...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </SignedOut>

      <SignedIn>
        <div className="bg-yellow-50 border-l-8 border-yellow-200 p-8 min-h-screen shadow-inner">




          {/* Header section */}
          <div className="text-center mb-8 pl-10">
            <h1 className="text-4xl font-serif font-normal text-gray-800 mb-2 underline decoration-wavy decoration-yellow-300">
              My Notepad
            </h1>
            <p className="text-gray-600 font-mono">
              Write down your thoughts...
            </p>
          </div>

          {/* Ruled paper effect for content area */}
          <div className="pl-12 relative">
            <div className="absolute left-12 top-0 h-full w-px bg-yellow-300"></div>

            {/* Ruled lines */}
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-px bg-yellow-200"></div>
              ))}
            </div>

            {/* Content */}
            <div className="py-4">
              <Images />
            </div>
          </div>
        </div>
      </SignedIn>
    </main>
  );
}