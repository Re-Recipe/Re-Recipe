// Switch to the appropriate database
db = db.getSiblingDB('recipeSample');

// Create the 'recipes' collection (only if it doesn't already exist)
db.createCollection('recipes');
const recipesCollection = db.getCollection("recipes");

// Clear the collection
recipesCollection.deleteMany({});

// Insert sample recipes using `insertMany`
recipesCollection.insertMany([
    {
        recipe_ID: "recipe001",
        user_ID: "user123",
        recipe_name: "Classic Pancakes",
        category: ["breakfast"],
        ingredients: [
            { name: "Flour", quantity: 2, unit: "cup" },
            { name: "Milk", quantity: 1, unit: "cup" },
            { name: "Eggs", quantity: 2, unit: "each" },
            { name: "Baking Powder", quantity: 1, unit: "tbsp" },
            { name: "Salt", quantity: 0.5, unit: "tsp" }
        ],
        directions: [
            { step: "Mix dry ingredients together." },
            { step: "Add wet ingredients and stir until smooth." },
            { step: "Pour batter onto hot griddle and cook until golden brown." }
        ],
        image_URL: "http://example.com/classic_pancakes.jpg"
    },
    {
        recipe_ID: "recipe002",
        user_ID: "user456",
        recipe_name: "Spaghetti Bolognese",
        category: ["dinner"],
        ingredients: [
            { name: "Spaghetti", quantity: 500, unit: "g" },
            { name: "Ground Beef", quantity: 1, unit: "lb" },
            { name: "Tomato Sauce", quantity: 1, unit: "cup" },
            { name: "Onion", quantity: 1, unit: "each" },
            { name: "Garlic", quantity: 2, unit: "tsp" }
        ],
        directions: [
            { step: "Cook spaghetti according to package instructions." },
            { step: "Brown ground beef and drain excess fat." },
            { step: "Add onion and garlic, and cook until softened." },
            { step: "Stir in tomato sauce and simmer for 10 minutes." },
            { step: "Serve sauce over spaghetti." }
        ],
        image_URL: "http://example.com/spaghetti_bolognese.jpg"
    },
    {
        recipe_ID: "recipe003",
        user_ID: "user789",
        recipe_name: "Caesar Salad",
        category: ["salad"],
        ingredients: [
            { name: "Romaine Lettuce", quantity: 1, unit: "each" },
            { name: "Caesar Dressing", quantity: 0.5, unit: "cup" },
            { name: "Croutons", quantity: 1, unit: "cup" },
            { name: "Parmesan Cheese", quantity: 0.25, unit: "cup" }
        ],
        directions: [
            { step: "Chop romaine lettuce and place in a large bowl." },
            { step: "Add Caesar dressing and toss to coat evenly." },
            { step: "Top with croutons and grated Parmesan cheese." }
        ],
        image_URL: "http://example.com/caesar_salad.jpg"
    },
    {
        recipe_ID: "recipe004",
        user_ID: "user321",
        recipe_name: "Chicken Curry",
        category: ["dinner"],
        ingredients: [
            { name: "Chicken Breast", quantity: 1, unit: "lb" },
            { name: "Coconut Milk", quantity: 1, unit: "cup" },
            { name: "Curry Powder", quantity: 2, unit: "tbsp" },
            { name: "Onion", quantity: 1, unit: "each" },
            { name: "Garlic", quantity: 2, unit: "tsp" }
        ],
        directions: [
            { step: "Heat oil in a pan and cook onions until softened." },
            { step: "Add garlic and curry powder, cooking until fragrant." },
            { step: "Add chicken and cook until browned." },
            { step: "Stir in coconut milk and simmer for 20 minutes." }
        ],
        image_URL: "http://example.com/chicken_curry.jpg"
    },
    {
        recipe_ID: "recipe005",
        user_ID: "user654",
        recipe_name: "Avocado Toast",
        category: ["breakfast"],
        ingredients: [
            { name: "Bread", quantity: 2, unit: "slice" },
            { name: "Avocado", quantity: 1, unit: "each" },
            { name: "Salt", quantity: 0.5, unit: "tsp" },
            { name: "Pepper", quantity: 0.25, unit: "tsp" },
            { name: "Lemon Juice", quantity: 1, unit: "tsp" }
        ],
        directions: [
            { step: "Toast bread slices to desired crispness." },
            { step: "Mash avocado with salt, pepper, and lemon juice." },
            { step: "Spread avocado mixture on toasted bread." }
        ],
        image_URL: "http://example.com/avocado_toast.jpg"
    },
    {
        recipe_ID: "recipe006",
        user_ID: "user987",
        recipe_name: "Chocolate Chip Cookies",
        category: ["dessert"],
        ingredients: [
            { name: "Butter", quantity: 1, unit: "cup" },
            { name: "Sugar", quantity: 0.75, unit: "cup" },
            { name: "Brown Sugar", quantity: 0.75, unit: "cup" },
            { name: "Eggs", quantity: 2, unit: "each" },
            { name: "Flour", quantity: 2.25, unit: "cup" },
            { name: "Chocolate Chips", quantity: 2, unit: "cup" }
        ],
        directions: [
            { step: "Preheat oven to 350°F (175°C)." },
            { step: "Cream together butter and sugars." },
            { step: "Beat in eggs one at a time." },
            { step: "Mix in flour, then fold in chocolate chips." },
            { step: "Drop dough by spoonfuls onto baking sheet and bake for 10-12 minutes." }
        ],
        image_URL: "http://example.com/chocolate_chip_cookies.jpg"
    }
]);
