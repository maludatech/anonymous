function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 2.87-.39c.97 0 1.95.13 2.87.39 2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.82 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.21.66.79.55A11.5 11.5 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.2l-5.6-7.3L4 22H1l8.1-9.3L.8 2h7.4l5.1 6.7L18.9 2Zm-1.3 18h1.9L6.5 4h-2l13.1 16Z" />
    </svg>
  );
}

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
            <GithubIcon className="h-6 w-6 text-muted-foreground hover:text-primary" />
          </a>
          <a
            href="https://x.com/maludatechdev"
            target="_blank"
            rel="noopener noreferrer"
          >
            <XIcon className="h-6 w-6 text-muted-foreground hover:text-primary" />
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
