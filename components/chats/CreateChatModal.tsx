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
import { DropdownMenuItem } from "../ui/dropdown-menu";
import SearchUsersInput from "./SearchUsersInput";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { CreateChat, CreateChatSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useCreateChat } from "@/hooks/react-query";
import { useToast } from "@/hooks/use-toast";
import MultipleItemSelector from "../shared/MultipleItemSelector";
import { useChatContext } from "../shared/ChatContext";
import CustomDialogContent from "../shared/CustomDialogContent";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CreateChatModal = ({ open, setOpen }: Props) => {
  const { toast } = useToast();

  const { setCurrentChatId, setHasJoinedChats } = useChatContext();

  const form = useForm<CreateChat>({
    resolver: zodResolver(CreateChatSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutateAsync: createChatAction } = useCreateChat();

  const onSubmit: SubmitHandler<CreateChat> = async (data) => {
    const res = await createChatAction(data);

    if (res.error) {
      form.setError("root", {
        message: res.error.message,
      });
      return;
    }

    toast({
      title: "Chat successfully created",
    });

    form.reset();

    setOpen(false);

    setHasJoinedChats(false);
    if (res.data?.chatId) setCurrentChatId(res.data?.chatId);
  };

  return (
    <CustomDialogContent className="max-w-[425px]">
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
                <CardContent className="flex flex-col gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="users"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Search for people to start chat with
                        </FormLabel>

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
                <CardContent className="flex flex-col gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chat name</FormLabel>
                        <Input
                          placeholder="Your chat name..."
                          value={field.value}
                          onChange={field.onChange}
                        />
                        {form.formState.errors.name && (
                          <span className="text-red-500 text-xs">
                            {form.formState.errors.name.message}
                          </span>
                        )}
                      </FormItem>
                    )}
                  ></FormField>

                  <FormField
                    control={form.control}
                    name="users"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Users to add in chat</FormLabel>
                        <MultipleItemSelector
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
          </Tabs>
          <DialogFooter>
            <Button type="submit">Create chat</Button>
          </DialogFooter>
          {form.formState.errors.root && (
            <span className="text-red-500 text-xs">
              {form.formState.errors.root.message}
            </span>
          )}
        </form>
      </Form>
    </CustomDialogContent>
  );
};

export default CreateChatModal;
