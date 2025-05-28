import { Injectable } from '@angular/core';
import { SimpleI18nService, Language } from './simple-i18n.service';
import { Restaurant, CuisineType, PriceRange } from '../models/restaurant.model';
import { MenuItem, MenuCategory, CustomizationType, Allergen } from '../models/menu.model';

export interface LocalizedContent {
  restaurants: Record<string, LocalizedRestaurant>;
  menuCategories: Record<string, LocalizedMenuCategory>;
  menuItems: Record<string, LocalizedMenuItem>;
}

export interface LocalizedRestaurant {
  name: string;
  description: string;
  tags: string[];
}

export interface LocalizedMenuCategory {
  name: string;
  description: string;
}

export interface LocalizedMenuItem {
  name: string;
  description: string;
  tags: string[];
  customizations: LocalizedCustomization[];
}

export interface LocalizedCustomization {
  name: string;
  options: LocalizedCustomizationOption[];
}

export interface LocalizedCustomizationOption {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocalizedMockDataService {
  private localizedContent: Record<Language, LocalizedContent> = {
    en: {
      restaurants: {
        '1': {
          name: 'Pizza Palace',
          description: 'Authentic Italian pizza with fresh ingredients and traditional recipes',
          tags: ['Popular', 'Fast Delivery', 'Family Friendly']
        },
        '2': {
          name: 'Burger Barn',
          description: 'Gourmet burgers made with premium beef and fresh local ingredients',
          tags: ['Premium Beef', 'Local Ingredients', 'Gourmet']
        },
        '3': {
          name: 'Sushi Zen',
          description: 'Fresh sushi and Japanese cuisine prepared by master chefs',
          tags: ['Premium', 'Fresh Fish', 'Master Chef']
        },
        '4': {
          name: 'Taco Fiesta',
          description: 'Authentic Mexican street food with bold flavors and fresh ingredients',
          tags: ['Authentic', 'Spicy', 'Street Food']
        },
        '5': {
          name: 'Pasta Corner',
          description: 'Homemade Italian pasta with traditional sauces and fresh herbs',
          tags: ['Homemade', 'Traditional', 'Italian']
        }
      },
      menuCategories: {
        'cat-1-1': { name: 'Appetizers', description: 'Start your meal with our delicious appetizers' },
        'cat-1-2': { name: 'Pizzas', description: 'Our signature wood-fired pizzas' },
        'cat-1-3': { name: 'Pasta', description: 'Fresh homemade pasta dishes' },
        'cat-1-4': { name: 'Desserts', description: 'Sweet treats to end your meal' },
        'cat-2-1': { name: 'Appetizers', description: 'Tasty starters to begin your meal' },
        'cat-2-2': { name: 'Burgers', description: 'Gourmet burgers with premium ingredients' },
        'cat-2-3': { name: 'Sides', description: 'Perfect accompaniments to your meal' },
        'cat-3-1': { name: 'Appetizers', description: 'Traditional Japanese starters' },
        'cat-3-2': { name: 'Sushi Rolls', description: 'Fresh sushi rolls made to order' },
        'cat-3-3': { name: 'Sashimi', description: 'Premium fresh fish sliced to perfection' }
      },
      menuItems: {
        'item-1-1': {
          name: 'Garlic Bread',
          description: 'Fresh baked bread with garlic butter and herbs',
          tags: ['Popular', 'Vegetarian'],
          customizations: [
            {
              name: 'Extra Garlic',
              options: [
                { name: 'No Extra' },
                { name: 'Extra Garlic' }
              ]
            }
          ]
        },
        'item-1-2': {
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
          tags: ['Popular', 'Vegetarian', 'Classic'],
          customizations: [
            {
              name: 'Size',
              options: [
                { name: 'Small (10")' },
                { name: 'Medium (12")' },
                { name: 'Large (14")' }
              ]
            },
            {
              name: 'Crust Type',
              options: [
                { name: 'Thin Crust' },
                { name: 'Thick Crust' },
                { name: 'Stuffed Crust' }
              ]
            }
          ]
        },
        'item-2-1': {
          name: 'Classic Burger',
          description: 'Beef patty with lettuce, tomato, onion, and our special sauce',
          tags: ['Popular', 'Classic'],
          customizations: [
            {
              name: 'Cooking Level',
              options: [
                { name: 'Medium Rare' },
                { name: 'Medium' },
                { name: 'Well Done' }
              ]
            },
            {
              name: 'Add Cheese',
              options: [
                { name: 'No Cheese' },
                { name: 'American Cheese' },
                { name: 'Cheddar Cheese' }
              ]
            }
          ]
        },
        'item-3-1': {
          name: 'California Roll',
          description: 'Crab, avocado, and cucumber with sesame seeds',
          tags: ['Popular', 'Fresh'],
          customizations: []
        },
        'item-3-2': {
          name: 'Salmon Sashimi',
          description: 'Fresh Atlantic salmon sliced thin and served with wasabi',
          tags: ['Popular', 'Premium', 'Gluten Free'],
          customizations: []
        }
      }
    },
    ar: {
      restaurants: {
        '1': {
          name: 'قصر البيتزا',
          description: 'بيتزا إيطالية أصيلة مع مكونات طازجة ووصفات تقليدية',
          tags: ['شائع', 'توصيل سريع', 'مناسب للعائلة']
        },
        '2': {
          name: 'حظيرة البرجر',
          description: 'برجر فاخر مصنوع من لحم البقر الممتاز والمكونات المحلية الطازجة',
          tags: ['لحم بقر ممتاز', 'مكونات محلية', 'فاخر']
        },
        '3': {
          name: 'سوشي زن',
          description: 'سوشي طازج ومأكولات يابانية محضرة من قبل طهاة خبراء',
          tags: ['ممتاز', 'سمك طازج', 'طاهي خبير']
        },
        '4': {
          name: 'تاكو فييستا',
          description: 'طعام شارع مكسيكي أصيل بنكهات جريئة ومكونات طازجة',
          tags: ['أصيل', 'حار', 'طعام شارع']
        },
        '5': {
          name: 'ركن الباستا',
          description: 'باستا إيطالية منزلية الصنع مع صلصات تقليدية وأعشاب طازجة',
          tags: ['منزلي الصنع', 'تقليدي', 'إيطالي']
        }
      },
      menuCategories: {
        'cat-1-1': { name: 'المقبلات', description: 'ابدأ وجبتك مع مقبلاتنا اللذيذة' },
        'cat-1-2': { name: 'البيتزا', description: 'بيتزا مميزة مطبوخة في الفرن الحجري' },
        'cat-1-3': { name: 'الباستا', description: 'أطباق باستا طازجة منزلية الصنع' },
        'cat-1-4': { name: 'الحلويات', description: 'حلويات لذيذة لإنهاء وجبتك' },
        'cat-2-1': { name: 'المقبلات', description: 'مقبلات شهية لبداية وجبتك' },
        'cat-2-2': { name: 'البرجر', description: 'برجر فاخر مع مكونات ممتازة' },
        'cat-2-3': { name: 'الأطباق الجانبية', description: 'مرافقات مثالية لوجبتك' },
        'cat-3-1': { name: 'المقبلات', description: 'مقبلات يابانية تقليدية' },
        'cat-3-2': { name: 'لفائف السوشي', description: 'لفائف سوشي طازجة محضرة حسب الطلب' },
        'cat-3-3': { name: 'الساشيمي', description: 'سمك طازج ممتاز مقطع بإتقان' }
      },
      menuItems: {
        'item-1-1': {
          name: 'خبز بالثوم',
          description: 'خبز طازج مخبوز مع زبدة الثوم والأعشاب',
          tags: ['شائع', 'نباتي'],
          customizations: [
            {
              name: 'ثوم إضافي',
              options: [
                { name: 'بدون إضافي' },
                { name: 'ثوم إضافي' }
              ]
            }
          ]
        },
        'item-1-2': {
          name: 'بيتزا مارغريتا',
          description: 'بيتزا كلاسيكية مع صلصة الطماطم والموزاريلا والريحان الطازج',
          tags: ['شائع', 'نباتي', 'كلاسيكي'],
          customizations: [
            {
              name: 'الحجم',
              options: [
                { name: 'صغير (10 بوصة)' },
                { name: 'متوسط (12 بوصة)' },
                { name: 'كبير (14 بوصة)' }
              ]
            },
            {
              name: 'نوع العجينة',
              options: [
                { name: 'عجينة رقيقة' },
                { name: 'عجينة سميكة' },
                { name: 'عجينة محشوة' }
              ]
            }
          ]
        },
        'item-2-1': {
          name: 'برجر كلاسيكي',
          description: 'قطعة لحم بقري مع الخس والطماطم والبصل وصلصتنا الخاصة',
          tags: ['شائع', 'كلاسيكي'],
          customizations: [
            {
              name: 'مستوى الطبخ',
              options: [
                { name: 'نصف مطبوخ' },
                { name: 'متوسط' },
                { name: 'مطبوخ جيداً' }
              ]
            },
            {
              name: 'إضافة جبن',
              options: [
                { name: 'بدون جبن' },
                { name: 'جبن أمريكي' },
                { name: 'جبن شيدر' }
              ]
            }
          ]
        },
        'item-3-1': {
          name: 'لفة كاليفورنيا',
          description: 'سلطعون وأفوكادو وخيار مع بذور السمسم',
          tags: ['شائع', 'طازج'],
          customizations: []
        },
        'item-3-2': {
          name: 'ساشيمي السلمون',
          description: 'سلمون أطلسي طازج مقطع رقيق ويقدم مع الواسابي',
          tags: ['شائع', 'ممتاز', 'خالي من الجلوتين'],
          customizations: []
        }
      }
    },
    es: {
      restaurants: {
        '1': {
          name: 'Palacio de Pizza',
          description: 'Pizza italiana auténtica con ingredientes frescos y recetas tradicionales',
          tags: ['Popular', 'Entrega Rápida', 'Familiar']
        },
        '2': {
          name: 'Granero de Hamburguesas',
          description: 'Hamburguesas gourmet hechas con carne premium y ingredientes locales frescos',
          tags: ['Carne Premium', 'Ingredientes Locales', 'Gourmet']
        },
        '3': {
          name: 'Sushi Zen',
          description: 'Sushi fresco y cocina japonesa preparada por chefs maestros',
          tags: ['Premium', 'Pescado Fresco', 'Chef Maestro']
        },
        '4': {
          name: 'Taco Fiesta',
          description: 'Comida callejera mexicana auténtica con sabores audaces e ingredientes frescos',
          tags: ['Auténtico', 'Picante', 'Comida Callejera']
        },
        '5': {
          name: 'Rincón de Pasta',
          description: 'Pasta italiana casera con salsas tradicionales y hierbas frescas',
          tags: ['Casero', 'Tradicional', 'Italiano']
        }
      },
      menuCategories: {
        'cat-1-1': { name: 'Aperitivos', description: 'Comienza tu comida con nuestros deliciosos aperitivos' },
        'cat-1-2': { name: 'Pizzas', description: 'Nuestras pizzas exclusivas cocidas en horno de leña' },
        'cat-1-3': { name: 'Pasta', description: 'Platos de pasta fresca casera' },
        'cat-1-4': { name: 'Postres', description: 'Dulces delicias para terminar tu comida' },
        'cat-2-1': { name: 'Aperitivos', description: 'Entrantes sabrosos para comenzar tu comida' },
        'cat-2-2': { name: 'Hamburguesas', description: 'Hamburguesas gourmet con ingredientes premium' },
        'cat-2-3': { name: 'Acompañamientos', description: 'Acompañamientos perfectos para tu comida' },
        'cat-3-1': { name: 'Aperitivos', description: 'Entrantes japoneses tradicionales' },
        'cat-3-2': { name: 'Rollos de Sushi', description: 'Rollos de sushi frescos hechos al momento' },
        'cat-3-3': { name: 'Sashimi', description: 'Pescado fresco premium cortado a la perfección' }
      },
      menuItems: {
        'item-1-1': {
          name: 'Pan de Ajo',
          description: 'Pan recién horneado con mantequilla de ajo y hierbas',
          tags: ['Popular', 'Vegetariano'],
          customizations: [
            {
              name: 'Ajo Extra',
              options: [
                { name: 'Sin Extra' },
                { name: 'Ajo Extra' }
              ]
            }
          ]
        },
        'item-1-2': {
          name: 'Pizza Margarita',
          description: 'Pizza clásica con salsa de tomate, mozzarella y albahaca fresca',
          tags: ['Popular', 'Vegetariano', 'Clásico'],
          customizations: [
            {
              name: 'Tamaño',
              options: [
                { name: 'Pequeña (10")' },
                { name: 'Mediana (12")' },
                { name: 'Grande (14")' }
              ]
            },
            {
              name: 'Tipo de Masa',
              options: [
                { name: 'Masa Delgada' },
                { name: 'Masa Gruesa' },
                { name: 'Masa Rellena' }
              ]
            }
          ]
        },
        'item-2-1': {
          name: 'Hamburguesa Clásica',
          description: 'Carne de res con lechuga, tomate, cebolla y nuestra salsa especial',
          tags: ['Popular', 'Clásico'],
          customizations: [
            {
              name: 'Nivel de Cocción',
              options: [
                { name: 'Medio Crudo' },
                { name: 'Medio' },
                { name: 'Bien Cocido' }
              ]
            },
            {
              name: 'Agregar Queso',
              options: [
                { name: 'Sin Queso' },
                { name: 'Queso Americano' },
                { name: 'Queso Cheddar' }
              ]
            }
          ]
        },
        'item-3-1': {
          name: 'Rollo California',
          description: 'Cangrejo, aguacate y pepino con semillas de sésamo',
          tags: ['Popular', 'Fresco'],
          customizations: []
        },
        'item-3-2': {
          name: 'Sashimi de Salmón',
          description: 'Salmón atlántico fresco cortado fino y servido con wasabi',
          tags: ['Popular', 'Premium', 'Sin Gluten'],
          customizations: []
        }
      }
    },
    fr: {
      restaurants: {
        '1': {
          name: 'Palais de la Pizza',
          description: 'Pizza italienne authentique avec des ingrédients frais et des recettes traditionnelles',
          tags: ['Populaire', 'Livraison Rapide', 'Familial']
        },
        '2': {
          name: 'Grange à Burgers',
          description: 'Burgers gastronomiques faits avec du bœuf premium et des ingrédients locaux frais',
          tags: ['Bœuf Premium', 'Ingrédients Locaux', 'Gastronomique']
        },
        '3': {
          name: 'Sushi Zen',
          description: 'Sushi frais et cuisine japonaise préparés par des chefs maîtres',
          tags: ['Premium', 'Poisson Frais', 'Chef Maître']
        },
        '4': {
          name: 'Taco Fiesta',
          description: 'Cuisine de rue mexicaine authentique avec des saveurs audacieuses et des ingrédients frais',
          tags: ['Authentique', 'Épicé', 'Cuisine de Rue']
        },
        '5': {
          name: 'Coin des Pâtes',
          description: 'Pâtes italiennes maison avec des sauces traditionnelles et des herbes fraîches',
          tags: ['Fait Maison', 'Traditionnel', 'Italien']
        }
      },
      menuCategories: {
        'cat-1-1': { name: 'Apéritifs', description: 'Commencez votre repas avec nos délicieux apéritifs' },
        'cat-1-2': { name: 'Pizzas', description: 'Nos pizzas signature cuites au feu de bois' },
        'cat-1-3': { name: 'Pâtes', description: 'Plats de pâtes fraîches faites maison' },
        'cat-1-4': { name: 'Desserts', description: 'Douceurs sucrées pour terminer votre repas' },
        'cat-2-1': { name: 'Apéritifs', description: 'Entrées savoureuses pour commencer votre repas' },
        'cat-2-2': { name: 'Burgers', description: 'Burgers gastronomiques avec des ingrédients premium' },
        'cat-2-3': { name: 'Accompagnements', description: 'Accompagnements parfaits pour votre repas' },
        'cat-3-1': { name: 'Apéritifs', description: 'Entrées japonaises traditionnelles' },
        'cat-3-2': { name: 'Rouleaux de Sushi', description: 'Rouleaux de sushi frais faits sur commande' },
        'cat-3-3': { name: 'Sashimi', description: 'Poisson frais premium tranché à la perfection' }
      },
      menuItems: {
        'item-1-1': {
          name: 'Pain à l\'Ail',
          description: 'Pain fraîchement cuit avec du beurre à l\'ail et des herbes',
          tags: ['Populaire', 'Végétarien'],
          customizations: [
            {
              name: 'Ail Supplémentaire',
              options: [
                { name: 'Pas de Supplément' },
                { name: 'Ail Supplémentaire' }
              ]
            }
          ]
        },
        'item-1-2': {
          name: 'Pizza Margherita',
          description: 'Pizza classique avec sauce tomate, mozzarella et basilic frais',
          tags: ['Populaire', 'Végétarien', 'Classique'],
          customizations: [
            {
              name: 'Taille',
              options: [
                { name: 'Petite (10")' },
                { name: 'Moyenne (12")' },
                { name: 'Grande (14")' }
              ]
            },
            {
              name: 'Type de Pâte',
              options: [
                { name: 'Pâte Fine' },
                { name: 'Pâte Épaisse' },
                { name: 'Pâte Farcie' }
              ]
            }
          ]
        },
        'item-2-1': {
          name: 'Burger Classique',
          description: 'Steak de bœuf avec laitue, tomate, oignon et notre sauce spéciale',
          tags: ['Populaire', 'Classique'],
          customizations: [
            {
              name: 'Niveau de Cuisson',
              options: [
                { name: 'Saignant' },
                { name: 'À Point' },
                { name: 'Bien Cuit' }
              ]
            },
            {
              name: 'Ajouter du Fromage',
              options: [
                { name: 'Pas de Fromage' },
                { name: 'Fromage Américain' },
                { name: 'Fromage Cheddar' }
              ]
            }
          ]
        },
        'item-3-1': {
          name: 'Rouleau California',
          description: 'Crabe, avocat et concombre avec graines de sésame',
          tags: ['Populaire', 'Frais'],
          customizations: []
        },
        'item-3-2': {
          name: 'Sashimi de Saumon',
          description: 'Saumon atlantique frais tranché fin et servi avec wasabi',
          tags: ['Populaire', 'Premium', 'Sans Gluten'],
          customizations: []
        }
      }
    }
  };

