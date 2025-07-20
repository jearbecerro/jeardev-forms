"use client";
import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { FormValue } from "./types";
import { useFormInputRegistry } from "./context/FormInputRegistryContext";
import { useFormConfig } from "./context/FormConfigContext";
import { Input, TextareaAutosize } from "@mui/material";

// Optionally: Style item for inner Paper if you want (like MUI docs)
// Not required, but it's here if you want the look
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: (theme.vars ?? theme).palette.text.secondary,
  boxShadow: "none",
}));

// Convert 24-based width to MUI Grid (out of 12)
function getMuiColSpan(width?: number) {
  if (!width || width < 1 || width > 24) return 12; // full row
  return Math.round((width / 24) * 12) || 1;
}

export interface FormProps {
  form: UseFormReturn<any>;
  formLayout: FormValue;
  loading?: boolean;
  showSubmitButton?: boolean;
  onSubmit?: (data: any) => void;
  submitButton?: (loading: boolean) => React.ReactNode;
}

export const Form: React.FC<FormProps> = ({
  form,
  formLayout,
  loading,
  showSubmitButton = false,
  onSubmit,
  submitButton,
}) => {
  const handleSubmit = onSubmit
    ? form.handleSubmit(onSubmit)
    : (e: React.FormEvent) => e.preventDefault();

  const registry = useFormInputRegistry();
  const config = useFormConfig();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {Object.entries(formLayout).map(([key, layout]) => {
            const error = form.formState.errors[key]?.message as string | undefined;
            if (layout.hidden?.(form.getValues())) return null;
            const colSpan = getMuiColSpan(layout.width);

            return (
              <Grid size={{ xs: 12, md: colSpan }} key={key}>
                <Item elevation={0}>
                  <div className={`min-w-[180px] flex flex-col ${layout.className ?? ""}`} style={layout.style}>
                    <label
                      className={`mb-1 font-medium text-gray-700 gap-10 ${config.labelPosition === "left" ? "flex items-center" : ""
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

                        // Registry
                        if (registry && registry[layout.type]) {
                          const Comp = registry[layout.type];
                          return <Comp field={field} layout={layout} />;
                        }
                        // Built-in fallback
                        switch (layout.type) {
                          case "text":
                            return (
                              <Input
                                {...field}
                                placeholder={layout.placeholder}
                                className={`${baseInput} ${errorInput}`}
                              />
                            );
                          case "textarea":
                            return (
                              <TextareaAutosize
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
                </Item>
              </Grid>
            );
          })}
        </Grid>
        {showSubmitButton && (
          submitButton ? (
            submitButton(!!loading)
          ) : config.submitButton ? (
            config.submitButton(!!loading)
          ) : (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
              sx={{ mt: 4, borderRadius: 2, fontWeight: 600, py: 1.5, fontSize: "1rem" }}
            >
              {loading ? "Loading..." : "Submit"}
            </Button>
          )
        )}
      </form>
    </Box>
  );
};
