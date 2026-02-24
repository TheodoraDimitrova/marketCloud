"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormError } from "@/components/ui/forms/FormError";
import Modal from "@/components/ui/Modal";

interface IFormInput {
  email: string;
}

const FooterNewsLetter = () => {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setError(null);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "newsletter", email: data.email }),
      });
      if (!res.ok) throw new Error("Failed to subscribe");
      reset();
      setShowModal(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className="px-3  pb-5  w-full sm:w-1/2 sm:pb-5  lg:basis-1/4 lg:pb-0 overflow-hidden">
        <h3 className="text-gradient-rose">Join Our Email List</h3>
        <p className="text-white mb-4 opacity-85 font-light">
          Get 20% off your first purchase! Plus, be the first to know about sales,
          new product launches, and exclusive offers!
        </p>
        <div className="flex flex-col w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 text-black rounded-md"
              style={{ height: '44px' }}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
            />
            <FormError message={errors.email?.message || error} />
            <Button type="submit" variant="accent" className="w-full rounded-md" style={{ height: '44px' }}>
              Subscribe
            </Button>
          </form>
          <p className="text-sm text-gray-400 mt-3">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type="success"
        title="Successfully Subscribed!"
        primaryButton={{
          label: "Continue Shopping",
          onClick: () => setShowModal(false),
        }}
      >
        <p>Thank you for joining our email list!</p>
        <p className="font-semibold text-gray-900">🎉 Get 20% off your first purchase!</p>
        <p className="text-sm">Check your email for a special discount code. Plus, you&apos;ll be the first to know about:</p>
        <ul className="text-sm list-disc list-inside space-y-1 ml-2">
          <li>New product launches</li>
          <li>Exclusive sales and offers</li>
          <li>Beauty tips and trends</li>
        </ul>
      </Modal>
    </>
  );
};

export default FooterNewsLetter;
