import { useChatContext } from "@/components/shared/ChatContext";
import { useState, useEffect } from "react";

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<"small" | "full">("full");
  const { currentChatId } = useChatContext();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && currentChatId) {
        setScreenSize("small");
      } else {
        setScreenSize("full");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentChatId]);

  return { screenSize, setScreenSize };
};

export default useScreenSize;
