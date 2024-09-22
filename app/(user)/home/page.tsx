"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  Home,
  LogOut,
  Mail,
  MessageCircle,
  MessageSquare,
  Settings,
  User,
  Users,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import UserDropdownMenu from "@/components/shared/UserDropdownMenu";
import { useUserContext } from "@/components/shared/UserContext";

export default function MessengerLayout() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useUserContext();

  const contacts = [
    { id: 1, name: "Alice Smith", status: "online" },
    { id: 2, name: "Bob Johnson", status: "offline" },
    { id: 3, name: "Charlie Brown", status: "away" },
    { id: 4, name: "Diana Prince", status: "online" },
    { id: 5, name: "Ethan Hunt", status: "offline" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileContent />;
      case "contacts":
        return <ContactsContent contacts={contacts} />;
      default:
        return <div>Content for {activeTab}</div>;
    }
  };

  return (
    <div className="flex h-screen bg-background/75">
      <aside className="hidden w-1/4 border-r bg-muted/40 md:block">
        <div className="flex flex-row gap-4 py-2 items-center border-b px-4">
          <UserDropdownMenu username={user?.name} />
          <h3 className="text-lg font-semibold">Home</h3>
        </div>
        <div className="p-4">
          <nav>
            <Button
              variant={activeTab === "profile" ? "secondary" : "ghost"}
              className="w-full justify-start mb-2"
              onClick={() => setActiveTab("profile")}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button
              variant={activeTab === "contacts" ? "secondary" : "ghost"}
              className="w-full justify-start mb-2"
              onClick={() => setActiveTab("contacts")}
            >
              <Users className="mr-2 h-4 w-4" />
              Contacts
            </Button>
            <Button
              variant={activeTab === "settings" ? "secondary" : "ghost"}
              className="w-full justify-start mb-2"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6">{renderContent()}</CardContent>
        </Card>
      </main>
    </div>
  );
}

function ProfileContent() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <Avatar className="w-24 h-24 mx-auto">
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <h2 className="mt-4 text-2xl font-bold">John Doe</h2>
        <p className="text-muted-foreground">@johndoe • Joined April 2023</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">About Me</h3>
        <p className="text-muted-foreground">
          Passionate developer and avid coffee drinker. Love to chat about new
          technologies and ideas!
        </p>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Statistics</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">152</p>
            <p className="text-sm text-muted-foreground">Messages</p>
          </div>
          <div>
            <p className="text-2xl font-bold">38</p>
            <p className="text-sm text-muted-foreground">Contacts</p>
          </div>
          <div>
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">Groups</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Bell className="w-4 h-4" />
              <Label htmlFor="notifications">Notifications</Label>
            </div>
            <Switch id="notifications" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Mail className="w-4 h-4" />
              <Label htmlFor="email-notifications">Email Notifications</Label>
            </div>
            <Switch id="email-notifications" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MessageCircle className="w-4 h-4" />
              <Label htmlFor="message-preview">Message Preview</Label>
            </div>
            <Switch id="message-preview" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <Button variant="outline" className="w-full">
          <User className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
        <Button variant="destructive" className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}

function ContactsContent({ contacts }: { contacts: any[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Contacts</h2>
      <ScrollArea className="h-[400px] pr-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="flex items-center space-x-4 mb-4">
            <Avatar>
              <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{contact.name}</p>
              <p className="text-sm text-muted-foreground capitalize">
                {contact.status}
              </p>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
