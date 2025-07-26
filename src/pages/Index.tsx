import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface Review {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minAmount?: number;
  maxDiscount?: number;
  validUntil: string;
  description: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  brand: string;
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  isOnSale?: boolean;
  saleEndDate?: string;
}

interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');

  const products: Product[] = [
    {
      id: 1,
      name: "Беспроводные наушники",
      price: 12999,
      category: "Аудио",
      brand: "TechSound",
      image: "/img/952529fe-2198-416a-bf54-d64de6c25411.jpg",
      description: "Премиальные беспроводные наушники с активным шумоподавлением",
      rating: 4.5,
      reviewCount: 24,
      isOnSale: true,
      originalPrice: 15999,
      discount: 19,
      saleEndDate: "2024-02-01"
    },
    {
      id: 2,
      name: "Смартфон Premium",
      price: 45999,
      category: "Телефоны",
      brand: "SmartTech",
      image: "/img/09130635-82a4-4b3d-8e84-535934686c60.jpg",
      description: "Флагманский смартфон с передовыми технологиями",
      rating: 4.8,
      reviewCount: 156
    },
    {
      id: 3,
      name: "Ультрабук Pro",
      price: 89999,
      category: "Компьютеры",
      brand: "LaptopCorp",
      image: "/img/c1e5c24a-f79c-485b-8951-3b0aed3c1563.jpg",
      description: "Мощный и легкий ультрабук для профессионалов",
      rating: 4.2,
      reviewCount: 89
    },
    {
      id: 4,
      name: "Игровая мышь RGB",
      price: 3999,
      category: "Аксессуары",
      brand: "GameGear",
      image: "/img/952529fe-2198-416a-bf54-d64de6c25411.jpg",
      description: "Профессиональная игровая мышь с RGB подсветкой",
      rating: 4.7,
      reviewCount: 203,
      isOnSale: true,
      originalPrice: 4999,
      discount: 20,
      saleEndDate: "2024-01-31"
    },
    {
      id: 5,
      name: "Механическая клавиатура",
      price: 8999,
      category: "Аксессуары",
      brand: "KeyMaster",
      image: "/img/09130635-82a4-4b3d-8e84-535934686c60.jpg",
      description: "Механическая клавиатура с Blue переключателями",
      rating: 4.3,
      reviewCount: 67
    },
    {
      id: 6,
      name: "4K Веб-камера",
      price: 15999,
      category: "Аксессуары",
      brand: "CamPro",
      image: "/img/c1e5c24a-f79c-485b-8951-3b0aed3c1563.jpg",
      description: "Профессиональная веб-камера для стриминга",
      rating: 4.6,
      reviewCount: 42,
      isOnSale: true,
      originalPrice: 19999,
      discount: 20,
      saleEndDate: "2024-02-05"
    }
  ];

  const categories = ["Аудио", "Телефоны", "Компьютеры", "Аксессуары"];
  const brands = ["TechSound", "SmartTech", "LaptopCorp", "GameGear", "KeyMaster", "CamPro"];

  const promoCodes: PromoCode[] = [
    {
      code: "WELCOME20",
      discount: 20,
      type: "percentage",
      minAmount: 10000,
      maxDiscount: 5000,
      validUntil: "2024-02-29",
      description: "Скидка 20% для новых пользователей"
    },
    {
      code: "SAVE1000",
      discount: 1000,
      type: "fixed",
      minAmount: 5000,
      validUntil: "2024-03-31",
      description: "Фиксированная скидка 1000₽"
    },
    {
      code: "TECHFAN",
      discount: 15,
      type: "percentage",
      minAmount: 15000,
      maxDiscount: 7500,
      validUntil: "2024-02-15",
      description: "Для любителей технологий - 15%"
    }
  ];

  const reviews: Review[] = [
    {
      id: 1,
      productId: 1,
      userName: "Алексей К.",
      rating: 5,
      comment: "Отличные наушники! Звук очень качественный, шумоподавление работает превосходно.",
      date: "2024-01-15"
    },
    {
      id: 2,
      productId: 1,
      userName: "Мария С.",
      rating: 4,
      comment: "Хорошие наушники, но батарея могла бы работать дольше.",
      date: "2024-01-10"
    },
    {
      id: 3,
      productId: 2,
      userName: "Дмитрий П.",
      rating: 5,
      comment: "Лучший смартфон, который у меня был. Камера просто шикарная!",
      date: "2024-01-20"
    },
    {
      id: 4,
      productId: 4,
      userName: "Игорь В.",
      rating: 5,
      comment: "Идеальная игровая мышь. Очень точная и удобная.",
      date: "2024-01-18"
    }
  ];

  const filteredProducts = products.filter(product => {
    const inPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
    const inCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const inBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    return inPriceRange && inCategory && inBrand;
  });

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getDiscountAmount = () => {
    if (!appliedPromo) return 0;
    
    const subtotal = getTotalPrice();
    if (appliedPromo.minAmount && subtotal < appliedPromo.minAmount) return 0;
    
    let discount = 0;
    if (appliedPromo.type === 'percentage') {
      discount = (subtotal * appliedPromo.discount) / 100;
      if (appliedPromo.maxDiscount && discount > appliedPromo.maxDiscount) {
        discount = appliedPromo.maxDiscount;
      }
    } else {
      discount = appliedPromo.discount;
    }
    
    return Math.min(discount, subtotal);
  };

  const getFinalPrice = () => {
    return getTotalPrice() - getDiscountAmount();
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const applyPromoCode = () => {
    setPromoError('');
    const code = promoCodes.find(p => p.code.toLowerCase() === promoCode.toLowerCase());
    
    if (!code) {
      setPromoError('Промокод не найден');
      return;
    }
    
    const currentDate = new Date();
    const validUntil = new Date(code.validUntil);
    if (currentDate > validUntil) {
      setPromoError('Срок действия промокода истек');
      return;
    }
    
    const subtotal = getTotalPrice();
    if (code.minAmount && subtotal < code.minAmount) {
      setPromoError(`Минимальная сумма заказа: ${code.minAmount.toLocaleString()}₽`);
      return;
    }
    
    setAppliedPromo(code);
    setPromoCode('');
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const getProductReviews = (productId: number) => {
    return reviews.filter(review => review.productId === productId);
  };

  const addReview = () => {
    if (!selectedProduct || !userName.trim() || !newComment.trim()) return;
    
    const newReview: Review = {
      id: Date.now(),
      productId: selectedProduct.id,
      userName: userName.trim(),
      rating: newRating,
      comment: newComment.trim(),
      date: new Date().toISOString().split('T')[0]
    };
    
    reviews.push(newReview);
    setNewComment('');
    setUserName('');
    setNewRating(5);
    setIsReviewDialogOpen(false);
  };

  const StarRating = ({ rating, size = 16, showCount = false, count = 0 }: { 
    rating: number; 
    size?: number; 
    showCount?: boolean; 
    count?: number; 
  }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center gap-1">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Icon
              key={i}
              name="Star"
              size={size}
              className={`${
                i < fullStars
                  ? 'text-yellow-400 fill-yellow-400'
                  : i === fullStars && hasHalfStar
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        {showCount && (
          <span className="text-sm text-gray-500 ml-1">
            ({count})
          </span>
        )}
      </div>
    );
  };

  const InteractiveStarRating = ({ rating, onRatingChange }: { 
    rating: number; 
    onRatingChange: (rating: number) => void; 
  }) => {
    const [hoverRating, setHoverRating] = useState(0);
    
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="p-1"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => onRatingChange(star)}
          >
            <Icon
              name="Star"
              size={20}
              className={`${
                star <= (hoverRating || rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-black">TechStore</h1>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-gray-700 hover:text-black transition-colors">Главная</a>
                <a href="#catalog" className="text-gray-700 hover:text-black transition-colors">Каталог</a>
                <a href="#" className="text-gray-700 hover:text-black transition-colors">Доставка</a>
                <a href="#" className="text-gray-700 hover:text-black transition-colors">Контакты</a>
                <a href="#" className="text-gray-700 hover:text-black transition-colors">О нас</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Icon name="Search" size={20} />
              </Button>
              <Button variant="ghost" size="sm">
                <Icon name="User" size={20} />
              </Button>
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Icon name="ShoppingCart" size={20} />
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-black text-white text-xs">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Корзина</SheetTitle>
                    <SheetDescription>
                      {cartItems.length === 0 ? "Ваша корзина пуста" : `Товаров в корзине: ${getTotalItems()}`}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center space-x-3 border-b pb-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-500">{item.quantity} × {item.price.toLocaleString()}₽</p>
                        </div>
                      </div>
                    ))}
                    {cartItems.length > 0 && (
                      <div className="pt-4 border-t space-y-4">
                        {/* Promo Code Section */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Промокод</label>
                          <div className="flex gap-2">
                            <Input
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                              placeholder="Введите промокод"
                              className="flex-1"
                            />
                            <Button 
                              onClick={applyPromoCode}
                              disabled={!promoCode.trim()}
                              size="sm"
                            >
                              Применить
                            </Button>
                          </div>
                          {promoError && (
                            <p className="text-red-500 text-xs">{promoError}</p>
                          )}
                          {appliedPromo && (
                            <div className="flex items-center justify-between bg-green-50 p-2 rounded text-sm">
                              <span className="text-green-700">
                                {appliedPromo.code} - {appliedPromo.description}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={removePromoCode}
                                className="h-6 w-6 p-0"
                              >
                                <Icon name="X" size={12} />
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Price Summary */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Подытог:</span>
                            <span>{getTotalPrice().toLocaleString()}₽</span>
                          </div>
                          {appliedPromo && getDiscountAmount() > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                              <span>Скидка ({appliedPromo.code}):</span>
                              <span>-{getDiscountAmount().toLocaleString()}₽</span>
                            </div>
                          )}
                          <div className="flex justify-between text-lg font-bold border-t pt-2">
                            <span>Итого:</span>
                            <span>{getFinalPrice().toLocaleString()}₽</span>
                          </div>
                        </div>
                        
                        <Button className="w-full bg-black hover:bg-gray-800">
                          Оформить заказ
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-6">Современные технологии</h2>
            <p className="text-xl mb-8 text-gray-300">Откройте для себя лучшие гаджеты и аксессуары</p>
            <Button size="lg" className="bg-white text-black hover:bg-gray-100">
              Перейти в каталог
            </Button>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">🔥 Горячие скидки! 🔥</h2>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="font-bold">WELCOME20</span> - 20% скидка для новых клиентов
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="font-bold">SAVE1000</span> - 1000₽ скидка на заказ от 5000₽
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="font-bold">TECHFAN</span> - 15% для любителей техники
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">Каталог товаров</h2>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold mb-4 text-black">Фильтры</h3>
                
                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-black">Цена</label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100000}
                    min={0}
                    step={1000}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{priceRange[0].toLocaleString()}₽</span>
                    <span>{priceRange[1].toLocaleString()}₽</span>
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-black">Категории</label>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <label htmlFor={category} className="text-sm text-gray-700">{category}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-black">Бренды</label>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                        />
                        <label htmlFor={brand} className="text-sm text-gray-700">{brand}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300 relative">
                    <CardHeader className="p-0 relative">
                      {product.isOnSale && (
                        <div className="absolute top-2 left-2 z-10">
                          <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold">
                            -{product.discount}%
                          </Badge>
                        </div>
                      )}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{product.brand}</span>
                      </div>
                      <CardTitle className="text-lg mb-2 text-black">{product.name}</CardTitle>
                      <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                      
                      {/* Rating */}
                      <div className="flex items-center justify-between mb-3">
                        <StarRating 
                          rating={product.rating} 
                          showCount={true} 
                          count={product.reviewCount}
                        />
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-800">
                              Отзывы
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{product.name}</DialogTitle>
                              <DialogDescription>
                                Отзывы покупателей
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              {/* Overall rating */}
                              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="text-center">
                                  <div className="text-3xl font-bold text-black">{product.rating}</div>
                                  <StarRating rating={product.rating} size={20} />
                                  <div className="text-sm text-gray-500 mt-1">
                                    {product.reviewCount} отзывов
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <Button 
                                    onClick={() => {
                                      setSelectedProduct(product);
                                      setIsReviewDialogOpen(true);
                                    }}
                                    className="w-full bg-black hover:bg-gray-800"
                                  >
                                    Написать отзыв
                                  </Button>
                                </div>
                              </div>
                              
                              {/* Reviews list */}
                              <div className="space-y-4">
                                {getProductReviews(product.id).map(review => (
                                  <div key={review.id} className="border-b pb-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-3">
                                        <span className="font-medium text-black">{review.userName}</span>
                                        <StarRating rating={review.rating} size={14} />
                                      </div>
                                      <span className="text-sm text-gray-500">{review.date}</span>
                                    </div>
                                    <p className="text-gray-700">{review.comment}</p>
                                  </div>
                                ))}
                                {getProductReviews(product.id).length === 0 && (
                                  <p className="text-gray-500 text-center py-8">
                                    Пока нет отзывов. Будьте первым!
                                  </p>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          {product.isOnSale && product.originalPrice ? (
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-black">{product.price.toLocaleString()}₽</span>
                              <span className="text-lg text-gray-500 line-through">{product.originalPrice.toLocaleString()}₽</span>
                            </div>
                          ) : (
                            <span className="text-2xl font-bold text-black">{product.price.toLocaleString()}₽</span>
                          )}
                          {product.isOnSale && product.saleEndDate && (
                            <span className="text-xs text-red-600 font-medium">
                              Акция до {new Date(product.saleEndDate).toLocaleDateString('ru-RU')}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button 
                        className="w-full bg-black hover:bg-gray-800"
                        onClick={() => addToCart(product)}
                      >
                        <Icon name="ShoppingCart" size={16} className="mr-2" />
                        В корзину
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Товары не найдены. Попробуйте изменить фильтры.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">TechStore</h3>
              <p className="text-gray-400">Ваш надежный партнер в мире технологий</p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Каталог</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Смартфоны</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Компьютеры</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Аксессуары</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Поддержка</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Доставка</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Возврат</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Гарантия</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Контакты</h4>
              <ul className="space-y-2 text-gray-400">
                <li>+7 (800) 123-45-67</li>
                <li>info@techstore.ru</li>
                <li>Москва, ул. Примерная, 123</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TechStore. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Написать отзыв</DialogTitle>
            <DialogDescription>
              {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ваше имя</label>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Введите ваше имя"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Оценка</label>
              <InteractiveStarRating 
                rating={newRating} 
                onRatingChange={setNewRating} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Комментарий</label>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Поделитесь своими впечатлениями о товаре"
                rows={4}
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={addReview}
                className="flex-1 bg-black hover:bg-gray-800"
                disabled={!userName.trim() || !newComment.trim()}
              >
                Опубликовать отзыв
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsReviewDialogOpen(false)}
              >
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;