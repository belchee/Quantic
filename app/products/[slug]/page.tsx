import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ArrowLeft, MessageCircle } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { products, categoryLabels } from "@/lib/products/cameras";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.id === slug);
  if (!product) return {};
  return {
    title: `${product.name} — ${product.model}`,
    description: product.shortDesc,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.id === slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
            <span>/</span>
            <span className="text-gray-700 truncate">{categoryLabels[product.category]}</span>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{product.model}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Image */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 flex items-center justify-center min-h-72">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={300}
                className="w-full max-w-sm object-contain"
              />
            </div>

            {/* Info */}
            <div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Products
              </Link>

              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-blue-600 text-white">
                  {product.model}
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                  {categoryLabels[product.category]}
                </span>
              </div>

              <h1
                className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight"
                style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.01em" }}
              >
                {product.name}
              </h1>

              <p className="text-gray-500 text-base mb-6 leading-relaxed">{product.shortDesc}</p>

              <div className="text-4xl font-bold text-gray-900 mb-8">
                €{product.price}
              </div>

              {/* Specs */}
              <div className="mb-8">
                <h3 className="text-gray-900 font-semibold text-sm mb-4 uppercase tracking-wide">Specifications</h3>
                <ul className="space-y-2">
                  {product.specs.map((spec) => (
                    <li key={spec} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <span className="text-gray-600 text-sm">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/contact?product=${product.model}`}
                  className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm text-center transition-colors"
                >
                  Request a Quote
                </Link>
                <a
                  href="https://wa.me/38345460460"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-gray-200 hover:border-green-400 text-gray-700 hover:text-green-600 font-semibold text-sm transition-colors bg-white"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-2xl font-bold text-gray-900 mb-8"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="h-36 bg-gray-50 flex items-center justify-center p-4">
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={200}
                      height={150}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-mono font-semibold text-blue-600">{p.model}</span>
                    <h3 className="text-gray-900 font-semibold text-sm mt-1 mb-2 line-clamp-2">{p.name}</h3>
                    <span className="text-lg font-bold text-gray-900">€{p.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
