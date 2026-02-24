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
import { FormError } from "@/components/ui/forms/FormError";
import Modal from "@/components/ui/Modal";

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    getValues,
  } = useForm<IFormInput>();

  const onSubmit = async (data: IFormInput) => {
    setIsLoading(true);
    setSubmitError(null);
    setShowSuccessModal(false);

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "contact",
          email: data.email,
          name: data.name,
          message: data.message,
          enquiryType: data.enquiryType || undefined,
          subscribed: Boolean(data.emailMarketing),
          orderNumber: data.orderNumber || undefined,
        }),
      });
      
      const responseData = await res.json();
      console.log("Contact form - API response:", { status: res.status, data: responseData });
      
      if (!res.ok) {
        throw new Error(responseData.message || "Failed to send");
      }

      reset();
      setShowSuccessModal(true);
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

  const handleRetry = () => {
    setSubmitError(null);
    // Re-submit the form with the same data
    const formData = getValues();
    onSubmit(formData);
  };

  return (
    <div className="flex flex-col md:w-3/4 ">
      <h1>Contact us</h1>
      <p>
        Drop your details below and we&apos;ll get back to you within a day.
      </p>
      {/* form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {submitError && (
          <ErrorMessage message={submitError} retry={handleRetry} />
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
            <Label htmlFor="name">
              Name <span className="text-gray-600">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              className="rounded w-full "
              autoComplete="off"
              aria-label="Your Name"
              {...register("name", { required: "Name is required" })}
            />
            <FormError message={errors.name?.message} />
          </div>

          <div>
            <Label htmlFor="email">
              Email <span className="text-gray-600">*</span>
            </Label>
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
            <FormError message={errors.email?.message} />
          </div>

          <div>
            <Label htmlFor="enquiryType">
              Type of enquiry <span className="text-gray-600">*</span>
            </Label>
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
            <FormError message={errors.enquiryType?.message} />
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
            <Label htmlFor="message">
              Message <span className="text-gray-600">*</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Type your message here."
              {...register("message", { required: "Message is required" })}
            />
            <FormError message={errors.message?.message} />
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

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        title="Message Sent Successfully!"
        primaryButton={{
          label: "Close",
          onClick: () => setShowSuccessModal(false),
        }}
      >
        <p>Thank you for contacting us!</p>
        <p className="text-sm">We&apos;ll get back to you within a day.</p>
      </Modal>
    </div>
  );
};

export default ContactForm;
