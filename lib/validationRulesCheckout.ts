import { RegisterOptions } from "react-hook-form";
import { FormValues } from "@/types/formValues";

const validationRules: Record<keyof FormValues, RegisterOptions<FormValues>> = {
  contact: {
    minLength: { value: 5, message: "Must be at least 5 characters" },
    pattern: {
      value: /(^\+?[0-9\s-]{7,15}$)|(^[^\s@]+@[^\s@]+\.[^\s@]+$)/,
      message: "Enter a valid phone number or email",
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
  country: {
    required: "Country is required",
  },
  deliveryMethod: {
    required: "Delivery method is required",
  },
  paymentMethod: {
    required: "Payment method is required",
  },
};

export default validationRules;