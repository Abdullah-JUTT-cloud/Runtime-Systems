export const site = {
  name: "Runtime Systems",
  shortName: "Runtime",
  domain: import.meta.env.VITE_SITE_URL || "https://runtimesystems.tech",
  description:
    "Runtime Systems engineers intelligent products, scalable platforms, AI systems, mobile applications, and backend infrastructure.",
  location: "Lahore, Pakistan",
  reach: "Worldwide",
  email: "hello@runtimesystems.tech",
  phone: "+92 321 4194045",
  whatsapp: "https://wa.me/923214194045",
  booking: { label: "Book an appointment", href: "https://cal.com/muhammad-abdullah-jutt/15min", note: "15-min intro call" },
} as const;

export const navigation = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Contact Us", href: "/contact" },
] as const;

export const socials = [
  { label: "Instagram", href: "https://www.instagram.com/runtimesystems/", placeholder: false },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61594981626249", placeholder: false },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/runtime-systems", placeholder: false },
] as const;

export const footerLinks = [
  ...navigation,
  { label: "Careers", href: "/careers" },
  { label: "Start a Project", href: "/start-project" },
  { label: "Book an appointment", href: site.booking.href, external: true },
] as const;
