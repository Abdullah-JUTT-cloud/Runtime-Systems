import { createContext, useContext, useEffect, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";

type RouterContextValue = { path: string; navigate: (path: string) => void };
const RouterContext = createContext<RouterContextValue>({ path: "/", navigate: () => undefined });

function currentPath() {
  const hash = window.location.hash.replace(/^#/, "");
  if (hash.startsWith("/")) return hash;
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";
  return pathname;
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    const onHash = () => {
      setPath(currentPath());
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onHash);
    return () => { window.removeEventListener("hashchange", onHash); window.removeEventListener("popstate", onHash); };
  }, []);

  const navigate = (next: string) => {
    if (next === path) window.scrollTo({ top: 0, behavior: "smooth" });
    else {
      window.history.pushState({}, "", next);
      setPath(next);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  return useContext(RouterContext);
}

export function Link({ href, children, className, onClick, ariaLabel, style }: { href: string; children: ReactNode; className?: string; onClick?: (event: MouseEvent<HTMLAnchorElement>) => void; ariaLabel?: string; style?: CSSProperties }) {
  const { navigate } = useRouter();
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      onClick?.(event);
      if (event.defaultPrevented) return;
      event.preventDefault();
      navigate(href);
    }
  };
  return <a href={href} className={className} onClick={handleClick} aria-label={ariaLabel} style={style}>{children}</a>;
}
