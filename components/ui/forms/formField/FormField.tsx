import { Input } from "@/components/ui/forms/input";
import React from "react";
import { FieldErrors, UseFormRegister, RegisterOptions } from "react-hook-form";
import { FormValues } from "@/lib/types/formValues";

interface FormFieldProps {
  label?: string;
  name: keyof FormValues;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  placeholder?: string;
  type?: string;
  validationRules?: RegisterOptions<FormValues, keyof FormValues>;
}
const FormField = ({
  label,
  name,
  register,
  errors,
  placeholder,
  type = "text",
  validationRules = {},
}: FormFieldProps) => {
  const isRequired = Boolean(validationRules?.required);

  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className="mb-1 text-sm font-medium">
          {label}
          {isRequired && <span className="text-gray-600"> *</span>}
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
};

export default FormField;
