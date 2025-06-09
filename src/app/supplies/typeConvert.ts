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

interface EnumDict<T> {
    [key: string]: T;
}

export const to_enum: (v: string[]) => EnumDict<string> | null = (v) => {
    
    // Evaluate repetition
    const weights = [0.4, 0.3, 0.3]
    const [freq, seq, sim] = [repetition_frequency(v), repetition_sequential(v), repetition_similarity(v)]
    const score = weights[0] * freq + weights[1] * seq + weights[2] * sim;

    if (score >= 0.6 && [...new Set(v)].length <= 25) {
        // Repetitive, is enum
        return null;
    }

    return null;
} 

// Repetition analysis for enum inference

const repetition_frequency: (v: string[]) => number = (v) => {
    
    if (v.length == 0) return 0.0;

    const counts: Record<string, number> = {};
    v.forEach(str => {
        counts[str] = (counts[str] || 0) + 1;
    });

    const max_repeats = Math.max(...Object.values(counts))
    return (max_repeats - 1) / (v.length - 1) || 1.0;
}

const repetition_sequential: (v: string[]) => number = (v) => {

    if (v.length == 0) return 0.0;

    let repeat_count = 0;
    for (let i=1;i<v.length;i++) {
        if (v[i] == v[i - 1]) repeat_count++;
    }

    return (v.length > 1) ? repeat_count / (v.length - 1) : 1.0
}

const repetition_similarity: (v: string[]) => number = (v) => {

    if (v.length == 0) return 0.0;

    let similar_pairs = 0;
    let total_pairs = 0;

    for (let i=0;i<v.length;i++) {
        for (let j=i+1;j<v.length;j++) {
            const max_length = Math.max(v[i].length, v[j].length);
            const distance = levenshtein_distance(v[i], v[j]);
            const similarity = 1 - distance / max_length;

            if (similarity >= 1.0) {
                similar_pairs++;
            }
            total_pairs++;
        }
    }

    return total_pairs > 0 ? similar_pairs / total_pairs : 0.0;
}

// Levenshtein Distance
function levenshtein_distance(a: string, b: string): number {

    if (a.length == 0) return b.length;
    if (b.length == 0) return a.length;

    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
            const cost = a[i-1] === b[j-1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i-1] + 1,
                matrix[j-1][i] + 1,
                matrix[j-1][i-1] + cost
            );
        }
    }

    return matrix[b.length][a.length];
}