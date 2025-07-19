"use client";
import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { FormValue } from "./types";
import { useFormInputRegistry } from "./context/FormInputRegistryContext";
import { useFormConfig } from "./context/FormConfigContext";
import { getWidthClassAndStyle } from "./utils/widthUtil";

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

  const registry = useFormInputRegistry();
  const config = useFormConfig();

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8">
      <div className="flex flex-wrap gap-x-4 gap-y-6">
        {Object.entries(formLayout).map(([key, layout]) => {
          const width = layout.width ?? 24;
          const { className: widthClass, style: widthStyle } = getWidthClassAndStyle(width);
          const error = form.formState.errors[key]?.message as string | undefined;
          const mergedClassName = `flex flex-col min-w-[180px] ${widthClass} ${layout.className ?? ""}`;
          const mergedStyle = { ...widthStyle, ...layout.style };

          if (layout.hidden?.(form.getValues())) return null;

          return (
            <div
              key={key}
              className={mergedClassName.trim()}
              style={mergedStyle}
            >
              <label
                className={`mb-1 font-medium text-gray-700 gap-10 ${
                  config.labelPosition === "left" ? "flex items-center" : ""
                }`}
              >
                {layout.label || key}
              </label>
              <Controller
                name={key}
                control={form.control}
                render={({ field }) => {
                  const baseInput =
                    "w-full rounded-lg border px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 border-gray-300 " +
                    (config.inputClassName ?? "");
                  const errorInput = error
                    ? "border-red-500 focus:ring-red-400"
                    : "";

                  // Try registry
                  try {
                    if (registry && registry[layout.type]) {
                      const Comp = registry[layout.type];
                      try {
                        return (
                          <Comp
                            field={field}
                            layout={layout}
                            error={error}
                          />
                        );
                      } catch (componentErr) {
                        console.error(
                          `Error rendering custom component for type "${layout.type}":`,
                          componentErr
                        );
                        return (
                          <span className="text-red-500 text-xs">
                            Error in custom renderer for "{layout.type}"
                          </span>
                        );
                      }
                    }
                  } catch (err) {
                    console.error(
                      `Error in registry lookup for type "${layout.type}":`,
                      err
                    );
                  }

                  switch (layout.type) {
                    case "text":
                      return (
                        <input
                          {...field}
                          placeholder={layout.placeholder}
                          className={`${baseInput} ${errorInput}`}
                        />
                      );
                    case "textarea":
                      return (
                        <textarea
                          {...field}
                          placeholder={layout.placeholder}
                          className={`${baseInput} ${errorInput} resize-y min-h-[80px]`}
                        />
                      );
                    case "checkbox":
                      return (
                        <div className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            checked={!!field.value}
                            onChange={e => field.onChange(e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-gray-600">
                            {layout.placeholder}
                          </span>
                        </div>
                      );
                    case "number":
                      return (
                        <input
                          type="number"
                          {...field}
                          placeholder={layout.placeholder}
                          className={`${baseInput} ${errorInput}`}
                        />
                      );
                    case "custom":
                      if (layout.render) {
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
                      return <span />;
                    default:
                      return <span />;
                  }
                }}
              />
              {error && (
                <div className="text-red-500 text-xs mt-1">{error}</div>
              )}
            </div>
          );
        })}
      </div>
      {showSubmitButton && (
        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      )}
    </form>
  );
};
