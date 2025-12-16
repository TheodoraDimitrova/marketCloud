import React from "react";
import { Controller } from "react-hook-form";
import PaymentDetails from "@/components/features/checkout/PaymentDetails";
import { FormValues } from "@/lib/types/formValues";
import { Control } from "react-hook-form";

interface PaymentMethodProps {
  control: Control<FormValues>;
}

const PaymentMethod = ({ control }: PaymentMethodProps) => {
  return (
    <div className="space-y-4 text-sm">
      <p className=" font-semibold">Payment Method</p>

      <Controller
        name="paymentMethod"
        control={control}
        defaultValue="cod"
        render={({ field }) => (
          <>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0 md:py-2">
              {/* Credit / Debit Card */}
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="card"
                  checked={field.value === "card"}
                  onChange={() => field.onChange("card")}
                />
                <span>Credit / Debit Card</span>
              </label>

              {/* Cash on Delivery (COD) */}
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="cod"
                  checked={field.value === "cod"}
                  onChange={() => field.onChange("cod")}
                />
                <span>Cash on Delivery (COD)</span>
              </label>
            </div>

            {field.value === "card" && <PaymentDetails />}
          </>
        )}
      />
    </div>
  );
};

export default PaymentMethod;
