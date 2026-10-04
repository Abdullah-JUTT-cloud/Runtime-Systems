import { useEffect } from "react";
import { site } from "../data/site";

export function SEO({ title, description = site.description }: { title?: string; description?: string }) {
  useEffect(() => {
    document.title = title ? `${title} — ${site.name}` : `${site.name} — Engineering What Comes Next`;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = description;
  }, [title, description]);
  return null;
}

