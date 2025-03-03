import React from "react";
import { Controller } from "react-hook-form";
import PaymentDetails from "@/components/PaymentDetails/PaymentDetails";

import { Control } from "react-hook-form";

interface PaymentMethodProps {
  control: Control;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payment Method</h2>

      <Controller
        name="paymentMethod"
        control={control}
        defaultValue="cod"
        render={({ field }) => (
          <div className="flex items-center space-x-4">
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
        )}
      />

      <Controller
        name="paymentMethod"
        control={control}
        render={({ field }) =>
          field.value === "card" ? <PaymentDetails /> : <></>
        }
      />
    </div>
  );
};

export default PaymentMethod;
