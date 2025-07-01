import { useForm as useRHF, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodTypeAny } from "zod";
import { FormValue } from "./types";

export function useForm(layout: FormValue, schema: ZodTypeAny): UseFormReturn<any> {
    const defaultValues = Object.keys(layout).reduce((acc, key) => {
        acc[key] = layout[key].initialValue;
        return acc;
    }, {} as Record<string, any>);
    return useRHF({
        resolver: zodResolver(schema),
        defaultValues,
        mode: "onChange",
    });
}
