import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";
import { Badge } from "../ui/badge";

const PremiumBadge = () => {
  return (
    <Badge className="bg-gradient-to-r flex items-center gap-1 from-violet-500 to-fuchsia-500 border border-violet-500/30 text-violet-100">
      <Crown className="h-3 w-3" />
      <span className="font-medium">Premium</span>
    </Badge>
  );
};

export default PremiumBadge;
