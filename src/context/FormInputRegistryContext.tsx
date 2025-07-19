import React, { createContext, useContext } from "react";
import { FieldValues, ControllerRenderProps } from "react-hook-form";

type CustomFieldComponent = React.FC<{
  field: ControllerRenderProps<FieldValues, string>;
  layout: any;
  error?: string;
}>;

export type InputRegistry = Record<string, CustomFieldComponent>;

const InputRegistryContext = createContext<InputRegistry>({});

export const useFormInputRegistry = () => useContext(InputRegistryContext);

export const FormInputRegistryProvider: React.FC<{
  registry?: InputRegistry;
  children: React.ReactNode;
}> = ({ registry = {}, children }) => (
  <InputRegistryContext.Provider value={registry}>
    {children}
  </InputRegistryContext.Provider>
);
