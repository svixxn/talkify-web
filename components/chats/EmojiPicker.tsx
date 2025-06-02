import { Smile } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";

type EmojiPickerProps = {
  onEmojiClick: (emojiData: EmojiClickData) => void;
};

const EmojiPickerWrapper = ({ onEmojiClick }: EmojiPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-[50px] w-[50px] hover:bg-accent/50"
        >
          <Smile className="h-5 w-5 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 border-accent bg-black/40 backdrop-blur-sm"
        side="top"
        align="end"
      >
        <EmojiPicker
          onEmojiClick={onEmojiClick}
          theme={Theme.DARK}
          width={320}
          height={400}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPickerWrapper;
