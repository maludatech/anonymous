"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import { HamburgerMenu } from "./HamburgerMenu";
import { NavLink } from "@/lib/types";
import ThemeToggle from "../ThemeToggle";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();

  // Define navigation links based on authentication status
  const navLinks: NavLink[] = isAuthenticated
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/profile", label: "Profile" },
        { href: "#", label: "Logout", onClick: () => logout() },
      ]
    : [
        { href: "/sign-up", label: "Sign Up" },
        { href: "/sign-in", label: "Sign in" },
      ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border animate-in fade-in duration-500">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          Maluda Anonymous
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4 items-center">
          <ThemeToggle />
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-foreground hover:text-primary transition-colors"
              onClick={link.onClick}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Mobile Navigation */}
        <HamburgerMenu navLinks={navLinks} />
      </div>
    </header>
  );
}
