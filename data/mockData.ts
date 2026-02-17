export interface MockOrder {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  total: number;
  paymentStatus: string;
  fulfillmentStatus: string;
  tracking?: string;
  paymentMethod?: string;
  transactionId?: string;
  shippingAddress: {
    address: string;
    city: string;
    zip: string;
    country: string;
  };
  items: Array<{
    product: string;
    variant: string;
    qty: number;
    price: number;
  }>;
  notes: string[];
}

export const orders: MockOrder[] = [
  {
    id: "1",
    orderNumber: "ORD-1001",
    customer: "John Smith",
    email: "ivan@example.com",
    phone: "+359 888 111222",
    date: "2026-02-08",
    total: 150,
    paymentStatus: "Paid",
    fulfillmentStatus: "Shipped",
    tracking: "SPEEDY123456",
    paymentMethod: "Card",
    transactionId: "tx_abc123",
    shippingAddress: {
      address: "123 Main St",
      city: "Sofia",
      zip: "1000",
      country: "Bulgaria",
    },
    items: [
      { product: "Moisturizing cream", variant: "50ml", qty: 1, price: 60 },
      { product: "Shirt", variant: "M / Blue", qty: 2, price: 45 },
    ],
    notes: [],
  },
  {
    id: "2",
    orderNumber: "ORD-1002",
    customer: "Maria Johnson",
    email: "maria@example.com",
    phone: "+359 877 333444",
    date: "2026-02-08",
    total: 89.5,
    paymentStatus: "Pending",
    fulfillmentStatus: "New",
    paymentMethod: "Cash on delivery",
    transactionId: undefined,
    shippingAddress: {
      address: "5 Vazov Blvd",
      city: "Plovdiv",
      zip: "4000",
      country: "Bulgaria",
    },
    items: [
      { product: "Vitamin C serum", variant: "30ml", qty: 1, price: 89.5 },
    ],
    notes: ["Customer requested delivery after 6 PM"],
  },
  {
    id: "3",
    orderNumber: "ORD-1003",
    customer: "George Williams",
    email: "georgi@example.com",
    phone: "+359 899 555666",
    date: "2026-02-07",
    total: 250,
    paymentStatus: "Paid",
    fulfillmentStatus: "Shipped",
    tracking: "ECONT789",
    paymentMethod: "Card",
    transactionId: "tx_def456",
    shippingAddress: {
      address: "10 Graf Ignatiev St",
      city: "Sofia",
      zip: "1000",
      country: "Bulgaria",
    },
    items: [{ product: "Gift set", variant: "Standard", qty: 1, price: 250 }],
    notes: [],
  },
];

export const customers = [
  {
    id: "1",
    name: "John Smith",
    email: "ivan@example.com",
    phone: "+359 888 111222",
    ordersCount: 5,
    totalSpent: 420,
    subscribed: true,
    createdAt: "2024-01-15",
    notes: [],
  },
  {
    id: "2",
    name: "Maria Johnson",
    email: "maria@example.com",
    phone: "+359 877 333444",
    ordersCount: 2,
    totalSpent: 150,
    subscribed: false,
    createdAt: "2025-06-01",
    notes: [],
  },
  {
    id: "3",
    name: "George Williams",
    email: "georgi@example.com",
    phone: "+359 899 555666",
    ordersCount: 12,
    totalSpent: 890,
    subscribed: true,
    createdAt: "2023-03-20",
    notes: ["VIP customer"],
  },
];

export const messages = [
  {
    id: "1",
    name: "Helen",
    email: "elena@mail.com",
    message: "When will product X be in stock?",
    date: "2026-02-07",
    status: "New" as const,
  },
  {
    id: "2",
    name: "Peter",
    email: "petar@mail.com",
    message: "Thanks for the fast delivery!",
    date: "2026-02-06",
    status: "Replied" as const,
  },
];

export const emailSubscriptions = [
  { id: "1", email: "ivan@example.com", date: "2025-01-10", source: "Footer" },
  {
    id: "2",
    email: "maria@example.com",
    date: "2025-06-01",
    source: "Checkout",
  },
  { id: "3", email: "georgi@example.com", date: "2024-03-15", source: "Popup" },
];
