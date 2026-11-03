import React from "react";
import { Outlet, useParams } from "react-router-dom";
import { isSupportedLocale } from "../lib/i18n";
import NotFound from "../pages/NotFound";

const LocaleGate = () => {
  const { locale } = useParams();

  if (!isSupportedLocale(locale)) {
    return <NotFound />;
  }

  return <Outlet />;
};

export default LocaleGate;
