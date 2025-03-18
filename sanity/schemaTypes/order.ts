const orderSchema= {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
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
      initialValue: 'confirm',
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
  