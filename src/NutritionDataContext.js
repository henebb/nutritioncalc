import {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
} from "react";
import { updateApiKey } from "./api";

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

function updateLocalStore(chosenIngredients) {
  localStorage.setItem(
    chosenIngredientsStorageKeyName,
    JSON.stringify(chosenIngredients)
  );
}

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
      const newStateAfterAdd = {
        chosenIngredients: updatedChosenIngredients,
        preDefinedIngredients: state.preDefinedIngredients,
      };
      // Also store in local storage:
      updateLocalStore(newStateAfterAdd.chosenIngredients);

      return newStateAfterAdd;
    case nutritionActionTypes.deleteChosenIngredient:
      const newStateAfterDelete = {
        // Use "name" here, since it might be added as a manual ingredient,
        // and then it has no "short"
        chosenIngredients: state.chosenIngredients.filter(
          (i) => i.name !== action.payload
        ),
        preDefinedIngredients: state.preDefinedIngredients,
      };
      // Also store in local storage:
      updateLocalStore(newStateAfterDelete.chosenIngredients);

      return newStateAfterDelete;
    case nutritionActionTypes.updateChosenIngredientName:
      // Check if already exists
      let newName = action.payload.newName;
      if (
        state.chosenIngredients.some((i) => i.name === action.payload.newName)
      ) {
        newName = `${newName}_ny`;
      }

      const newStateAfterUpdate = {
        chosenIngredients: state.chosenIngredients.map((i) =>
          i.name === action.payload.oldName
            ? { ...i, name: newName.toLocaleLowerCase("sv-SE") }
            : i
        ),
        preDefinedIngredients: state.preDefinedIngredients,
      };
      // Also store in local storage:
      updateLocalStore(newStateAfterUpdate.chosenIngredients);

      return newStateAfterUpdate;
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

      const newStateAfterItemUpdate = {
        // Use "name" here, since it might be added as a manual ingredient,
        // and then it has no "short"
        chosenIngredients: state.chosenIngredients.map((i) =>
          i.name === ingredientToUpdate.name ? ingredientToUpdate : i
        ),
        preDefinedIngredients: state.preDefinedIngredients,
      };
      // Also store in local storage:
      updateLocalStore(newStateAfterItemUpdate.chosenIngredients);

      return newStateAfterItemUpdate;
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

  useEffect(() => {
    localStorage.setItem(apiKeyName, apiKey);
    updateApiKey(apiKey);
  }, [apiKey]);

  return (
    <NutritionDataContext.Provider
      value={{
        nutritionData: nutritionData,
        dispatch: dispatch,
        apiKey: apiKey,
        setApiKey: setApiKey,
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
