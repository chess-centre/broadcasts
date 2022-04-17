import React from "react";
import { Link } from "react-router-dom";

export default function Page404() {
  return (
    <div className="min-h-full pt-12 pb-12 flex flex-col bg-white">
      <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-10 sm:py-16">
          <div className="text-center">
            <p className="text-4xl font-semibold text-cyan-600 uppercase tracking-wide">
              404
            </p>
            <h1 className="mt-2 text-2xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Page not found.
            </h1>
            <p className="mt-6 text-base text-slate-500">
              Sorry, we couldn’t find the page you’re looking for.
            </p>
            <p className="text-8xl sm:text-9xl mt-4">
              <i className="fas fa-chess text-slate-100"></i>
            </p>
            <div className="mt-4 space-x-3">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-700 hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                Go back home
              </Link>
              <a
                href="mailto:support@chesscentre.online"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-brand bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                Contact support
              </a>
            </div>
          </div>
        </div>
      </main>
      <footer className="flex-shrink-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8"></footer>
    </div>
  );
}
