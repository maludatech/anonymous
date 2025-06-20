// components/HamburgerMenu.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { NavLink } from "@/lib/types";
import ThemeToggle from "../ThemeToggle";

interface HamburgerMenuProps {
  navLinks: NavLink[];
}

export function HamburgerMenu({ navLinks }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="md:hidden relative flex justify-between items-center gap-4">
      <ThemeToggle />
      <div
        className="flex flex-col justify-between h-5 w-6 cursor-pointer"
        onClick={toggleMenu}
      >
        <span
          className={`h-0.5 bg-foreground transition-all ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`h-0.5 bg-foreground transition-all ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`h-0.5 bg-foreground transition-all ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </div>
      <div
        className={`absolute top-full right-0 bg-background w-48 max-h-0 overflow-hidden transition-all z-20 rounded-md shadow-lg ${
          isOpen ? "max-h-96 py-2" : ""
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="block p-3 text-center text-lg text-foreground hover:text-primary hover:bg-muted transition-colors"
            onClick={() => {
              if (link.onClick) link.onClick();
              toggleMenu();
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
