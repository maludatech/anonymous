"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export default function ThemedToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster theme={resolvedTheme as "light" | "dark" | "system" | undefined} />
  );
}
