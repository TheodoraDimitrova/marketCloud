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
import { FormValues } from "@/types/formValues";
import { useCheckout } from "@/hooks/useCheckout";

const CheckoutForm = () => {
  const { submitOrder } = useCheckout();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  return (
    <div className="col-span-2">
      <h1>Checkout</h1>

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
          <FormField
            label="Postal Code"
            name="postalCode"
            register={register}
            errors={errors}
            placeholder="Postal Code"
            validationRules={validationRules.postalCode}
          />
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

        <p className="text-sm font-semibold">Delivery Method</p>
        <p className="text-sm">
          Enter your address to see the shipping methods
        </p>

        {watch("city") && watch("postalCode") && (
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
