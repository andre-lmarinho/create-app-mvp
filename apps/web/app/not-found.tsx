import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 text-center space-y-3">
      <h1 className="text-2xl font-semibold text-primary-main">Page not found</h1>
      <p className="text-sm text-gray-600">The page you requested does not exist.</p>
      <Link href="/" className="inline-block text-sm font-semibold text-primary-700 hover:underline">
        Back home
      </Link>
    </div>
  );
}
