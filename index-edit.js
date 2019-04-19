let textAreaEl = document.querySelector('#instruction_body')
let recipeId = location.hash.substring(1)
let recipes = getSavedRecipes()
let recipe = recipes.find((recipe) => {
    return recipe.id === recipeId
})

const filters = {
    searchText: '',
    hideCompleted: false
}

if (recipe === undefined) {
    location.assign('/index.html')
}

textAreaEl.value = recipe.body

textAreaEl.addEventListener('input', (e) => {
    recipe.body = e.target.value
    saveRecipes(recipes)
})

// Add a new ingredient
document.querySelector('#ingredient_form').addEventListener('submit', (e) => {
    const ingredient = e.target.elements.addIngredient.value.trim()
    recipe.ingredients.push({
        name: ingredient,
        completed: false
    })
    saveRecipes(recipes)
    e.target.elements.addIngredient.value = ''
    
    recipes = getSavedRecipes()
    ingredientsRenderPage(recipe.ingredients)
})

// Toggle completed 
document.querySelector('#hide-completed').addEventListener('change', (e) => {
    filters.hideCompleted = e.target.checked
    renderRecipes(recipes, filters)
})

// Generate DOM structure for ingredient
const generateIngredientDOM = (ingredient) => {
    const ingredientName = document.createElement('label')
    
    if (ingredient.name.length > 0) {
        ingredientName.textContent = ingredient.name
    } else {
        ingredientName.textContent = 'Unnamed Ingredient'
    }
    
    return ingredientName
}



const filteredIngredients = recipe.ingredients.filter((ingredient) => {
    const hideCompletedMatch = !filters.hideCompleted || !ingredient.completed

        return hideCompletedMatch 
})

const ingredientsRenderPage = (filteredIngredients) => {
    const ingredientContainer = document.querySelector('#ingredients')
    ingredientContainer.innerHTML = ''
    filteredIngredients.map(ingredient => {
        // Create a container for the ingredients
        const ingredientEl = document.createElement('p')
        const ingredientName = generateIngredientDOM(ingredient)
        const checkBox = document.createElement('input')
        const removeEl = document.createElement('button')
    
        ingredientContainer.appendChild(ingredientEl)
    
        // Setup checkbox
        checkBox.checked = ingredient.completed
        checkBox.setAttribute('type', 'checkbox')
        checkBox.addEventListener('change', function () {
            toggleIngredient(ingredient.id)
            saveRecipes(recipes)
            // renderRecipes(recipes)
        })

        // Setup remove button
        removeEl.textContent = 'Remove'
        removeEl.classList.add('remove_button')
        removeEl.addEventListener('click', (e) => {
            removeIngredient(ingredient.name)
            saveRecipes(recipes)
            // renderRecipes(recipes)
        })

        // Add all elements to the ingredientEl as you create them
        ingredientEl.appendChild(removeEl)
        ingredientEl.appendChild(ingredientName)
        ingredientEl.appendChild(checkBox)
    })
}

ingredientsRenderPage(filteredIngredients)
