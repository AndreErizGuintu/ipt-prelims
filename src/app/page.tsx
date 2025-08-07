import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { UploadButton } from "~/utils/uploadthing";
import { UploadDialog } from "./_components/upload-dialog";
import { getMyNotes } from "~/server/queries";
import { ImageModal } from "./_components/image-modal";

export const dynamic = "force-dynamic"; 


async function Images() {

 const notes = await getMyNotes();
  return (
    <div>
      <UploadDialog />
      <div className="flex flex-wrap justify-center gap-6 p-4">
        {notes.map((note) => (
          <div key={note.id} className="w-64 flex flex-col">
            <ImageModal image={note}>
              <div className="relative aspect-video bg-zinc-900 overflow-hidden">
                <img
                  src={note.imageUrl}
                  alt={`Image ${note.id}`}
                  className="h-full w-full object-contain object-center"
                />
              </div>
            </ImageModal>
            <div className="text-center mt-2 text-white">{note.imageName}</div>
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
        <div className="min-h-screen h-full w-full relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          {/* Main content container */}
          <div className="relative z-10 h-full flex items-center justify-center px-8">
            <div className="max-w-6xl w-full">
              {/* Main content */}
              <div className="flex items-center justify-center">
                <div className="space-y-8 text-center max-w-2xl flex flex-col items-center justify-center">
                  <div className="mt-30 mb-8">
                    <h1 className="text-8xl lg:text-9xl font-light text-gray-200 leading-tight mb-8">
                      Welcome
                      <br />
                      <span className="text-gray-400">To Gallery</span>
                    </h1>
                  </div>
                  <div className="space-y-6 text-gray-400 max-w-md mx-auto">
                    <p className="leading-relaxed">
                      Welcome to the world of images enjoy.
                    </p>
                    <p className="leading-relaxed">
                      Please sign in or sign up to continue.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </SignedOut>

      <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
          <div className="max-w-6xl mx-auto">
            {/*  Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-light text-gray-200 mb-4">
                Welcome back
              </h1>
              <p className="text-gray-400">
                You are now signed in to your account
              </p>

            </div>

            {/* Images Section */}
            <div className="bg-gray-800 rounded-xl p-6">

              <Images />
            </div>

          </div>
        </div>

      </SignedIn>
    </main>
  );
}