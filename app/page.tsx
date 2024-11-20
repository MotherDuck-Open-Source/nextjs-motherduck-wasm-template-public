import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col row-start-2  items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex gap-4 justify-center sm:flex-row">

        <Image
          className="dark:invert"
          src="/motherduck_logo.png"
          alt="MotherDuck logo"
          width={250}
          height={35}
          priority
        />

        <Image
          className="dark:invert"
          src="/Slash.png"
          alt="slash"
          width={24}
          height={48}
          priority />

        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />


      </div>

      <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
        The Next.js MotherDuck Wasm-SDK Starter.

        Learn how to:
        <li>Connect to MotherDuck. </li>
        <li>Build interactive, blazing fast data visualizations.</li>
      </ol>

      <div className="flex gap-4 justify-center sm:flex-row">
        <a
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
          href="demo"
        >
          See Demo
        </a>
      </div>
    </div>
  );
}
