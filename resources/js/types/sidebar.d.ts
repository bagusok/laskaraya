export interface NavItem {
    label: string;
    icon: React.ReactNode;
    href?: string;
    subItems?: {
      label: string;
      href: string;
    }[];
  }

  export interface SidebarProps {
    navItems: NavItem[];
    sidebarOpen: boolean;
    onClose: () => void;
    currentUrl: string;
  }
