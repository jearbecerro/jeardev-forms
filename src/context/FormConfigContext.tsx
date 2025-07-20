import React, { createContext, useContext } from "react";

export interface FormConfig {
  labelPosition?: "top" | "left";
  inputClassName?: string;
  submitButton?: (loading: boolean)=>React.ReactNode; 
}

const defaultConfig: FormConfig = {
  labelPosition: "top",
  inputClassName: "",
  submitButton: undefined,
};

const FormConfigContext = createContext<FormConfig>(defaultConfig);

export const useFormConfig = () => useContext(FormConfigContext);

export const FormConfigProvider: React.FC<{
  config?: FormConfig;
  children: React.ReactNode;
}> = ({
  config = defaultConfig,
  children,
}) => (
  <FormConfigContext.Provider value={config}>
    {children}
  </FormConfigContext.Provider>
);
