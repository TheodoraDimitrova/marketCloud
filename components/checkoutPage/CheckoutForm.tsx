"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/forms/checkbox";
import { Label } from "@/components/ui/label";
import Flag from "react-world-flags";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/forms/select";
import DeliveryMethods from "@/components/checkoutPage/DeliveryMethods";
import FormField from "../shared/formField/FormField";
import PaymentMethod from "@/components/checkoutPage/PaymentMethod";
import validationRules from "@/lib/validationRulesCheckout";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { createOrder } from "@/store/slices/orderSlice";
import Loading from "@/components/shared/Loading";
import { AppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import { CartItem, CartState } from "@/types/cart";
import { FormValues } from "@/types/formValues";

const CheckoutForm = () => {
  const router = useRouter();
  const cart = useSelector((state: RootState) => state.cart) as CartState;
  const dispatch = useDispatch<AppDispatch>();
  const order = useSelector((state: RootState) => state.order.order);
  const orderStatus = useSelector(
    (state: RootState) => state.order?.status || "idle"
  );
  const orderError = useSelector(
    (state: RootState) => state.order?.error || null
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (orderStatus === "succeeded" && order?._id) {
      localStorage.clear();
      router.push(`/checkout/thank-you/${order._id}`);
    }
  }, [orderStatus, order, router]);

  const prepareOrderData = (data: FormValues, cart: CartState) => ({
    ...data,
    cart: cart.items.map((item: CartItem, index: number) => ({
      _key: `cartItem-${Date.now()}-${index}`,
      _type: "cartItem",
      images: [item.images[0]],
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      discountedPrice: item.discount ? item.discountedPrice : item.price,
      subtotalSingleProduct: item.subtotalSingleProduct,
      totalPrice: item.subtotalSingleProduct,
      discount: item.discount
        ? {
            amount: item.discount.amount,
            isActive: item.discount.isActive,
            type: item.discount.type,
          }
        : {
            amount: 0,
            isActive: false,
            type: "",
          },
    })),
    subtotal: cart.subtotal,
    totalSavings: cart.totalSavings,
    totalAmount: cart.totalAmount,
    shipping: {
      method: cart.shipping.method,
      cost: cart.shipping.cost,
      label: cart.shipping.label,
    },
    status: "confirm",
  });

  const handleFormSubmit = async (data: FormValues) => {
    const orderData = prepareOrderData(data, cart);
    try {
      await dispatch(createOrder(orderData));
      localStorage.clear();
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <>
      {orderStatus === "loading" && <Loading />}
      {orderError === "failed" && <p>Error: {orderError}</p>}

      {orderStatus !== "loading" && orderError !== "failed" && (
        <div className="col-span-2">
          <h1 className="title">Checkout</h1>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
                      disabled={!!errors.contact}
                    />
                  )}
                />
                <Label htmlFor="subscribed" className="text-sm">
                  Be first to know about new products and exclusive offers
                </Label>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
            <div className="space-y-2">
              <div className="flex flex-col">
                <label
                  htmlFor="country"
                  className="mb-2 text-sm font-medium text-gray-700"
                >
                  Choose a country
                </label>
                <Controller
                  name="country"
                  control={control}
                  defaultValue="bg"
                  rules={{ required: "Country is required" }}
                  render={({ field }) => (
                    <Select {...field}>
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us" id="us">
                          <div className="flex items-center space-x-2">
                            <Flag code="US" className="w-6 h-6" />
                            <span>United States</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="bg" id="bg">
                          <div className="flex items-center space-x-2">
                            <Flag code="BG" className="w-6 h-6" />
                            <span>Bulgaria</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="fr" id="fr">
                          <div className="flex items-center space-x-2">
                            <Flag code="FR" className="w-6 h-6" />
                            <span>France</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.country && (
                  <p className="text-red-500 text-sm">
                    {errors.country.message}
                  </p>
                )}
              </div>
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
              <FormField
                label="Postal Code"
                name="postalCode"
                register={register}
                errors={errors}
                placeholder="Postal Code"
                validationRules={validationRules.postalCode}
              />
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

            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

            <p className="text-sm font-semibold">Delivery Method</p>
            <p className="text-sm">
              Enter your address to see the shipping methods
            </p>

            {watch("city") && watch("postalCode") && (
              <DeliveryMethods control={control} errors={errors} />
            )}
            <PaymentMethod control={control} />

            <Button type="submit" className="w-full">
              Complete order
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default CheckoutForm;
