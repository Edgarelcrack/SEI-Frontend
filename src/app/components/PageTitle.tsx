import { useEffect } from "react";

/** Nombre de marca usado como sufijo en el título de cada página. */
const SITE_NAME = "SEI";

interface PageTitleProps {
  /** Título de la página, sin el sufijo de marca. */
  title: string;
  /** Meta description para SEO. Si se omite, se conserva la del index.html. */
  description?: string;
}

export function PageTitle({ title, description }: PageTitleProps) {
  useEffect(() => {
    document.title = `${title} | ${SITE_NAME}`;

    if (description) {
      let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = "description";
        document.head.appendChild(tag);
      }
      tag.content = description;
    }
  }, [title, description]);

  return null;
}
