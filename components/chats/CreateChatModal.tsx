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
import { useForm } from "react-hook-form";
import z from "zod";
import { CreateChat, CreateChatSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel } from "../ui/form";

const CreateChatModal = () => {
  const form = useForm<CreateChat>({
    resolver: zodResolver(CreateChatSchema),
  });

  const onSubmit = async (data: CreateChat) => {
    console.log(data);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
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
                <CardContent className="flex flex-col gap-3 pt-6">
                  <FormLabel>Search for people to start chat with</FormLabel>
                  <FormField
                    control={form.control}
                    name="users"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <SearchUsersInput
                          value={field.value}
                          setValue={form.setValue}
                        />
                        {form.formState.errors.users && (
                          <span className="text-red-500 text-xs">
                            {form.formState.errors.users.message}
                          </span>
                        )}
                      </FormItem>
                    )}
                  ></FormField>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="group">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password here. After saving, you&apos;ll be
                    logged out.
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
            <Button type="submit">Create chat</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default CreateChatModal;
