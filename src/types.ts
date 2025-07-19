import { ReactNode, CSSProperties } from "react";

export type FieldWidth = number; // 1-24, type-safe if you prefer: 1 | 2 | ... | 24

export type Option = { label: string; value: string | number | boolean };

export type CustomRenderProps = {
  value: any;
  setValue: (value: any) => void;
  setNewFieldValues?: (value: any) => void;
  error?: string;
  label?: string;
  placeholder?: string;
};

export type FormValue = Record<
  string,
  {
    className?: string;
    style?: CSSProperties;
    type: "custom" | "text" | "checkbox" | "textarea" | "number" | string;
    label?: string;
    readOnly?: boolean;
    initialValue?: any;
    placeholder?: string;
    width?: FieldWidth;
    minRows?: number;
    mode?: "multiple" | "tags" | "default";
    options?: Option[];
    value?: string | number | boolean | (string | number | boolean)[] | Record<string, unknown>[];
    hidden?: (values: Record<string, any>) => boolean;
    render?: (props: CustomRenderProps) => ReactNode;
  }
>;
