import React from "react";
import { Button } from "@/components/ui/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormError } from "@/components/ui/forms/FormError";

interface IFormInput {
  email: string;
}

const FooterNewsLetter = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log("Form submitted with:", data);
    alert("You have successfully subscribed!");
    reset();
  };

  return (
    <div className="px-3  pb-5  w-full sm:w-1/2 sm:pb-5  lg:basis-1/4 lg:pb-0 overflow-hidden">
      <h3 className="text-white h3-bold">Join Our Email List</h3>
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
          <FormError message={errors.email?.message} />
          <Button type="submit" className="w-full rounded-md" style={{ height: '44px' }}>
            Subscribe
          </Button>
        </form>
        <p className="text-sm text-gray-400 mt-3">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
};

export default FooterNewsLetter;
