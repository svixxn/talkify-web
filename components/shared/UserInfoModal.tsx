import { User } from "@/types";
import CustomDialogContent from "./CustomDialogContent";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Calendar, Github, Globe, Mail, MapPin, Twitter } from "lucide-react";
import { Button } from "../ui/button";
import { useGetUserById } from "@/hooks/react-query";
import LoadingSpinner from "./LoadingSpinner";
import { useUserContext } from "./UserContext";

type Props = {
  userId: number;
};

const UserInfoModal = ({ userId }: Props) => {
  const { user } = useUserContext();
  const { data, isError, isLoading } = useGetUserById(userId);

  const isCurrentUser = user?.id === userId;

  if (isLoading) {
    <CustomDialogContent>
      <div className="flex items-center justify-center h-32">
        <LoadingSpinner />
      </div>
    </CustomDialogContent>;
  }

  if (isError) {
    return (
      <CustomDialogContent>
        <div className="flex items-center justify-center h-32">
          <span className="text-sm text-red-500">Failed to load user info</span>
        </div>
      </CustomDialogContent>
    );
  }

  return (
    <CustomDialogContent>
      <DialogHeader>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
              <span className="text-xl font-medium text-accent-foreground">
                {}
              </span>
            </div>
          </div>
          <div>
            <DialogTitle className="text-xl font-semibold text-primary">
              {data?.data?.user.name}
            </DialogTitle>
          </div>
        </div>
      </DialogHeader>

      <ScrollArea className="max-h-[calc(100vh-12rem)]">
        <div className="space-y-6">
          {/* Bio Section */}

          {data?.data?.user.bio && (
            <div>
              <h3 className="text-sm font-medium text-primary mb-2">About</h3>
              <p className="text-sm text-muted-foreground">
                {data?.data?.user.bio}
              </p>
            </div>
          )}

          <Separator />

          {/* Contact & Location */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-primary">Zhytomyr</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <a
                href={`mailto:example@gmail.com`}
                className="text-sm text-primary hover:underline"
              >
                example@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Joined{" "}
                {new Date(
                  data?.data?.user.createdAt as Date
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <Separator />

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-primary">Social Links</h3>
            <div className="space-y-3">
              <a
                href={`https://github.com/example`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Github className="w-4 h-4" />
                @example
              </a>
              <a
                href={`https://twitter.com/example`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Twitter className="w-4 h-4" />
                @example
              </a>
              <a
                href={`https://example.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Globe className="w-4 h-4" />
                example.com
              </a>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-3">
            <Button className="flex-1" variant="secondary">
              Block User
            </Button>
            <Button className="flex-1" variant="destructive">
              Report User
            </Button>
          </div>
        </div>
      </ScrollArea>
    </CustomDialogContent>
  );
};

export default UserInfoModal;
