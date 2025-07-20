"use client";
import React from "react";
import { z } from "zod";
import { Form, useForm, FormValue } from ".."; // Or "@jeardev/forms"
import { FormConfigProvider } from "../context/FormConfigContext";
import { FormInputRegistryProvider, InputRegistry } from "../context/FormInputRegistryContext";

/** --- Demo Visual Styling --- **/
const inputDemoBox =
  "bg-blue-50 border-blue-300 border rounded-lg p-2 mb-2 shadow-sm";

// Shows width below each input (for demo)
const FieldWidthBadge: React.FC<{ width?: number }> = ({ width }) =>
  width ? (
    <span className="text-xs text-blue-600 mt-1 block text-right">
      (width: {width} of 24)
    </span>
  ) : null;

// Registry components
const StyledInput: React.FC<any> = ({ field, layout, error }) => (
  <div className={inputDemoBox}>
    <input
      {...field}
      type={layout.type === "number" ? "number" : "text"}
      placeholder={layout.placeholder}
      className={`block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 ${error ? "border-red-500" : ""}`}
      readOnly={!!layout.readOnly}
    />
    <FieldWidthBadge width={layout.width} />
    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
  </div>
);

const StyledTextarea: React.FC<any> = ({ field, layout, error }) => (
  <div className={inputDemoBox}>
    <textarea
      {...field}
      placeholder={layout.placeholder}
      className={`block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 resize-y min-h-[80px] ${error ? "border-red-500" : ""}`}
      readOnly={!!layout.readOnly}
      rows={layout.minRows ?? 3}
    />
    <FieldWidthBadge width={layout.width} />
    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
  </div>
);

const StyledCheckbox: React.FC<any> = ({ field, layout, error }) => (
  <div className={inputDemoBox + " flex items-center"}>
    <input
      type="checkbox"
      checked={!!field.value}
      onChange={e => field.onChange(e.target.checked)}
      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      readOnly={!!layout.readOnly}
    />
    <span className="ml-2 text-gray-700">{layout.label || layout.placeholder}</span>
    <FieldWidthBadge width={layout.width} />
    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
  </div>
);

const StyledSelect: React.FC<any> = ({ field, layout, error }) => (
  <div className={inputDemoBox}>
    <select
      {...field}
      className={`block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 ${error ? "border-red-500" : ""}`}
      disabled={!!layout.readOnly}
    >
      <option value="">{layout.placeholder || "Select..."}</option>
      {(layout.options ?? []).map((opt: { value: string; label: string }) =>
        <option value={opt.value} key={opt.value}>{opt.label}</option>
      )}
    </select>
    <FieldWidthBadge width={layout.width} />
    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
  </div>
);

// Custom registry field: Fruit picker
const FruitSelect: React.FC<any> = ({ field, layout, error }) => (
  <div className={inputDemoBox}>
    <label className="mb-1 block">{layout.label}</label>
    <select
      className={`border rounded-lg px-3 py-2 w-full ${error ? "border-red-500" : "border-gray-300"}`}
      value={field.value}
      onChange={e => field.onChange(e.target.value)}
    >
      <option value="">Choose a fruit</option>
      {(layout.options || []).map((opt: { value: string; label: string }) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <FieldWidthBadge width={layout.width} />
    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
  </div>
);

/** --- Registry object: Use all field types! --- **/
const registry: InputRegistry = {
  text: StyledInput,
  number: StyledInput,
  textarea: StyledTextarea,
  checkbox: StyledCheckbox,
  select: StyledSelect,
  fruit: FruitSelect,
};

/** --- Demo Layouts --- **/

const fruitOptions = [
  { label: "Banana", value: "banana" },
  { label: "Apple", value: "apple" },
  { label: "Mango", value: "mango" }
];

// For registry-based demo
const registryLayout: FormValue = {
  fruitChoice: {
    type: "fruit",
    label: "Choose your favorite fruit (width: 12)",
    initialValue: "",
    width: 12,
    options: fruitOptions,
  },
  likesFruit: {
    type: "checkbox",
    label: "I like fruit (width: 12)",
    initialValue: false,
    width: 12,
  },
  selectExample: {
    type: "select",
    label: "Generic Select Example (width: 24)",
    initialValue: "",
    width: 24,
    options: [
      { label: "Option A", value: "A" },
      { label: "Option B", value: "B" },
    ],
  },
};

// Zod for registryLayout
const registrySchema = z.object({
  fruitChoice: z.enum(["banana", "apple", "mango"], { errorMap: () => ({ message: "Pick a fruit!" }) }),
  likesFruit: z.boolean().refine(v => v === true, { message: "You must like fruit" }),
  selectExample: z.enum(["A", "B"], { errorMap: () => ({ message: "Choose one!" }) }),
});

// Standard layout using built-in and custom inline
const demoLayout: FormValue = {
  email: { type: "text", label: "Email (width: 24)", initialValue: "", width: 24 },
  age: { type: "number", label: "Age (width: 12)", initialValue: 18, width: 12 },
  about: { type: "textarea", label: "About yourself (width: 12)", initialValue: "", width: 12 },
  favoriteColor: {
    type: "custom",
    label: "Favorite Color (width: 24)",
    initialValue: "",
    width: 24,
    render: ({ value, setValue, label }) => (
      <div className={inputDemoBox}>
        <label className="mb-1 block">{label}</label>
        <select
          className="border rounded px-3 py-2 w-full"
          value={value}
          onChange={e => setValue(e.target.value)}
        >
          <option value="">Select a color</option>
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="orange">Orange</option>
        </select>
        <FieldWidthBadge width={24} />
      </div>
    ),
  },
  agreed: { type: "checkbox", label: "Agree to terms (width: 24)", initialValue: false, width: 24 },
};

// Zod for demoLayout
const demoSchema = z.object({
  email: z.string().email("Invalid email"),
  age: z.number().min(18, "Must be 18+"),
  about: z.string(),
  favoriteColor: z.enum(["red", "green", "blue", "orange"], {
    errorMap: () => ({ message: "Pick a favorite color!" }),
  }),
  agreed: z.literal(true, { errorMap: () => ({ message: "Must agree to terms" }) }),
});

/** --- Main Demo Component --- **/
export default function Demo() {
  const demoForm = useForm(demoLayout, demoSchema);
  const registryForm = useForm(registryLayout, registrySchema);

  return (
    <FormConfigProvider config={{ labelPosition: "left", inputClassName: "focus:ring-primary-500" }}>
      <FormInputRegistryProvider registry={registry}>
        <div>
          <h2 className="text-xl font-bold mb-4">1. Standard Form (with Inline Custom Field)</h2>
          <Form
            form={demoForm}
            formLayout={demoLayout}
            showSubmitButton
            onSubmit={data => alert("Demo Form:\n" + JSON.stringify(data, null, 2))}
          />
          <div>
            <h2 className="text-xl font-bold mb-4">2. Registry-based Custom Inputs (With Column Widths)</h2>
            <Form
              form={registryForm}
              formLayout={registryLayout}
              showSubmitButton
              onSubmit={data => alert("Registry Form:\n" + JSON.stringify(data, null, 2))}
            />
          </div>
        </div>
      </FormInputRegistryProvider>
    </FormConfigProvider>
  );
}
