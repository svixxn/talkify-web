import { useInviteUsersToChat } from "@/hooks/react-query";
import { useToast } from "@/hooks/use-toast";
import { InviteUsersToChat, InviteUsersToChatSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomDialogContent from "../shared/CustomDialogContent";
import { Form, FormField, FormItem } from "../ui/form";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import MultipleItemSelector from "../shared/MultipleItemSelector";
import { useSocket } from "../shared/SocketProvider";

type Props = {
  chatId: number;
  participants: number[];
  setOpen: (open: boolean) => void;
};

const InviteUsersToChatModal = ({ chatId, participants, setOpen }: Props) => {
  const { toast } = useToast();
  const socket = useSocket();
  const form = useForm<InviteUsersToChat>({
    resolver: zodResolver(InviteUsersToChatSchema),
    defaultValues: {
      users: [],
    },
  });

  const { mutateAsync: inviteUsersAction } = useInviteUsersToChat(
    chatId,
    socket
  );

  const onSubmit: SubmitHandler<InviteUsersToChat> = async (data) => {
    const res = await inviteUsersAction({ ...data, chatId });

    if (res.error) {
      form.setError("root", {
        message: res.error.message,
      });
      return;
    }

    toast({
      title: "Users invited successfully",
    });

    setOpen(false);

    form.reset();
  };
  return (
    <CustomDialogContent className="max-w-[425px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <DialogHeader>
            <DialogTitle>Invite users</DialogTitle>
            <DialogDescription>
              Search for people to invite to chat
            </DialogDescription>
          </DialogHeader>
          <Card>
            <CardContent className="flex flex-col gap-4 py-4">
              <FormField
                control={form.control}
                name="users"
                render={({ field }) => (
                  <FormItem>
                    <MultipleItemSelector
                      value={field.value}
                      setValue={form.setValue}
                      filtered={participants}
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
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Add users
            </Button>
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

export default InviteUsersToChatModal;
