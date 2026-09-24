import { MenuItem, DietaryType } from '../types';

export type InputSourceType = 'ingredients' | 'handwritten' | 'stocklist';
export type MenuLanguage = 'en' | 'mr' | 'hi';

export interface AiGenerationRequest {
  imagePreviewUrl?: string;
  sourceType: InputSourceType;
  customPrompt?: string;
  targetLanguage: MenuLanguage;
  rawFileName?: string;
}

export interface AiGenerationResult {
  isUsingLiveApi: boolean;
  providerName: string;
  identifiedItems: string[];
  menuTitle: string;
  dishes: Array<{
    id: string;
    name: string;
    nativeNames: {
      mr: string;
      hi: string;
    };
    description: string;
    price: number;
    costPrice: number;
    category: string;
    isAvailable: boolean;
    isChefSpecial?: boolean;
    prepTimeMin: number;
    dietary: DietaryType;
    image: string;
  }>;
}

// Check if vendor configured live Gemini/OpenAI API in environment
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

export const isLiveAiConfigured = Boolean(GEMINI_API_KEY || OPENAI_API_KEY);
export const getActiveAiProvider = () => {
  if (GEMINI_API_KEY) return 'Google Gemini 1.5 Flash Vision (Live API)';
  if (OPENAI_API_KEY) return 'OpenAI GPT-4o Vision (Live API)';
  return 'DailyMenu Vision Engine (Offline Demo Fallback)';
};

// Fallback presets based on realistic Mumbai/Pune/Bangalore street food & kitchen ingredients
const MOCK_PRESETS: Record<InputSourceType, AiGenerationResult> = {
  ingredients: {
    isUsingLiveApi: false,
    providerName: 'DailyMenu Vision Engine (Offline Demo Fallback)',
    menuTitle: "Today's Fresh Specials",
    identifiedItems: [
      'Fresh Paneer Block (3kg)',
      'Ladi Pav (50 pcs)',
      'Boiled Potatoes & Green Peas',
      'Farsan, Sprouts (Matki) & Tarri',
      'Fresh Mint, Coriander & Lemons'
    ],
    dishes: [
      {
        id: `ai-item-${Date.now()}-1`,
        name: 'Paneer Masala Pav',
        nativeNames: {
          mr: 'पनीर मसाला पाव',
          hi: 'पनीर मसाला पाव',
        },
        description: 'Tawa-tossed soft paneer cubes in spiced tomato-onion bhaji served with butter toasted ladi pav.',
        price: 80,
        costPrice: 28,
        category: "Today's Special",
        isAvailable: true,
        isChefSpecial: true,
        prepTimeMin: 6,
        dietary: 'veg',
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: `ai-item-${Date.now()}-2`,
        name: 'Kolhapuri Special Misal Pav',
        nativeNames: {
          mr: 'कोल्हापुरी स्पेशल मिसळ पाव',
          hi: 'कोल्हापुरी स्पेशल मिसल पाव',
        },
        description: 'Fiery sprouted moth bean curry topped with crunchy farsan, chopped onions, lemon and two butter pavs.',
        price: 60,
        costPrice: 20,
        category: "Today's Special",
        isAvailable: true,
        isChefSpecial: true,
        prepTimeMin: 4,
        dietary: 'veg',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: `ai-item-${Date.now()}-3`,
        name: 'Butter Masala Pav (2 pcs)',
        nativeNames: {
          mr: 'बटर मसाला पाव',
          hi: 'बटर मसाला पाव',
        },
        description: 'Pav bread drenched in spiced garlic-coriander red chili butter paste crisped on iron tawa.',
        price: 50,
        costPrice: 15,
        category: "Today's Special",
        isAvailable: true,
        isChefSpecial: false,
        prepTimeMin: 3,
        dietary: 'veg',
        image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: `ai-item-${Date.now()}-4`,
        name: 'Mumbai Batata Vada Pav',
        nativeNames: {
          mr: 'मुंबई बटाटा वडा पाव',
          hi: 'मुंबई बटाटा वड़ा पाव',
        },
        description: 'Crispy spiced golden potato fritter tucked in pav with dry garlic coconut thecha and green chutney.',
        price: 20,
        costPrice: 7,
        category: "Today's Special",
        isAvailable: true,
        isChefSpecial: false,
        prepTimeMin: 2,
        dietary: 'veg',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      },
    ]
  },
  handwritten: {
    isUsingLiveApi: false,
    providerName: 'DailyMenu Vision Engine (Offline Demo Fallback)',
    menuTitle: "Chalkboard Menu Extracted",
    identifiedItems: [
      'Handwritten Blackboard: "Aajche Khas Padarth"',
      'Line 1: Paneer Tikka Tawa - 120/-',
      'Line 2: Veg Pulao Raita - 90/-',
      'Line 3: Special Chai - 25/-',
      'Line 4: Bun Maska - 35/-'
    ],
    dishes: [
      {
        id: `ai-item-${Date.now()}-5`,
        name: 'Tawa Paneer Tikka Dry',
        nativeNames: {
          mr: 'तवा पनीर टिक्का',
          hi: 'तवा पनीर टिक्का',
        },
        description: 'Tandoori-marinated cottage cheese charred on high flame with capsicum and lachha onions.',
        price: 120,
        costPrice: 42,
        category: 'Quick Bites',
        isAvailable: true,
        isChefSpecial: true,
        prepTimeMin: 8,
        dietary: 'veg',
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: `ai-item-${Date.now()}-6`,
        name: 'Tawa Matar Pulao with Raita',
        nativeNames: {
          mr: 'तवा मटार पुलाव आणि रायता',
          hi: 'तवा मटर पुलाव और रायता',
        },
        description: 'Fragrant basmati rice tossed with whole spices, green peas and served with roasted cumin boondi raita.',
        price: 90,
        costPrice: 32,
        category: 'Main Course',
        isAvailable: true,
        isChefSpecial: false,
        prepTimeMin: 6,
        dietary: 'veg',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: `ai-item-${Date.now()}-7`,
        name: 'Irani Bun Maska Jam',
        nativeNames: {
          mr: 'इराणी बन मस्का',
          hi: 'इरानी बन मस्का',
        },
        description: 'Warm fluffy sweet bun slathered with wholesome amul butter and mixed fruit jam.',
        price: 35,
        costPrice: 12,
        category: 'Hot Beverages & Bakery',
        isAvailable: true,
        isChefSpecial: false,
        prepTimeMin: 2,
        dietary: 'veg',
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: `ai-item-${Date.now()}-8`,
        name: 'Kadak Adrak Masala Chai',
        nativeNames: {
          mr: 'कडक आले मसाला चहा',
          hi: 'कड़क अदरक मसाला चाय',
        },
        description: 'Rich slow-brewed tea flavored with crushed mountain ginger and roasted cardamom pods.',
        price: 25,
        costPrice: 8,
        category: 'Hot Beverages & Bakery',
        isAvailable: true,
        isChefSpecial: true,
        prepTimeMin: 4,
        dietary: 'veg',
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
      },
    ]
  },
  stocklist: {
    isUsingLiveApi: false,
    providerName: 'DailyMenu Vision Engine (Offline Demo Fallback)',
    menuTitle: "Daily Stock Inventory Menu",
    identifiedItems: [
      'Stock Note: 20 Samosa packets',
      'Stock Note: 15 Sweet curd tubs',
      'Stock Note: 5kg Semolina flour & sev',
      'Stock Note: Tamarind + Mint Chutney batch'
    ],
    dishes: [
      {
        id: `ai-item-${Date.now()}-9`,
        name: 'Shahi Dahi Samosa Chaat',
        nativeNames: {
          mr: 'शाही दही समोसा चाट',
          hi: 'शाही दही समोसा चाट',
        },
        description: 'Crushed crispy samosas smothered in sweet churned yogurt, date tamarind sauce, spicy mint chutney & sev.',
        price: 70,
        costPrice: 22,
        category: 'Chaat & Crunch',
        isAvailable: true,
        isChefSpecial: true,
        prepTimeMin: 4,
        dietary: 'veg',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: `ai-item-${Date.now()}-10`,
        name: 'Sev Puri Pune Special (6 pcs)',
        nativeNames: {
          mr: 'शेव पुरी पुणे स्पेशल',
          hi: 'सेव पूरी पुणे स्पेशल',
        },
        description: 'Flat crispy puris loaded with diced potatoes, raw mango, sweet spicy chutneys and a mountain of fine sev.',
        price: 50,
        costPrice: 16,
        category: 'Chaat & Crunch',
        isAvailable: true,
        isChefSpecial: false,
        prepTimeMin: 3,
        dietary: 'veg',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      }
    ]
  }
};

