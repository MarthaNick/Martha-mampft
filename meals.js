const meatMeals = [
    // Mediterranean/Italian
    {
        title: "Osso Buco alla Milanese with saffron risotto",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=200&fit=crop",
        type: "meat",
        constraints: ["oven", "grain", "dairy"],
        region: "mediterranean",
        ingredients: {
            "Veal shanks": "1200g",
            "Arborio rice": "320g",
            "White wine": "400ml",
            "Beef broth": "800ml",
            "Saffron": "1g",
            "Parmesan cheese": "100g",
            "Carrots": "200g",
            "Celery": "200g",
            "Onions": "2 pieces",
            "Butter": "80g"
        }
    },
    
    // Eastern European/Slavic
    {
        title: "Polish Pierogi with kielbasa and sauerkraut",
        image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=200&fit=crop",
        type: "meat",
        constraints: ["pasta", "seasonal"],
        region: "eastern_european",
        ingredients: {
            "Kielbasa sausage": "600g",
            "Pierogi (frozen)": "800g",
            "Sauerkraut": "400g",
            "Onions": "3 pieces",
            "Sour cream": "200ml",
            "Butter": "100g",
            "Bacon": "150g",
            "Fresh dill": "20g"
        }
    },

    // Scandinavian/Benelux
    {
        title: "Swedish Meatballs with lingonberry sauce and potatoes",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop",
        type: "meat",
        constraints: ["dairy"],
        region: "scandinavian",
        ingredients: {
            "Ground beef": "400g",
            "Ground pork": "400g",
            "Potatoes": "800g",
            "Heavy cream": "300ml",
            "Lingonberry jam": "100g",
            "Breadcrumbs": "100g",
            "Eggs": "2 pieces",
            "Butter": "80g",
            "Beef broth": "400ml"
        }
    },

    // Germanic/Austrian/Swiss
    {
        title: "Wiener Schnitzel with spaetzle and red cabbage",
        image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=200&fit=crop",
        type: "meat",
        constraints: ["pasta", "seasonal"],
        region: "germanic",
        ingredients: {
            "Veal cutlets": "800g",
            "Spaetzle": "400g",
            "Red cabbage": "600g",
            "Breadcrumbs": "200g",
            "Eggs": "4 pieces",
            "Flour": "150g",
            "Butter": "120g",
            "Apples": "2 pieces",
            "Red wine vinegar": "60ml"
        }
    },

    // North American/English/Australian
    {
        title: "BBQ Brisket with mac and cheese and coleslaw",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=200&fit=crop",
        type: "meat",
        constraints: ["pasta", "dairy", "salad"],
        region: "north_american",
        ingredients: {
            "Beef brisket": "1200g",
            "Macaroni": "400g",
            "Cheddar cheese": "400g",
            "Cabbage": "500g",
            "Carrots": "200g",
            "BBQ sauce": "200ml",
            "Heavy cream": "300ml",
            "Mayonnaise": "100ml",
            "Brown sugar": "60g"
        }
    },

    // Middle Eastern/Arabic
    {
        title: "Moroccan Lamb Tagine with couscous and preserved lemons",
        image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=200&fit=crop",
        type: "meat",
        constraints: ["oven", "grain", "seasonal"],
        region: "middle_eastern",
        ingredients: {
            "Lamb shoulder": "1000g",
            "Couscous": "320g",
            "Dried apricots": "150g",
            "Preserved lemons": "100g",
            "Chickpeas": "400g",
            "Moroccan spice blend": "30g",
            "Onions": "2 pieces",
            "Vegetable broth": "600ml",
            "Fresh cilantro": "25g"
        }
    },

    // Latin American
    {
        title: "Brazilian Feijoada with rice and collard greens",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop",
        type: "meat",
        constraints: ["beans_lentils", "grain", "green_vegetable"],
        region: "latin_american",
        ingredients: {
            "Pork shoulder": "600g",
            "Beef short ribs": "400g",
            "Black beans": "800g",
            "White rice": "320g",
            "Collard greens": "500g",
            "Chorizo": "200g",
            "Onions": "3 pieces",
            "Garlic": "6 cloves",
            "Orange zest": "30g"
        }
    },

    // South East Asian/Indian
    {
        title: "Indian Butter Chicken with basmati rice and naan",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop",
        type: "meat",
        constraints: ["grain", "dairy"],
        region: "south_east_asian",
        ingredients: {
            "Chicken thighs": "1000g",
            "Basmati rice": "320g",
            "Naan bread": "8 pieces",
            "Heavy cream": "300ml",
            "Tomato sauce": "400ml",
            "Garam masala": "20g",
            "Butter": "100g",
            "Ginger": "30g",
            "Garlic": "6 cloves"
        }
    },

    // Chinese/Japanese/Korean
    {
        title: "Korean Bulgogi with kimchi fried rice",
        image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=200&fit=crop",
        type: "meat",
        constraints: ["grain", "seasonal"],
        region: "east_asian",
        ingredients: {
            "Beef ribeye": "800g",
            "Short grain rice": "320g",
            "Kimchi": "300g",
            "Soy sauce": "100ml",
            "Sesame oil": "60ml",
            "Korean pear": "1 piece",
            "Garlic": "6 cloves",
            "Ginger": "20g",
            "Scallions": "100g"
        }
    },

    // Central/Sub-Saharan African
    {
        title: "Ethiopian Doro Wat with injera bread",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop",
        type: "meat",
        constraints: ["grain", "eggs"],
        region: "african",
        ingredients: {
            "Chicken pieces": "1200g",
            "Injera bread": "8 pieces",
            "Hard-boiled eggs": "8 pieces",
            "Berbere spice": "40g",
            "Red onions": "4 pieces",
            "Tomato paste": "100g",
            "Chicken broth": "500ml",
            "Ethiopian butter": "100g",
            "Garlic": "8 cloves"
        }
    },

    // Caribbean
    {
        title: "Jamaican Jerk Chicken with rice and peas",
        image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=200&fit=crop",
        type: "meat",
        constraints: ["grain", "beans_lentils"],
        region: "caribbean",
        ingredients: {
            "Chicken pieces": "1200g",
            "Jasmine rice": "320g",
            "Kidney beans": "400g",
            "Coconut milk": "400ml",
            "Jerk seasoning": "50g",
            "Scotch bonnet pepper": "1 piece",
            "Thyme": "20g",
            "Allspice": "10g",
            "Lime": "3 pieces"
        }
    },

    // Additional Mediterranean/Italian
    {
        title: "Saltimbocca alla Romana with roasted vegetables",
        image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=200&fit=crop",
        type: "meat",
        constraints: ["seasonal", "green_vegetable"],
        region: "mediterranean",
        ingredients: {
            "Veal cutlets": "800g",
            "Prosciutto": "200g",
            "Fresh sage": "30g",
            "Mixed vegetables": "600g",
            "White wine": "300ml",
            "Olive oil": "80ml",
            "Butter": "60g",
            "Garlic": "4 cloves"
        }
    },

    // Additional Scandinavian
    {
        title: "Norwegian Salmon with dill potatoes and cucumber salad",
        image: "https://images.unsplash.com/photo-1485704686097-ed47f7263ca4?w=400&h=200&fit=crop",
        type: "meat",
        constraints: ["seasonal", "salad", "green_vegetable"],
        region: "scandinavian",
        ingredients: {
            "Salmon fillets": "800g",
            "New potatoes": "800g",
            "Cucumber": "3 pieces",
            "Fresh dill": "40g",
            "Sour cream": "200ml",
            "Butter": "80g",
            "White vinegar": "60ml",
            "Sugar": "30g"
        }
    },

    // Additional Germanic
    {
        title: "Sauerbraten with red cabbage and dumplings",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=200&fit=crop",
        type: "meat",
        constraints: ["oven", "seasonal", "grain"],
        region: "germanic",
        ingredients: {
            "Beef roast": "1200g",
            "Red cabbage": "600g",
            "Bread dumplings": "8 pieces",
            "Red wine vinegar": "300ml",
            "Gingersnap cookies": "100g",
            "Onions": "3 pieces",
            "Bay leaves": "4 pieces",
            "Juniper berries": "10g"
        }
    },

    // Additional North American
    {
        title: "New England Clam Chowder with sourdough bread",
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=200&fit=crop",
        type: "meat",
        constraints: ["dairy", "grain"],
        region: "north_american",
        ingredients: {
            "Fresh clams": "1000g",
            "Sourdough bread": "1 loaf",
            "Potatoes": "600g",
            "Heavy cream": "400ml",
            "Bacon": "200g",
            "Onions": "2 pieces",
            "Celery": "200g",
            "Bay leaves": "3 pieces",
            "Butter": "80g"
        }
    },

    // Additional East Asian
    {
        title: "Japanese Teriyaki Salmon with miso soup and rice",
        image: "https://images.unsplash.com/photo-1485704686097-ed47f7263ca4?w=400&h=200&fit=crop",
        type: "meat",
        constraints: ["grain", "green_vegetable"],
        region: "east_asian",
        ingredients: {
            "Salmon fillets": "800g",
            "Short grain rice": "320g",
            "Miso paste": "60g",
            "Wakame seaweed": "20g",
            "Teriyaki sauce": "150ml",
            "Tofu": "200g",
            "Scallions": "100g",
            "Sesame seeds": "30g"
        }
    }
];

