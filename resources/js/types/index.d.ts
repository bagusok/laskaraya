import { LucideIcon } from "lucide-react";
import type { Config } from "ziggy-js";

export interface Auth {
  user: User;
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  ziggy: Config & { location: string };
  sidebarOpen: boolean;
  [key: string]: unknown;
}

export interface User {
  id: number;
  name: string;
  identifier: string;
  email: string;
  phone: string;
  faculty: string;
  role: Role;
  created_at: Date | string;
  updated_at: Date | string;
  [key: string]: unknown;
}

export enum Role {
  MAHASISWA = "mahasiswa",
  ADMIN = "admin",
  DOSEN = "dosen",
}
