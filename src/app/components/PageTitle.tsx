import { useEffect } from "react";

interface PageTitleProps {
  title: string;
}

export function PageTitle({ title }: PageTitleProps) {
  useEffect(() => {
    document.title = `${title} | DevTeam Solutions`;
  }, [title]);

  return null;
}
