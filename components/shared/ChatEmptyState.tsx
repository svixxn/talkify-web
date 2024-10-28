import { cn } from "@/lib/utils";
import { Sparkles, Users } from "lucide-react";

type Props = {
  icon: React.ReactElement;
  title: string;
  description: string;
  showMembers?: boolean;
};
const ChatEmptyState = ({ title, icon, description, showMembers }: Props) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-4">
      <div className="relative mb-8">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-75 blur-xl" />
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-black">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-primary mb-3">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-8">{description}</p>
      {showMembers && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/30 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">5 team members online</span>
          </div>
          <div className="flex -space-x-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-8 h-8 rounded-full border-2 border-background flex items-center justify-center",
                  "bg-accent text-accent-foreground text-xs font-medium",
                  "transition-transform hover:scale-110 hover:z-10"
                )}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatEmptyState;
