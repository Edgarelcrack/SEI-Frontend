import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";

const Home = lazy(() => import("./pages/Home").then(m => ({ default: m.Home })));
const Services = lazy(() => import("./pages/Services").then(m => ({ default: m.Services })));
const Platforms = lazy(() => import("./pages/Platforms").then(m => ({ default: m.Platforms })));
const SoftwareDetail = lazy(() => import("./pages/SoftwareDetail").then(m => ({ default: m.SoftwareDetail })));
const NotFound = lazy(() => import("./pages/NotFound").then(m => ({ default: m.NotFound })));

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-[#1B56D2] border-t-transparent animate-spin" />
    </div>
  );
}

const withSuspense = (Component: React.ComponentType) => () => (
  <Suspense fallback={<PageFallback />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: withSuspense(Home) },
      { path: "services", Component: withSuspense(Services) },
      { path: "platforms", Component: withSuspense(Platforms) },
      { path: "software/:id", Component: withSuspense(SoftwareDetail) },
      { path: "*", Component: withSuspense(NotFound) },
    ],
  },
]);
