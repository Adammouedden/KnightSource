"use client";

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Chatbot } from '@/components/Chatbot';
import { AccordionSection } from '@/components/AccordionSection';
import { useEffect, useState } from 'react';
import { CategoryData } from '@/lib/content-loader';

export default function LegalPage() {
  const [data, setData] = useState<CategoryData | null>(null);

  useEffect(() => {
    fetch('/content/categories/legal.json')
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container max-w-5xl">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.title}</h1>
              <p className="text-xl text-muted-foreground">{data.description}</p>
            </div>

            <div className="bg-card border rounded-2xl p-6 md:p-8">
              <AccordionSection subcategories={data.subcategories} />
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-8 p-4 bg-muted rounded-lg text-sm">
                <summary className="font-semibold cursor-pointer">
                  Dev: Content File Location
                </summary>
                <p className="mt-2 text-muted-foreground">
                  Edit: <code className="bg-background px-2 py-1 rounded">
                    /content/categories/legal.json
                  </code>
                </p>
              </details>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}
