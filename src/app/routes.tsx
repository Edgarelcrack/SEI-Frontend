import { lazy, Suspense, type ComponentType } from "react";
import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";

const Home = lazy(() => import("./pages/Home").then(m => ({ default: m.Home })));
const Services = lazy(() => import("./pages/Services").then(m => ({ default: m.Services })));
const Platforms = lazy(() => import("./pages/Platforms").then(m => ({ default: m.Platforms })));
const SoftwareDetail = lazy(() => import("./pages/SoftwareDetail").then(m => ({ default: m.SoftwareDetail })));
const Hardware = lazy(() => import("./pages/Hardware").then(m => ({ default: m.Hardware })));
const HardwareDetail = lazy(() => import("./pages/HardwareDetail").then(m => ({ default: m.HardwareDetail })));
const Privacy = lazy(() => import("./pages/Privacy").then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import("./pages/Terms").then(m => ({ default: m.Terms })));
const NotFound = lazy(() => import("./pages/NotFound").then(m => ({ default: m.NotFound })));

// Panel admin (code-split en su propio chunk)
const AdminLayout = lazy(() => import("./components/admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin").then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminSoftwareList = lazy(() => import("./pages/admin/AdminSoftwareList").then(m => ({ default: m.AdminSoftwareList })));
const AdminSoftwareForm = lazy(() => import("./pages/admin/AdminSoftwareForm").then(m => ({ default: m.AdminSoftwareForm })));
const AdminHardwareList = lazy(() => import("./pages/admin/AdminHardwareList").then(m => ({ default: m.AdminHardwareList })));
const AdminHardwareForm = lazy(() => import("./pages/admin/AdminHardwareForm").then(m => ({ default: m.AdminHardwareForm })));
const AdminTags = lazy(() => import("./pages/admin/AdminTags").then(m => ({ default: m.AdminTags })));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads").then(m => ({ default: m.AdminLeads })));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers").then(m => ({ default: m.AdminUsers })));

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-[#1B56D2] border-t-transparent animate-spin" />
    </div>
  );
}

const withSuspense = (Component: ComponentType) => () => (
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
      { path: "software/:slug", Component: withSuspense(SoftwareDetail) },
      { path: "hardware", Component: withSuspense(Hardware) },
      { path: "hardware/:slug", Component: withSuspense(HardwareDetail) },
      { path: "privacidad", Component: withSuspense(Privacy) },
      { path: "terminos", Component: withSuspense(Terms) },
      { path: "*", Component: withSuspense(NotFound) },
    ],
  },
  {
    path: "/admin/login",
    Component: withSuspense(AdminLogin),
  },
  {
    path: "/admin",
    Component: withSuspense(AdminLayout),
    children: [
      { index: true, Component: withSuspense(AdminDashboard) },
      { path: "software", Component: withSuspense(AdminSoftwareList) },
      { path: "software/new", Component: withSuspense(AdminSoftwareForm) },
      { path: "software/:id", Component: withSuspense(AdminSoftwareForm) },
      { path: "hardware", Component: withSuspense(AdminHardwareList) },
      { path: "hardware/new", Component: withSuspense(AdminHardwareForm) },
      { path: "hardware/:id", Component: withSuspense(AdminHardwareForm) },
      { path: "tags", Component: withSuspense(AdminTags) },
      { path: "leads", Component: withSuspense(AdminLeads) },
      { path: "users", Component: withSuspense(AdminUsers) },
    ],
  },
]);
