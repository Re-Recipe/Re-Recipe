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
    meal_category: ["Breakfast"],
    recipe_versions: [
      {
        cooking_duration: 15,
        version_number: 1,
        serving_size: 1,
        ingredients: [
          { name: "Flour", quantity: 1, unit: "cup" },
          { name: "Milk", quantity: 1, unit: "cup" },
          { name: "Eggs", quantity: 2, unit: "each" },
          { name: "Baking Powder", quantity: 1, unit: "tbsp" },
          { name: "Salt", quantity: 0.5, unit: "tsp" },
        ],
        directions: [
          { step: "Mix dry ingredients together." },
          { step: "Add wet ingredients and stir until smooth." },
          { step: "Pour batter onto hot griddle and cook until golden brown." },
        ],
      },
    ],
    image_url: "https://www.pamperedchef.com/iceberg/com/recipe/1307769-lg.jpg",
    image_url: "https://www.pamperedchef.com/iceberg/com/recipe/1307769-lg.jpg",
    is_visible: true,
  },
  {
    modified_flag: true,
    user_ID: "user002",
    recipe_ID: "recipe002",
    recipe_name: "Spaghetti Bolognese",
    meal_category: ["Dinner"],
    recipe_versions: [
      {
        cooking_duration: 40,
        version_number: 0,
        serving_size: 2,
        ingredients: [
          { name: "Spaghetti", quantity: 200, unit: "g" },
          { name: "Ground Beef", quantity: 0.5, unit: "lb" },
          { name: "Tomato Sauce", quantity: 1.5, unit: "cup" },
          { name: "Onion", quantity: 1, unit: "each" },
          { name: "Garlic", quantity: 1, unit: "clove" },
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
    image_url: "https://images.ctfassets.net/uexfe9h31g3m/6QtnhruEFi8qgEyYAICkyS/ab01e9b1da656f35dd1a721c810162a0/Spaghetti_bolognese_4x3_V2_LOW_RES.jpg",
    is_visible: true,
  },
  {
    modified_flag: true,
    user_ID: "user001",
    recipe_ID: "recipe003",
    recipe_name: "Caesar Salad",
    meal_category: ["Salad"],
    recipe_versions: [
      {
        cooking_duration: 10,
        version_number: 1,
        serving_size: 1,
        ingredients: [
          { name: "Romaine Lettuce", quantity: 1, unit: "head" },
          { name: "Caesar Dressing", quantity: 0.25, unit: "cup" },
          { name: "Croutons", quantity: 0.5, unit: "cup" },
          { name: "Parmesan Cheese", quantity: 0.25, unit: "cup" },
        ],
        directions: [
          { step: "Chop romaine lettuce and place in a large bowl." },
          { step: "Add Caesar dressing and toss to coat evenly." },
          { step: "Top with croutons and grated Parmesan cheese." },
        ],
      },
    ],
    image_url: "https://www.seriouseats.com/thmb/Fi_FEyVa3_-_uzfXh6OdLrzal2M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/the-best-caesar-salad-recipe-06-40e70f549ba2489db09355abd62f79a9.jpg",
    is_visible: true,
  },
  {
    modified_flag: true,
    user_ID: "user003",
    recipe_ID: "recipe004",
    recipe_name: "Chicken Curry",
    meal_category: ["Dinner"],
    recipe_versions: [
      {
        cooking_duration: 30,
        version_number: 0,
        serving_size: 2,
        ingredients: [
          { name: "Chicken Breast", quantity: 1, unit: "lb" },
          { name: "Coconut Milk", quantity: 1, unit: "cup" },
          { name: "Curry Powder", quantity: 2, unit: "tbsp" },
          { name: "Onion", quantity: 1, unit: "each" },
          { name: "Garlic", quantity: 2, unit: "cloves" },
        ],
        directions: [
          { step: "Heat oil in a pan and cook onions until softened." },
          { step: "Add garlic and curry powder, cooking until fragrant." },
          { step: "Add chicken and cook until browned." },
          { step: "Stir in coconut milk and simmer for 20 minutes." },
        ],
      },
    ],
    image_url: "https://www.kitchensanctuary.com/wp-content/uploads/2020/08/Easy-Chicken-Curry-square-FS-117.jpg",
    is_visible: true,
  },
  {
    modified_flag: true,
    user_ID: "user002",
    recipe_ID: "recipe005",
    recipe_name: "Avocado Toast",
    meal_category: ["Breakfast"],
    recipe_versions: [
      {
        cooking_duration: 10,
        version_number: 0,
        serving_size: 1,
        ingredients: [
          { name: "Bread", quantity: 1, unit: "slice" },
          { name: "Avocado", quantity: 1, unit: "each" },
          { name: "Salt", quantity: 0.25, unit: "tsp" },
          { name: "Pepper", quantity: 0.25, unit: "tsp" },
          { name: "Lemon Juice", quantity: 0.5, unit: "tsp" },
        ],
        directions: [
          { step: "Toast bread slices to desired crispness." },
          { step: "Mash avocado with salt, pepper, and lemon juice." },
          { step: "Spread avocado mixture on toasted bread." },
        ],
      },
    ],
    image_url: "https://bonabbetit.com/wp-content/uploads/2022/07/Avocado-toast-with-farmers-cheese-and-bacon-bits.jpg",
    is_visible: true,
  },
  {
    modified_flag: true,
    user_ID: "user004",
    recipe_ID: "recipe006",
    recipe_name: "Chocolate Chip Cookies",
    meal_category: ["Dessert"],
    recipe_versions: [
      {
        cooking_duration: 25,
        version_number: 0,
        serving_size: 24,
        ingredients: [
          { name: "Butter", quantity: 1, unit: "cup" },
          { name: "Sugar", quantity: 0.75, unit: "cup" },
          { name: "Brown Sugar", quantity: 0.75, unit: "cup" },
          { name: "Eggs", quantity: 2, unit: "each" },
          { name: "Flour", quantity: 2.25, unit: "cup" },
          { name: "Chocolate Chips", quantity: 2, unit: "cup" },
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
    image_url: "https://sallysbakingaddiction.com/wp-content/uploads/2013/05/classic-chocolate-chip-cookies.jpg",
    is_visible: true,
  },
  {
    modified_flag: true,
    user_ID: "user003",
    recipe_ID: "recipe007",
    recipe_name: "Vegetable Stir Fry",
    meal_category: ["Lunch"],
    recipe_versions: [
      {
        cooking_duration: 15,
        version_number: 0,
        serving_size: 2,
        ingredients: [
          { name: "Broccoli", quantity: 1, unit: "cup" },
          { name: "Carrot", quantity: 1, unit: "each" },
          { name: "Bell Pepper", quantity: 1, unit: "each" },
          { name: "Soy Sauce", quantity: 2, unit: "tbsp" },
          { name: "Olive Oil", quantity: 1, unit: "tbsp" },
        ],
        directions: [
          { step: "Heat olive oil in a wok over medium heat." },
          { step: "Add vegetables and stir fry until tender-crisp." },
          { step: "Add soy sauce and stir well before serving." },
        ],
      },
    ],
    image_url: "https://www.allrecipes.com/thmb/MF7yU1MBbRlaT40ogVr-1PgggKc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/222658-frozen-vegetable-stir-fry-4x3-1382-583b53fa0bcd4247920611ad431c14cb.jpg",
    is_visible: true,
  },
  {
    modified_flag: true,
    user_ID: "user002",
    recipe_ID: "recipe008",
    recipe_name: "Banana Smoothie",
    meal_category: ["Beverage"],
    recipe_versions: [
      {
        cooking_duration: 5,
        version_number: 0,
        serving_size: 1,
        ingredients: [
          { name: "Banana", quantity: 1, unit: "each" },
          { name: "Milk", quantity: 1, unit: "cup" },
          { name: "Honey", quantity: 1, unit: "tbsp" },
          { name: "Ice Cubes", quantity: 3, unit: "each" },
        ],
        directions: [
          { step: "Combine all ingredients in a blender." },
          { step: "Blend until smooth and creamy." },
        ],
      },
    ],
    image_url: "https://www.dessertfortwo.com/wp-content/uploads/2023/02/Banana-Milkshake-8-735x1103.jpg",
    is_visible: true,
  },
]);