const vegetarianMeals = [
    // Mediterranean/Italian
    {
        title: "Eggplant Parmigiana with arugula salad",
        image: "https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400&h=200&fit=crop",
        type: "vegetarian",
        constraints: ["oven", "dairy", "green_vegetable"],
        region: "mediterranean",
        ingredients: {
            "Eggplants": "1000g",
            "Mozzarella cheese": "400g",
            "Parmesan cheese": "200g",
            "Tomato sauce": "600ml",
            "Arugula": "200g",
            "Basil": "30g",
            "Olive oil": "100ml",
            "Breadcrumbs": "150g"
        }
    },

    // Eastern European/Slavic
    {
        title: "Ukrainian Borscht with sour cream and rye bread",
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=200&fit=crop",
        type: "vegetarian",
        constraints: ["seasonal", "dairy", "grain"],
        region: "eastern_european",
        ingredients: {
            "Fresh beets": "800g",
            "Cabbage": "400g",
            "Potatoes": "400g",
            "Carrots": "200g",
            "Sour cream": "300ml",
            "Rye bread": "8 slices",
            "Vegetable broth": "1200ml",
            "Fresh dill": "30g",
            "Garlic": "4 cloves"
        }
    },

    // Scandinavian/Benelux
    {
        title: "Danish Smørrebrød with avocado and cucumber",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop",
        type: "vegetarian",
        constraints: ["grain", "dairy", "salad"],
        region: "scandinavian",
        ingredients: {
            "Rye bread": "8 slices",
            "Cream cheese": "300g",
            "Avocados": "4 pieces",
            "Cucumber": "3 pieces",
            "Radishes": "200g",
            "Fresh herbs": "40g",
            "Capers": "50g",
            "Lemon": "2 pieces"
        }
    },

    // Germanic/Austrian/Swiss
    {
        title: "Swiss Rösti with fried eggs and sauerkraut",
        image: "https://images.unsplash.com/photo-1571197192738-e735c3dd9659?w=400&h=200&fit=crop",
        type: "vegetarian",
        constraints: ["eggs", "seasonal"],
        region: "germanic",
        ingredients: {
            "Potatoes": "1000g",
            "Eggs": "8 pieces",
            "Sauerkraut": "400g",
            "Butter": "120g",
            "Gruyère cheese": "200g",
            "Onions": "2 pieces",
            "Fresh parsley": "25g",
            "Paprika": "10g"
        }
    },

    // North American/English/Australian
    {
        title: "American Pancakes with maple syrup and berries",
        image: "https://images.unsplash.com/photo-1571197192738-e735c3dd9659?w=400&h=200&fit=crop",
        type: "vegetarian",
        constraints: ["grain", "dairy", "eggs"],
        region: "north_american",
        ingredients: {
            "Flour": "400g",
            "Eggs": "6 pieces",
            "Milk": "500ml",
            "Maple syrup": "300ml",
            "Mixed berries": "400g",
            "Butter": "150g",
            "Baking powder": "20g",
            "Vanilla extract": "15ml",
            "Sugar": "60g"
        }
    },

    // Middle Eastern/Arabic
    {
        title: "Lebanese Fattoush salad with pita bread",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop",
        type: "vegetarian",
        constraints: ["salad", "grain", "green_vegetable"],
        region: "middle_eastern",
        ingredients: {
            "Mixed greens": "300g",
            "Pita bread": "6 pieces",
            "Tomatoes": "400g",
            "Cucumber": "3 pieces",
            "Red onion": "1 piece",
            "Sumac": "20g",
            "Olive oil": "100ml",
            "Lemon": "3 pieces",
            "Fresh mint": "30g",
            "Parsley": "50g"
        }
    },

    // Latin American
    {
        title: "Mexican Chiles Rellenos with black beans and rice",
        image: "https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400&h=200&fit=crop",
        type: "vegetarian",
        constraints: ["eggs", "dairy", "beans_lentils", "grain"],
        region: "latin_american",
        ingredients: {
            "Poblano peppers": "8 pieces",
            "Monterey Jack cheese": "400g",
            "Black beans": "600g",
            "White rice": "320g",
            "Eggs": "8 pieces",
            "Flour": "200g",
            "Tomato salsa": "300ml",
            "Cumin": "15g",
            "Vegetable oil": "200ml"
        }
    },

    // South East Asian/Indian
    {
        title: "Indian Dal Makhani with basmati rice and naan",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop",
        type: "vegetarian",
        constraints: ["beans_lentils", "grain", "dairy"],
        region: "south_east_asian",
        ingredients: {
            "Black lentils": "400g",
            "Basmati rice": "320g",
            "Naan bread": "8 pieces",
            "Heavy cream": "300ml",
            "Tomatoes": "400g",
            "Garam masala": "20g",
            "Ginger": "30g",
            "Garlic": "6 cloves",
            "Butter": "100g"
        }
    },

    // Chinese/Japanese/Korean
    {
        title: "Japanese Vegetable Ramen with miso broth",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=200&fit=crop",
        type: "vegetarian",
        constraints: ["pasta", "green_vegetable", "eggs"],
        region: "east_asian",
        ingredients: {
            "Ramen noodles": "400g",
            "Miso paste": "80g",
            "Shiitake mushrooms": "300g",
            "Bok choy": "400g",
            "Soft-boiled eggs": "8 pieces",
            "Scallions": "100g",
            "Sesame oil": "60ml",
            "Nori seaweed": "20g",
            "Vegetable broth": "1200ml"
        }
    },

    // Central/Sub-Saharan African
    {
        title: "Moroccan Vegetable Tagine with couscous",
        image: "https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400&h=200&fit=crop",
        type: "vegetarian",
        constraints: ["grain", "seasonal", "beans_lentils"],
        region: "african",
        ingredients: {
            "Mixed vegetables": "800g",
            "Couscous": "320g",
            "Chickpeas": "600g",
            "Dried fruits": "200g",
            "Moroccan spices": "30g",
            "Vegetable broth": "800ml",
            "Olive oil": "80ml",
            "Fresh cilantro": "30g",
            "Preserved lemons": "60g"
        }
    },

    // Caribbean
    {
        title: "Jamaican Callaloo with rice and beans",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop",
        type: "vegetarian",
        constraints: ["green_vegetable", "grain", "beans_lentils"],
        region: "caribbean",
        ingredients: {
            "Callaloo leaves": "600g",
            "Rice": "320g",
            "Red kidney beans": "600g",
            "Coconut milk": "400ml",
            "Scotch bonnet pepper": "1 piece",
            "Onions": "2 pieces",
            "Garlic": "4 cloves",
            "Thyme": "20g",
            "Lime": "2 pieces"
        }
    },

    // Additional Mediterranean
    {
        title: "Greek Moussaka with béchamel sauce",
        image: "https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400&h=200&fit=crop",
        type: "vegetarian",
        constraints: ["oven", "dairy", "seasonal"],
        region: "mediterranean",
        ingredients: {
            "Eggplants": "1000g",
            "Lentils": "400g",
            "Béchamel sauce": "500ml",
            "Feta cheese": "200g",
            "Tomatoes": "600g",
            "Olive oil": "100ml",
            "Onions": "3 pieces",
            "Garlic": "6 cloves",
            "Oregano": "20g"
        }
    },

    // Additional Eastern European
    {
        title: "Polish Kapusta with mushrooms and sour cream",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop",
        type: "vegetarian",
        constraints: ["seasonal", "dairy"],
        region: "eastern_european",
        ingredients: {
            "Sauerkraut": "800g",
            "Mixed mushrooms": "500g",
            "Sour cream": "300ml",
            "Onions": "3 pieces",
            "Potatoes": "600g",
            "Caraway seeds": "10g",
            "Bay leaves": "4 pieces",
            "Vegetable oil": "60ml",
            "Fresh dill": "25g"
        }
    },

    // Additional Scandinavian
    {
        title: "Swedish Janssons Temptation potato gratin",
        image: "https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400&h=200&fit=crop",
        type: "vegetarian",
        constraints: ["oven", "dairy"],
        region: "scandinavian",
        ingredients: {
            "Potatoes": "1200g",
            "Anchovies (optional)": "100g",
            "Onions": "3 pieces",
            "Heavy cream": "600ml",
            "Butter": "100g",
            "Breadcrumbs": "80g",
            "Mixed greens": "200g",
            "Pickled beets": "200g"
        }
    },

    // Additional Germanic
    {
        title: "Austrian Kaiserschmarrn with plum compote",
        image: "https://images.unsplash.com/photo-1571197192738-e735c3dd9659?w=400&h=200&fit=crop",
        type: "vegetarian",
        constraints: ["eggs", "dairy", "seasonal"],
        region: "germanic",
        ingredients: {
            "Eggs": "8 pieces",
            "Flour": "300g",
            "Milk": "400ml",
            "Plums": "800g",
            "Sugar": "120g",
            "Butter": "120g",
            "Vanilla": "15ml",
            "Raisins": "100g",
            "Powdered sugar": "60g"
        }
    },

    // Additional North American
    {
        title: "Canadian Tourtière with cranberry sauce",
        image: "https://images.unsplash.com/photo-1571197192738-e735c3dd9659?w=400&h=200&fit=crop",
        type: "vegetarian",
        constraints: ["oven", "seasonal", "grain"],
        region: "north_american",
        ingredients: {
            "Pie crust": "600g",
            "Lentils": "500g",
            "Mushrooms": "400g",
            "Cranberry sauce": "300ml",
            "Onions": "3 pieces",
            "Celery": "200g",
            "Vegetable broth": "400ml",
            "Sage": "20g",
            "Thyme": "15g"
        }
    },

    // Additional Middle Eastern
    {
        title: "Turkish Stuffed Eggplant (Imam Bayildi)",
        image: "https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400&h=200&fit=crop",
        type: "vegetarian",
        constraints: ["oven", "seasonal", "green_vegetable"],
        region: "middle_eastern",
        ingredients: {
            "Eggplants": "8 pieces",
            "Onions": "4 pieces",
            "Tomatoes": "600g",
            "Garlic": "8 cloves",
            "Parsley": "60g",
            "Olive oil": "150ml",
            "Pine nuts": "80g",
            "Lemon": "3 pieces",
            "Sugar": "30g"
        }
    },

    // Additional Latin American
    {
        title: "Peruvian Quinoa Soup with vegetables",
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=200&fit=crop",
        type: "vegetarian",
        constraints: ["grain", "green_vegetable", "seasonal"],
        region: "latin_american",
        ingredients: {
            "Quinoa": "320g",
            "Mixed vegetables": "800g",
            "Vegetable broth": "1200ml",
            "Ají amarillo paste": "60g",
            "Cilantro": "40g",
            "Onions": "2 pieces",
            "Garlic": "6 cloves",
            "Cumin": "15g",
            "Lime": "3 pieces"
        }
    },

    // Additional South East Asian
    {
        title: "Thai Green Papaya Salad with jasmine rice",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop",
        type: "vegetarian",
        constraints: ["salad", "grain", "green_vegetable"],
        region: "south_east_asian",
        ingredients: {
            "Green papaya": "800g",
            "Jasmine rice": "320g",
            "Cherry tomatoes": "300g",
            "Green beans": "200g",
            "Peanuts": "100g",
            "Thai chilies": "6 pieces",
            "Fish sauce (vegetarian)": "60ml",
            "Lime": "4 pieces",
            "Palm sugar": "60g"
        }
    },

    // Additional East Asian
    {
        title: "Korean Bibimbap with mixed vegetables",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop",
        type: "vegetarian",
        constraints: ["grain", "green_vegetable", "eggs"],
        region: "east_asian",
        ingredients: {
            "Short grain rice": "320g",
            "Mixed vegetables (spinach, carrots, bean sprouts)": "800g",
            "Eggs": "4 pieces",
            "Gochujang": "80g",
            "Sesame oil": "80ml",
            "Soy sauce": "60ml",
            "Garlic": "6 cloves",
            "Sesame seeds": "40g"
        }
    },

    // Additional African
    {
        title: "Ethiopian Vegetarian Platter with injera",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop",
        type: "vegetarian",
        constraints: ["beans_lentils", "grain", "green_vegetable"],
        region: "african",
        ingredients: {
            "Mixed lentils": "600g",
            "Injera bread": "12 pieces",
            "Collard greens": "400g",
            "Berbere spice": "40g",
            "Onions": "4 pieces",
            "Garlic": "8 cloves",
            "Ginger": "40g",
            "Vegetable oil": "100ml",
            "Turmeric": "15g"
        }
    },

    // Additional Caribbean
    {
        title: "Cuban Black Beans and Rice (Moros y Cristianos)",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop",
        type: "vegetarian",
        constraints: ["beans_lentils", "grain"],
        region: "caribbean",
        ingredients: {
            "Black beans": "800g",
            "White rice": "320g",
            "Bell peppers": "300g",
            "Onions": "3 pieces",
            "Garlic": "6 cloves",
            "Cumin": "15g",
            "Bay leaves": "4 pieces",
            "Olive oil": "80ml",
            "Lime": "3 pieces"
        }
    }
];