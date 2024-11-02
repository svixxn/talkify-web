import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogClose,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateChat } from "@/types";
import { UpdateChatSchema } from "@/lib/validations";
import { useUpdateChat } from "@/hooks/react-query";
import CustomDialogContent from "../shared/CustomDialogContent";
import { MessagesSquare, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { title } from "process";

type Props = {
  id: number;
  name: string | undefined;
  description: string | undefined;
  image: string | undefined;
};

const ChatSettingsModal = ({ id, name, description, image }: Props) => {
  const { toast } = useToast();
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateChat>({
    resolver: zodResolver(UpdateChatSchema),
    defaultValues: {
      name,
      description,
    },
  });

  const { mutateAsync: updateChatAction } = useUpdateChat();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit: SubmitHandler<UpdateChat> = async (data) => {
    try {
      const res = await updateChatAction({ chatId: id, ...data });

      if (res.error) {
        setError("name", {
          message: res.error.message,
        });
        return;
      }

      toast({
        title: "Chat updated successfully",
      });
    } catch (err) {
      console.log("err");
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <CustomDialogContent>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-primary">
          Manage Chat Settings
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
        <div className="space-y-4">
          <Label>Chat Photo</Label>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div
                className={cn(
                  "w-20 h-20 rounded-full bg-accent flex items-center justify-center overflow-hidden",
                  "ring-2 ring-offset-2 ring-offset-background ring-accent"
                )}
              >
                <Avatar className="w-full h-full object-cover">
                  <AvatarImage
                    src={photoPreview ? photoPreview : image}
                    alt="Avatar"
                  />
                  <AvatarFallback>{name}</AvatarFallback>
                </Avatar>
              </div>
              {photoPreview && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={handleRemovePhoto}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="chat-photo"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Photo
              </Button>
              <p className="text-xs text-muted-foreground">
                Recommended: Square image, at least 256x256px
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="chat-name">Chat Name</Label>
          <Input
            id="chat-name"
            placeholder="Enter chat name"
            className="bg-accent/50"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="chat-description">Description</Label>
          <Textarea
            id="chat-description"
            placeholder="Enter chat description"
            className="bg-accent/50 min-h-[100px] max-h-[300px]"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </CustomDialogContent>
  );
};

export default ChatSettingsModal;
