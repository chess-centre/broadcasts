import React from "react";
import { Link } from "react-router-dom";

export default function Page404() {
  return (
    <div className="min-h-full pt-12 pb-12 flex flex-col">
      <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-10 sm:py-16">
          <div className="text-center">
            <p className="text-4xl font-semibold text-gh-link uppercase tracking-wide">
              404
            </p>
            <h1 className="mt-2 text-2xl font-extrabold text-gh-text tracking-tight sm:text-4xl">
              Page not found.
            </h1>
            <p className="mt-6 text-base text-gh-textMuted">
              Sorry, we couldn't find the page you're looking for.
            </p>
            <div className="mt-8">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-gh-btnPrimary border border-green-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-green-700 transition-colors"
              >
                Go back home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
