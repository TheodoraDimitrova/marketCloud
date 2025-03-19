import clientBackend from '@/sanity/lib/clientBackend'
import { NextRequest, NextResponse } from 'next/server';



export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json(); 
  
    const createdOrder = await clientBackend.create({
      _type: 'order',
      contact: orderData.contact,
      subscribed: orderData.subscribed,
      country: orderData.country,
      firstName: orderData.firstName,
      lastName: orderData.lastName,
      address: orderData.address,
      postalCode: orderData.postalCode,
      city: orderData.city,
      phone: orderData.phone,
      paymentMethod: orderData.paymentMethod,
      cart: orderData.cart.map((item,index) => ({
        name: item.name,
        _key: `cartItem-${Date.now()}-${index}`, 
        _type: 'cartItem',
        images: [item.images[0]], 
        quantity: item.quantity,
        price: item.price,
        discountedPrice: item.discountedPrice,
        subtotalSingleProduct: item.subtotalSingleProduct,
        totalPrice: item.totalPrice,
        discount: item.discount, 
      })),
      subtotal: orderData.subtotal,
      totalSavings: orderData.totalSavings,
      totalAmount: orderData.totalAmount,
      shipping: orderData.shipping,
      status: orderData.status,
    });
    return NextResponse.json({ message: 'Order created successfully', createdOrder });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Error creating order', error }, { status: 500 });
  }
}
