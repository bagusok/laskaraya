import { ReactNode } from "react";

export interface Stat {
  label: string;
  value: string;
  icon: ReactNode;
}

export interface Event {
  name: string;
  date: string;
  category: string;
}

export interface ProgramStudi {
  id: number;
  name: string;
  students: number;
  competitions: number;
}

export interface Period {
  id: number;
  name: string;
  status: string;
  events: number;
}
