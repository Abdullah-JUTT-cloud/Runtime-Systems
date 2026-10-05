import { AnimatePresence, motion } from "motion/react";
import { CustomCursor } from "./components/CustomCursor";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Footer } from "./components/Footer";
import { Navigation } from "./components/Navigation";
import { RuntimeIntro } from "./components/intro/RuntimeIntro";
import { ScrollProgress } from "./components/ScrollProgress";
import { SonarMount } from "./components/SonarMount";
import { useReveal } from "./hooks/useReveal";
import { services } from "./data/services";
import { projects } from "./data/projects";
import { useRouter } from "./lib/router";
import { About } from "./pages/About";
import { Careers } from "./pages/Careers";
import { Contact } from "./pages/Contact";
import { Home } from "./pages/Home";
import { Insights } from "./pages/Insights";
import { NotFound } from "./pages/NotFound";
import { Privacy } from "./pages/Privacy";
import { Process } from "./pages/Process";
import { ProjectBrief } from "./pages/ProjectBrief";
import { ProjectDetail } from "./pages/ProjectDetail";
import { ServiceDetail } from "./pages/ServiceDetail";
import { Services } from "./pages/Services";
import { Solutions } from "./pages/Solutions";
import { Work } from "./pages/Work";

function RouteView({ path }: { path: string }) {
  if (path === "/") return <Home />;
  if (path === "/work") return <Work />;
  if (path.startsWith("/work/")) {
    const project = projects.find((item) => item.slug === path.slice(6));
    return project ? <ProjectDetail project={project} /> : <NotFound />;
  }
  if (path === "/services") return <Services />;
  if (path.startsWith("/services/")) {
    const service = services.find((item) => item.href === path);
    return service ? <ServiceDetail service={service} /> : <NotFound />;
  }
  if (path === "/solutions") return <Solutions />;
  if (path === "/process") return <Process />;
  if (path === "/about") return <About />;
  if (path === "/insights") return <Insights />;
  if (path === "/careers") return <Careers />;
  if (path === "/contact") return <Contact />;
  if (path === "/privacy-policy") return <Privacy />;
  if (path === "/start-project") return <ProjectBrief />;
  return <NotFound />;
}

/** Re-arms the reveal observer once the incoming route has mounted. */
function RevealOnMount({ path }: { path: string }) {
  useReveal(path);
  return null;
}

export function App() {
  const { path } = useRouter();
  const standalone = path === "/start-project";
  return (
    <ErrorBoundary>
      <a className="skip-link" href="#content">Skip to content</a>
      <CustomCursor />
      <ScrollProgress />
      {!standalone && <Navigation />}
      <AnimatePresence mode="wait">
        <motion.div id="content" key={path} className="route" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
          <RevealOnMount path={path} />
          <RouteView path={path} />
        </motion.div>
      </AnimatePresence>
      {!standalone && <Footer />}
      <SonarMount />
      <RuntimeIntro />
    </ErrorBoundary>
  );
}
