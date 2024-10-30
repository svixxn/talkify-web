import { ChatParticipant } from "@/types";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Circle, MessagesSquare, Users } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

type Props = {
  id: number;
  name: string | undefined;
  photo: string | undefined;
  description: string | undefined;
  isGroup: boolean | undefined;
  participants: ChatParticipant[] | undefined;
};

const ChatInfoModal = ({
  id,
  name,
  photo,
  description,
  isGroup,
  participants,
}: Props) => {
  return (
    <DialogContent className="bg-accent/20 backdrop-blur-sm border-accent">
      <DialogHeader>
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16 border">
            <AvatarImage src={photo} alt="Avatar" />
            <AvatarFallback>TLK</AvatarFallback>
          </Avatar>
          <div>
            <DialogTitle className="text-xl font-semibold text-primary">
              {name}
            </DialogTitle>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-6">
        {description && (
          <div>
            <h3 className="text-sm font-medium text-primary mb-2">About</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        )}

        {/* Members */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-primary">Members</h3>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {participants?.length}
              </span>
            </div>
          </div>

          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-2">
              {participants?.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-2 rounded-lg"
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={member.avatar || ""} alt="Avatar" />
                      <AvatarFallback>TLK</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">
                        {member.name}
                      </span>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          member.role === "admin"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {member.role}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </DialogContent>
  );
};

export default ChatInfoModal;
