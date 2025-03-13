interface Product {
  id: number;
  name: string;
  description: string;
  category: { id: number; name: string };
  productSizes: ProductSize[];
  options?: VariantType[];
}
