import type { Session, User } from "next-auth"


export type RecipeSearchParams = {
    diet: string | null
    mealType: string | null
    intolerances: string[]
    cuisine: string | null
    maxReadyTime: number | null
    nutrientLimits: NutrientLimits | null
}

export type NutrientLimits = {
    [key: string]: number
}

export type RecipeSearchParamStrings = {
    query: string | undefined,
    mealType: string | undefined,
    maxReadyTime: Number | undefined,
    onlyFavorites: string | undefined,
    intolerances: string | undefined,
    diet: string | undefined,
    cuisine: string | undefined,
    nutrientLimits: string | undefined
}
export type Recipe = {
    vegetarian: boolean,
    vegan: boolean,
    glutenFree: boolean,
    dairyFree:boolean,
    veryHealthy: boolean,
    cheap: boolean,
    veryPopular: boolean,
    sustainable: boolean,
    lowFodmap: boolean,
    weightWatcherSmartPoints: Number,
    gaps: string,
    preparationMinutes: Number,
    cookingMinutes: Number,
    aggregateLikes: Number,
    healthScore: Number,
    creditsText: string,
    license: string,
    nutrition: any,
    sourceName: string,
    pricePerServing: Number,
    extendedIngredients: Ingredient[],
    id: number,
    title: string,
    readyInMinutes: Number,
    servings: Number,
    sourceUrl: string,
    image: string,
    imageType: string,
    summary: string,
    cuisines: [],
    dishTypes: [],
    diets: [],
    occasions: [],
    instructions: string
    analyzedInstructions: [{
        name: string,
        steps: Step[]
    }],
    originalId: Number | null,
    spoonacularScore: Number,
    spoonacularSourceUrl: string
}

export type Step = {
    number: Number,
    step: string
}

export type Ingredient = {
    id: number,
    aisle: string,
    image: string,
    consistency: string,
    name: string,
    nameClean: string,
    original: string,
    originalName: string,
    amount: number,
    unit: string,
    meta: [],
    measures: [Object]
}

export type Nutrition = {
    nutrients: []
    properties: []
    flavonoids: []
    ingredients: NutritionIngredient[]
}

export type NutritionIngredient = {
    id: number
    name: string
    amount: number
    unit: string
    nutrients: []
}

export type NormalizedUnitType = "g" | "mL" | "ct" | "unknown";

export type Cart = {
    count: number,
    recipes: CartRecipe[]
    ingredients: DynamicIngredients
}

export type CartRecipe = {
    name: string
    id: number
    guid: string
    imageURL: string
    instructions: string[]
}

export type DynamicIngredients = {
    [ingredientName: string]: CartIngredient
}

export type CartIngredient = {
    name: string
    included: boolean
    override: boolean
    overrideValue: string | null
    recipeIngredients: RecipeIngredient[]
}

export type RecipeIngredient = {
    amount: number
    unit: string
    normalizedAmount: number
    unitType: string
    recipeGUID: string
}

export type MySession = Session & {
    user: MyUser
    accessToken: string | undefined
    refreshToken: string | undefined
    expiresAt: number
}

export type MyUser = User & {
    id: number
}

export type MealType = "main course" | "side dish" | "dessert" | "appetizer" | "salad" | "bread" | "breakfast" | "soup" | "beverage" | "sauce" | "marinade" | "fingerfood" | "snack" | "drink";

export type KrogerProfile = {
    data: {
        id: string
        meta: any
    }
}

export type MappedIngredients = {
    [ingredientName: string]: MappedIngredient
}

export type MappedIngredient = {
    cartIngredient: CartIngredient
    productOptions: KrogerProductInfo[]
}

export type KrogerLocation = {
    locationId: string
    storeNumber: string
    chain: string
    geolocation: {
        latitude: number
        longitude: number
    }
    address: {
        addressLine1: string
        city: string
        state: string
        zipCode: string
    }
    name: string
}

export type KrogerProductInfo = {
    productId: string
    upc: string
    brand: string
    countryOrigin: string
    aisleLocations: [{
        bayNumber: string
        description: string
        number: string
        numberOfFacings: string
        sequenceNumber: string
        side: string
        shelfNumber: string
        shelfPositionInBay: string
    }]
    categories: string[]
    description: string
    images: [{
        id?: string
        perspective: string
        featured?: boolean
        sizes: [
            {
                id?: string
                size: "xlarge" | "large" | "medium" | "small"
                url: string
            }
        ]
    }]
    items: [
        {
            itemId: string
            favorite: boolean
            fulfillment: {
                curbside: boolean
                delivery: boolean
                instore: boolean
                shiptohome: boolean
            },
            price: {
                regular: number
                promo: number
                regularPerUnitEstimate: number
                promoPerUnitEstimate: number
            },
            nationalPrice: {
                regular: number
                promo: number
                regularPerUnitEstimate: number
                promoPerUnitEstimate: number
            },
            soldby: string
            size: string
        }

    ]
    itemInformation: any
    temperature: {
        indicator: string
        heatSensitive: boolean
    }

}