"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Crown,
  Sparkles,
  Zap,
  Infinity as InfinityIcon,
  Palette,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CustomDialogContent from "../shared/CustomDialogContent";
import { createStripeCheckoutSession } from "@/hooks/react-query/functions";
import { useToast } from "@/hooks/useToast";
import { useCreateStripeCheckoutSession } from "@/hooks/react-query";

type PremiumModalProps = {
  userId: number;
};

const FEATURES = [
  {
    icon: InfinityIcon,
    title: "Unlimited Chat Members",
    description: "Add as many members as you want to your group chats",
  },
  {
    icon: Shield,
    title: "Priority Support",
    description: "Get faster responses from our support team",
  },
];

const GoPremiumModal = ({ userId }: PremiumModalProps) => {
  const { toast } = useToast();
  const { mutateAsync: createCheckoutSession, isLoading } =
    useCreateStripeCheckoutSession();

  const handleUpgrade = async () => {
    const { data, error } = await createCheckoutSession();

    if (error) {
      toast({
        title: `An error occurred: ${error.message}`,
      });
      return;
    }

    if (data?.url) {
      window.location.href = data.url;
    } else {
      toast({
        title: "Failed to create checkout session",
        description: "Please try again later.",
      });
    }
  };

  return (
    <CustomDialogContent>
      <DialogHeader>
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-75 blur-xl" />
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-black">
              <Crown className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-primary mb-2">
            Upgrade to Premium
          </DialogTitle>
          <p className="text-muted-foreground">
            Unlock premium features and enhance your chat experience
          </p>
        </div>
      </DialogHeader>

      <div className="grid gap-6 py-4">
        {FEATURES.map((feature, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start gap-4 p-4 rounded-xl transition-colors",
              "bg-gradient-to-r from-accent/50 to-accent/30"
            )}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <feature.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-primary mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </div>
        ))}

        <div className="bg-accent/30 rounded-xl p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-primary">$9</span>
              <span className="text-lg text-muted-foreground">/month</span>
            </div>
          </div>
          <Button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90 transition-opacity gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Upgrade Now
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Cancel anytime. No questions asked.
          </p>
        </div>
      </div>
    </CustomDialogContent>
  );
};

export default GoPremiumModal;
