
export interface Product {
id: string;
name: string;
picture?: string | null;
categoryId: string;
price:number;
}

export interface ProductCreateBody {
name: string;
picture?: string;
categoryId: string;
price:number;
}

export interface ProductUpdateBody {
name?: string;
picture?: string;
categoryId?: string;
price?: any;
}


