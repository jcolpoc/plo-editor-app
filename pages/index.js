import dynamic from "next/dynamic";

const PLOEditor = dynamic(() => import("../src/PLOEditor"), { ssr: false });

export default function Home() {
  return <PLOEditor />;
}
