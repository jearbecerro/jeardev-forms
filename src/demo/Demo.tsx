import React from "react";
import { z } from "zod";
import { Form, useForm, FormValue } from ".."; // or "@jeardev/forms"
import { FormConfigProvider } from "../context/FormConfigContext";
import { FormInputRegistryProvider, InputRegistry } from "../context/FormInputRegistryContext";

/** --- Tailwind-styled Input Components for Registry --- **/
const StyledInput: React.FC<any> = ({ field, layout, error }) => (
  <input
    {...field}
    type={layout.type === "number" ? "number" : "text"}
    placeholder={layout.placeholder}
    className={`block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 ${error ? "border-red-500" : ""}`}
    readOnly={!!layout.readOnly}
  />
);

const StyledTextarea: React.FC<any> = ({ field, layout, error }) => (
  <textarea
    {...field}
    placeholder={layout.placeholder}
    className={`block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 resize-y min-h-[80px] ${error ? "border-red-500" : ""}`}
    readOnly={!!layout.readOnly}
    rows={layout.minRows ?? 3}
  />
);

const StyledCheckbox: React.FC<any> = ({ field, layout }) => (
  <label className="inline-flex items-center mt-2">
    <input
      type="checkbox"
      checked={!!field.value}
      onChange={e => field.onChange(e.target.checked)}
      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      readOnly={!!layout.readOnly}
    />
    <span className="ml-2 text-gray-700">{layout.label || layout.placeholder}</span>
  </label>
);

const StyledSelect: React.FC<any> = ({ field, layout, error }) => (
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
);

// Custom registry field: Fruit picker
const FruitSelect: React.FC<any> = ({ field, layout, error }) => (
  <div>
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

// For registry-based demo
const fruitOptions = [
  { label: "Banana", value: "banana" },
  { label: "Apple", value: "apple" },
  { label: "Mango", value: "mango" }
];

// Standard layout using built-in and custom inline
const demoLayout: FormValue = {
  email: { type: "text", label: "Email", initialValue: "" },
  age: { type: "number", label: "Age", initialValue: 18 },
  about: { type: "textarea", label: "About yourself", initialValue: "" },
  favoriteColor: {
    type: "custom",
    label: "Favorite Color",
    initialValue: "",
    render: ({ value, setValue, label }) => (
      <div>
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
      </div>
    ),
  },
  agreed: { type: "checkbox", label: "Agree to terms", initialValue: false },
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

// Registry-based layout
const registryLayout: FormValue = {
  fruitChoice: {
    type: "fruit",
    label: "Choose your favorite fruit",
    initialValue: "",
    width: 12,
    options: fruitOptions,
  },
  likesFruit: { type: "checkbox", label: "I like fruit", initialValue: false, width: 12 },
  selectExample: {
    type: "select",
    label: "Generic Select Example",
    initialValue: "",
    width: 24,
    options: [
      { label: "Option A", value: "A" },
      { label: "Option B", value: "B" },
    ],
  },
};

const registrySchema = z.object({
  fruitChoice: z.enum(["banana", "apple", "mango"], { errorMap: () => ({ message: "Pick a fruit!" }) }),
  likesFruit: z.boolean().refine(v => v === true, { message: "You must like fruit" }),
  selectExample: z.enum(["A", "B"], { errorMap: () => ({ message: "Choose one!" }) }),
});

/** --- Main Demo Component --- **/
export default function Demo() {
  const demoForm = useForm(demoLayout, demoSchema);
  const registryForm = useForm(registryLayout, registrySchema);

  return (
    <FormConfigProvider config={{ labelPosition: "left", inputClassName: "focus:ring-primary-500" }}>
      <FormInputRegistryProvider registry={registry}>
        <div className="max-w-xl mx-auto mt-8 flex flex-col gap-16">
          <div>
            <h2 className="text-xl font-bold mb-4">1. Standard Form (with Inline Custom Field)</h2>
            <Form
              form={demoForm}
              formLayout={demoLayout}
              showSubmitButton
              onSubmit={data => alert("Demo Form:\n" + JSON.stringify(data, null, 2))}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">2. Registry-based Custom Inputs (All Styled!)</h2>
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
