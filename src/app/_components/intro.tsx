"use client";

import { useState } from "react";

export function Intro() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/mzdddwrw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsFormOpen(false);
          setIsSubmitted(false);
          setFormData({ name: "", email: "", phone: "", website: "", message: "" });
        }, 2000);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-20 md:mb-28">
      <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
        Aqui.io
      </h1>
      <div className="text-center md:text-left mt-5 md:pl-8 relative">
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="text-lg text-neutral-600 dark:text-neutral-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors underline underline-offset-4"
        >
          Get in touch to discuss your project.
        </button>

        <div
          className={`absolute right-0 top-full mt-4 w-80 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-neutral-200 dark:border-slate-700 p-6 z-50 transition-all duration-300 ease-out origin-top ${
            isFormOpen
              ? "opacity-100 scale-y-100 translate-y-0"
              : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
          }`}
        >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                Get in touch
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                aria-label="Close form"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            {isSubmitted ? (
              <div className="text-center py-6">
                <p className="text-lg font-medium text-neutral-900 dark:text-white">
                  Thanks for reaching out!
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  We&apos;ll be in touch soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-neutral-200 dark:border-slate-700 rounded-lg bg-neutral-50 dark:bg-slate-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                    placeholder="Your name"
                    suppressHydrationWarning
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-neutral-200 dark:border-slate-700 rounded-lg bg-neutral-50 dark:bg-slate-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                    placeholder="you@company.com"
                    suppressHydrationWarning
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-neutral-200 dark:border-slate-700 rounded-lg bg-neutral-50 dark:bg-slate-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                    placeholder="+44 7700 900000"
                    suppressHydrationWarning
                  />
                </div>
                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5"
                  >
                    Website <span className="text-neutral-400 dark:text-neutral-500">(optional)</span>
                  </label>
                  <input
                    type="url"
                    id="website"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-neutral-200 dark:border-slate-700 rounded-lg bg-neutral-50 dark:bg-slate-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                    placeholder="https://yourcompany.com"
                    suppressHydrationWarning
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5"
                  >
                    Project details
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-neutral-200 dark:border-slate-700 rounded-lg bg-neutral-50 dark:bg-slate-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your project..."
                    suppressHydrationWarning
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-2.5 px-4 rounded-lg text-sm font-bold tracking-tight hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send message"}
                </button>
              </form>
            )}
          </div>
      </div>
    </section>
  );
}
