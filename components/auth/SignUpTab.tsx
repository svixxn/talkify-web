import { Github, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { TabsContent } from "../ui/tabs";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { SignIn, SignUp } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema, SignUpSchema } from "@/lib/validations";
import axios from "axios";
import { useToast } from "@/hooks/useToast";
import { useRegisterUser } from "@/hooks/react-query";

const SignUpTab = () => {
  const { toast } = useToast();

  const {
    register,
    setError,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUp>({
    resolver: zodResolver(SignUpSchema),
  });

  const { mutateAsync: registerUserAction } = useRegisterUser();

  const onSubmit: SubmitHandler<SignUp> = async (data) => {
    const res = await registerUserAction({
      email: data.email,
      age: parseInt(data.age.toString()),
      name: data.name,
      password: data.password,
    });

    if (res.error) {
      setError("email", {
        message: res.error.message,
      });
      return;
    }

    toast({
      title: "User successfully created",
    });

    reset();
  };

  return (
    <TabsContent value="signup" className="p-6 pt-2 space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-primary">
          Create an account
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your details to get started
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4">
          <div className="flex flex-row justify-between gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                disabled={isSubmitting}
                className="bg-accent/50"
                {...register("name")}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Age</Label>
              <Input
                id="age"
                placeholder="18"
                disabled={isSubmitting}
                className="bg-accent/50"
                {...register("age")}
              />
              {errors.age && (
                <span className="text-red-500 text-sm">
                  {errors.age.message}
                </span>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              disabled={isSubmitting}
              className="bg-accent/50"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              disabled={isSubmitting}
              className="bg-accent/50"
              {...register("password")}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              disabled={isSubmitting}
              className="bg-accent/50"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          disabled={isSubmitting}
          className="bg-accent/50"
        >
          <Github className="mr-2 h-4 w-4" />
          Github
        </Button>
        <Button
          variant="outline"
          disabled={isSubmitting}
          className="bg-accent/50"
        >
          <Mail className="mr-2 h-4 w-4" />
          Email
        </Button>
      </div>
    </TabsContent>
  );
};

export default SignUpTab;
