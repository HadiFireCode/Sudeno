
export interface Product {
  id: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
  total: number;
  date: string;
}

export interface Debt {
  id: string;
  firstName: string;
  lastName: string;
  itemsDescription: string;
  amount: number;
  contactNumber?: string;
  note: string;
}
