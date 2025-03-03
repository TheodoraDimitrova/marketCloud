import React from "react";
import { Controller } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface DeliveryMethodsProps {
  control: any;
  errors: any;
  handleDeliveryMethodChange: (method: string) => void;
}

const deliveryMethods = [
  { value: "toAddress", label: "Delivery to Address" },
  { value: "toCourierOffice", label: "Delivery to Courier Office" },
  { value: "toSmartPoint", label: "Delivery to Smart Point" },
];

const DeliveryMethods: React.FC<DeliveryMethodsProps> = ({
  control,
  errors,
  handleDeliveryMethodChange,
}) => {
  return (
    <div className="space-y-3 mt-4 text-xs">
      <Controller
        name="deliveryMethod"
        control={control}
        rules={{ required: "Delivery method is required" }}
        render={({ field }) => (
          <RadioGroup {...field} className="space-y-3">
            {deliveryMethods.map((method) => (
              <div
                key={method.value}
                className="flex items-center justify-start space-x-2 px-6 py-4 bg-gray-200 md:w-1/2 rounded-sm"
              >
                <RadioGroupItem
                  value={method.value}
                  id={method.value}
                  checked={field.value === method.value}
                  onClick={() => {
                    field.onChange(method.value);
                    handleDeliveryMethodChange(method.value);
                  }}
                />
                <Label htmlFor={method.value}>{method.label}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      />

      {errors.deliveryMethod && (
        <p className="text-red-500 text-sm">{errors.deliveryMethod?.message}</p>
      )}
    </div>
  );
};

export default DeliveryMethods;
