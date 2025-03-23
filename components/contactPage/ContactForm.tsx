import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/forms/select";

import { Checkbox } from "@/components/ui/forms/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/forms/textarea";

interface IFormInput {
  name: string;
  email: string;
  enquiryType: string;
  orderNumber?: string;
  message: string;
  emailMarketing?: boolean;
}

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<IFormInput>();

  const onSubmit = (data: IFormInput) => {
    console.log(data);
    reset();
  };

  return (
    <div className="flex flex-col md:w-3/4 ">
      <h1>Contact us</h1>
      <p>
        Drop your details below and we&apos;ll get back to you within a day.
      </p>
      {/* form */}
      <form onSubmit={handleSubmit(onSubmit)}>
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
            <Label>Type of enquiry</Label>
            <Controller
              name="enquiryType"
              control={control}
              rules={{ required: "Please select an enquiry type" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
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
            <Label htmlFor="orderNumber" className="block pb-2">
              Order number (optional)
            </Label>
            <Input
              type="number"
              className="rounded w-full "
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
          <Button className="uppercase" type="submit">
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
