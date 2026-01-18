"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/forms/textarea";
import { FormError } from "@/components/ui/forms/FormError";
import { FaStar, FaRegStar } from "react-icons/fa";

interface ReviewFormData {
  name: string;
  email: string;
  comment: string;
  rating: number;
}

interface ReviewFormProps {
  productId: string;
  onSubmitSuccess: () => void;
}

const ReviewForm = ({ productId, onSubmitSuccess }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ReviewFormData>({
    defaultValues: {
      name: "",
      email: "",
      comment: "",
      rating: 0,
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch("/api/reviews/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          name: data.name,
          email: data.email,
          comment: data.comment,
          rating: data.rating,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit review");
      }

      reset();
      setRating(0);
      setSubmitSuccess(true);
      onSubmitSuccess();

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting review:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to submit review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (value: number) => {
    setRating(value);
    // keep react-hook-form in sync and validate immediately
    setValue("rating", value, { shouldValidate: true, shouldDirty: true });
    setSubmitError(null);
  };

  return (
    <div>
      {submitError && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-800 text-base">
          {submitError}
        </div>
      )}
      {submitSuccess && (
        <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded text-green-800 text-base">
          <p className="font-medium text-base">Review submitted successfully!</p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <div>
            <Label htmlFor="name" className="text-base">
              Name <span className="text-gray-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              className="rounded mt-0.5"
              {...register("name", { required: "Name is required" })}
            />
            <FormError message={errors.name?.message} />
          </div>

          <div>
            <Label htmlFor="email" className="text-base">
              Email <span className="text-gray-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              className="rounded mt-0.5"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            <FormError message={errors.email?.message} />
          </div>
        </div>

        <div>
          <Label className="text-base">
            Rating <span className="text-gray-500">*</span>
          </Label>
          <div className="flex gap-1 mt-0.5">
            <input
              type="hidden"
              {...register("rating", {
                validate: (value) =>
                  value > 0 || "Please select a rating",
              })}
            />
            {Array(5)
              .fill(0)
              .map((_, index) => {
                const starValue = index + 1;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleStarClick(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    {starValue <= (hoveredRating || rating) ? (
                      <FaStar className="w-5 h-5 text-[#7d0d23] fill-[#7d0d23]" />
                    ) : (
                      <FaRegStar className="w-5 h-5 text-gray-300 fill-current hover:text-[#7d0d23] transition-colors" />
                    )}
                  </button>
                );
              })}
          </div>
          <FormError message={errors.rating?.message} />
        </div>

        <div>
          <Label htmlFor="comment" className="text-base">
            Comment <span className="text-gray-500">*</span>
          </Label>
          <Textarea
            id="comment"
            className="rounded mt-0.5 min-h-[70px]"
            {...register("comment", {
              required: "Comment is required",
              minLength: {
                value: 10,
                message: "Comment must be at least 10 characters",
              },
            })}
          />
          <FormError message={errors.comment?.message} />
        </div>

        <Button type="submit" disabled={isSubmitting} className="mt-1.5">
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  );
};

export default ReviewForm;
