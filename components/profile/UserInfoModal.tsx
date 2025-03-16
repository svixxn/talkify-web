import { User } from "@/types";
import CustomDialogContent from "../shared/CustomDialogContent";
import { Dialog, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  Calendar,
  Github,
  Globe,
  Mail,
  MapPin,
  Settings2,
  Twitter,
} from "lucide-react";
import { Button } from "../ui/button";
import { useGetUserById } from "@/hooks/react-query";
import LoadingSpinner from "../shared/LoadingSpinner";
import { useUserContext } from "../shared/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Circle,
  Camera,
  BellRing,
  Shield,
  Languages,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";

type Props = {
  userId: number;
};

const UserInfoModal = ({ userId }: Props) => {
  const { user } = useUserContext();
  const { data, isError, isLoading } = useGetUserById(userId);
  const [isEditing, setIsEditing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSave = async () => {
    setIsEditing(false);
    console.log("Saving data?.data?.user:");
  };

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
            {isCurrentUser ? (
              <>
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  className="w-16 h-16 rounded-full bg-accent flex items-center justify-center group relative cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {photoPreview ? (
                    <>
                      <Avatar className="w-full h-full object-cover">
                        <AvatarImage src={photoPreview} alt="Avatar" />
                        <AvatarFallback>{data?.data?.user.name}</AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-xl font-medium text-accent-foreground">
                        {data?.data?.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                      <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                <span className="text-xl font-medium text-accent-foreground">
                  {data?.data?.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
            )}
            {/* <Circle
              className={cn(
                "absolute bottom-0 right-0 w-3.5 h-3.5 ring-2 ring-background rounded-full",
                data?.data?.user.status === "active"
                  ? "fill-emerald-500 text-emerald-500"
                  : "fill-yellow-500 text-yellow-500"
              )}
            /> */}
          </div>
          <div className="flex-1">
            {isCurrentUser && isEditing ? (
              <div className="space-y-2">
                <Input
                  value={data?.data?.user.name}
                  // onChange={(e) =>
                  //   setdata?.data?.user({
                  //     ...data?.data?.user,
                  //     name: e.target.value,
                  //   })
                  // }
                  className="bg-accent/50"
                  placeholder="Your name"
                />
              </div>
            ) : (
              <>
                <DialogTitle className="text-xl font-semibold text-primary">
                  {data?.data?.user.name}
                </DialogTitle>
              </>
            )}
          </div>
          {isCurrentUser && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                isEditing ? setIsEditing(false) : setIsEditing(true)
              }
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          )}
        </div>
      </DialogHeader>

      <ScrollArea className="max-h-[calc(100vh-12rem)]">
        <div className="space-y-6">
          {/* Bio Section */}
          <div>
            <h3 className="text-sm font-medium text-primary mb-2">About</h3>
            {isCurrentUser && isEditing ? (
              <Textarea
                value={data?.data?.user.bio || ""}
                // onChange={(e) =>
                //   setdata?.data?.user({
                //     ...data?.data?.user,
                //     bio: e.target.value,
                //   })
                // }
                className="bg-accent/50"
                placeholder="Tell us about yourself"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {data?.data?.user.bio}
              </p>
            )}
          </div>

          <Separator />

          {/* Contact & Location */}
          <div className="space-y-4">
            {isCurrentUser && isEditing ? (
              <>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={"test"}
                    // onChange={(e) =>
                    //   setdata?.data?.user({ ...data?.data?.user, location: e.target.value })
                    // }
                    className="bg-accent/50"
                    placeholder="Your location"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={data?.data?.user.email}
                    // onChange={(e) =>
                    //   setdata?.data?.user({ ...data?.data?.user, email: e.target.value })
                    // }
                    className="bg-accent/50"
                    placeholder="Your email"
                    type="email"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-primary">test</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={`mailto:${data?.data?.user.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {data?.data?.user.email}
                  </a>
                </div>
              </>
            )}
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

          {isCurrentUser && (
            <>
              {/* Preferences */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-primary">
                  Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BellRing className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-primary">
                        Email Notifications
                      </span>
                    </div>
                    <Switch
                      checked={true}
                      // onCheckedChange={(checked) =>
                      //   setdata?.data?.user({
                      //     ...data?.data?.user,
                      //     notifications: {
                      //       ...data?.data?.user.notifications,
                      //       email: checked,
                      //     },
                      //   })
                      // }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-primary">
                        Show Email Address
                      </span>
                    </div>
                    <Switch
                      checked={true}
                      // checked={data?.data?.user.privacy.showEmail}
                      // onCheckedChange={(checked) =>
                      //   setdata?.data?.user({
                      //     ...data?.data?.user,
                      //     privacy: {
                      //       ...data?.data?.user.privacy,
                      //       showEmail: checked,
                      //     },
                      //   })
                      // }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-primary">
                        Show Location
                      </span>
                    </div>
                    <Switch
                      checked={true}
                      // onCheckedChange={(checked) =>
                      //   setdata?.data?.user({
                      //     ...data?.data?.user,
                      //     privacy: {
                      //       ...data?.data?.user.privacy,
                      //       showLocation: checked,
                      //     },
                      //   })
                      // }
                    />
                  </div>
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Actions */}
          {!isCurrentUser && (
            <div className="flex gap-3">
              <Button className="flex-1" variant="secondary">
                Block User
              </Button>
              <Button className="flex-1" variant="destructive">
                Report User
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </CustomDialogContent>
  );
};

export default UserInfoModal;
