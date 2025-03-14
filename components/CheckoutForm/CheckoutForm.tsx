"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Flag from "react-world-flags";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import DeliveryMethods from "@/components/DeliveryMethods/DeliveryMethods";
import FormField from "../shared/formField/FormField";
import PaymentMethod from "@/components/PaymentMethod/PaymentMethod";
import validationRules from "@/lib/validationRulesCheckout";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const CheckoutForm = () => {
  const cart = useSelector((state: RootState) => state.cart);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = (data) => {
    console.log("handleFormSubmit", { ...data, cart });
  };

  return (
    <div className="col-span-2">
      <h1 className="title">Checkout</h1>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Email / Phone + Subscription */}
        <div className="space-y-2">
          <FormField
            label="Contact"
            name="contact"
            register={register}
            errors={errors}
            placeholder="Enter your email or phone"
            validationRules={validationRules}
          />

          <div className="flex items-center space-x-2">
            <Controller
              name="subscribed"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Checkbox
                  id="subscribed"
                  checked={field.value === "on" || false}
                  onCheckedChange={(e) => field.onChange(e ? "on" : "false")}
                  disabled={!!errors.contact}
                />
              )}
            />
            <Label htmlFor="subscribed" className="text-sm">
              Be first to know about new products and exclusive offers
            </Label>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
        <div className="space-y-2">
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
              defaultValue="bg"
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <Select {...field}>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us" id="us">
                      <div className="flex items-center space-x-2">
                        <Flag code="US" className="w-6 h-6" />
                        <span>United States</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="bg" id="bg">
                      <div className="flex items-center space-x-2">
                        <Flag code="BG" className="w-6 h-6" />
                        <span>Bulgaria</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="fr" id="fr">
                      <div className="flex items-center space-x-2">
                        <Flag code="FR" className="w-6 h-6" />
                        <span>France</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.country && (
              <p className="text-red-500 text-sm">
                {errors.country.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="First Name"
            name="firstName"
            register={register}
            errors={errors}
            placeholder="First Name"
            validationRules={validationRules}
          />

          <FormField
            label="Last Name"
            name="lastName"
            register={register}
            errors={errors}
            placeholder="Last Name"
            validationRules={validationRules}
          />
        </div>

        <FormField
          label="Address"
          name="address"
          register={register}
          errors={errors}
          placeholder="Address"
          validationRules={validationRules}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Postal Code"
            name="postalCode"
            register={register}
            errors={errors}
            placeholder="Postal Code"
            validationRules={validationRules}
          />
          <FormField
            label="City"
            name="city"
            register={register}
            errors={errors}
            placeholder="City"
            validationRules={validationRules}
          />
        </div>
        <FormField
          label="Phone"
          name="phone"
          register={register}
          errors={errors}
          placeholder="Phone"
          validationRules={validationRules}
        />

        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

        <p className="text-sm font-semibold">Delivery Method</p>
        <p className="text-sm" style={{ marginTop: "0" }}>
          Enter your address to see the shipping metods
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
