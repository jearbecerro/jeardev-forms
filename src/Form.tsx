import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { FormValue } from "./types";

export interface FormProps {
    form: UseFormReturn<any>;
    formLayout: FormValue;
    loading?: boolean;
    showSubmitButton?: boolean;
    onSubmit?: (data: any) => void;
}

export const Form: React.FC<FormProps> = ({
    form,
    formLayout,
    loading,
    showSubmitButton = false,
    onSubmit,
}) => {
    const handleSubmit = onSubmit
        ? form.handleSubmit(onSubmit)
        : (e: React.FormEvent) => e.preventDefault();

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap gap-x-4 gap-y-6">
                {Object.entries(formLayout).map(([key, layout]) => {
                    const width = layout.width ?? 24;
                    const flexBasis = `${(width / 24) * 100}%`;
                    const error = form.formState.errors[key]?.message as string | undefined;
                    const mergedClassName = `min-w-[180px] ${layout.className ?? ""}`;
                    const mergedStyle = { flexBasis, ...layout.style };

                    // Don't render if hidden
                    if (layout.hidden?.(form.getValues())) return null;

                    return (
                        <div key={key} className={mergedClassName.trim()} style={mergedStyle}>
                            <label>{layout.label || key}</label>
                            <Controller
                                name={key}
                                control={form.control}
                                render={({ field }) => {
                                    switch (layout.type) {
                                        case "text":
                                            return <input {...field} placeholder={layout.placeholder} />;
                                        case "textarea":
                                            return <textarea {...field} placeholder={layout.placeholder} />;
                                        case "checkbox":
                                            return (
                                                <input
                                                    type="checkbox"
                                                    checked={!!field.value}
                                                    onChange={e => field.onChange(e.target.checked)}
                                                />
                                            );
                                        case "number":
                                            return <input type="number" {...field} placeholder={layout.placeholder} />;
                                        case "custom":
                                            if (layout.render) {
                                                // Always wrap in a div or React.Fragment!
                                                return (
                                                    <React.Fragment>
                                                        {layout.render({
                                                            value: field.value,
                                                            setValue: field.onChange,
                                                            error: "",
                                                            label: layout.label,
                                                            placeholder: layout.placeholder,
                                                        }) ?? null}
                                                    </React.Fragment>
                                                );
                                            }
                                            return <span />; // fallback, never undefined!
                                        default:
                                            return <span />; // fallback, never undefined!
                                    }
                                }}
                            />
                            {error && <div className="text-destructive text-xs">{error}</div>}
                        </div>
                    );
                })}
            </div>
            {showSubmitButton && (
                <button type="submit" disabled={loading}>
                    Submit
                </button>
            )}
        </form>
    );
};
