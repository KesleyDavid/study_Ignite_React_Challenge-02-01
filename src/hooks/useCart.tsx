import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {

      const { data: productStock } = await api.get<Stock>(`/stock/${String(productId)}`);

      const productCart:Product|undefined = cart.find(product => product.id === productId);

      if (productCart) {

        if (productCart.amount < productStock.amount) {

          productCart.amount++;
          setCart([...cart]);
          
        } else {
          toast.error('Quantidade solicitada fora de estoque');
          return;
        }

      } else {

        const { data: product } = await api.get<Product>(`/products/${String(productId)}`);
        
        if (productStock.amount < 1) {
          toast.error('Quantidade solicitada fora de estoque');
          return;
        }

        setCart([
          ...cart,
          {
            ...product,
            amount: 1
          }
        ]);

      }   
      
      localStorage.setItem('@RocketShoes:cart',JSON.stringify(cart));

    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
