import { toZonedTime } from "date-fns-tz";

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
}


// Time zone for Bohol, Philippines (Asia/Manila)
export const timeZone = 'Asia/Manila';

export const timeDate =(date:Date) => toZonedTime(date, timeZone);