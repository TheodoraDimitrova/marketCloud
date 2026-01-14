export interface Review {
  _id: string;
  product: {
    _ref: string;
    _type: string;
  };
  author: string;
  email: string;
  rating: number;
  comment: string;
  _createdAt?: string;
  _updatedAt?: string;
}
