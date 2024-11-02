import { ChatParticipant } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Circle,
  MessagesSquare,
  Settings2,
  UserPlus,
  Users,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import ChatSettingsModal from "./ChatSettingsModal";
import CustomDialogContent from "../shared/CustomDialogContent";

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
    <CustomDialogContent>
      <DialogHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent">
              <MessagesSquare className="w-8 h-8 text-accent-foreground" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-primary">
                {name}
              </DialogTitle>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <ChatSettingsModal
              id={id}
              name={name}
              description={description}
              image={photo}
            />
          </Dialog>
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
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-primary">Members</h3>
              <span className="text-xs text-muted-foreground">
                {participants?.length}
              </span>
            </div>
            {/* <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Add Member
                </Button>
              </DialogTrigger>
              <ChatSettingsModal
                id={id}
                name={name}
                description={description}
              />
            </Dialog> */}
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
    </CustomDialogContent>
  );
};

export default ChatInfoModal;
