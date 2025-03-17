import { cn } from "@/lib/utils";
import { DialogContent, DialogTitle } from "../ui/dialog";

type Props = {
  className?: string;
  children: React.ReactNode;
};

const CustomDialogContent = ({ className, children }: Props) => {
  return (
    <DialogContent
      className={cn(className, "bg-accent/20 backdrop-blur-sm border-accent")}
    >
      <DialogTitle className="hidden"></DialogTitle>
      {children}
    </DialogContent>
  );
};

export default CustomDialogContent;
