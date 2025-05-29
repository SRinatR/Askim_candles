
"use client";
// This file needs to be moved into src/app/[locale]/cart/page.tsx
// and adapted to use translations.
// For client components, translations would typically come via context or props
// For simplicity in this step, we'll use hardcoded or placeholder text.

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, ShoppingCart, ArrowLeft, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Slash } from 'lucide-react';
import { useParams } from 'next/navigation';
import type { Locale } from '@/lib/i1n-config';

// Placeholder dictionary for cart page
const getCartDictionary = (locale: Locale) => {
  if (locale === 'uz') {
    return {
      emptyCartTitle: "Savatingiz bo'sh",
      emptyCartSubtitle: "Hali savatga hech narsa qo'shmaganga o'xshaysiz.",
      startShopping: "Xarid qilishni boshlash",
      yourCartTitle: "Sizning savatingiz",
      itemRemoved: "Mahsulot o'chirildi",
      itemRemovedDesc: (name: string) => `${name} savatingizdan o'chirildi.`,
      cartCleared: "Savatcha tozalandi",
      cartClearedDesc: "Barcha mahsulotlar savatingizdan o'chirildi.",
      price: "Narx",
      quantityFor: (name: string) => `${name} uchun miqdor`,
      remove: (name: string) => `${name}ni savatdan olib tashlash`,
      clearCart: "Savatni tozalash",
      orderSummary: "Buyurtma xulosasi",
      subtotal: "Oraliq jami",
      shipping: "Yetkazib berish",
      free: "Bepul",
      taxes: "Soliqlar",
      calculatedAtCheckout: "To'lovda hisoblanadi",
      total: "Jami",
      proceedToCheckout: "To'lovga o'tish",
      continueShopping: "Xaridni davom ettirish",
      home: "Bosh sahifa",
      shoppingCartBreadcrumb: "Savatcha"
    };
  }
  if (locale === 'ru') {
    return {
      emptyCartTitle: "Ваша корзина пуста",
      emptyCartSubtitle: "Похоже, вы еще ничего не добавили в корзину.",
      startShopping: "Начать покупки",
      yourCartTitle: "Ваша корзина",
      itemRemoved: "Товар удален",
      itemRemovedDesc: (name: string) => `${name} был удален из вашей корзины.`,
      cartCleared: "Корзина очищена",
      cartClearedDesc: "Все товары были удалены из вашей корзины.",
      price: "Цена",
      quantityFor: (name: string) => `Количество для ${name}`,
      remove: (name: string) => `Удалить ${name} из корзины`,
      clearCart: "Очистить корзину",
      orderSummary: "Сводка заказа",
      subtotal: "Промежуточный итог",
      shipping: "Доставка",
      free: "Бесплатно",
      taxes: "Налоги",
      calculatedAtCheckout: "Рассчитывается при оформлении",
      total: "Итого",
      proceedToCheckout: "Перейти к оформлению",
      continueShopping: "Продолжить покупки",
      home: "Главная",
      shoppingCartBreadcrumb: "Корзина"
    };
  }
  // Default to English
  return {
    emptyCartTitle: "Your Cart is Empty",
    emptyCartSubtitle: "Looks like you haven't added anything to your cart yet.",
    startShopping: "Start Shopping",
    yourCartTitle: "Your Shopping Cart",
    itemRemoved: "Item Removed",
    itemRemovedDesc: (name: string) => `${name} has been removed from your cart.`,
    cartCleared: "Cart Cleared",
    cartClearedDesc: "All items have been removed from your cart.",
    price: "Price",
    quantityFor: (name: string) => `Quantity for ${name}`,
    remove: (name: string) => `Remove ${name} from cart`,
    clearCart: "Clear Cart",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    free: "Free",
    taxes: "Taxes",
    calculatedAtCheckout: "Calculated at checkout",
    total: "Total",
    proceedToCheckout: "Proceed to Checkout",
    continueShopping: "Continue Shopping",
    home: "Home",
    shoppingCartBreadcrumb: "Shopping Cart"
  };
};


export default function CartPage() {
  const params = useParams();
  const locale = params.locale as Locale || 'uz';
  const dictionary = getCartDictionary(locale);

  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { toast } = useToast();

  const handleRemove = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast({
      title: dictionary.itemRemoved,
      description: dictionary.itemRemovedDesc(productName),
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: dictionary.cartCleared,
      description: dictionary.cartClearedDesc,
    });
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-semibold mb-4">{dictionary.emptyCartTitle}</h1>
        <p className="text-muted-foreground mb-8">{dictionary.emptyCartSubtitle}</p>
        <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href={`/${locale}/products`}>{dictionary.startShopping}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
       <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/`}>{dictionary.home}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{dictionary.shoppingCartBreadcrumb}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold tracking-tight">{dictionary.yourCartTitle}</h1>
      
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map(item => (
            <Card key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4 shadow-sm">
              <div className="relative w-full sm:w-24 h-32 sm:h-24 aspect-square rounded-md overflow-hidden shrink-0">
                <Image src={item.images[0]} alt={item.name} fill className="object-cover" data-ai-hint="cart item" sizes="(max-width: 640px) 100vw, 96px" />
              </div>
              <div className="flex-grow space-y-1">
                <Link href={`/${locale}/products/${item.id}`} className="text-lg font-medium hover:text-primary">{item.name}</Link>
                <p className="text-sm text-muted-foreground">{dictionary.price}: ${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-3 shrink-0 mt-2 sm:mt-0">
                <Input
                  type="number"
                  min="1"
                  max={item.stock > 0 ? item.stock : 99}
                  value={item.quantity}
                  onChange={e => updateQuantity(item.id, parseInt(e.target.value))}
                  className="w-20 h-9 text-center"
                  aria-label={dictionary.quantityFor(item.name)}
                />
                <Button variant="ghost" size="icon" onClick={() => handleRemove(item.id, item.name)} aria-label={dictionary.remove(item.name)}>
                  <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
              </div>
              <p className="sm:ml-auto text-lg font-semibold w-full sm:w-auto text-right sm:text-left mt-2 sm:mt-0">${(item.price * item.quantity).toFixed(2)}</p>
            </Card>
          ))}
          {cartItems.length > 0 && (
             <div className="flex justify-end pt-4">
               <Button variant="outline" onClick={handleClearCart} className="text-destructive border-destructive hover:bg-destructive/10">
                 <Trash2 className="mr-2 h-4 w-4" /> {dictionary.clearCart}
               </Button>
             </div>
           )}
        </div>

        <Card className="lg:sticky lg:top-24 p-6 shadow-md">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-2xl">{dictionary.orderSummary}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-0">
            <div className="flex justify-between text-muted-foreground">
              <span>{dictionary.subtotal}</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>{dictionary.shipping}</span>
              <span>{dictionary.free}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>{dictionary.taxes}</span>
              <span>{dictionary.calculatedAtCheckout}</span>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between text-xl font-semibold">
              <span>{dictionary.total}</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-4 p-0 pt-6">
            <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href={`/${locale}/checkout`}>
                <CreditCard className="mr-2 h-5 w-5" /> {dictionary.proceedToCheckout}
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/${locale}/products`}>
                <ArrowLeft className="mr-2 h-5 w-5" /> {dictionary.continueShopping}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
