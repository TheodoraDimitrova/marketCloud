const orderSchema = {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      description: 'Sequential order number (1000, 1001, ...). Set automatically on create.',
      readOnly: true,
    },
    {
      name: 'tracking',
      title: 'Tracking Number',
      type: 'string',
      description: 'Shipping tracking number.',
    },
    {
      name: 'contact',
      title: 'Contact',
      type: 'string',
    },
    {
      name: 'subscribed',
      title: 'Subscribed',
      type: 'boolean',
    },
    {
      name: 'country',
      title: 'Country',
      type: 'string',
    },
    {
      name: 'firstName',
      title: 'First Name',
      type: 'string',
    },
    {
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Address',
      type: 'string',
    },
    {
      name: 'postalCode',
      title: 'Postal Code',
      type: 'string',
    },
    {
      name: 'city',
      title: 'City',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    },
    {
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
    },
    {
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Unpaid', value: 'unpaid' },
          { title: 'Paid', value: 'paid' },
        ],
        layout: 'radio',
      },
    },
    {
      name: 'subtotal',
      title: 'Subtotal',
      type: 'number',
    },
    {
      name: 'totalSavings',
      title: 'Total Savings',
      type: 'number',
    },
    {
      name: 'totalAmount',
      title: 'Total Amount',
      type: 'number',
    },
    {
      name: 'shipping',
      title: 'Shipping',
      type: 'object',
      fields: [
        {
          name: 'method',
          title: 'Method',
          type: 'string',
        },
        {
          name: 'cost',
          title: 'Cost',
          type: 'number',
        },
        {
          name: 'label',
          title: 'Label',
          type: 'string',
        },
      ],
    },
    {
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Confirm', value: 'confirm' },
          { title: 'Pending', value: 'pending' },
          { title: 'Fulfilled', value: 'fulfilled' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
        layout: 'dropdown',
      },
      description: 'Fulfillment status (use Payment Status for paid/unpaid).',
    },
    {
      name: "cart",
      title: "Cart Items",
      type: "array",
      of: [{ type: "cartItem" }] 
    },

  ],
}
export default orderSchema;
  