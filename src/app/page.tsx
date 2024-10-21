"use client"
import Calculator from "@/app/components/Calculator";


export default function Home() {
  return (
      <div className="min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)] bg-gray-100 dark:bg-gray-900">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Agro Calculator</h1>
          <p className="text-gray-600 dark:text-gray-400">Real-time commodity conversions</p>
        </header>

        <main className="max-w-4xl mx-auto">
          <Calculator />
        </main>

        <footer className="mt-16 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2024 Agro Calculator. All rights reserved.</p>
        </footer>
      </div>
  );
}
