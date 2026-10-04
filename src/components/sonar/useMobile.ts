import { useEffect, useState } from "react";

/** True below the SONAR sheet breakpoint (matches sonar.css, < 720px). */
export function useIsMobile(): boolean {
  const query = "(max-width: 719px)";
  const [mobile, setMobile] = useState(
    () => typeof window.matchMedia === "function" && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return mobile;
}
