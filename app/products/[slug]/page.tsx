import ProductPageClient from "@/components/ProductPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

// We can't statically generate from API at build time, so use dynamic rendering
export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  return <ProductPageClient slug={slug} />;
}
