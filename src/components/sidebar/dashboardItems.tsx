import { SidebarItemsType } from "@/types/sidebar";

import {
  BookOpen,
  Briefcase,
  Calendar,
  CheckSquare,
  CreditCard,
  Grid,
  Heart,
  Layout,
  List,
  Map,
  ShoppingCart,
  Package,
  PieChart,
  Sliders,
  Users,
} from "lucide-react";

const userSection = [
  {
    href: "/dashboard",
    icon: Sliders,
    title: "Dashboard",
    children: [
      {
        href: "/dashboard/lab1",
        title: "Lab 1",
      },
      {
        href: "/dashboard/lab2",
        title: "Lab 2",
      },
      {
        href: "/dashboard/lab3",
        title: "Lab 3",
      },
    ],
  },
  // {
  //   href: "/pages",
  //   icon: Layout,
  //   title: "Pages",
  //   children: [
  //     {
  //       href: "/pages/profile",
  //       title: "Profile",
  //     },
  //     {
  //       href: "/pages/settings",
  //       title: "Settings",
  //     },
  //     {
  //       href: "/pages/pricing",
  //       title: "Pricing",
  //     },
  //     {
  //       href: "/pages/chat",
  //       title: "Chat",
  //     },
  //     {
  //       href: "/pages/blank",
  //       title: "Blank Page",
  //     },
  //   ],
  // },
  {
    href: "/projects",
    icon: Briefcase,
    title: "Projects",
    badge: "8",
  },
  {
    href: "/reports",
    icon: Package,
    title: "Reports",
  },
  // {
  //   href: "/invoices",
  //   icon: CreditCard,
  //   title: "Invoices",
  //   children: [
  //     {
  //       href: "/invoices",
  //       title: "List",
  //     },
  //     {
  //       href: "/invoices/detail",
  //       title: "Detail",
  //     },
  //   ],
  // },
  {
    href: "/controls",
    icon: CheckSquare,
    title: "Controls",
    badge: "17",
  },
  // {
  //   href: "/calendar",
  //   icon: Calendar,
  //   title: "Calendar",
  // },
  // {
  //   href: "/auth",
  //   icon: Users,
  //   title: "Auth",
  //   children: [
  //     {
  //       href: "/auth/sign-in",
  //       title: "Sign In",
  //     },
  //     {
  //       href: "/auth-cover/sign-in",
  //       title: "Sign In Cover",
  //     },
  //     {
  //       href: "/auth/sign-up",
  //       title: "Sign Up",
  //     },
  //     {
  //       href: "/auth-cover/sign-up",
  //       title: "Sign Up Cover",
  //     },
  //     {
  //       href: "/auth/reset-password",
  //       title: "Reset Password",
  //     },
  //     {
  //       href: "/auth-cover/reset-password",
  //       title: "Reset Password Cover",
  //     },
  //     {
  //       href: "/error/404",
  //       title: "404 Page",
  //     },
  //     {
  //       href: "/error/500",
  //       title: "500 Page",
  //     },
  //   ],
  // },
] as SidebarItemsType[];

