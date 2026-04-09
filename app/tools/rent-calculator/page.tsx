import dynamic from "next/dynamic";

// Metadata is defined in layout.tsx for this route.

// Client-only: uses local state and browser APIs — no SSR needed
const RentCalculatorClient = dynamic(
  () => import("@/components/RentCalculatorClient"),
  { ssr: false, loading: () => <div className="min-h-screen bg-gray-50 animate-pulse" /> }
);

export default function RentCalculatorPage() {
  return <RentCalculatorClient />;
}
