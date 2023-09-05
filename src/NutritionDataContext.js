import {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
} from "react";

const apiKeyName = "apiKey";

const chosenIngredientsStorageKeyName = "chosenIngredients";

// Preload data from local storage
const localStoredChosenIngredients = JSON.parse(
  localStorage.getItem(chosenIngredientsStorageKeyName)
);

const initialNutritionData = {
  chosenIngredients: localStoredChosenIngredients ?? [],
  preDefinedIngredients: [],
};

const nutritionActionTypes = {
  addChosenIngredient: "ADD_CHOSEN_INGREDIENT",
  deleteChosenIngredient: "DELETE_CHOSEN_INGREDIENT",
  updateChosenIngredient: "UPDATE_CHOSEN_INGREDIENT",
  updateChosenIngredientName: "UPDATE_CHOSEN_INGREDIENT_NAME",
  loadPreDefIngredients: "LOAD_PREDEF_INGREDIENTS",
  addPreDefIngredient: "ADD_PREDEF_INGREDIENT",
  updatePreDefIngredient: "UPDATE_PREDEF_INGREDIENT",
};

function nutritionStoreReducer(state, action) {
  switch (action.type) {
    case nutritionActionTypes.addChosenIngredient:
      // You can add a manual ingredient (without "short"), so check duplicate on name)
      const nameLowerCased = action.payload.name.toLocaleLowerCase("sv-SE");
      if (state.chosenIngredients.some((i) => i.name === nameLowerCased)) {
        return state;
      }
      const updatedIngredient = { ...action.payload, name: nameLowerCased };

      const updatedChosenIngredients = [
        updatedIngredient,
        ...state.chosenIngredients,
      ];
      // Also store in local storage:
      localStorage.setItem(
        chosenIngredientsStorageKeyName,
        JSON.stringify(updatedChosenIngredients)
      );
      return {
        chosenIngredients: updatedChosenIngredients,
        preDefinedIngredients: state.preDefinedIngredients,
      };
    case nutritionActionTypes.deleteChosenIngredient:
      const chosenIngredientsAfterDelete = {
        // Use "name" here, since it might be added as a manual ingredient,
        // and then it has no "short"
        chosenIngredients: state.chosenIngredients.filter(
          (i) => i.name !== action.payload
        ),
        preDefinedIngredients: state.preDefinedIngredients,
      };
      // Also store in local storage:
      localStorage.setItem(
        chosenIngredientsStorageKeyName,
        JSON.stringify(chosenIngredientsAfterDelete)
      );
      return chosenIngredientsAfterDelete;
    case nutritionActionTypes.updateChosenIngredientName:
      // Check if already exists
      let newName = action.payload.newName;
      if (
        state.chosenIngredients.some((i) => i.name === action.payload.newName)
      ) {
        newName = `${newName}_ny`;
      }

      const chosenIngredientsAfterUpdate = {
        chosenIngredients: state.chosenIngredients.map((i) =>
          i.name === action.payload.oldName
            ? { ...i, name: newName.toLocaleLowerCase("sv-SE") }
            : i
        ),
        preDefinedIngredients: state.preDefinedIngredients,
      };
      // Also store in local storage:
      localStorage.setItem(
        chosenIngredientsStorageKeyName,
        JSON.stringify(chosenIngredientsAfterUpdate)
      );
      return chosenIngredientsAfterUpdate;
    case nutritionActionTypes.updateChosenIngredient:
      const ingredientToUpdate = {
        ...action.payload,
        weight:
          action.payload.weight === ""
            ? ""
            : action.payload.weight.toString().replace(",", "."),
        kcal:
          action.payload.kcal === ""
            ? ""
            : action.payload.kcal.toString().replace(",", "."),
        proteins:
          action.payload.proteins === ""
            ? ""
            : action.payload.proteins.toString().replace(",", "."),
        fat:
          action.payload.fat === ""
            ? ""
            : action.payload.fat.toString().replace(",", "."),
        carbs:
          action.payload.carbs === ""
            ? ""
            : action.payload.carbs.toString().replace(",", "."),
      };
      return {
        // Use "name" here, since it might be added as a manual ingredient,
        // and then it has no "short"
        chosenIngredients: state.chosenIngredients.map((i) =>
          i.name === ingredientToUpdate.name ? ingredientToUpdate : i
        ),
        preDefinedIngredients: state.preDefinedIngredients,
      };
    case nutritionActionTypes.loadPreDefIngredients:
      return {
        chosenIngredients: state.chosenIngredients,
        preDefinedIngredients: action.payload,
      };
    case nutritionActionTypes.addPreDefIngredient:
      return {
        chosenIngredients: state.chosenIngredients,
        preDefinedIngredients: [action.payload, ...state.preDefinedIngredients],
      };
    case nutritionActionTypes.updatePreDefIngredient:
      const preDefToUpdate = {
        ...action.payload,
        weight: action.payload.weight.replace(",", "."),
        kcal: action.payload.kcal.replace(",", "."),
        proteins: action.payload.proteins.replace(",", "."),
        fat: action.payload.fat.replace(",", "."),
        carbs: action.payload.carbs.replace(",", "."),
      };
      return {
        chosenIngredients: state.chosenIngredients,
        preDefinedIngredients: state.preDefinedIngredients.map((pi) =>
          pi.short === preDefToUpdate.short ? preDefToUpdate : pi
        ),
      };
    default:
      return state;
  }
}

const NutritionDataContext = createContext();

function NutritionDataProvider({ children }) {
  const [apiKey, setApiKey] = useState(localStorage.getItem(apiKeyName));

  const [nutritionData, dispatch] = useReducer(
    nutritionStoreReducer,
    initialNutritionData
  );

  // Empty dependency array will cause to only load once
  useEffect(() => {
    // No api key?
    if (!apiKey) {
      return;
    }
    // Already loaded?
    if (nutritionData.preDefinedIngredients.length > 0) {
      return;
    }
    fetch("https://fn-22plrgrwvmnok.azurewebsites.net/api/nutritions", {
      method: "GET",
      cache: "no-store",
      headers: {
        "x-functions-key": apiKey,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        dispatch({
          type: nutritionActionTypes.loadPreDefIngredients,
          payload: json,
        });
      });
  }, [apiKey, nutritionData, dispatch]);

  // If apiKey is set, set localStorage and reload page.
  function handleApiKey(newApiKey) {
    localStorage.setItem(apiKeyName, newApiKey);
    setApiKey(newApiKey);
  }

  return (
    <NutritionDataContext.Provider
      value={{
        nutritionData: nutritionData,
        dispatch: dispatch,
        apiKey: apiKey,
        handleApiKey: handleApiKey,
      }}
    >
      {children}
    </NutritionDataContext.Provider>
  );
}

function useNutritionData() {
  return useContext(NutritionDataContext);
}

export { useNutritionData, NutritionDataProvider, nutritionActionTypes };
