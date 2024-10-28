"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Github, Mail } from "lucide-react";
import SignInTab from "./SignInTab";
import SignUpTab from "./SignUpTab";
import { DialogTitle } from "@radix-ui/react-dialog";

const AuthModal = () => {
  return (
    <Dialog>
      <DialogTitle className="text-2xl font-semibold hidden">
        Welcome
      </DialogTitle>
      <DialogTrigger asChild>
        <Button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white transition">
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/70 p-0 pt-4 backdrop-blur-sm border-accent">
        <Tabs defaultValue={"login"} className="w-full">
          <div className="p-6 pb-4">
            <TabsList className="w-full bg-accent/50">
              <TabsTrigger value="login" className="w-1/2">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="w-1/2">
                Sign Up
              </TabsTrigger>
            </TabsList>
          </div>

          <SignInTab />
          <SignUpTab />
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
