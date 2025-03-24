export interface Category {
    _id: string;
    name: string;
    slug: { current: string };
    image: { _type: string; asset: { _ref: string } }; 
    description: string;
    totalProducts: number
}