import Link from 'next/link';

export default function Header() {
  return (
    <header className="py-6 px-4 sm:px-0 sticky top-0 z-50 bg-[rgb(var(--color-background))/80 backdrop-blur-md">
      <Link href="/" className="flex items-center justify-center gap-3 group">
        <div className="relative flex items-center justify-center w-10 h-10 bg-[rgb(var(--color-primary))] rounded-full shadow-md shadow-[rgb(var(--color-primary))/20 transform transition-all duration-300 group-hover:scale-110">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
          </svg>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] tracking-tight">Murmur</h1>
      </Link>
    </header>
  );
} 