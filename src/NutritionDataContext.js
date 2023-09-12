import {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
} from "react";
import { updateApiKey } from "./api";

const apiKeyName = "apiKey";

const stateStorageKeyName = "state";

// Preload data from local storage
const localStoredState = JSON.parse(localStorage.getItem(stateStorageKeyName));

const initialNutritionData = localStoredState ?? {
  chosenIngredients: [],
  preDefinedIngredients: [],
};

const nutritionActionTypes = {
  addChosenIngredient: "ADD_CHOSEN_INGREDIENT",
  deleteChosenIngredient: "DELETE_CHOSEN_INGREDIENT",
  updateChosenIngredient: "UPDATE_CHOSEN_INGREDIENT",
  updateChosenIngredientName: "UPDATE_CHOSEN_INGREDIENT_NAME",
  updateChosenIngredientId: "UPDATE_CHOSEN_INGREDIENT_ID",
  loadPreDefIngredients: "LOAD_PREDEF_INGREDIENTS",
  addPreDefIngredient: "ADD_PREDEF_INGREDIENT",
  updatePreDefIngredient: "UPDATE_PREDEF_INGREDIENT",
};

function nutritionStoreReducer(state, action) {
  switch (action.type) {
    case nutritionActionTypes.addChosenIngredient:
      // You can add a manual ingredient (without "short"), so check duplicate on name)
      // If already added (for meal) just return state.
      const nameLowerCased = action.payload.name.toLocaleLowerCase("sv-SE");
      if (
        state.chosenIngredients.some(
          (i) => i.name === nameLowerCased && i.meal === action.payload.meal
        )
      ) {
        return state;
      }
      const updatedIngredient = { ...action.payload, name: nameLowerCased };

      const updatedChosenIngredients = [
        updatedIngredient,
        ...state.chosenIngredients,
      ];
      return {
        chosenIngredients: updatedChosenIngredients,
        preDefinedIngredients: state.preDefinedIngredients,
      };
    case nutritionActionTypes.deleteChosenIngredient:
      return {
        // Use "name" here, since it might be added as a manual ingredient,
        // and then it has no "short"
        chosenIngredients: state.chosenIngredients.filter(
          (i) =>
            !(
              i.name === action.payload.name &&
              i.meal === action.payload.selectedMeal
            )
        ),
        preDefinedIngredients: state.preDefinedIngredients,
      };
    case nutritionActionTypes.updateChosenIngredientName:
      // Check if already exists
      let newName = action.payload.newName;
      if (
        state.chosenIngredients.some(
          (i) =>
            i.name === action.payload.newName &&
            i.meal === action.payload.selectedMeal
        )
      ) {
        newName = `${newName}_ny`;
      }

      return {
        chosenIngredients: state.chosenIngredients.map((i) =>
          i.name === action.payload.oldName
            ? { ...i, name: newName.toLocaleLowerCase("sv-SE") }
            : i
        ),
        preDefinedIngredients: state.preDefinedIngredients,
      };
    case nutritionActionTypes.updateChosenIngredientId:
      return {
        chosenIngredients: state.chosenIngredients.map((i) =>
          i.name === action.payload.name
            ? { ...i, short: action.payload.short.toLocaleLowerCase("sv-SE") }
            : i
        ),
        preDefinedIngredients: state.preDefinedIngredients,
      };

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
          i.name === ingredientToUpdate.name &&
          i.meal === ingredientToUpdate.meal
            ? ingredientToUpdate
            : i
        ),
        preDefinedIngredients: state.preDefinedIngredients,
      };
    case nutritionActionTypes.loadPreDefIngredients:
      return {
        chosenIngredients: state.chosenIngredients,
        preDefinedIngredients: action.payload,
      };
    case nutritionActionTypes.addPreDefIngredient:
      // If no predef ingredients loaded, then don' add it.
      // It will otherwise stop the load of all predef via API.
      if (
        state.preDefinedIngredients == null ||
        state.preDefinedIngredients.length === 0
      ) {
        return state;
      }
      return {
        chosenIngredients: state.chosenIngredients,
        preDefinedIngredients: [action.payload, ...state.preDefinedIngredients],
      };
    case nutritionActionTypes.updatePreDefIngredient:
      const preDefToUpdate = {
        ...action.payload,
        name: action.payload.name,
        description: action.payload.description,
        weight: isNaN(action.payload.weight)
          ? action.payload.weight.replace(",", ".")
          : action.payload.weight,
        kcal: isNaN(action.payload.kcal)
          ? action.payload.kcal.replace(",", ".")
          : action.payload.kcal,
        proteins: isNaN(action.payload.proteins)
          ? action.payload.proteins.replace(",", ".")
          : action.payload.proteins,
        fat: isNaN(action.payload.fat)
          ? action.payload.fat.replace(",", ".")
          : action.payload.fat,
        carbs: isNaN(action.payload.carbs)
          ? action.payload.carbs.replace(",", ".")
          : action.payload.carbs,
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

const mealTargets = [
  {
    meal: "breakfast",
    description: "Frukost",
    kcal: 350,
    proteins: 30,
    fat: 12,
    carbs: 33,
  },
  {
    meal: "lunch",
    description: "Lunch",
    kcal: 550,
    proteins: 40,
    fat: 20,
    carbs: 55,
  },
  {
    meal: "snack_1",
    description: "Mellis",
    kcal: 350,
    proteins: 30,
    fat: 12,
    carbs: 33,
  },
  {
    meal: "dinner",
    description: "Middag",
    kcal: 550,
    proteins: 40,
    fat: 20,
    carbs: 55,
  },
  {
    meal: "snack_2",
    description: "Kvällsmål",
    kcal: 350,
    proteins: 30,
    fat: 12,
    carbs: 33,
  },
];

const NutritionDataContext = createContext();

function NutritionDataProvider({ children }) {
  const [apiKey, setApiKey] = useState(localStorage.getItem(apiKeyName));
  const [selectedMeal, setSelectedMeal] = useState(
    localStorage.getItem("selectedMeal") ?? mealTargets[0].meal
  );

  // Set description for selected meal
  const selectedMealDescription = mealTargets.find(
    (m) => m.meal === selectedMeal
  ).description;

  const [nutritionData, dispatch] = useReducer(
    nutritionStoreReducer,
    initialNutritionData
  );

  useEffect(() => {
    localStorage.setItem(apiKeyName, apiKey);
    updateApiKey(apiKey);
  }, [apiKey]);

  // Always set local storage when state change
  useEffect(
    () =>
      localStorage.setItem(stateStorageKeyName, JSON.stringify(nutritionData)),
    [nutritionData]
  );

  // Always store selected meal in local storage on change
  useEffect(() => {
    localStorage.setItem("selectedMeal", selectedMeal);
  }, [selectedMeal]);

  return (
    <NutritionDataContext.Provider
      value={{
        nutritionData: nutritionData,
        dispatch: dispatch,
        apiKey: apiKey,
        setApiKey: setApiKey,
        mealTargets: mealTargets,
        selectedMeal: selectedMeal,
        setSelectedMeal: setSelectedMeal,
        selectedMealDescription: selectedMealDescription,
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
