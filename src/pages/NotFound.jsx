import React from "react";
import { Link } from "react-router-dom";
import ArchivePage from "../components/archive/ArchivePage";
import { useLocalizedPath } from "../lib/i18n";

const NotFound = () => {
  const toLocalized = useLocalizedPath();
  return (
    <ArchivePage eyebrow="Error archive" title="404" subtitle="Halaman ini tidak ada di archive portfolio." contentClassName="lg:min-h-[50svh]">
      <Link to={toLocalized("/")} className="archive-btn archive-btn-primary">Back to home</Link>
    </ArchivePage>
  );
};

export default NotFound;
