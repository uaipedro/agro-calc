"use client"
import Calculator from "@/app/components/Calculator";


export default function Home() {
  return (
      <div className="min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)] bg-gray-100 dark:bg-gray-900">


        <main className="max-w-4xl mx-auto">
          <Calculator />
        </main>


      </div>
  );
}
