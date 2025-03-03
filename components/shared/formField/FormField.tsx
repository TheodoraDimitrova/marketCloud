import { Input } from "@/components/ui/input";
import React from "react";

const FormField = ({
  label,
  name,
  register,
  errors,
  placeholder,
  type = "text",
  validationRules = {},
}) => (
  <div className="flex flex-col">
    <Input
      type={type}
      placeholder={placeholder}
      {...register(name, validationRules[name])}
    />
    {errors[name] && (
      <p className="text-red-500 text-sm">{errors[name].message}</p>
    )}
  </div>
);

export default FormField;
