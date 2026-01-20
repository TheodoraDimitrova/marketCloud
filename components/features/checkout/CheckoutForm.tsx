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
import { FormError } from "@/components/ui/forms/FormError";

const SAVED_ADDRESS_KEY = "saved_address";

const CheckoutForm = () => {
  const { submitOrder } = useCheckout();
  const dispatch = useAppDispatch();
  const orderError = useAppSelector((state) => state.order?.error || null);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, touchedFields, isSubmitted },
    trigger,
  } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      contact: "",
      firstName: "",
      lastName: "",
      address: "",
      postalCode: "",
      city: "",
      phone: "",
      email: "",
      subscribed: false,
      saveAddress: false,
      country: "bg",
      deliveryMethod: "",
      paymentMethod: "cod",
    },
  });

  const handleRetry = () => {
    dispatch(clearOrder());
    handleSubmit(submitOrder)();
  };

  const selectedCountry = watch("country");
  const city = watch("city");
  const postalCode = watch("postalCode");
  const address = watch("address");
  const contact = watch("contact");
  const saveAddress = watch("saveAddress");
  const showDeliveryMethods = city && postalCode;
  const hasAddressInfo = address && city && postalCode;

  // Check if contact is valid email or phone
  const isContactValid = useMemo(() => {
    if (!contact || contact.trim() === "") {
      return false;
    }

    const trimmedContact = contact.trim();

    // Email pattern: valid email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Phone pattern: allows +, digits, spaces, and hyphens, 7-15 digits
    const phonePattern = /^\+?[0-9\s-]{7,15}$/;

    // Check if it's a valid email
    if (emailPattern.test(trimmedContact)) {
      return true;
    }

    // Check if it's a valid phone (must contain at least 7 digits)
    const digitsOnly = trimmedContact.replace(/\D/g, "");
    if (
      phonePattern.test(trimmedContact) &&
      digitsOnly.length >= 7 &&
      digitsOnly.length <= 15
    ) {
      return true;
    }

    return false;
  }, [contact]);

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
      required: "Postal code is required",
      validate: (value: string) => {
        // Only validate format if value exists
        if (!value || value.trim() === "") {
          return true; // required rule will handle empty case
        }
        return validatePostalCode(value);
      },
    }),
    [validatePostalCode]
  );

  useEffect(() => {
    if (selectedCountry && (touchedFields.postalCode || isSubmitted)) {
      trigger("postalCode");
    }
  }, [selectedCountry, trigger, touchedFields.postalCode, isSubmitted]);

  // Reset subscribed checkbox if contact is not valid
  useEffect(() => {
    if (!isContactValid) {
      const subscribedValue = watch("subscribed");
      if (subscribedValue) {
        setValue("subscribed", false);
      }
    }
  }, [isContactValid, setValue, watch]);

  // Load saved address on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAddress = localStorage.getItem(SAVED_ADDRESS_KEY);
      if (savedAddress) {
        try {
          const parsedAddress = JSON.parse(savedAddress);
          if (parsedAddress.firstName) setValue("firstName", parsedAddress.firstName);
          if (parsedAddress.lastName) setValue("lastName", parsedAddress.lastName);
          if (parsedAddress.address) setValue("address", parsedAddress.address);
          if (parsedAddress.postalCode) setValue("postalCode", parsedAddress.postalCode);
          if (parsedAddress.city) setValue("city", parsedAddress.city);
          if (parsedAddress.phone) setValue("phone", parsedAddress.phone);
          if (parsedAddress.country) setValue("country", parsedAddress.country);
        } catch (error) {
          console.error("Error loading saved address:", error);
        }
      }
    }
  }, [setValue]);

  // Custom submit handler to save address if checkbox is checked
  const onSubmit = async (data: FormValues) => {
    // Save address to localStorage if checkbox is checked
    if (data.saveAddress && hasAddressInfo) {
      const addressData = {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        postalCode: data.postalCode,
        city: data.city,
        phone: data.phone,
        country: data.country,
      };
      localStorage.setItem(SAVED_ADDRESS_KEY, JSON.stringify(addressData));
    } else if (!data.saveAddress) {
      // Remove saved address if checkbox is unchecked
      localStorage.removeItem(SAVED_ADDRESS_KEY);
    }

    // Submit the order
    await submitOrder(data);
  };

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  disabled={!isContactValid}
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
                  value={field.value || ""}
                  onChange={(e) => {
                    //only digits
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    field.onChange(value);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            />
            <FormError
              message={
                isSubmitted || touchedFields.postalCode
                  ? errors.postalCode?.message
                  : undefined
              }
            />
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

        {/* Save Address Option */}
        {hasAddressInfo && (
          <div className="flex items-center space-x-2">
            <Controller
              name="saveAddress"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Checkbox
                  id="saveAddress"
                  checked={field.value === true}
                  onCheckedChange={(e) => field.onChange(e ? true : false)}
                />
              )}
            />
            <Label htmlFor="saveAddress" className="text-sm">
              Save for future orders
            </Label>
          </div>
        )}

        <h3>Shipping Information</h3>

        {!hasAddressInfo && (
          <p className="text-sm">
            Enter your address to see the shipping methods
          </p>
        )}

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
