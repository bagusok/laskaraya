import { atomWithStorage } from "jotai/utils";

export enum Theme {
  Light = "light",
  Dark = "dark",
  System = "system",
}

export const themeAtom = atomWithStorage<Theme>("theme", Theme.Light);
