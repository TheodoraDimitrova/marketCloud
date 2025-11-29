"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/forms/select";

import { Checkbox } from "@/components/ui/forms/checkbox";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/forms/textarea";
import { Loading } from "@/components/ui/Loading";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

interface IFormInput {
  name: string;
  email: string;
  enquiryType: string;
  orderNumber?: string;
  message: string;
  emailMarketing?: boolean;
}

const ContactForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<IFormInput>();

  const onSubmit = async (data: IFormInput) => {
    setIsLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // TODO: Replace with actual API call
      console.log(data);
      // Simulate API call
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, 1000);
      });

      reset();
      setSubmitSuccess(true);

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:w-3/4 ">
      <h1>Contact us</h1>
      <p>
        Drop your details below and we&apos;ll get back to you within a day.
      </p>
      {/* form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {submitError && <ErrorMessage message={submitError} />}
        {submitSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
            <p className="font-semibold">Message sent successfully!</p>
            <p className="text-sm">We&apos;ll get back to you within a day.</p>
          </div>
        )}
        {isLoading && (
          <div className="fixed inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center pointer-events-auto">
            <div className="text-center">
              <Loading />
              <p className="mt-2 text-gray-700">Sending your message...</p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 my-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              className="rounded w-full "
              autoComplete="off"
              aria-label="Your Name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className="rounded w-full "
              autoComplete="off"
              aria-label="Your Email"
              {...register("email", {
                required: "Email is required",
                pattern: /^[^@]+@[^@]+\.[^@]+$/i,
              })}
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>

          <div>
            <Label htmlFor="enquiryType">Type of enquiry</Label>
            <Controller
              name="enquiryType"
              control={control}
              defaultValue=""
              rules={{ required: "Please select an enquiry type" }}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="mt-2 rounded data-[state=open]:rounded-b-none data-[state=open]:border-b-0">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="rounded data-[side=bottom]:translate-y-0 data-[side=left]:translate-x-0 data-[side=right]:translate-x-0 data-[side=top]:translate-y-0 data-[side=bottom]:rounded-t-none data-[side=bottom]:border-t-0 w-[var(--radix-select-trigger-width)]">
                    <SelectItem value="returns">Returns</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="support">Product Support</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.enquiryType && (
              <span className="text-red-500">{errors.enquiryType.message}</span>
            )}
          </div>

          <div>
            <Label htmlFor="orderNumber">Order number (optional)</Label>
            <Input
              type="number"
              className="rounded w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
              autoComplete="off"
              aria-label="Order number (optional)"
              {...register("orderNumber")}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here."
              {...register("message", { required: "Message is required" })}
            />
            {errors.message && (
              <span className="text-red-500">{errors.message.message}</span>
            )}
          </div>

          <div className="flex items-center gap-2 m-4">
            <Controller
              name="emailMarketing"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <span>Send me relevant email marketing updates and offers</span>
          </div>
        </div>

        <div className="inline-flex items-center">
          <Button className="uppercase" type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
