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
    let hash = 0;
    for (let i=0;i<s.length;i++) {
        hash = s.charCodeAt(i) + ((hash << 5) - hash);
    }

    const r = (hash & 0xFF0000) >> 16;
    const g = (hash & 0x00FF00) >> 8;
    const b = hash & 0x0000FF;

    return [r, g, b]
}