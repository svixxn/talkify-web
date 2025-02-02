import { File, ImageIcon, Paperclip, SendIcon, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRef, useState } from "react";
import { Progress } from "../ui/progress";

type Props = {
  onSendMessage: (message: string, files?: File[]) => void;
  replyMessage?: {
    id: number;
    content: string;
    sender: string;
  } | null;
  onCancelReply?: () => void;
  chatInputRef: React.RefObject<HTMLInputElement>;
};

type FilePreview = {
  file: File;
  preview?: string;
  progress: number;
};

const ChatInput = ({
  replyMessage,
  onSendMessage,
  onCancelReply,
  chatInputRef,
}: Props) => {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    const message = chatInputRef.current?.value.trim() || "";
    onSendMessage(
      message.trim(),
      files.map((f) => f.file)
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

        const filePreview: FilePreview = {
          file,
          preview,
          progress: 0,
        };

        const interval = setInterval(() => {
          setFiles((current) =>
            current.map((f) =>
              f.file === file
                ? { ...f, progress: Math.min(f.progress + 10, 100) }
                : f
            )
          );
        }, 200);

        setTimeout(() => clearInterval(interval), 2000);

        return filePreview;
      })
    );

    setFiles((current) => [...current, ...newFiles]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (file: File) => {
    setFiles((current) => current.filter((f) => f.file !== file));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  return (
    <div>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 border-t border-accent">
          {files.map((filePreview, index) => (
            <div
              key={index}
              className="relative group flex items-center gap-2 bg-accent/50 rounded-lg p-2 pr-8"
            >
              {filePreview.preview ? (
                <img
                  src={filePreview.preview}
                  alt="Preview"
                  className="w-8 h-8 rounded object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded bg-accent/50 flex items-center justify-center">
                  {getFileIcon(filePreview.file)}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm truncate max-w-[150px]">
                  {filePreview.file.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {(filePreview.file.size / 1024).toFixed(1)} KB
                </span>
              </div>
              {filePreview.progress < 100 && (
                <Progress
                  value={filePreview.progress}
                  className="h-1 w-full absolute bottom-0 left-0"
                />
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
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
      <div className="flex flex-col bg-[#02040d] border-t border-input py-1">
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
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="absolute right-12"
          >
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
