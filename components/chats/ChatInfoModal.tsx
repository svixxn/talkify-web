import { ChatParticipant, ChatRole } from "@/types";
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
  UserX,
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
import { Checkbox } from "../ui/checkbox";
import { useRemoveUsersFromChat } from "@/hooks/react-query";
import { useSocket } from "../shared/SocketProvider";
import { useToast } from "@/hooks/useToast";
import RoleGuard from "../shared/RoleGuard";
import { allowedRoles } from "@/utils/allowedRoles";
import { useUserContext } from "../shared/UserContext";
import { Popover, PopoverTrigger } from "../ui/popover";
import ChatUserRoleDropdown from "./ChatUserRoleDropdown";
import UserInfoModal from "../profile/UserInfoModal";

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
  const [selectedMembers, setSelectedMembers] = useState<
    { id: number; role: ChatRole }[]
  >([]);

  const { user } = useUserContext();
  const { toast } = useToast();
  const socket = useSocket();
  const { mutateAsync: removeUsersFromChatAction, isLoading } =
    useRemoveUsersFromChat(id, socket);

  const currentUserInChat = participants.find(
    (member) => member.id === user?.id
  );

  const isCheckUserDisabled = (member: ChatParticipant) => {
    return (
      member.role === "admin" ||
      member.id === user?.id ||
      member.role === currentUserInChat?.role
    );
  };

  const handleMemberSelect = (memberId: number, memberRole: ChatRole) => {
    setSelectedMembers((prev) => {
      if (prev.some((member) => member.id === memberId)) {
        return prev.filter((member) => member.id !== memberId);
      } else {
        return [...prev, { id: memberId, role: memberRole }];
      }
    });
  };

  const handleKickMembers = async () => {
    const memberIds = selectedMembers.map((member) => member.id);
    const res = await removeUsersFromChatAction({
      users: memberIds,
      chatId: id,
    });

    if (res.error) {
      toast({
        title: `An error occurred: ${res.error.message}`,
      });
      return;
    }

    toast({
      title: `Users were successfully removed from the chat`,
    });

    setSelectedMembers([]);
  };

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

        <div>
          <div className="flex flex-col justify-between  gap-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-medium text-primary">Members</h3>
                <span className="text-xs text-muted-foreground">
                  {participants?.length}
                </span>
              </div>
              <RoleGuard
                allowedRoles={allowedRoles.addMembers}
                userRole={currentUserInChat?.role!}
              >
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
              </RoleGuard>
            </div>
            <div className="flex flex-row items-center gap-2">
              {selectedMembers.length === 1 && (
                <RoleGuard
                  allowedRoles={allowedRoles.changeRole}
                  userRole={currentUserInChat?.role!}
                >
                  <ChatUserRoleDropdown
                    userRole={selectedMembers[0].role}
                    userId={selectedMembers[0].id}
                    chatId={id}
                    setSelectedMembers={setSelectedMembers}
                  />
                </RoleGuard>
              )}
              {selectedMembers.length > 0 && (
                <RoleGuard
                  allowedRoles={allowedRoles.removeMembers}
                  userRole={currentUserInChat?.role!}
                >
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleKickMembers}
                    className="gap-2"
                    disabled={isLoading}
                  >
                    <UserX className="w-4 h-4" />
                    Kick ({selectedMembers.length})
                  </Button>
                </RoleGuard>
              )}
            </div>
          </div>

          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-2">
              {participants?.map((member) => (
                <div
                  key={member.id}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg transition-colors",
                    selectedMembers.some(
                      (selectedMember) => selectedMember.id === member.id
                    )
                      ? "bg-accent/50"
                      : "hover:bg-accent/30",
                    "group"
                  )}
                >
                  <Checkbox
                    checked={selectedMembers.some(
                      (selectedMember) => selectedMember.id === member.id
                    )}
                    onCheckedChange={() =>
                      handleMemberSelect(member.id, member.role)
                    }
                    disabled={isCheckUserDisabled(member)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <div className="relative">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={member.avatar || ""} alt="Avatar" />
                      <AvatarFallback>TLK</AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Dialog>
                        <DialogTrigger asChild>
                          <span className="text-sm font-medium text-primary cursor-pointer">
                            {member.name}
                          </span>
                        </DialogTrigger>

                        <UserInfoModal userId={member.id} />
                      </Dialog>
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
