import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertDateWithoutOffset(date: Date) {
  const localOffset = new Date().getTimezoneOffset() * 60000;

  return new Date(date.getTime() - localOffset);
}
