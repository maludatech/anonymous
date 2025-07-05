"use client";

import { useTheme } from "next-themes";
import { Toaster } from "./ui/sonner";

export default function ThemedToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      richColors
      theme={resolvedTheme as "light" | "dark" | "system" | undefined}
    />
  );
}
