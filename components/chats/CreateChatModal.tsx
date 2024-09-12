import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import SearchUsersInput from "./SearchUsersInput";

const CreateChatModal = () => {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>New chat</DialogTitle>
        <DialogDescription>
          Choose either to create a private chat or a group chat
        </DialogDescription>
      </DialogHeader>
      <Tabs defaultValue="private" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="private">Private</TabsTrigger>
          <TabsTrigger value="group">Group</TabsTrigger>
        </TabsList>
        <TabsContent value="private">
          <Card>
            <CardHeader>
              <CardDescription>
                Search for people to start chat with
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <SearchUsersInput />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="group">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you&apos;ll be logged
                out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default CreateChatModal;
