import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { UploadButton } from "~/utils/uploadthing";
import { UploadDialog } from "./_components/upload-dialog";

async function Images() {

  const mockUrls = [
    "https://static1.srcdn.com/wordpress/wp-content/uploads/2023/03/kafka-shouting-in-kaiju-no-8.jpg",
    "https://picsum.photos/seed/picsum/800/600",
    "https://picsum.photos/seed/picsum2/800/600",
    "https://wallpaperbat.com/img/57973342-artstation-kaiju-no-8.jpg",
    "https://static1.srcdn.com/wordpress/wp-content/uploads/2023/03/kafka-shouting-in-kaiju-no-8.jpg",
    "https://tse3.mm.bing.net/th/id/OIP.qHLZUHo8OovlJ0HbQ-QumgHaEK?pid=Api&P=0&h=180",
  ];

  const images = mockUrls.map((url, index) => ({
    id: index + 1,
    url,
  }));

  return (
    <div>
      <UploadDialog />
      <div className="flex flex-wrap justify-center gap-6 p-4">
        {images.map((image) => (
          <div key={image.id} className="w-64 flex flex-col">
            <div className="relative aspect-video bg-zinc-900 overflow-hidden">
              <img
                src={image.url}
                alt={`Image ${image.id}`}
                className="h-full w-full object-contain object-center"
              />
            </div>
            <div className="text-center mt-2 text-white">{image.id}</div>
          </div>
        ))}
      </div>
    </div>

  );

}

export default function HomePage() {
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