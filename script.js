let currentWeek = 0;
let weeklyMeals = [];
let usedMeatMeals = [];
let usedVegetarianMeals = [];
let allWeeklyMeals = {}; // Store meals for all weeks
let favorites = [];
let banned = [];
let mealRatings = {}; // Store ratings for each meal
let startingCalendarWeek = getCurrentWeekNumber(); // Track when meal planning started
let deactivatedMealsByWeek = {};

function getFlagForRegion(region) {
    const regionFlags = {
        'mediterranean': '🇮🇹',
        'eastern_european': '🇵🇱',
        'scandinavian': '🇸🇪',
        'germanic': '🇩🇪',
        'north_american': '🇺🇸',
        'middle_eastern': '🇹🇷',
        'latin_american': '🇲🇽',
        'south_east_asian': '🇮🇳',
        'east_asian': '🇯🇵',
        'african': '🇪🇹',
        'caribbean': '🇯🇲'
    };
    return regionFlags[region] || '🌍';
}

function getConstraintLabel(constraint) {
    const labels = {
        'pasta': 'Nudeln',
        'green_vegetable': 'Grünes Gemüse',
        'oven': 'Backofen',
        'grain': 'Getreide',
        'seasonal': 'Saisonal',
        'salad': 'Salat',
        'beans_lentils': 'Bohnen/Linsen',
        'eggs': 'Eier',
        'dairy': 'Milchprodukte'
    };
    return labels[constraint] || constraint;
}