const adminSection = [
  {
    href: "/admin/dashboard",
    icon: Sliders,
    title: "Dashboard",
    children: [
      {
        href: "/admin/dashboard/lab1",
        title: "Lab 1",
      },
      {
        href: "/admin/dashboard/lab2",
        title: "Lab 2",
      },
      {
        href: "/admin/dashboard/lab3",
        title: "Lab 3",
      },
    ],
  },
  {
    href: "/admin/access",
    icon: Package,
    title: "Manage Access",
  },
  {
    href: "/admin/activity",
    icon: Package,
    title: "Activity Logs",
  },
  {
    href: "/admin/usage",
    icon: ShoppingCart,
    title: "Usage History",
  },
  {
    href: "/admin/settings",
    icon: ShoppingCart,
    title: "System Settings",
  },
  {
    href: "/admin/alerts",
    icon: ShoppingCart,
    title: "Alerts",
  },
  // {
  //   href: "/components",
  //   icon: Grid,
  //   title: "Components",
  //   children: [
  //     {
  //       href: "/components/alerts",
  //       title: "Alerts",
  //     },
  //     {
  //       href: "/components/accordion",
  //       title: "Accordion",
  //     },
  //     {
  //       href: "/components/avatars",
  //       title: "Avatars",
  //     },
  //     {
  //       href: "/components/badges",
  //       title: "Badges",
  //     },
  //     {
  //       href: "/components/buttons",
  //       title: "Buttons",
  //     },
  //     {
  //       href: "/components/cards",
  //       title: "Cards",
  //     },
  //     {
  //       href: "/components/chips",
  //       title: "Chips",
  //     },
  //     {
  //       href: "/components/dialogs",
  //       title: "Dialogs",
  //     },
  //     {
  //       href: "/components/lists",
  //       title: "Lists",
  //     },
  //     {
  //       href: "/components/menus",
  //       title: "Menus",
  //     },
  //     {
  //       href: "/components/pagination",
  //       title: "Pagination",
  //     },
  //     {
  //       href: "/components/progress",
  //       title: "Progress",
  //     },
  //     {
  //       href: "/components/snackbars",
  //       title: "Snackbars",
  //     },
  //     {
  //       href: "/components/tooltips",
  //       title: "Tooltips",
  //     },
  //   ],
  // },
  // {
  //   href: "/charts",
  //   icon: PieChart,
  //   title: "Charts",
  //   children: [
  //     {
  //       href: "/charts/chartjs",
  //       title: "Chart.js",
  //     },
  //     {
  //       href: "/charts/apexcharts",
  //       title: "ApexCharts",
  //     },
  //   ],
  // },
  // {
  //   href: "/forms",
  //   icon: CheckSquare,
  //   title: "Forms",
  //   children: [
  //     {
  //       href: "/forms/pickers",
  //       title: "Pickers",
  //     },
  //     {
  //       href: "/forms/selection-controls",
  //       title: "Selection Controls",
  //     },
  //     {
  //       href: "/forms/selects",
  //       title: "Selects",
  //     },
  //     {
  //       href: "/forms/text-fields",
  //       title: "Text Fields",
  //     },
  //     {
  //       href: "/forms/editors",
  //       title: "Editors",
  //     },
  //     {
  //       href: "/forms/formik",
  //       title: "Formik",
  //     },
  //   ],
  // },
  // {
  //   href: "/tables",
  //   icon: List,
  //   title: "Tables",
  //   children: [
  //     {
  //       href: "/tables/simple-table",
  //       title: "Simple Table",
  //     },
  //     {
  //       href: "/tables/advanced-table",
  //       title: "Advanced Table",
  //     },
  //     {
  //       href: "/tables/data-grid",
  //       title: "Data Grid",
  //     },
  //   ],
  // },
  // {
  //   href: "/icons",
  //   icon: Heart,
  //   title: "Icons",
  //   children: [
  //     {
  //       href: "/icons/material-icons",
  //       title: "Material Icons",
  //     },
  //     {
  //       href: "/icons/lucide-icons",
  //       title: "Lucide Icons",
  //     },
  //   ],
  // },
  // {
  //   href: "/maps",
  //   icon: Map,
  //   title: "Maps",
  //   children: [
  //     {
  //       href: "/maps/google-maps",
  //       title: "Google Maps",
  //     },
  //     {
  //       href: "/maps/vector-maps",
  //       title: "Vector Maps",
  //     },
  //   ],
  // },
] as SidebarItemsType[];

const accountSection = [
  {
    href: "/account/notifications",
    icon: ShoppingCart,
    title: "Notifications",
  },
  {
    href: "/account/profile",
    icon: ShoppingCart,
    title: "Profile",
  },
  {
    href: "/account/settings",
    icon: ShoppingCart,
    title: "Settings",
  },
  // {
  //   href: "/documentation/welcome",
  //   icon: BookOpen,
  //   title: "Documentation",
  // },
  // {
  //   href: "/changelog",
  //   icon: List,
  //   title: "Changelog",
  //   badge: "v5.0.1",
  // },
] as SidebarItemsType[];

const navItems = [
  {
    title: "User",
    pages: userSection,
  },
  {
    title: "Admin",
    pages: adminSection,
  },
  {
    title: "Account",
    pages: accountSection,
  },
];

export default navItems;
