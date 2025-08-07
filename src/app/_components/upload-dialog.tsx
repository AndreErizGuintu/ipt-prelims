"use client";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { UploadButton, useUploadThing } from "~/utils/uploadthing";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Textarea } from "~/components/ui/textarea";

const formSchema = z.object({
  ImageName: z
    .string()
    .min(5, { message: "Image Name must be at least 5 Characterss long" })
    .max(50),
  Description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(200),
})

export function UploadDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ImageName: "",
      Description: "",
    },
  });

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImageName(file.name);
      setSelectedImageUrl(URL.createObjectURL(file));
    } else {
      setSelectedImageName(null);
      setSelectedImageUrl(null);
      toast.error(`Please select a valid image file.`);
    }
  };

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadBegin: () => {
      toast(
        <div className="flex items-center gap-2">
          <span className="text-lg">Uploading...</span>
        </div>,
        {
          duration: 5000, // Duration in milliseconds
          id: "upload-begin",
        }
      );
    },

    onUploadError: () => {
      toast.dismiss("upload-begin");
      toast.error(<span className="text-lg">Upload Error</span>);
    },

    onClientUploadComplete: () => {
      toast.dismiss("upload-begin");
      toast.success(<span className="text-lg">Upload Completed</span>);
      router.refresh(); // Refresh the page to show the new images
    },



  });

  const handleImageUpload = async () => {
    if (!inputRef.current?.files?.length) {
      toast.warning(<span className="text-lg">No File Selected</span>)
      return;
    }

    const selectedImage = Array.from(inputRef.current.files);
    await startUpload(selectedImage, {
      imageName: form.getValues("ImageName"),
      description: form.getValues("Description"),
    });
    setSelectedImageName(null);
    setSelectedImageUrl(null);
  }



  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setOpen(false);
    await handleImageUpload();
  }




  return (
    // <UploadButton
    //   endpoint="imageUploader"
    //   onClientUploadComplete={(res) => {
    //     // Do something with the response
    //     console.log("Files: ", res);
    //     // alert("Upload Completed");
    //     toast.success("Upload Completed");
    //     router.refresh(); // Refresh the page to show the new images
    //   }}
    //   onUploadError={(error: Error) => {
    //     // Do something with the error.
    //     // alert(ERROR! ${error.message});
    //     toast.error(`ERROR! ${error.message}`);
    //   }}
    // />

    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger asChild>
  <Button 
    variant="outline"
    className="
      bg-yellow-50
      border border-gray-400
      text-gray-800
      hover:bg-yellow-100
      hover:border-gray-600
      font-normal
      px-5 py-2
      top-2
      right-2
      absolute
      shadow-none
    "
  >
    Upload Notes
  </Button>
</DialogTrigger>
      
     <DialogContent className="sm:max-w-[425px] p-0 bg-yellow-50 border-2 border-black rounded-sm">
  {/* Notepad Header */}
  <div className="bg-yellow-100 border-b-2 border-black p-4 flex items-center gap-2">
    <div className="w-3 h-3 bg-gray-400 rounded-full border border-gray-500"></div>
    <DialogTitle className="text-gray-800">Upload Notes</DialogTitle>
  </div>

  <div className="p-4 space-y-6">
    {/* Image Preview Section */}
    {selectedImageUrl && (
      <div className="bg-white border-2 border-black p-2">
        <img
          src={selectedImageUrl}
          alt={selectedImageName || "Selected Image"}
          className="w-full h-40 object-contain mx-auto"
        />
      </div>
    )}

    {/* File Upload Section */}
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={() => inputRef.current?.click()}
        className="bg-white border-2 border-black hover:bg-yellow-100 rounded-sm"
      >
        <Upload className="w-4 h-4 mr-2" />
        Choose Image
      </Button>
      <input
        type="file"
        ref={inputRef}
        className="sr-only"
        accept="image/*"
        onChange={handleImageSelect}
      />
      {selectedImageName && (
        <div className="text-sm text-gray-700 truncate max-w-[180px]">
          {selectedImageName}
        </div>
      )}
    </div>

    {/* Form Section */}
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Name Field */}
        <FormField
          control={form.control}
          name="ImageName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-gray-800">Note Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="My important note" 
                  {...field} 
                  className="bg-white border-2 border-black rounded-sm focus-visible:ring-yellow-500"
                />
              </FormControl>
              <FormDescription className="text-gray-600 text-xs">
                What should we call this note?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="Description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-gray-800">Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write your notes here..." 
                  className="bg-white border-2 border-black rounded-sm min-h-24 max-h-32 focus-visible:ring-yellow-500 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                  {...field} 
                />
              </FormControl>
              <FormDescription className="text-gray-600 text-xs">
                Add details about your note
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Footer with Submit Button */}
        <DialogFooter className="border-t-2 border-black pt-4">
          <Button 
            type="submit" 
            disabled={isUploading}
            className="bg-yellow-600 hover:bg-yellow-700 text-white border-2 border-black rounded-sm"
          >
            {isUploading ? "Uploading..." : "Save Note"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  </div>
</DialogContent>
    </Dialog>

  );
};