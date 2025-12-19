"use client";

import { Button } from "@/components/ui/Button";
import { useForm, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/forms/checkbox";
import { Label } from "@/components/ui/Label";
import DeliveryMethods from "@/components/features/checkout/DeliveryMethods";
import FormField from "@/components/ui/forms/formField/FormField";
import PaymentMethod from "@/components/features/checkout/PaymentMethod";
import CountrySelect from "@/components/ui/forms/CountrySelect";
import validationRules from "@/lib/validationRulesCheckout";
import { FormValues } from "@/lib/types/formValues";
import { useCheckout } from "@/hooks/useCheckout";
import { useEffect, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/forms/input";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { clearOrder } from "@/store/slices/orderSlice";

const CheckoutForm = () => {
  const { submitOrder } = useCheckout();
  const dispatch = useAppDispatch();
  const orderError = useAppSelector((state) => state.order?.error || null);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    trigger,
  } = useForm<FormValues>();

  const handleRetry = () => {
    dispatch(clearOrder());
    handleSubmit(submitOrder)();
  };

  const selectedCountry = watch("country");
  const city = watch("city");
  const postalCode = watch("postalCode");
  const showDeliveryMethods = city && postalCode;

  const validatePostalCode = useCallback(
    (value: string) => {
      if (!value || value.trim() === "") {
        return "Postal code is required";
      }
      if (selectedCountry === "gr") {
        if (!/^[0-9]{5}$/.test(value)) {
          return "Postal code must be exactly 5 digits for Greece";
        }
      } else if (selectedCountry === "bg") {
        if (!/^[0-9]{4}$/.test(value)) {
          return "Postal code must be exactly 4 digits for Bulgaria";
        }
      } else {
        if (!/^[0-9]{4,5}$/.test(value)) {
          return "Invalid postal code format";
        }
      }

      return true;
    },
    [selectedCountry]
  );

  const postalCodeRules = useMemo(
    () => ({
      validate: validatePostalCode,
    }),
    [validatePostalCode]
  );

  useEffect(() => {
    if (selectedCountry) {
      trigger("postalCode");
    }
  }, [selectedCountry, trigger]);

  return (
    <div className="col-span-2">
      <h1>Checkout</h1>

      {orderError && (
        <div className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-auto">
          <div className="animate-in fade-in slide-in-from-top-2 duration-500 max-w-md mx-4">
            <ErrorMessage message={orderError} retry={handleRetry} />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(submitOrder)} className="space-y-4">
        {/* Contact Section */}
        <div className="space-y-2">
          <FormField
            label="Contact"
            name="contact"
            register={register}
            errors={errors}
            placeholder="Enter your email or phone"
            validationRules={validationRules.contact}
          />
          <div className="flex items-center space-x-2">
            <Controller
              name="subscribed"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Checkbox
                  id="subscribed"
                  checked={field.value === true}
                  onCheckedChange={(e) => field.onChange(e ? true : false)}
                  disabled={!!errors.contact}
                />
              )}
            />
            <Label htmlFor="subscribed" className="text-sm">
              Be first to know about new products and exclusive offers
            </Label>
          </div>
        </div>

        <h3>Billing Information</h3>
        <div className="space-y-2">
          <CountrySelect control={control} errors={errors} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="First Name"
            name="firstName"
            register={register}
            errors={errors}
            placeholder="First Name"
            validationRules={validationRules.firstName}
          />
          <FormField
            label="Last Name"
            name="lastName"
            register={register}
            errors={errors}
            placeholder="Last Name"
            validationRules={validationRules.lastName}
          />
        </div>

        <FormField
          label="Address"
          name="address"
          register={register}
          errors={errors}
          placeholder="Address"
          validationRules={validationRules.address}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="postalCode" className="mb-1 text-sm font-medium">
              Postal Code <span className="text-gray-600">*</span>
            </label>
            <Controller
              name="postalCode"
              control={control}
              rules={postalCodeRules}
              render={({ field }) => (
                <Input
                  id="postalCode"
                  type="text"
                  placeholder="Postal Code"
                  {...field}
                  onChange={(e) => {
                    //only digits
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    field.onChange(value);
                  }}
                />
              )}
            />
            {errors.postalCode && (
              <p className="text-red-500 text-sm">
                {String(errors.postalCode?.message)}
              </p>
            )}
          </div>
          <FormField
            label="City"
            name="city"
            register={register}
            errors={errors}
            placeholder="City"
            validationRules={validationRules.city}
          />
        </div>

        <FormField
          label="Phone"
          name="phone"
          register={register}
          errors={errors}
          placeholder="Phone"
          validationRules={validationRules.phone}
        />

        <h3>Shipping Information</h3>

        <p className="text-sm">
          Enter your address to see the shipping methods
        </p>

        {showDeliveryMethods && (
          <DeliveryMethods control={control} errors={errors} />
        )}
        <PaymentMethod control={control} />

        <Button type="submit" className="w-full">
          Complete order
        </Button>
      </form>
    </div>
  );
};

export default CheckoutForm;
