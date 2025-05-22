import { ReactNode } from "react";

export interface NavItem {
  label: string;
  icon: ReactNode;
  href?: string;
  subItems?: {
    label: string;
    href: string;
  }[];
}
