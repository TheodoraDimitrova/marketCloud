import React from "react";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";

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
    <div className="px-5  pb-5  w-full sm:w-1/2 sm:pb-5  lg:basis-1/4 lg:pb-0 overflow-hidden">
      <h3 className="text-white h3-bold">Join Our Email List</h3>
      <p className="text-white mb-4">
        Get 20% off your first purchase! Plus, be the first to know about sales,
        new product launches, and exclusive offers!
      </p>
      <div className="flex flex-col space-y-2 w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 text-black "
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && typeof errors.email.message === "string" && (
            <p className="text-red-500 py-2">{errors.email.message}</p>
          )}
          <Button type="submit" className="mt-4">
            Subscribe
          </Button>
        </form>
      </div>
    </div>
  );
};

export default FooterNewsLetter;
