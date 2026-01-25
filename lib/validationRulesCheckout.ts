import { RegisterOptions } from "react-hook-form";
import { FormValues } from "@/lib/types/formValues";

const validationRules: Record<keyof FormValues, RegisterOptions<FormValues>> = {
  contact: {
    validate: (value: string | boolean) => {
      // If value is boolean or empty, it's valid (field is optional)
      if (typeof value !== "string" || !value || value.trim() === "") {
        return true;
      }

      // Email pattern: valid email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Phone pattern: allows +, digits, spaces, and hyphens, 7-15 digits
      const phonePattern = /^\+?[0-9\s-]{7,15}$/;

      // Check if it's a valid email
      if (emailPattern.test(value.trim())) {
        return true;
      }

      // Check if it's a valid phone (must contain at least 7 digits)
      const digitsOnly = value.replace(/\D/g, "");
      if (
        phonePattern.test(value.trim()) &&
        digitsOnly.length >= 7 &&
        digitsOnly.length <= 15
      ) {
        return true;
      }

      return "Enter a valid email address or phone number";
    },
  },
  firstName: {
    required: "First name is required",
    minLength: { value: 2, message: "Minimum 2 characters" },
  },
  lastName: {
    required: "Last name is required",
    minLength: { value: 2, message: "Minimum 2 characters" },
  },
  address: {
    required: "Address is required",
  },
  postalCode: {
    required: "Postal code is required",
    pattern: { value: /^[0-9]{4,5}$/, message: "Invalid postal code format" },
  },
  city: {
    required: "City is required",
    pattern: { value: /^[a-zA-Z\s]{2,}$/, message: "Invalid city name" },
  },
  phone: {
    required: "Phone is required",
    pattern: {
      value: /^\+?[0-9\s-]{7,15}$/,
      message: "Invalid phone number",
    },
  },
  email: {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Invalid email format",
    },
  },
  subscribed: {
    required: false,
  },
  saveAddress: {
    required: false,
  },
  country: {
    required: "Country is required",
  },
  deliveryMethod: {
    required: "Delivery method is required",
  },
  paymentMethod: {},
};

export default validationRules;
