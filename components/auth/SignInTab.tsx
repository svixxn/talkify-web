import { Github, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { TabsContent } from "../ui/tabs";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { SignIn } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/lib/validations";
import axios from "axios";

const SignInTab = () => {
  const router = useRouter();

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignIn>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit: SubmitHandler<SignIn> = async (data) => {
    try {
      const res = await axios.post("/api/login", data);

      if (res.data.error) {
        setError("email", {
          message: res.data.error.message,
        });
        return;
      }

      router.push("/chat");
    } catch (err) {
      console.log("err");
    }
  };
  return (
    <TabsContent value="login" className="p-6 pt-2 space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-primary">
          Welcome back
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to sign in
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
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
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>
        <div className="space-y-2">
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
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
        {errors.root && (
          <span className="text-red-500 text-sm">{errors.root.message}</span>
        )}
      </form>

      {/* <div className="relative">
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
      </div> */}
    </TabsContent>
  );
};

export default SignInTab;
