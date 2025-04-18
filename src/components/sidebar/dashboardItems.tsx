import { SidebarItemsType } from "@/types/sidebar";
import { useSession } from "next-auth/react";

import {
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  CheckSquare,
  Clock,
  CreditCard,
  FileText,
  Grid,
  Heart,
  Layout,
  List,
  Map,
  ShoppingCart,
  Package,
  PieChart,
  Settings,
  Sliders,
  SlidersHorizontal,
  User,
  Users,
  Key,
} from "lucide-react";

const userSection = [
  {
    href: "/dashboard",
    icon: Layout,
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
    icon: FileText,
    title: "Reports",
  },

  {
    href: "/controls",
    icon: SlidersHorizontal,
    title: "Controls",
    // badge: "17",
  },
] as SidebarItemsType[];

const adminSection = [
  {
    href: "/admin/access",
    icon: Key,
    title: "Manage Access",
  },
  {
    href: "/admin/activity",
    icon: List,
    title: "Activity Logs",
  },
  {
    href: "/admin/usage",
    icon: Clock,
    title: "Usage History",
  },
  {
    href: "/admin/alerts",
    icon: Bell,
    title: "Alerts",
  },
] as SidebarItemsType[];

const accountSection = [
  {
    href: "/account/profile",
    icon: User,
    title: "Profile",
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
