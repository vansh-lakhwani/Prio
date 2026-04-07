"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    let gPressed = false;
    let gTimeout: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is in an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      // Universal Search: Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("global-search");
        if (searchInput) {
          searchInput.focus();
        } else {
          toast.info("Search focused", {
             description: "Tactical command interface activated."
          });
        }
      }

      // New Task: N
      if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        // Trigger generic "New Task" modal or event
        const newTaskBtn = document.getElementById("create-task-btn");
        if (newTaskBtn) {
           newTaskBtn.click();
        } else {
           toast.success("Command Received", {
             description: "Deploying task interface..."
           });
        }
      }

      // Navigation: G + [key]
      if (e.key.toLowerCase() === "g") {
        gPressed = true;
        clearTimeout(gTimeout);
        gTimeout = setTimeout(() => {
          gPressed = false;
        }, 1000); // 1 second window
        return;
      }

      if (gPressed) {
        const key = e.key.toLowerCase();
        let navigated = true;

        switch (key) {
           case "d":
             router.push("/dashboard");
             break;
           case "k":
             router.push("/kanban");
             break;
           case "c":
             router.push("/calendar");
             break;
           case "i":
             router.push("/insights");
             break;
           case "s":
             router.push("/profile");
             break;
           default:
             navigated = false;
        }

        if (navigated) {
          e.preventDefault();
          gPressed = false;
          toast.info("Navigation", {
             description: `Rerouting to ${key.toUpperCase()} module...`
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(gTimeout);
    };
  }, [router]);
}
