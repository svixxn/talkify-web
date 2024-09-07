"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/utils/validation";
import { SignIn } from "@/types";
import { useRouter } from "next/navigation";
import axios from "axios";

const SignInForm = () => {
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
        setError("root", {
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
    <div className="flex h-screen flex-col p-1 items-center justify-center">
      <Card className="mx-auto w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-xl">Sign In</CardTitle>
          <CardDescription>Enter your information to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Sign In
            </Button>

            {errors.root && (
              <span className="text-red-500 text-sm">
                {errors.root.message}
              </span>
            )}
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInForm;
