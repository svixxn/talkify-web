import { cn } from "@/lib/utils";
import { DialogContent } from "../ui/dialog";

type Props = {
  className?: string;
  children: React.ReactNode;
};

const CustomDialogContent = ({ className, children }: Props) => {
  return (
    <DialogContent
      className={cn(className, "bg-accent/20 backdrop-blur-sm border-accent")}
    >
      {children}
    </DialogContent>
  );
};

export default CustomDialogContent;
