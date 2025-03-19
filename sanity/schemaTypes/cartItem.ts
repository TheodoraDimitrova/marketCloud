 const cartItem={
    name: "cartItem",
    title: "Cart Item",
    type: "object", 
    fields: [
      {
        name: "images",
        title: "Images",
        type: "array",
        of: [{ type: "image" }]
      },
      {
        name: "name",
        title: "Name",
        type: "string",
      },
      {
        name: "quantity",
        title: "Quantity",
        type: "number",
        initialValue: 1
      
      },
      {
        name: "price",
        title: "Original Price",
        type: "number",
    
        description: "Original price before any discounts."
      },
      {
        name: "discount",
        title: "Discount",
        type: "object",
        fields: [
          {
            name: "amount",
            title: "Amount",
            type: "number"
          },
          {
            name: "isActive",
            title: "Is Active",
            type: "boolean"
          },
          {
            name: "type",
            title: "Type",
            type: "string"
          }
        ]
      },
      {
        name: "totalPrice",
        title: "Total Price",
        type: "number",
        description: "Total price for this item (after any discounts)"
      },
      {
        name: "discountedPrice",
        title: "Discounted Price",
        type: "number",
     
          description: "Price after discount is applied."
      },
      {
        name: "subtotalSingleProduct",
        title: "Total for Item",
        type: "number",
        description: "Total price for this product (discountedPrice * quantity)."

      }
    ]
  };

  export default cartItem;