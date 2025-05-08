import { ReactNode } from "react";

export interface User {
  id?: number;
  name: string;
  email: string;
  identifier: string;
  phone: string;
  faculty: string;
  password?: string;
  role: string;
  is_verified: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Column {
  header: string;
  accessorKey: string;
  cell?: (row: User) => ReactNode;
}

