import { Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted py-8 fixed bottom-0 w-full z-10">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center space-x-4 mb-4">
          <a
            href="https://github.com/maludatech"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-6 w-6 text-muted-foreground hover:text-primary" />
          </a>
          <a
            href="https://x.com/maludatechdev"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter className="h-6 w-6 text-muted-foreground hover:text-primary" />
          </a>
        </div>
        <p className="text-muted-foreground">
          &copy; {new Date().getFullYear()} Maluda Anonymous. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
