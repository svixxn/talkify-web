import {
  File,
  ImageIcon,
  Loader2,
  Paperclip,
  SendHorizontal,
  SendIcon,
  Smile,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { deleteOne, uploadOne } from "@/lib/actions/cloudinary";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import EmojiPickerWrapper from "./EmojiPicker";

type Props = {
  chatId: number;
  onSendMessage: (message: string, files?: string[]) => void;
  replyMessage?: {
    id: number;
    content: string;
    sender: string;
  } | null;
  onCancelReply?: () => void;
  chatInputRef: React.RefObject<HTMLInputElement>;
};
type FilePreview = {
  id: number;
  file: File;
  preview?: string;
  loading: boolean;
  link: string;
};

const ChatInput = ({
  replyMessage,
  onSendMessage,
  onCancelReply,
  chatInputRef,
  chatId,
}: Props) => {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (files.some((f) => f.loading)) return;

    const message = chatInputRef.current?.value.trim() || "";
    onSendMessage(
      message.trim(),
      files.map((f) => f.link)
    );
    chatInputRef.current!.value = "";
    setFiles([]);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    const newFiles: FilePreview[] = await Promise.all(
      selectedFiles.map(async (file) => {
        let preview: string | undefined;

        if (file.type.startsWith("image/")) {
          preview = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        }

        return {
          id: Date.now() + Math.random(),
          file,
          preview,
          loading: true,
          link: "",
        };
      })
    );

    setFiles((current) => [...current, ...newFiles]);

    newFiles.forEach(async (filePreview) => {
      if (filePreview.preview) {
        const result = await uploadOne({
          file: filePreview.preview,
          folder: "talkify/media",
          public_id: `${chatId}_${filePreview.id}`,
        });

        if (typeof result === "string") {
          setFiles((current) =>
            current.map((f) =>
              f === filePreview ? { ...f, loading: false, link: result } : f
            )
          );
        }
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = async (file: File) => {
    const removedFile = files.find((f) => f.file === file);
    setFiles((current) => current.filter((f) => f !== removedFile));

    deleteOne({
      folder: "talkify/media",
      public_id: `${chatId}_${removedFile?.id}`,
    });
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const input = chatInputRef.current;
    if (input) {
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const textBefore = input.value.substring(0, start);
      const textAfter = input.value.substring(end);
      input.value = `${textBefore}${emojiData.emoji}${textAfter}`;
      input.focus();
      input.setSelectionRange(
        start + emojiData.emoji.length,
        start + emojiData.emoji.length
      );
    }
  };

  return (
    <div>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 border-t border-accent">
          {files.map((filePreview, index) => (
            <div
              key={index}
              className="relative group flex items-center gap-2 bg-accent/50 rounded-lg p-2"
            >
              <div className="relative">
                {filePreview.preview ? (
                  <div>
                    <img
                      src={filePreview.preview}
                      alt="Preview"
                      className={cn(
                        "w-8 h-8 rounded object-cover",
                        filePreview.loading && "opacity-50"
                      )}
                    />
                    {filePreview.loading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative w-8 h-8 rounded bg-accent/50 flex items-center justify-center">
                    {getFileIcon(filePreview.file)}
                    {filePreview.loading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm truncate max-w-[150px]">
                  {filePreview.file.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {(filePreview.file.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                onClick={() => removeFile(filePreview.file)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {replyMessage && (
        <div className="flex bg-[#02040d] items-start gap-3 p-3 pl-4 border-t border-accent/50">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span>Replying to</span>
              <span className="font-medium text-primary">
                {replyMessage.sender}
              </span>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {replyMessage.content}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-primary"
            onClick={onCancelReply}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex flex-col bg-[#02040d] border-t border-input py-1"
      >
        <div className="flex items-center px-4 py-2 md:px-6 gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
          />
          <Button
            variant="ghost"
            type="button"
            size="icon"
            className="h-[50px] w-[50px]"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            ref={chatInputRef}
            placeholder="Type your message..."
            className="h-16 flex-1 bg-[#1D283A80] resize-none rounded-md border border-input pr-20 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
          <EmojiPickerWrapper onEmojiClick={onEmojiClick} />
          <Button
            size="icon"
            className="h-[50px] w-[50px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-black/20 rounded-2xl"
            type="submit"
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
