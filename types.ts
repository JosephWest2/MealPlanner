import type { Session, User } from "next-auth";

export type RecipeSearchParams = {
    diet: string | null;
    mealType: string | null;
    intolerances: string[];
    cuisine: string | null;
    maxReadyTime: number | null;
    nutrientLimits: NutrientLimits | null;
};

export type NutrientLimits = {
    [key: string]: number;
};

export type RecipeSearchParamStrings = {
    query: string | undefined;
    mealType: string | undefined;
    maxReadyTime: Number | undefined;
    onlyFavorites: string | undefined;
    intolerances: string | undefined;
    diet: string | undefined;
    cuisine: string | undefined;
    nutrientLimits: string | undefined;
};
export type Recipe = {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    veryHealthy: boolean;
    cheap: boolean;
    veryPopular: boolean;
    sustainable: boolean;
    lowFodmap: boolean;
    weightWatcherSmartPoints: Number;
    gaps: string;
    preparationMinutes: Number;
    cookingMinutes: Number;
    aggregateLikes: Number;
    healthScore: Number;
    creditsText: string;
    license: string;
    nutrition: SPNutrition;
    sourceName: string;
    pricePerServing: Number;
    extendedIngredients: Ingredient[];
    id: number;
    title: string;
    readyInMinutes: Number;
    servings: Number;
    sourceUrl: string;
    image: string;
    imageType: string;
    summary: string;
    cuisines: [];
    dishTypes: [];
    diets: [];
    occasions: [];
    instructions: string;
    analyzedInstructions: [
        {
            name: string;
            steps: Step[];
        }
    ];
    originalId: Number | null;
    spoonacularScore: Number;
    spoonacularSourceUrl: string;
};

export type Step = {
    number: Number;
    step: string;
};

export type CookieIngredients = {
    [ingredientName: string] : {
        included: boolean;
        override: string | null;
        units: {
            [unit: string] : number
        }
        
    }
}

export type CookieIngredient = {
    name: string;
    included: boolean;
    override: string | null;
    units: {
        [unit: string]: number
    }
}

export type Ingredient = {
    id: number;
    aisle: string;
    image: string;
    consistency: string;
    name: string;
    nameClean: string;
    original: string;
    originalName: string;
    amount: number;
    unit: string;
    meta: [];
    measures: {
        metric: {
            amount: number;
            unitLong: string;
            unitShort: string;
        },
        us: {
            amount: number;
            unitLong: string;
            unitShort: string;
        }
    };
};

export type Nutrition = {
    nutrients: [];
    properties: [];
    flavonoids: [];
    ingredients: NutritionIngredient[];
};

export type NutritionIngredient = {
    id: number;
    name: string;
    amount: number;
    unit: string;
    nutrients: [];
};

export type NormalizedUnitType = "g" | "mL" | "ct" | "unknown";

export type Cart = {
    count: number;
    recipes: {
        [id : string] : {
            recipe: CartRecipe,
            count: number
        }
    };
    ingredients: DynamicIngredients;
};

export type CartRecipe = {
    name: string;
    imageURL: string;
    nutrition: SPNutrition;
    instructions: string[];
    originalIngredients: string[];
};

export type SPNutrition = {
    nutrients: Nutrient[];
     weightPerServing: Nutrient
}

export type Nutrient = {
    name: string;
    amount: string;
    unit: string;
}
export type DynamicIngredients = {
    [ingredientName: string]: CartIngredient;
};

export type CartIngredient = {
    included: boolean;
    override: boolean;
    overrideValue: string | null;
    recipeIngredients: RecipeIngredient[];
};

export type RecipeIngredient = {
    amount: number;
    unit: string;
    recipeId: string;
};

export type MySession = Session & {
    user: MyUser;
    accessToken: string | undefined;
    refreshToken: string | undefined;
    expiresAt: number;
};

export type MyUser = User & {
    id: number;
};

export type MealType =
    | "main course"
    | "side dish"
    | "dessert"
    | "appetizer"
    | "salad"
    | "bread"
    | "breakfast"
    | "soup"
    | "beverage"
    | "sauce"
    | "marinade"
    | "fingerfood"
    | "snack"
    | "drink";

export type KrogerProfile = {
    data: {
        id: string;
        meta: any;
    };
};

export type MappedIngredient = {
    name: string;
    included: boolean;
    override: string | null;
    units: {
        [unit: string]: number;
    }
    productOptions: KrogerProductInfo[] | undefined;
};

export type KrogerLocation = {
    locationId: string;
    storeNumber: string;
    chain: string;
    geolocation: {
        latitude: number;
        longitude: number;
    };
    address: {
        addressLine1: string;
        city: string;
        state: string;
        zipCode: string;
    };
    name: string;
};

export type KrogerProductInfo = {
    productId: string;
    upc: string;
    brand: string;
    countryOrigin: string;
    aisleLocations: [
        {
            bayNumber: string;
            description: string;
            number: string;
            numberOfFacings: string;
            sequenceNumber: string;
            side: string;
            shelfNumber: string;
            shelfPositionInBay: string;
        }
    ];
    categories: string[];
    description: string;
    images: [
        {
            id?: string;
            perspective: string;
            featured?: boolean;
            sizes: [
                {
                    id?: string;
                    size: "xlarge" | "large" | "medium" | "small";
                    url: string;
                }
            ];
        }
    ];
    items: [
        {
            itemId: string;
            favorite: boolean;
            fulfillment: {
                curbside: boolean;
                delivery: boolean;
                instore: boolean;
                shiptohome: boolean;
            };
            price: {
                regular: number;
                promo: number;
                regularPerUnitEstimate: number;
                promoPerUnitEstimate: number;
            };
            nationalPrice: {
                regular: number;
                promo: number;
                regularPerUnitEstimate: number;
                promoPerUnitEstimate: number;
            };
            soldby: string;
            size: string;
        }
    ];
    itemInformation: any;
    temperature: {
        indicator: string;
        heatSensitive: boolean;
    };
};
