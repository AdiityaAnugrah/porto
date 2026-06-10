import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { localizedPath } from "../lib/i18n";
import { apiUrl } from "../lib/api";
import { detectLocalLanguage } from "../lib/usePreferredLanguage";

const LocaleRedirect = ({ to = "/" }) => {
  const location = useLocation();
  const [language, setLanguage] = useState(null);
  const target = to || `${location.pathname}${location.search}${location.hash}`;

  useEffect(() => {
    let active = true;

    fetch(apiUrl("/visitor/context"))
      .then((response) => {
        if (!response.ok) throw new Error("Visitor context unavailable");
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        setLanguage(data.countryCode ? (data.countryCode === "ID" ? "id" : "en") : detectLocalLanguage());
      })
      .catch(() => {
        if (active) setLanguage(detectLocalLanguage());
      });

    return () => {
      active = false;
    };
  }, []);

  if (!language) return null;

  return <Navigate to={localizedPath(target, language)} replace />;
};

export default LocaleRedirect;
