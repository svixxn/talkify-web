import { ChatParticipant } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Calendar,
  Circle,
  Github,
  Globe,
  Mail,
  MapPin,
  MessagesSquare,
  Settings2,
  Twitter,
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
import { Separator } from "../ui/separator";
import InviteUsersToChatModal from "./InviteUsersToChatModal";
import { useState } from "react";

type Props = {
  id: number;
  name: string;
  photo: string;
  description: string | undefined;
  participants: ChatParticipant[];
};

const ChatInfoModal = ({
  id,
  name,
  photo,
  description,
  participants,
}: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <CustomDialogContent>
      <DialogHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent">
              <Avatar className="w-full h-full object-cover">
                <AvatarImage src={photo} alt="Avatar" />
                <AvatarFallback>{name}</AvatarFallback>
              </Avatar>
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
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setOpen(true)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Member
                </Button>
              </DialogTrigger>
              <InviteUsersToChatModal
                chatId={id}
                participants={participants.map((user) => user.id)}
                setOpen={setOpen}
              />
            </Dialog>
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
