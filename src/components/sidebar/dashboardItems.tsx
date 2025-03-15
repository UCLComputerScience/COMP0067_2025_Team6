import { SidebarItemsType } from "@/types/sidebar";
import { useSession } from "next-auth/react";

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
  {
    href: "/reports",
    icon: Package,
    title: "Reports",
  },

  {
    href: "/controls",
    icon: CheckSquare,
    title: "Controls",
    // badge: "17",
  },


] as SidebarItemsType[];

const adminSection = [
  // {
  //   href: "/admin/dashboard",
  //   icon: Sliders,
  //   title: "Dashboard",
  //   children: [
  //     {
  //       href: "/admin/dashboard/lab1",
  //       title: "Lab 1",
  //     },
  //     {
  //       href: "/admin/dashboard/lab2",
  //       title: "Lab 2",
  //     },
  //     {
  //       href: "/admin/dashboard/lab3",
  //       title: "Lab 3",
  //     },
  //   ],
  // },
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
  // {
  //   href: "/admin/settings",
  //   icon: ShoppingCart,
  //   title: "System Settings",
  // },
  {
    href: "/admin/alerts",
    icon: ShoppingCart,
    title: "Alerts",
  },

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
