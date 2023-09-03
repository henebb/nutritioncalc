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
const initialNutritionData = {
  chosenIngredients: JSON.parse(
    localStorage.getItem(chosenIngredientsStorageKeyName)
  ),
  preDefinedIngredients: [],
};

const nutritionActionTypes = {
  addChosenIngredient: "ADD_CHOSEN_INGREDIENT",
  deleteChosenIngredient: "DELETE_CHOSEN_INGREDIENT",
  updateChosenIngredient: "UPDATE_CHOSEN_INGREDIENT",
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
        alert("Denna ingrediens finns redan tillagd");
        return;
      }
      const updatedIngredient = { ...action.payload, name: nameLowerCased };

      return {
        chosenIngredients: [updatedIngredient, ...state.chosenIngredients],
        preDefinedIngredients: state.preDefinedIngredients,
      };
    case nutritionActionTypes.deleteChosenIngredient:
      return {
        chosenIngredients: state.chosenIngredients.filter(
          (i) => i.short !== action.payload
        ),
        preDefinedIngredients: state.preDefinedIngredients,
      };
    case nutritionActionTypes.updateChosenIngredient:
      const ingredientToUpdate = {
        ...action.payload,
        weight: action.payload.weight.replace(",", "."),
        kcal: action.payload.kcal.replace(",", "."),
        proteins: action.payload.proteins.replace(",", "."),
        fat: action.payload.fat.replace(",", "."),
        carbs: action.payload.carbs.replace(",", "."),
      };
      return {
        chosenIngredients: state.chosenIngredients.map((i) =>
          i.short === ingredientToUpdate.short ? ingredientToUpdate : i
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
