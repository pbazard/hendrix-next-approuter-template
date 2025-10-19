import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="text-center space-y-8 p-8 max-w-4xl mx-auto">
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/hendrix-logo.png"
            alt="Hendrix Logo"
            width={200}
            height={200}
            priority
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">
            Welcome to Hendrix
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your modern web application powered by Next.js, Tailwind CSS, and
            AWS Amplify
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button className="bg-gray-900 text-white hover:bg-gray-800 font-semibold py-3 px-8 rounded-md transition-all duration-200 hover:shadow-lg">
            Get Started
          </button>
          <button className="bg-white text-gray-900 hover:bg-gray-50 font-semibold py-3 px-8 rounded-md border border-gray-300 transition-all duration-200 hover:shadow-lg">
            Learn More
          </button>
        </div>

        <div className="mt-8">
          <a
            href="/admin"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            🔧 Admin Panel
          </a>
        </div>

        <div className="mt-12 text-gray-500 text-sm">
          Built with ❤️ using modern web technologies
        </div>
      </div>
    </main>
  );
}
