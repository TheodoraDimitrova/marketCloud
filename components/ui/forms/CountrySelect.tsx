"use client";

import { Controller, Control, FieldErrors } from "react-hook-form";
import Flag from "react-world-flags";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/forms/select";
import { COUNTRIES } from "@/lib/constants";
import { FormValues } from "@/types/formValues";

interface CountrySelectProps {
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
  defaultValue?: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  control,
  errors,
  defaultValue = "bg",
}) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor="country"
        className="mb-2 text-sm font-medium text-gray-700"
      >
        Choose a country
      </label>
      <Controller
        name="country"
        control={control}
        defaultValue={defaultValue}
        rules={{ required: "Country is required" }}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger id="country">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem
                  key={country.value}
                  value={country.value}
                  id={country.value}
                >
                  <div className="flex items-center space-x-2">
                    <Flag code={country.code} className="w-6 h-6" />
                    <span>{country.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {errors.country && (
        <p className="text-red-500 text-sm">{errors.country.message}</p>
      )}
    </div>
  );
};

export default CountrySelect;
