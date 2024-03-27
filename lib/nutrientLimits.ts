import type { NutrientLimits } from "@/types";

export function DecodeNutrientLimits(limits: string) {
    return JSON.parse(limits) as NutrientLimits;
}

export function EncodeNutrientLimits(limits: NutrientLimits) {
    return JSON.stringify(limits);
}