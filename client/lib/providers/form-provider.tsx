"use client";

import React from "react";
import { usePlaygroundForm } from "../hooks/use-playground-form";

export const FormContext = React.createContext(null);

export function FormProvider({ children }) {
  const form = usePlaygroundForm();

  return <FormContext.Provider value={form}>{children}</FormContext.Provider>;
}
