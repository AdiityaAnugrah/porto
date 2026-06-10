import React from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import { isSupportedLocale } from "../lib/i18n";
import SEO from "./SEO";

const LocaleGate = () => {
  const { locale } = useParams();

  if (!isSupportedLocale(locale)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <SEO title="Page Not Found | Aditya Anugrah" robots="noindex,nofollow" />
        <h1 className="mb-4 text-7xl font-bold text-white md:text-9xl">404</h1>
        <p className="mb-8 max-w-md text-white/55">The page you are looking for does not exist.</p>
        <Link to="/en" className="rounded-full bg-cyan-100 px-8 py-3 font-bold text-black transition-colors hover:bg-white">
          Back to Home
        </Link>
      </div>
    );
  }

  return <Outlet />;
};

export default LocaleGate;