/**
 * Service function to process image/text input and generate an editable menu
 */
export async function generateAiMenu(request: AiGenerationRequest): Promise<AiGenerationResult> {
  // If live Gemini API key is available, call Gemini API
  if (GEMINI_API_KEY) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an AI chef and menu pricing specialist for Indian food vendors.
Analyze the provided food input/photo (${request.sourceType}).
Generate a structured JSON menu in this format:
{
  "menuTitle": "Today's Special",
  "identifiedItems": ["item 1", "item 2"],
  "dishes": [
    {
      "name": "Paneer Masala",
      "nativeNames": { "mr": "पनीर मसाला", "hi": "पनीर मसाला" },
      "description": "Tasty cottage cheese gravy",
      "price": 80,
      "costPrice": 28,
      "category": "Today's Special",
      "isAvailable": true,
      "isChefSpecial": true,
      "prepTimeMin": 6,
      "dietary": "veg",
      "image": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80"
    }
  ]
}
Return ONLY pure JSON without markdown codeblock wraps.`
                  }
                ]
              }
            ]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleanedJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedJson);

        return {
          isUsingLiveApi: true,
          providerName: 'Google Gemini 1.5 Flash (Live)',
          menuTitle: parsed.menuTitle || "Today's Generated Specials",
          identifiedItems: parsed.identifiedItems || ['Stock items detected'],
          dishes: parsed.dishes.map((d: any, idx: number) => ({
            id: `ai-live-${Date.now()}-${idx}`,
            name: d.name,
            nativeNames: {
              mr: d.nativeNames?.mr || d.name,
              hi: d.nativeNames?.hi || d.name,
            },
            description: d.description || '',
            price: Number(d.price) || 60,
            costPrice: Number(d.costPrice) || Math.round(Number(d.price) * 0.35),
            category: d.category || "Today's Special",
            isAvailable: d.isAvailable ?? true,
            isChefSpecial: d.isChefSpecial ?? false,
            prepTimeMin: Number(d.prepTimeMin) || 5,
            dietary: d.dietary || 'veg',
            image: d.image || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
          }))
        };
      }
    } catch (err) {
      console.warn('Live API request failed, gracefully switching to DailyMenu fallback preset:', err);
    }
  }

  // Graceful Demo Fallback: Simulate network latency for authentic UI state transition
  await new Promise((resolve) => setTimeout(resolve, 1600));

  const preset = MOCK_PRESETS[request.sourceType] || MOCK_PRESETS.ingredients;
  
  // Clone to generate unique IDs
  return {
    ...preset,
    dishes: preset.dishes.map((dish, i) => ({
      ...dish,
      id: `gen-dish-${Date.now()}-${i}`
    }))
  };
}
