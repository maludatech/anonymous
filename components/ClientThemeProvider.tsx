"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";

export function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Client-only mount gate to avoid SSR/CSR hydration mismatch with
    // next-themes; there's no external system to synchronize with here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
