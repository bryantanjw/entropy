import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";

export function useSliderChange(form: UseFormReturn<any>, fieldName: string) {
  const { setValue, watch } = form;
  const formValue = watch(fieldName);
  const [value, setValueState] = useState(formValue);

  // Watch for changes in the form value
  useEffect(() => {
    setValueState(formValue);
  }, [formValue]);

  const handleSliderChange = (val: number[]) => {
    const newValue = val[0];
    setValue(fieldName, newValue);
    setValueState(newValue);
  };

  return { value, handleSliderChange };
}
