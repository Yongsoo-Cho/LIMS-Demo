import { unique } from "next/dist/build/utils";

export const to_boolean: (v: string) => boolean | null = (v) => {

    // console.log(v)

    if (v === "0" || v === "false") return false;

    if (v === "1" || v === "true") return true;

    return null
}

export const to_number: (v: string) => number | null = (v) => {

    const convert = Number.parseFloat(v);

    // console.log(convert)

    if (isNaN(convert) || v === "") return null;

    return convert;
}

export const to_date: (v: string) => number | null = (v) => {
    
    const date = Date.parse(v);

    // console.log(date)

    if (isNaN(date)) return null;

    return date;
}

// MARK: Enum
export interface EnumDict<T> {
    [key: string]: T;
}

export const is_enum = (v: string[]): boolean => {
  if (v.length === 0) return false;

  const uniq = [...new Set(v)];
  const uniqueRatio = uniq.length / v.length;

  // Heuristics:
  // - Not too many unique values
  // - Unique values are short
  // - At least one value is repeated
  const maxEnumSize = 25;
  const maxValueLength = 25;
  const maxUniqueRatio = 0.3; // e.g. 30% unique

  const allShort = uniq.every((val) => val.length <= maxValueLength);
  const hasRepeats = uniq.length < v.length;

  return (
    uniq.length <= maxEnumSize &&
    uniqueRatio <= maxUniqueRatio &&
    allShort &&
    hasRepeats
  );
};

export const to_enum: (v: string[]) => EnumDict<[number, number, number]> = (v) => {

    const uniq: string[] = [...new Set(v)];
    let color_binds: [number,number,number][] = uniq.map((v) => string_to_color(v));
    let dict: EnumDict<[number, number, number]> = { };
    let _ = uniq.map((v, i) => {
        dict[v] = color_binds[i]
    })
    return dict;
    
} 

// String to color conversion

function string_to_color(s: string): [number, number, number] {
    // Hash string to a number
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        hash = s.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Use hash to get a hue value between 0 and 359
    const hue = Math.abs(hash) % 360;
    const saturation = 80; // percent, high saturation
    const lightness = 65;  // percent, medium lightness

    return hslToRgb(hue, saturation, lightness);
}

// Convert HSL to RGB
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
        l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1));
    return [
        Math.round(255 * f(0)),
        Math.round(255 * f(8)),
        Math.round(255 * f(4)),
    ];
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

export function getContrastTextColor([r, g, b]: [number, number, number]): string {
  // YIQ formula for perceived brightness
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#222" : "#fff"; // dark text on light bg, light text on dark bg
}