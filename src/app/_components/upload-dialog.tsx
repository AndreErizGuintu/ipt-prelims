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
        <Button variant="outline">Upload Notes</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Notes</DialogTitle>
          <DialogDescription>
            Upload your notes here.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {selectedImageUrl !== null && (
            <div>
              <img
                src={selectedImageUrl}
                alt={selectedImageName || "Selected Image"}
                className="w-full rounded-md object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant={"outline"}
              onClick={() => inputRef.current?.click()}
            >
              <Upload />
            </Button>
            <input
              type="file"
              ref={inputRef}
              className="sr-only"
              accept="image/"
              onChange={handleImageSelect}
            />
            {setSelectedImageName !== null && (
              <div>Selected Image: {selectedImageName}</div>
            )}
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="ImageName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Image ame" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add a short description..." {...field} />
                  </FormControl>
                  <FormDescription>
                    This description will be visible to others.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isUploading}>Submit</Button>
            </DialogFooter>
          </form>
        </Form>


      </DialogContent>
    </Dialog>

  );
};