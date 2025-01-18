import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function rupiahFormat(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(number)
    .replace(/\s/g, "");
}

export function timeFormat(date) {
  const d = new Date(date); // Ensure the input is a Date object
  const hours = String(d.getUTCHours()).padStart(2, "0"); // Ensure 2-digit format
  const minutes = String(d.getUTCMinutes()).padStart(2, "0"); // Ensure 2-digit format

  return `${hours}:${minutes}`;
}

export function dateFormat(dateString) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function dateTimeFormat(dateString) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}
