import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { setDeliveryMethod } from "@/store/slices/cartSlice";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { RootState } from "@/store/store";

interface FormValues {
  deliveryMethod: string;
}
interface DeliveryMethodsProps {
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
}

const deliveryMethods = [
  { value: "toAddress", label: "Delivery to Address", cost: 5.99 },
  { value: "toCourierOffice", label: "Delivery to Courier Office", cost: 3.99 },
  { value: "toSmartPoint", label: "Delivery to Smart Point", cost: 2.99 },
];

const DeliveryMethods: React.FC<DeliveryMethodsProps> = ({
  control,
  errors,
}) => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);

  const handleDeliveryMethodChange = (value: string) => {
    const selectedMethod = deliveryMethods.find((m) => m.value === value);

    if (selectedMethod) {
      const deliveryCost = cart.subtotal >= 60 ? 0 : selectedMethod.cost;
      dispatch(
        setDeliveryMethod({
          method: selectedMethod.value,
          cost: deliveryCost,
          label: selectedMethod.label,
        })
      );
    }
  };

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