  constructor(private i18nService: SimpleI18nService) {}

  getLocalizedRestaurant(restaurantId: string): LocalizedRestaurant | null {
    const currentLang = this.i18nService.currentLanguage;
    return this.localizedContent[currentLang].restaurants[restaurantId] || null;
  }

  getLocalizedMenuCategory(categoryId: string): LocalizedMenuCategory | null {
    const currentLang = this.i18nService.currentLanguage;
    return this.localizedContent[currentLang].menuCategories[categoryId] || null;
  }

  getLocalizedMenuItem(itemId: string): LocalizedMenuItem | null {
    const currentLang = this.i18nService.currentLanguage;
    return this.localizedContent[currentLang].menuItems[itemId] || null;
  }

  getAllLocalizedRestaurants(): Record<string, LocalizedRestaurant> {
    const currentLang = this.i18nService.currentLanguage;
    return this.localizedContent[currentLang].restaurants;
  }

  getAllLocalizedMenuCategories(): Record<string, LocalizedMenuCategory> {
    const currentLang = this.i18nService.currentLanguage;
    return this.localizedContent[currentLang].menuCategories;
  }

  getAllLocalizedMenuItems(): Record<string, LocalizedMenuItem> {
    const currentLang = this.i18nService.currentLanguage;
    return this.localizedContent[currentLang].menuItems;
  }
}
