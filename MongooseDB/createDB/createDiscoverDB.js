// Switch to the appropriate database
db = db.getSiblingDB("recipeSample");

// Create the 'recipes' collection
db.createCollection("discover");
discoverCollection = db.getCollection("discover");

// Clear any existing recipes
discoverCollection.deleteMany({});

// Insert sample recipes with a user_ID

discoverCollection.insertMany([
  {
    modified_flag: true,
    user_ID: "user001",
    recipe_ID: "recipe001",
    recipe_name: "Classic Pancakes",
    meal_category: ["Breakfast"], // Enum type for category
    recipe_versions: [
      {
        cooking_duration: 15, // Example cooking time
        version_number: 1, // First version
        serving_size: 1, // Number of servings
        ingredients: [
          { name: "Flour", unit: "cup" },
          { name: "Milk", unit: "cup" },
          { name: "Eggs", unit: "exeach" },
          { name: "Baking Powder", unit: "tbsp" },
          { name: "Salt", unit: "tsp" },
        ],
        directions: [
          { step: "Mix dry ingredients together." },
          { step: "Add wet ingredients and stir until smooth." },
          { step: "Pour batter onto hot griddle and cook until golden brown." },
        ],
      },
    ],
    image_url: "http://example.com/classic_pancakes.jpg",
    is_visible: true,
  },
  {
    modified_flag: true,
    user_ID: "user002",
    recipe_ID: "recipe002",
    recipe_name: "Spaghetti Bolognese",
    meal_category: ["Dinner"], // Enum type for category
    recipe_versions: [
      {
        cooking_duration: 40,
        version_number: 0,
        serving_size: 2,
        ingredients: [
          { name: "Spaghetti", unit: "g" },
          { name: "Ground Beef", unit: "lb" },
          { name: "Tomato Sauce", unit: "cup" },
          { name: "Onion", unit: "each" },
          { name: "Garlic", unit: "tsp" },
        ],
        directions: [
          { step: "Cook spaghetti according to package instructions." },
          { step: "Brown ground beef and drain excess fat." },
          { step: "Add onion and garlic, and cook until softened." },
          { step: "Stir in tomato sauce and simmer for 10 minutes." },
          { step: "Serve sauce over spaghetti." },
        ],
      },
    ],
    image_url: "http://example.com/spaghetti_bolognese.jpg",
    is_visible: true,
  },
  {
    modified_flag: true,
    user_ID: "user001",
    recipe_ID: "recipe003",
    recipe_name: "Caesar Salad",
    meal_category: ["Salad"], // Enum type for category
    recipe_versions: [
      {
        cooking_duration: 10, // Short cooking time
        version_number: 1,
        serving_size: 1,
        ingredients: [
          { name: "Romaine Lettuce", unit: "each" },
          { name: "Caesar Dressing", unit: "cup" },
          { name: "Croutons", unit: "cup" },
          { name: "Parmesan Cheese", unit: "cup" },
        ],
        directions: [
          { step: "Chop romaine lettuce and place in a large bowl." },
          { step: "Add Caesar dressing and toss to coat evenly." },
          { step: "Top with croutons and grated Parmesan cheese." },
        ],
      },
    ],
    image_url: "http://example.com/caesar_salad.jpg",
    is_visible: true,
  },
  {
    modified_flag: true,
    user_ID: "user003",
    recipe_ID: "recipe004",
    recipe_name: "Chicken Curry",
    meal_category: ["Dinner"], // Enum type for category
    recipe_versions: [
      {
        cooking_duration: 30,
        version_number: 0,
        serving_size: 2,
        ingredients: [
          { name: "Chicken Breast", unit: "lb" },
          { name: "Coconut Milk", unit: "cup" },
          { name: "Curry Powder", unit: "tbsp" },
          { name: "Onion", unit: "each" },
          { name: "Garlic", unit: "tsp" },
        ],
        directions: [
          { step: "Heat oil in a pan and cook onions until softened." },
          { step: "Add garlic and curry powder, cooking until fragrant." },
          { step: "Add chicken and cook until browned." },
          { step: "Stir in coconut milk and simmer for 20 minutes." },
        ],
      },
    ],
    image_url: "http://example.com/chicken_curry.jpg",
    is_visible: true,
  },
  {
    modified_flag: true,
    user_ID: "user002",
    recipe_ID: "recipe005",
    recipe_name: "Avocado Toast",
    meal_category: ["Breakfast"], // Enum type for category
    recipe_versions: [
      {
        cooking_duration: 10,
        version_number: 0,
        serving_size: 1,
        ingredients: [
          { name: "Bread", unit: "slice" },
          { name: "Avocado", unit: "each" },
          { name: "Salt", unit: "tsp" },
          { name: "Pepper", unit: "tsp" },
          { name: "Lemon Juice", unit: "tsp" },
        ],
        directions: [
          { step: "Toast bread slices to desired crispness." },
          { step: "Mash avocado with salt, pepper, and lemon juice." },
          { step: "Spread avocado mixture on toasted bread." },
        ],
      },
    ],
    image_url: "http://example.com/avocado_toast.jpg",
    is_visible: true,
  },
  {
    modified_flag: true,
    user_ID: "user004",
    recipe_ID: "recipe006",
    recipe_name: "Chocolate Chip Cookies",
    meal_category: ["Dessert"], // Enum type for category
    recipe_versions: [
      {
        cooking_duration: 25,
        version_number: 0,
        serving_size: 24,
        ingredients: [
          { name: "Butter", unit: "cup" },
          { name: "Sugar", unit: "cup" },
          { name: "Brown Sugar", unit: "cup" },
          { name: "Eggs", unit: "each" },
          { name: "Flour", unit: "cup" },
          { name: "Chocolate Chips", unit: "cup" },
        ],
        directions: [
          { step: "Preheat oven to 350°F (175°C)." },
          { step: "Cream together butter and sugars." },
          { step: "Beat in eggs one at a time." },
          { step: "Mix in flour, then fold in chocolate chips." },
          {
            step: "Drop dough by spoonfuls onto baking sheet and bake for 10-12 minutes.",
          },
        ],
      },
    ],
    image_url: "http://example.com/chocolate_chip_cookies.jpg",
    is_visible: true,
  },
  {
    modified_flag: true,
    user_ID: "user003",
    recipe_ID: "recipe007",
    recipe_name: "Vegetable Stir Fry",
    meal_category: ["Lunch"], // Enum type for category
    recipe_versions: [
      {
        cooking_duration: 15,
        version_number: 0,
        serving_size: 2,
        ingredients: [
          { name: "Broccoli", unit: "cup" },
          { name: "Carrot", unit: "each" },
          { name: "Bell Pepper", unit: "each" },
          { name: "Soy Sauce", unit: "tbsp" },
          { name: "Olive Oil", unit: "tbsp" },
        ],
        directions: [
          { step: "Heat olive oil in a wok over medium heat." },
          { step: "Add vegetables and stir fry until tender-crisp." },
          { step: "Add soy sauce and stir well before serving." },
        ],
      },
    ],
    image_url: "http://example.com/vegetable_stir_fry.jpg",
    is_visible: true,
  },
  {
    modified_flag: true,
    user_ID: "user002",
    recipe_ID: "recipe008",
    recipe_name: "Banana Smoothie",
    meal_category: ["Beverage"], // Enum type for category
    recipe_versions: [
      {
        cooking_duration: 5,
        version_number: 0,
        serving_size: 1,
        ingredients: [
          { name: "Banana", unit: "each" },
          { name: "Milk", unit: "cup" },
          { name: "Honey", unit: "tbsp" },
          { name: "Ice Cubes", unit: "each" },
        ],
        directions: [
          { step: "Combine all ingredients in a blender." },
          { step: "Blend until smooth and creamy." },
        ],
      },
    ],
    image_url: "http://example.com/banana_smoothie.jpg",
    is_visible: true,
  },
]);
