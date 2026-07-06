import Container from "@/app/_components/container";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 dark:bg-slate-800">
      <Container>
        <div className="py-10 flex flex-col items-center">
          <Link
            href="/portfolio"
            className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:underline underline-offset-4 transition-colors mb-3"
          >
            Side Projects
          </Link>
          <p className="text-center text-neutral-600 dark:text-neutral-400">
            Copyright &copy; 2026 Aquidigital Ltd. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
