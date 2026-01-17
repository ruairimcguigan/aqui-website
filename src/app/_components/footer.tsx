import Container from "@/app/_components/container";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 dark:bg-slate-800">
      <Container>
        <div className="py-10 flex flex-col items-center">
          <p className="text-center text-neutral-600 dark:text-neutral-400 mb-4">
            Copyright &copy; 2026 Aquidigital Ltd. All rights reserved.
          </p>
          <Link
            href="/privacy"
            className="text-brand-blue hover:underline duration-200 transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
