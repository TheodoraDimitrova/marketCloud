import { Input } from "@/components/ui/forms/input";
import React from "react";
import { FieldErrors, UseFormRegister, RegisterOptions } from "react-hook-form";
import { FormValues } from "@/types/formValues";

interface FormFieldProps {
  label?: string;
  name: keyof FormValues;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  placeholder?: string;
  type?: string;
  validationRules?: RegisterOptions<FormValues, keyof FormValues>;
}
const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  register,
  errors,
  placeholder,
  type = "text",
  validationRules = {},
}) => (
  <div className="flex flex-col">
    {label && (
      <label htmlFor={name} className="mb-1 text-sm font-medium">
        {label}
      </label>
    )}

    <Input
      id={name}
      type={type}
      placeholder={placeholder}
      {...register(name, validationRules)}
    />
    {errors[name] && (
      <p className="text-red-500 text-sm">{String(errors[name]?.message)}</p>
    )}
  </div>
);

export default FormField;
