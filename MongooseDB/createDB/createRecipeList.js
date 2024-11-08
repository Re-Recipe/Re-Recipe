// Select database
db = db.getSiblingDB('recipeSample');

// Select collection
const recipesCollection = db.getCollection("recipeList");

// Clear the collection (for testing)
recipesCollection.deleteMany({});

// Insert sample recipes using `insertMany`
recipesCollection.insertMany([
    {
        recipeID: "recipe001",
        userID: "user1",
        recipeName: "Classic Pancakes",
        category: ["Breakfast"],
        cookingDuration: 20,
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
        imageUrl: "http://example.com/classic_pancakes.jpg",
        isVisible: true
    },
    {
        recipeID: "recipe002",
        userID: "user2",
        recipeName: "Spaghetti Bolognese",
        category: ["Dinner"],
        cookingDuration: 40,
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
        imageUrl: "http://example.com/spaghetti_bolognese.jpg",
        isVisible: true
    },
    {
        recipeID: "recipe003",
        userID: "user3",
        recipeName: "Caesar Salad",
        category: ["Salad"],
        cookingDuration: 15,
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
        imageUrl: "http://example.com/caesar_salad.jpg",
        isVisible: true
    },
    {
        recipeID: "recipe004",
        userID: "user4",
        recipeName: "Chicken Curry",
        category: ["Dinner"],
        cookingDuration: 30,
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
        imageUrl: "http://example.com/chicken_curry.jpg",
        isVisible: true
    },
    {
        recipeID: "recipe005",
        userID: "user5",
        recipeName: "Avocado Toast",
        category: ["Breakfast"],
        cookingDuration: 10,
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
        imageUrl: "http://example.com/avocado_toast.jpg",
        isVisible: true
    },
    {
        recipeID: "recipe006",
        userID: "user6",
        recipeName: "Chocolate Chip Cookies",
        category: ["Dessert"],
        cookingDuration: 25,
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
        imageUrl: "http://example.com/chocolate_chip_cookies.jpg",
        isVisible: true
    },
    {
        recipeID: "recipe007",
        userID: "user7",
        recipeName: "Vegetable Stir Fry",
        category: ["Lunch"],
        cookingDuration: 15,
        ingredients: [
            { name: "Broccoli", quantity: 1, unit: "cup" },
            { name: "Carrot", quantity: 1, unit: "each" },
            { name: "Bell Pepper", quantity: 1, unit: "each" },
            { name: "Soy Sauce", quantity: 2, unit: "tbsp" },
            { name: "Olive Oil", quantity: 1, unit: "tbsp" }
        ],
        directions: [
            { step: "Heat olive oil in a wok over medium heat." },
            { step: "Add vegetables and stir fry until tender-crisp." },
            { step: "Add soy sauce and stir well before serving." }
        ],
        imageUrl: "http://example.com/vegetable_stir_fry.jpg",
        isVisible: true
    },
    {
        recipeID: "recipe008",
        userID: "user8",
        recipeName: "Banana Smoothie",
        category: ["Beverage"],
        cookingDuration: 5,
        ingredients: [
            { name: "Banana", quantity: 1, unit: "each" },
            { name: "Milk", quantity: 1, unit: "cup" },
            { name: "Honey", quantity: 1, unit: "tbsp" },
            { name: "Ice Cubes", quantity: 5, unit: "each" }
        ],
        directions: [
            { step: "Combine all ingredients in a blender." },
            { step: "Blend until smooth and creamy." }
        ],
        imageUrl: "http://example.com/banana_smoothie.jpg",
        isVisible: true
    }
]);