function getCurrentWeekNumber() {
    const now = new Date();
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function getCalendarWeekForMealWeek(mealWeek) {
    const currentCalendarWeek = getCurrentWeekNumber();
    const targetWeek = currentCalendarWeek + mealWeek;

    // Handle year overflow (weeks 53+ should wrap to next year)
    if (targetWeek > 52) {
        return targetWeek - 52;
    }
    return targetWeek;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function generateWeeklyMeals() {
    // Helper: try once to build a valid week set meeting strict rules
    function tryBuildWeek() {
        // Exclude meals from the previous 3 weeks (no repeats within any 4 consecutive weeks)
        const recentTitles = new Set();
        for (let w = Math.max(0, currentWeek - 3); w <= currentWeek - 1; w++) {
            if (allWeeklyMeals[w]) {
                allWeeklyMeals[w].forEach(m => recentTitles.add(m.title));
            }
        }

        const availableMeatMeals = meatMeals.filter(meal => !banned.includes(meal.title) && !recentTitles.has(meal.title));
        const availableVegetarianMeals = vegetarianMeals.filter(meal => !banned.includes(meal.title) && !recentTitles.has(meal.title));

        const requiredConstraints = [
            'seasonal','salad','oven','pasta','beans_lentils','eggs','dairy','grain','green_vegetable'
        ];

        // pick 1 meat
        if (availableMeatMeals.length === 0) return null;
        const meat = shuffleArray(availableMeatMeals)[0];

        // pick 3 vegetarian
        if (availableVegetarianMeals.length < 3) return null;
        let vegPool = shuffleArray(availableVegetarianMeals);

        // Greedy cover constraints
        const selected = [meat];
        const covered = new Set(meat.constraints || []);
        for (let i = 0; i < vegPool.length && selected.length < 4; i++) {
            const candidate = vegPool[i];
            // prefer that adds new constraints
            const adds = (candidate.constraints || []).some(c => !covered.has(c));
            if (adds || (4 - selected.length) >= (requiredConstraints.filter(c=>!covered.has(c)).length)) {
                selected.push(candidate);
                (candidate.constraints || []).forEach(c => covered.add(c));
            }
        }
        if (selected.length < 4) return null;

        // if still not 3 veg, adjust
        const vegCount = selected.filter(m => m.type === 'vegetarian').length;
        if (vegCount !== 3) return null;

        // validate constraint coverage
        const hasAll = requiredConstraints.every(c => selected.some(m => (m.constraints||[]).includes(c)));
        if (!hasAll) return null;

        return shuffleArray(selected);
    }

    // Retry loop to satisfy constraints
    for (let attempts = 0; attempts < 400; attempts++) {
        const built = tryBuildWeek();
        if (built) {
            return built;
        }
    }
    // Fallback: relax recent constraint but still honor banned and type/coverage if possible
    const poolMeat = meatMeals.filter(m=>!banned.includes(m.title));
    const poolVeg = vegetarianMeals.filter(m=>!banned.includes(m.title));
    if (poolMeat.length && poolVeg.length >= 3) {
        const meat = shuffleArray(poolMeat)[0];
        const vegs = shuffleArray(poolVeg).slice(0,3);
        const selected = [meat, ...vegs];
        return selected;
    }
    const allMeals = shuffleArray([...poolMeat, ...poolVeg]);
    return allMeals.slice(0,4);
}

function displayMeals(meals) {
    const container = document.getElementById('mealsContainer');

    // Hide container first
    container.classList.remove('show');

    setTimeout(() => {
        container.innerHTML = '';

        meals.forEach((meal, index) => {
            const mealCard = document.createElement('div');
            mealCard.className = 'meal-card';

            const rating = mealRatings[meal.title] || '';
            const thumbUpActive = rating === 'up' ? 'active' : '';
            const thumbDownActive = rating === 'down' ? 'active' : '';

            mealCard.innerHTML = `
                <img src="${meal.image}" alt="${meal.title}" class="meal-image">
                <div class="meal-title">
                    ${getFlagForRegion(meal.region)} ${meal.title}
                </div>
                <div class="constraints-row">
                    ${(meal.constraints || []).map(c => `<span class=\"constraint-badge badge-${c}\">${getConstraintLabel(c)}</span>`).join('')}
                </div>
                <div class="rating-buttons">
                    <button class="thumb-btn thumb-up ${thumbUpActive}" onclick="rateMeal('${meal.title}', 'up')">
                        👍
                    </button>
                    <button class="thumb-btn thumb-down ${thumbDownActive}" onclick="rateMeal('${meal.title}', 'down')">
                        👎
                    </button>
                </div>
            `;

            container.appendChild(mealCard);
        });

        // Show container with animation
        setTimeout(() => {
            container.classList.add('show');
        }, 100);
    }, 300);
}

function rateMeal(mealTitle, rating) {
    // Update rating
    mealRatings[mealTitle] = rating;

    if (rating === 'up') {
        // Add to favorites if not already there
        if (!favorites.includes(mealTitle)) {
            favorites.push(mealTitle);
        }
        // Remove from banned if it was there
        banned = banned.filter(title => title !== mealTitle);
    } else if (rating === 'down') {
        // Add to banned if not already there
        if (!banned.includes(mealTitle)) {
            banned.push(mealTitle);
        }
        // Remove from favorites if it was there
        favorites = favorites.filter(title => title !== mealTitle);
    }

    // Update button states
    updateRatingButtons();

    // Show favorites/banned buttons
    document.getElementById('favoritesBtn').style.display = 'inline-block';
    document.getElementById('bannedBtn').style.display = 'inline-block';
}

function updateRatingButtons() {
    const thumbButtons = document.querySelectorAll('.thumb-btn');
    thumbButtons.forEach(button => {
        const mealTitle = button.onclick.toString().match(/'([^']+)'/)[1];
        const rating = mealRatings[mealTitle];

        button.classList.remove('active');
        if ((button.classList.contains('thumb-up') && rating === 'up') ||
            (button.classList.contains('thumb-down') && rating === 'down')) {
            button.classList.add('active');
        }
    });
}

function updateWeekDisplay() {
    const calendarWeek = getCalendarWeekForMealWeek(currentWeek);
    document.getElementById('weekText').textContent = `Kalenderwoche ${calendarWeek}`;
}

function updateButtonStates() {
    const prevBtn = document.getElementById('prevWeekBtn');
    
    // Always show previous week button
    prevBtn.style.display = 'inline-block';
    
    // Enable/disable based on current week
    if (currentWeek <= 0) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }
}

function newRandomization() {
    // Generate 4 random meals for the current week honoring constraints
    const selectedMeals = generateWeeklyMeals();
    allWeeklyMeals[currentWeek] = selectedMeals;
    displayMeals(selectedMeals);
    // Reveal controls
    document.getElementById('nextWeekBtn').style.display = 'inline-block';
    document.getElementById('weekIndicator').style.display = 'block';
    document.getElementById('exportBtn').style.display = 'inline-block';
    document.getElementById('favoritesBtn').style.display = 'inline-block';
    document.getElementById('bannedBtn').style.display = 'inline-block';
    document.getElementById('saveBtn').style.display = 'inline-block';
    document.getElementById('randomizeBtn').style.display = 'inline-block';
    document.getElementById('weekIndicator').style.display = 'block';
    updateWeekDisplay();
    updateButtonStates();
}

function generateMeals() {
    // Backward compatibility retained
    if (Object.keys(allWeeklyMeals).length === 0) {
        currentWeek = 0;
        startingCalendarWeek = getCurrentWeekNumber();
        usedMeatMeals = [];
        usedVegetarianMeals = [];
        allWeeklyMeals = {};
    }
    newRandomization();
}

// Auto-generate on first load
document.addEventListener('DOMContentLoaded', () => {
    currentWeek = 0;
    startingCalendarWeek = getCurrentWeekNumber();
    usedMeatMeals = [];
    usedVegetarianMeals = [];
    allWeeklyMeals = {};
    
    // Show week indicator and update button states immediately
    document.getElementById('weekIndicator').style.display = 'block';
    document.getElementById('prevWeekBtn').style.display = 'inline-block';
    updateWeekDisplay();
    updateButtonStates();
    
    newRandomization();
});

function surpriseMe() {
    if (favorites.length < 4) {
        alert('Du brauchst mindestens 4 Lieblingsgerichte für die Überraschung!');
        return;
    }

    currentWeek = 0;
    startingCalendarWeek = getCurrentWeekNumber();
    allWeeklyMeals = {};

    // Get all favorite meals
    const allMeals = [...meatMeals, ...vegetarianMeals];
    const favoriteMeals = allMeals.filter(meal => favorites.includes(meal.title));

    // Try to maintain 1 meat + 3 vegetarian structure if possible
    const favoriteMeatMeals = favoriteMeals.filter(meal => meal.type === 'meat');
    const favoriteVegetarianMeals = favoriteMeals.filter(meal => meal.type === 'vegetarian');

    let selectedMeals = [];

    if (favoriteMeatMeals.length >= 1 && favoriteVegetarianMeals.length >= 3) {
        // Perfect balance possible
        selectedMeals.push(shuffleArray(favoriteMeatMeals)[0]);
        selectedMeals.push(...shuffleArray(favoriteVegetarianMeals).slice(0, 3));
    } else {
        // Just pick any 4 favorites
        selectedMeals = shuffleArray(favoriteMeals).slice(0, 4);
    }

    allWeeklyMeals[0] = selectedMeals;
    displayMeals(selectedMeals);

    // Show navigation buttons
    document.getElementById('nextWeekBtn').style.display = 'inline-block';
    document.getElementById('randomizeBtn').style.display = 'inline-block';
    document.getElementById('weekIndicator').style.display = 'block';
    document.getElementById('exportBtn').style.display = 'inline-block';
    document.getElementById('saveBtn').style.display = 'inline-block';
    updateWeekDisplay();
    updateButtonStates();
}

function showShoppingList() {
    if (!allWeeklyMeals[currentWeek]) {
        alert('Keine Mahlzeiten für diese Woche generiert!');
        return;
    }

    const isMainView = document.getElementById('mealsContainer').style.display !== 'none';
    
    if (isMainView) {
        document.getElementById('mealsContainer').style.display = 'none';
        document.querySelector('.button-container').style.display = 'none';
        document.getElementById('weekIndicator').style.display = 'none';
    }

    document.getElementById('favoritesContainer').style.display = 'none';
    document.getElementById('bannedContainer').style.display = 'none';
    document.getElementById('shoppingListContainer').style.display = 'block';

    generateShoppingListContent();
}

function generateShoppingListContent() {
    const weekMeals = allWeeklyMeals[currentWeek];
    const calendarWeek = getCalendarWeekForMealWeek(currentWeek);
    if (!deactivatedMealsByWeek[currentWeek]) { deactivatedMealsByWeek[currentWeek] = []; }
    const deactivatedSet = new Set(deactivatedMealsByWeek[currentWeek]);

    // Define ingredient categories in typical supermarket order
    const categories = {
        'Frisches Gemüse & Kräuter': ['asparagus', 'spinach', 'arugula', 'rucola', 'kale', 'brussels sprouts', 'cabbage', 'peas', 'broccoli', 'zucchini', 'bell peppers', 'eggplants', 'cucumber', 'tomatoes', 'cherry tomatoes', 'onions', 'red onion', 'garlic', 'ginger', 'carrots', 'pumpkin', 'winter squash', 'seasonal vegetables', 'spring vegetables', 'seasonal root vegetables', 'mixed seasonal greens', 'mixed greens', 'basil', 'parsley', 'chives', 'thyme', 'rosemary', 'sage', 'oregano', 'dill', 'mint', 'herbs', 'seasonal herbs', 'fresh herbs', 'bok choy', 'scallions', 'cilantro', 'collard greens', 'callaloo leaves', 'wakame seaweed', 'nori seaweed', 'radishes', 'celery', 'bean sprouts', 'green papaya'],
        'Obst': ['lemons', 'apples', 'rhubarb', 'plums', 'lime', 'mixed berries', 'avocados', 'korean pear', 'dried apricots', 'dried cranberries', 'dried fruits'],
        'Fleisch & Fisch': ['salmon fillets', 'chicken breast', 'cod fillets', 'turkey breast', 'duck breast', 'pork tenderloin', 'veal shanks', 'kielbasa sausage', 'ground beef', 'ground pork', 'veal cutlets', 'beef brisket', 'lamb shoulder', 'beef short ribs', 'chorizo', 'chicken thighs', 'beef ribeye', 'chicken pieces', 'prosciutto', 'fresh clams', 'sea bass fillets', 'beef stew meat', 'pork chops', 'halibut fillets', 'trout fillets', 'swordfish steaks', 'rack of lamb', 'sole fillets', 'pork shoulder', 'beef roast', 'lamb shanks', 'lamb chops'],
        'Milchprodukte & Eier': ['eggs', 'butter', 'milk', 'heavy cream', 'mascarpone cheese', 'ricotta cheese', 'mozzarella cheese', 'parmesan cheese', 'gruyere cheese', 'goat cheese', 'feta cheese', 'cheddar cheese', 'sour cream', 'cream cheese', 'monterey jack cheese', 'soft-boiled eggs', 'hard-boiled eggs'],
        'Getreide & Brot': ['wild rice', 'quinoa', 'pearl barley', 'brown rice', 'bulgur', 'basmati rice', 'arborio rice', 'pasta', 'lasagna sheets', 'bread', 'pie crust', 'puff pastry', 'breadcrumbs', 'flour', 'short grain rice', 'white rice', 'jasmine rice', 'couscous', 'rye bread', 'sourdough bread', 'naan bread', 'pita bread', 'injera bread', 'macaroni', 'spaetzle', 'ramen noodles', 'orzo pasta', 'egg noodles', 'corn tortillas', 'pierogi'],
        'Hülsenfrüchte & Nüsse': ['chickpeas', 'green lentils', 'red lentils', 'white beans', 'black beans', 'pine nuts', 'pumpkin seeds', 'kidney beans', 'black lentils', 'mixed lentils', 'walnuts', 'peanuts', 'sliced almonds'],
        'Vorratskammer & Gewürze': ['olive oil', 'vegetable oil', 'salt', 'black pepper', 'nutmeg', 'curry powder', 'dijon mustard', 'balsamic vinegar', 'red wine vinegar', 'honey', 'sugar', 'tomato sauce', 'tomatoes (canned)', 'coconut cream', 'white wine', 'vegetable broth', 'coconut milk', 'soy sauce', 'sesame oil', 'teriyaki sauce', 'miso paste', 'garam masala', 'jerk seasoning', 'berbere spice', 'moroccan spice blend', 'enchilada sauce', 'bbq sauce', 'maple syrup', 'sumac', 'tomato salsa', 'fish sauce', 'gochujang', 'sesame seeds', 'lingonberry jam', 'red wine', 'beef broth', 'chicken broth', 'kimchi', 'sauerkraut', 'capers', 'kalamata olives', 'preserved lemons', 'tomato paste', 'gingersnap cookies', 'bay leaves', 'juniper berries', 'caraway seeds', 'cumin', 'turmeric', 'paprika', 'allspice', 'vanilla extract', 'baking powder', 'powdered sugar', 'brown sugar', 'palm sugar', 'scotch bonnet pepper', 'thai chilies', 'pickled beets']
    };

    // Aggregate all ingredients for active meals and track per-meal amounts
    const ingredientsList = {};
    const categorizedIngredients = {};
    const perMealAmounts = {};

    // Initialize categories
    Object.keys(categories).forEach(category => {
        categorizedIngredients[category] = {};
    });
    categorizedIngredients['Other'] = {};

    weekMeals.forEach(meal => {
        if (meal.ingredients) {
            Object.entries(meal.ingredients).forEach(([ingredient, amount]) => {
                if (!perMealAmounts[ingredient]) perMealAmounts[ingredient] = {};
                perMealAmounts[ingredient][meal.title] = deactivatedSet.has(meal.title) ? '' : amount;
                if (!deactivatedSet.has(meal.title)) {
                    if (ingredientsList[ingredient]) {
                        if (!ingredientsList[ingredient].includes(amount)) {
                            ingredientsList[ingredient] += ` + ${amount}`;
                        }
                    } else {
                        ingredientsList[ingredient] = amount;
                    }
                }
            });
        }
    });

    // Categorize ingredients
    Object.entries(ingredientsList).forEach(([ingredient, amount]) => {
        let found = false;
        const lowerIngredient = ingredient.toLowerCase();
        
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => lowerIngredient.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(lowerIngredient))) {
                categorizedIngredients[category][ingredient] = amount;
                found = true;
                break;
            }
        }
        
        if (!found) {
            categorizedIngredients['Other'][ingredient] = amount;
        }
    });

    // Generate HTML content
    let htmlContent = `
        <div class="shopping-week-info">
            <h2>Einkaufsliste - Kalenderwoche ${calendarWeek}</h2>
            <p><strong>Erstellt am ${new Date().toLocaleDateString()}</strong></p>
        </div>

        <div class="shopping-meals-list">
            <h3>📋 Mahlzeiten dieser Woche:</h3>
            ${weekMeals.map((meal, idx) => `
                <div class=\"shopping-meal-item\"> 
                    <span><span class=\"meal-badge meal-badge-${idx+1}\">${idx+1}</span>${getFlagForRegion(meal.region)} ${meal.title}</span>
                    <span class=\"shopping-meal-actions\"> 
                        <span class=\"portion-count\">(4 portions)</span>
                        <button class=\"meal-toggle-btn ${deactivatedSet.has(meal.title) ? 'deactivated' : ''}\" onclick=\"toggleMealActive('${meal.title}')\">${deactivatedSet.has(meal.title) ? 'Aktivieren' : 'Deaktivieren'}</button>
                    </span> 
                </div>
            `).join('')}
        </div>

        <h2 style="color: #27ae60; margin-bottom: 20px;">🥘 Shopping List by Category:</h2>
        ${Object.entries(categorizedIngredients)
            .filter(([category, ingredients]) => Object.keys(ingredients).length > 0)
            .map(([category, ingredients]) => `
                <div class="shopping-category-section">
                    <div class="shopping-category-title">${category}</div>
                    <table class=\"shopping-table\"> 
                        <thead>
                            <tr>
                                <th>Zutat</th>
                                <th class=\"amount-cell\">Gesamt</th>
                                ${weekMeals.map((m, idx) => `<th class=\"center meal-header-${idx+1}\">${idx+1}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.entries(ingredients)
                                .sort(([a], [b]) => a.localeCompare(b))
                                .map(([ingredient, amount]) => `
                                    <tr>
                                        <td>${ingredient}</td>
                                        <td class=\"amount-cell\">${amount}</td>
                                        ${weekMeals.map((m, idx) => `<td class=\"center meal-col-${idx+1}\">${(perMealAmounts[ingredient] && perMealAmounts[ingredient][m.title]) ? perMealAmounts[ingredient][m.title] : ''}</td>`).join('')}
                                    </tr>
                                `).join('')}
                        </tbody>
                    </table>
                </div>
            `).join('')}
    `;

    document.getElementById('shoppingListContent').innerHTML = htmlContent;
}

function toggleMealActive(mealTitle) {
    if (!deactivatedMealsByWeek[currentWeek]) { deactivatedMealsByWeek[currentWeek] = []; }
    const list = deactivatedMealsByWeek[currentWeek];
    const idx = list.indexOf(mealTitle);
    if (idx >= 0) { list.splice(idx, 1); } else { list.push(mealTitle); }
    generateShoppingListContent();
}

function downloadShoppingList() {
    const weekMeals = allWeeklyMeals[currentWeek];
    const calendarWeek = getCalendarWeekForMealWeek(currentWeek);
    const deactivatedSet = new Set(deactivatedMealsByWeek[currentWeek] || []);

    // Define ingredient categories in typical supermarket order
    const categories = {
        'Frisches Gemüse & Kräuter': ['asparagus', 'spinach', 'arugula', 'rucola', 'kale', 'brussels sprouts', 'cabbage', 'peas', 'broccoli', 'zucchini', 'bell peppers', 'eggplants', 'cucumber', 'tomatoes', 'cherry tomatoes', 'onions', 'red onion', 'garlic', 'ginger', 'carrots', 'pumpkin', 'winter squash', 'seasonal vegetables', 'spring vegetables', 'seasonal root vegetables', 'mixed seasonal greens', 'mixed greens', 'basil', 'parsley', 'chives', 'thyme', 'rosemary', 'sage', 'oregano', 'dill', 'mint', 'herbs', 'seasonal herbs', 'fresh herbs', 'bok choy', 'scallions', 'cilantro', 'collard greens', 'callaloo leaves', 'wakame seaweed', 'nori seaweed', 'radishes', 'celery', 'bean sprouts', 'green papaya'],
        'Obst': ['lemons', 'apples', 'rhubarb', 'plums', 'lime', 'mixed berries', 'avocados', 'korean pear', 'dried apricots', 'dried cranberries', 'dried fruits'],
        'Fleisch & Fisch': ['salmon fillets', 'chicken breast', 'cod fillets', 'turkey breast', 'duck breast', 'pork tenderloin', 'veal shanks', 'kielbasa sausage', 'ground beef', 'ground pork', 'veal cutlets', 'beef brisket', 'lamb shoulder', 'beef short ribs', 'chorizo', 'chicken thighs', 'beef ribeye', 'chicken pieces', 'prosciutto', 'fresh clams', 'sea bass fillets', 'beef stew meat', 'pork chops', 'halibut fillets', 'trout fillets', 'swordfish steaks', 'rack of lamb', 'sole fillets', 'pork shoulder', 'beef roast', 'lamb shanks', 'lamb chops'],
        'Milchprodukte & Eier': ['eggs', 'butter', 'milk', 'heavy cream', 'mascarpone cheese', 'ricotta cheese', 'mozzarella cheese', 'parmesan cheese', 'gruyere cheese', 'goat cheese', 'feta cheese', 'cheddar cheese', 'sour cream', 'cream cheese', 'monterey jack cheese', 'soft-boiled eggs', 'hard-boiled eggs'],
        'Getreide & Brot': ['wild rice', 'quinoa', 'pearl barley', 'brown rice', 'bulgur', 'basmati rice', 'arborio rice', 'pasta', 'lasagna sheets', 'bread', 'pie crust', 'puff pastry', 'breadcrumbs', 'flour', 'short grain rice', 'white rice', 'jasmine rice', 'couscous', 'rye bread', 'sourdough bread', 'naan bread', 'pita bread', 'injera bread', 'macaroni', 'spaetzle', 'ramen noodles', 'orzo pasta', 'egg noodles', 'corn tortillas', 'pierogi'],
        'Hülsenfrüchte & Nüsse': ['chickpeas', 'green lentils', 'red lentils', 'white beans', 'black beans', 'pine nuts', 'pumpkin seeds', 'kidney beans', 'black lentils', 'mixed lentils', 'walnuts', 'peanuts', 'sliced almonds'],
        'Vorratskammer & Gewürze': ['olive oil', 'vegetable oil', 'salt', 'black pepper', 'nutmeg', 'curry powder', 'dijon mustard', 'balsamic vinegar', 'red wine vinegar', 'honey', 'sugar', 'tomato sauce', 'tomatoes (canned)', 'coconut cream', 'white wine', 'vegetable broth', 'coconut milk', 'soy sauce', 'sesame oil', 'teriyaki sauce', 'miso paste', 'garam masala', 'jerk seasoning', 'berbere spice', 'moroccan spice blend', 'enchilada sauce', 'bbq sauce', 'maple syrup', 'sumac', 'tomato salsa', 'fish sauce', 'gochujang', 'sesame seeds', 'lingonberry jam', 'red wine', 'beef broth', 'chicken broth', 'kimchi', 'sauerkraut', 'capers', 'kalamata olives', 'preserved lemons', 'tomato paste', 'gingersnap cookies', 'bay leaves', 'juniper berries', 'caraway seeds', 'cumin', 'turmeric', 'paprika', 'allspice', 'vanilla extract', 'baking powder', 'powdered sugar', 'brown sugar', 'palm sugar', 'scotch bonnet pepper', 'thai chilies', 'pickled beets']
    };

    // Aggregate all ingredients from active meals only
    const ingredientsList = {};
    const categorizedIngredients = {};

    // Initialize categories
    Object.keys(categories).forEach(category => {
        categorizedIngredients[category] = {};
    });
    categorizedIngredients['Other'] = {};

    weekMeals.forEach(meal => {
        if (deactivatedSet.has(meal.title)) return;
        if (meal.ingredients) {
            Object.entries(meal.ingredients).forEach(([ingredient, amount]) => {
                if (ingredientsList[ingredient]) {
                    // If ingredient already exists, note multiple amounts
                    if (!ingredientsList[ingredient].includes(amount)) {
                        ingredientsList[ingredient] += ` + ${amount}`;
                    }
                } else {
                    ingredientsList[ingredient] = amount;
                }
            });
        }
    });

    // Categorize ingredients
    Object.entries(ingredientsList).forEach(([ingredient, amount]) => {
        let found = false;
        const lowerIngredient = ingredient.toLowerCase();
        
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => lowerIngredient.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(lowerIngredient))) {
                categorizedIngredients[category][ingredient] = amount;
                found = true;
                break;
            }
        }
        
        if (!found) {
            categorizedIngredients['Other'][ingredient] = amount;
        }
    });

    // Create PDF content
    let pdfContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.4;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            color: #27ae60;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        h3 {
            color: #3498db;
            margin-top: 25px;
            margin-bottom: 10px;
            border-left: 4px solid #3498db;
            padding-left: 10px;
        }
        .meal-list {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .meal-item {
            margin: 8px 0;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .portion-count {
            color: #e67e22;
            font-size: 14px;
            font-weight: normal;
        }
        .category-section {
            margin-bottom: 25px;
        }
        .ingredients-list {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 10px 20px;
            max-width: 600px;
            margin-bottom: 20px;
        }
        .ingredient {
            border-bottom: 1px dotted #ccc;
            padding: 5px 0;
        }
        .amount {
            font-weight: bold;
            color: #e67e22;
            text-align: right;
            border-bottom: 1px dotted #ccc;
            padding: 5px 0;
        }
        @media print {
            body { margin: 10px; }
        }
    </style>
</head>
<body>
    <h1>🛒 Einkaufsliste - Kalenderwoche ${calendarWeek}</h1>
    <p><strong>Kalenderwoche ${calendarWeek}</strong> | Erstellt am ${new Date().toLocaleDateString()}</p>

    <div class="meal-list">
        <h2>📋 Gerichte dieser Woche:</h2>
        ${weekMeals.map(meal => `
            <div class="meal-item">
                <span>• ${meal.title}</span>
                <span class="portion-count">(4 portions)</span>
            </div>
        `).join('')}
    </div>

    <h2>🥘 Shopping List by Category:</h2>
    ${Object.entries(categorizedIngredients)
        .filter(([category, ingredients]) => Object.keys(ingredients).length > 0)
        .map(([category, ingredients]) => `
            <div class="category-section">
                <h3>${category}</h3>
                <div class="ingredients-list">
                    ${Object.entries(ingredients)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([ingredient, amount]) => `
                            <div class="ingredient">${ingredient}</div>
                            <div class="amount">${amount}</div>
                        `).join('')}
                </div>
            </div>
        `).join('')}

    <p style="margin-top: 40px; font-size: 12px; color: #7f8c8d;">
        Generated by Martha's Meals | All ingredients calculated for 4 portions per meal
    </p>
</body>
</html>`;

    // Create and download PDF
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marthas-meals-shopping-list-week-${calendarWeek}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Show success message
    alert('Einkaufsliste heruntergeladen! Die Datei wird in Ihrem Browser geöffnet, wo Sie sie als PDF drucken können.');
}

function copyShortList() {
    const weekMeals = allWeeklyMeals[currentWeek];
    const calendarWeek = getCalendarWeekForMealWeek(currentWeek);
    const deactivatedSet = new Set(deactivatedMealsByWeek[currentWeek] || []);

    // Define ingredient categories in typical supermarket order
    const categories = {
        'Frisches Gemüse & Kräuter': ['asparagus', 'spinach', 'arugula', 'rucola', 'kale', 'brussels sprouts', 'cabbage', 'peas', 'broccoli', 'zucchini', 'bell peppers', 'eggplants', 'cucumber', 'tomatoes', 'cherry tomatoes', 'onions', 'red onion', 'garlic', 'ginger', 'carrots', 'pumpkin', 'winter squash', 'seasonal vegetables', 'spring vegetables', 'seasonal root vegetables', 'mixed seasonal greens', 'mixed greens', 'basil', 'parsley', 'chives', 'thyme', 'rosemary', 'sage', 'oregano', 'dill', 'mint', 'herbs', 'seasonal herbs', 'fresh herbs', 'bok choy', 'scallions', 'cilantro', 'collard greens', 'callaloo leaves', 'wakame seaweed', 'nori seaweed', 'radishes', 'celery', 'bean sprouts', 'green papaya'],
        'Obst': ['lemons', 'apples', 'rhubarb', 'plums', 'lime', 'mixed berries', 'avocados', 'korean pear', 'dried apricots', 'dried cranberries', 'dried fruits'],
        'Fleisch & Fisch': ['salmon fillets', 'chicken breast', 'cod fillets', 'turkey breast', 'duck breast', 'pork tenderloin', 'veal shanks', 'kielbasa sausage', 'ground beef', 'ground pork', 'veal cutlets', 'beef brisket', 'lamb shoulder', 'beef short ribs', 'chorizo', 'chicken thighs', 'beef ribeye', 'chicken pieces', 'prosciutto', 'fresh clams', 'sea bass fillets', 'beef stew meat', 'pork chops', 'halibut fillets', 'trout fillets', 'swordfish steaks', 'rack of lamb', 'sole fillets', 'pork shoulder', 'beef roast', 'lamb shanks', 'lamb chops'],
        'Milchprodukte & Eier': ['eggs', 'butter', 'milk', 'heavy cream', 'mascarpone cheese', 'ricotta cheese', 'mozzarella cheese', 'parmesan cheese', 'gruyere cheese', 'goat cheese', 'feta cheese', 'cheddar cheese', 'sour cream', 'cream cheese', 'monterey jack cheese', 'soft-boiled eggs', 'hard-boiled eggs'],
        'Getreide & Brot': ['wild rice', 'quinoa', 'pearl barley', 'brown rice', 'bulgur', 'basmati rice', 'arborio rice', 'pasta', 'lasagna sheets', 'bread', 'pie crust', 'puff pastry', 'breadcrumbs', 'flour', 'short grain rice', 'white rice', 'jasmine rice', 'couscous', 'rye bread', 'sourdough bread', 'naan bread', 'pita bread', 'injera bread', 'macaroni', 'spaetzle', 'ramen noodles', 'orzo pasta', 'egg noodles', 'corn tortillas', 'pierogi'],
        'Hülsenfrüchte & Nüsse': ['chickpeas', 'green lentils', 'red lentils', 'white beans', 'black beans', 'pine nuts', 'pumpkin seeds', 'kidney beans', 'black lentils', 'mixed lentils', 'walnuts', 'peanuts', 'sliced almonds'],
        'Vorratskammer & Gewürze': ['olive oil', 'vegetable oil', 'salt', 'black pepper', 'nutmeg', 'curry powder', 'dijon mustard', 'balsamic vinegar', 'red wine vinegar', 'honey', 'sugar', 'tomato sauce', 'tomatoes (canned)', 'coconut cream', 'white wine', 'vegetable broth', 'coconut milk', 'soy sauce', 'sesame oil', 'teriyaki sauce', 'miso paste', 'garam masala', 'jerk seasoning', 'berbere spice', 'moroccan spice blend', 'enchilada sauce', 'bbq sauce', 'maple syrup', 'sumac', 'tomato salsa', 'fish sauce', 'gochujang', 'sesame seeds', 'lingonberry jam', 'red wine', 'beef broth', 'chicken broth', 'kimchi', 'sauerkraut', 'capers', 'kalamata olives', 'preserved lemons', 'tomato paste', 'gingersnap cookies', 'bay leaves', 'juniper berries', 'caraway seeds', 'cumin', 'turmeric', 'paprika', 'allspice', 'vanilla extract', 'baking powder', 'powdered sugar', 'brown sugar', 'palm sugar', 'scotch bonnet pepper', 'thai chilies', 'pickled beets']
    };

    // Aggregate all ingredients from active meals only
    const ingredientsList = {};
    const categorizedIngredients = {};

    // Initialize categories
    Object.keys(categories).forEach(category => {
        categorizedIngredients[category] = {};
    });
    categorizedIngredients['Other'] = {};

    weekMeals.forEach(meal => {
        if (deactivatedSet.has(meal.title)) return;
        if (meal.ingredients) {
            Object.entries(meal.ingredients).forEach(([ingredient, amount]) => {
                if (ingredientsList[ingredient]) {
                    // If ingredient already exists, note multiple amounts
                    if (!ingredientsList[ingredient].includes(amount)) {
                        ingredientsList[ingredient] += ` + ${amount}`;
                    }
                } else {
                    ingredientsList[ingredient] = amount;
                }
            });
        }
    });

    // Categorize ingredients
    Object.entries(ingredientsList).forEach(([ingredient, amount]) => {
        let found = false;
        const lowerIngredient = ingredient.toLowerCase();
        
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => lowerIngredient.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(lowerIngredient))) {
                categorizedIngredients[category][ingredient] = amount;
                found = true;
                break;
            }
        }
        
        if (!found) {
            categorizedIngredients['Other'][ingredient] = amount;
        }
    });

    // Generate simple text list
    let shortListText = `Einkaufsliste - Woche ${calendarWeek}\nErstellt: ${new Date().toLocaleDateString()}\n\n`;
    
    Object.entries(categorizedIngredients)
        .filter(([category, ingredients]) => Object.keys(ingredients).length > 0)
        .forEach(([category, ingredients]) => {
            shortListText += `${category}:\n`;
            Object.entries(ingredients)
                .sort(([a], [b]) => a.localeCompare(b))
                .forEach(([ingredient, amount]) => {
                    shortListText += `- ${ingredient}: ${amount}\n`;
                });
            shortListText += '\n';
        });

    // Copy to clipboard
    navigator.clipboard.writeText(shortListText).then(() => {
        alert('Kurze Einkaufsliste in die Zwischenablage kopiert! Sie können sie jetzt in WhatsApp oder einer anderen App einfügen.');
    }).catch(err => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shortListText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            alert('Kurze Einkaufsliste in die Zwischenablage kopiert! Sie können sie jetzt in WhatsApp oder einer anderen App einfügen.');
        } catch (err) {
            alert('Failed to copy to clipboard. Please try again or copy manually.');
            console.error('Copy failed:', err);
        }
        
        document.body.removeChild(textArea);
    });
}

function nextWeek() {
    currentWeek++;

    if (!allWeeklyMeals[currentWeek]) {
        // Reset used meals every 4 weeks to ensure variety
        if (currentWeek % 4 === 0) {
            usedMeatMeals = [];
            usedVegetarianMeals = [];
        }
        const selectedMeals = generateWeeklyMeals();
        allWeeklyMeals[currentWeek] = selectedMeals;
    }

    displayMeals(allWeeklyMeals[currentWeek]);

    document.getElementById('nextWeekBtn').style.display = 'inline-block';
    document.getElementById('randomizeBtn').style.display = 'inline-block';
    updateWeekDisplay();
    updateButtonStates();
}

function previousWeek() {
    if (currentWeek > 0) {
        currentWeek--;
        displayMeals(allWeeklyMeals[currentWeek]);

        document.getElementById('nextWeekBtn').style.display = 'inline-block';
        document.getElementById('randomizeBtn').style.display = 'inline-block';
        updateWeekDisplay();
        updateButtonStates();
    }
}

function showFavorites() {
    showListView('favorites');
}

function showBanned() {
    showListView('banned');
}

function showListView(type) {
    const isMainView = document.getElementById('mealsContainer').style.display !== 'none';
    
    if (isMainView) {
        document.getElementById('mealsContainer').style.display = 'none';
        document.querySelector('.button-container').style.display = 'none';
        document.getElementById('weekIndicator').style.display = 'none';
    }

    document.getElementById('favoritesContainer').style.display = type === 'favorites' ? 'block' : 'none';
    document.getElementById('bannedContainer').style.display = type === 'banned' ? 'block' : 'none';

    const allMeals = [...meatMeals, ...vegetarianMeals];
    const targetMeals = type === 'favorites' ? 
        allMeals.filter(meal => favorites.includes(meal.title)) :
        allMeals.filter(meal => banned.includes(meal.title));

    const gridId = type === 'favorites' ? 'favoritesMealsGrid' : 'bannedMealsGrid';
    const container = document.getElementById(gridId);

    container.innerHTML = '';
    
    if (targetMeals.length === 0) {
        // Show empty state message
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-list-message';
        emptyMessage.innerHTML = `
            <div class="empty-list-content">
                <div class="empty-list-icon">${type === 'favorites' ? '❤️' : '🚫'}</div>
                <h3>Noch keine ${type === 'favorites' ? 'Lieblings' : 'verbannten'} Gerichte</h3>
                <p>${type === 'favorites' 
                    ? 'Bewerte einige Gerichte mit 👍, um sie zu deinen Favoriten hinzuzufügen!' 
                    : 'Bewerte einige Gerichte mit 👎, um sie zu deiner Bannliste hinzuzufügen!'}</p>
            </div>
        `;
        container.appendChild(emptyMessage);
    } else {
        targetMeals.forEach(meal => {
            const mealCard = document.createElement('div');
            mealCard.className = 'meal-card';

            const rating = mealRatings[meal.title] || '';
            const thumbUpActive = rating === 'up' ? 'active' : '';
            const thumbDownActive = rating === 'down' ? 'active' : '';

            mealCard.innerHTML = `
                <img src="${meal.image}" alt="${meal.title}" class="meal-image">
                <div class="meal-title">${getFlagForRegion(meal.region)} ${meal.title}</div>
                <div class="rating-buttons">
                    <button class="thumb-btn thumb-up ${thumbUpActive}" onclick="rateMeal('${meal.title}', 'up')">
                        👍
                    </button>
                    <button class="thumb-btn thumb-down ${thumbDownActive}" onclick="rateMeal('${meal.title}', 'down')">
                        👎
                    </button>
                </div>
            `;

            container.appendChild(mealCard);
        });
    }
}

function showMainView() {
    document.getElementById('mealsContainer').style.display = '';
    document.querySelector('.button-container').style.display = '';
    document.getElementById('weekIndicator').style.display = Object.keys(allWeeklyMeals).length > 0 ? 'block' : 'none';
    document.getElementById('favoritesContainer').style.display = 'none';
    document.getElementById('bannedContainer').style.display = 'none';
    document.getElementById('shoppingListContainer').style.display = 'none';
}

function saveState() {
    const state = {
        currentWeek,
        allWeeklyMeals,
        usedMeatMeals,
        usedVegetarianMeals,
        favorites,
        banned,
        mealRatings,
        startingCalendarWeek,
        saveDate: new Date().toISOString()
    };
    
    const stateString = JSON.stringify(state, null, 2);
    const blob = new Blob([stateString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meal-planner-state-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('State saved successfully! You can now load this state anytime.');
}

function loadState() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const state = JSON.parse(e.target.result);
                
                // Validate the state object
                if (!state.allWeeklyMeals || typeof state.currentWeek !== 'number') {
                    throw new Error('Invalid state file');
                }
                
                // Restore state
                currentWeek = state.currentWeek || 0;
                allWeeklyMeals = state.allWeeklyMeals || {};
                usedMeatMeals = state.usedMeatMeals || [];
                usedVegetarianMeals = state.usedVegetarianMeals || [];
                favorites = state.favorites || [];
                banned = state.banned || [];
                mealRatings = state.mealRatings || {};
                startingCalendarWeek = state.startingCalendarWeek || getCurrentWeekNumber();
                
                // Update display
                if (allWeeklyMeals[currentWeek]) {
                    displayMeals(allWeeklyMeals[currentWeek]);
                    
                    // Show navigation buttons
                    document.getElementById('nextWeekBtn').style.display = 'inline-block';
                    document.getElementById('weekIndicator').style.display = 'block';
                    document.getElementById('exportBtn').style.display = 'inline-block';
                    document.getElementById('favoritesBtn').style.display = 'inline-block';
                    document.getElementById('bannedBtn').style.display = 'inline-block';
                    document.getElementById('saveBtn').style.display = 'inline-block';
                    
                    updateWeekDisplay();
                    updateButtonStates();
                }
                
                const saveDate = state.saveDate ? new Date(state.saveDate).toLocaleDateString() : 'Unknown date';
                alert(`State loaded successfully! (Saved on ${saveDate})`);
                
            } catch (error) {
                alert('Error loading state file. Please make sure it\'s a valid meal planner state file.');
                console.error('Load state error:', error);
            }
        };
        
        reader.readAsText(file);
    };
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
}
