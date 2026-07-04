import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-gray px-6 py-6">
      <nav aria-label="Legal" className="mx-auto flex w-full max-w-5xl flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground hover:underline">
          Privacy Policy
        </Link>
        <Link href="/terms-of-use" className="text-muted-foreground hover:text-foreground hover:underline">
          Terms of Use
        </Link>
      </nav>
    </footer>
  );
}
