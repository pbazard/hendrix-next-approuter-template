export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="text-center space-y-4 p-8">
        <h1 className="text-6xl font-bold text-white">404</h1>
        <h2 className="text-2xl font-semibold text-white/90">Page Not Found</h2>
        <p className="text-white/70">
          The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="inline-block bg-white text-purple-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 mt-4"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
