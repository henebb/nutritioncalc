import { useState } from "react";
import IdModal from "./IdModal";
import { useNutritionData, nutritionActionTypes } from "./NutritionDataContext";
import Settings from "./Settings";

function AddIngredient() {
  const [name, setName] = useState("");
  const [editApiKey, setEditApiKey] = useState("");
  const [alreadyChosen, setAlreadyChosen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { nutritionData, dispatch, apiKey, setApiKey, selectedMeal } =
    useNutritionData();

  const apiKeyAvailable = apiKey != null && apiKey !== "";

  function handleSubmit(e) {
    e.preventDefault();

    const nameLowerCasedTrimmed = name.toLocaleLowerCase("sv-SE").trim();

    // Check if the name, or short, exists in the list of predefined,
    // if so, fetch it from that list and use it as the added item.
    const existingPreDef = nutritionData.preDefinedIngredients.find(
      (i) =>
        i.name === nameLowerCasedTrimmed || i.short === nameLowerCasedTrimmed
    );

    let newItem = {};
    if (existingPreDef) {
      newItem = { ...existingPreDef, meal: selectedMeal };
    } else {
      newItem = {
        name: name,
        weight: 0,
        kcal: 0,
        proteins: 0,
        fat: 0,
        carbs: 0,
        meal: selectedMeal,
      };
    }

    // Check if already a chosen ingredient
    if (
      nutritionData.chosenIngredients.some(
        (i) => i.name === newItem.name && i.meal === selectedMeal
      )
    ) {
      // Show, and auto-hide, warning.
      // Use timers to allow animation to complete
      setAlreadyChosen(true);
      setTimeout(() => setShowAlert(true), 10);
      // Hide
      setTimeout(() => setShowAlert(false), 1000);
      setTimeout(() => setAlreadyChosen(false), 1200);

      setName("");
      return;
    }

    dispatch({
      type: nutritionActionTypes.addChosenIngredient,
      payload: newItem,
    });
    setName(""); // Clear input
  }

  return (
    <>
      <div className="row">
        <form className="col-8 add-form mb-2" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-6 pe-1">
              <label
                className="visually-hidden visually-hidden-focusable"
                htmlFor="newIngredientName"
              >
                Ingrediens
              </label>
              <input
                id="newIngredientName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control form-control-sm"
                placeholder="Ingrediens"
              />
            </div>
            <div className="col-4 ps-1">
              <button
                type="submit"
                className="btn btn-primary btn-sm text-nowrap"
                disabled={!name}
              >
                Lägg till
              </button>
            </div>
            <div className="col-2">
              <Settings modalId="settingsModal" />
            </div>
          </div>
        </form>
        <div className="col-4 id-modal text-end">
          {apiKeyAvailable ? (
            <IdModal />
          ) : (
            <input
              type="text"
              className="form-control form-control-sm"
              value={editApiKey}
              onChange={(e) => setEditApiKey(e.target.value)}
            />
          )}
        </div>
        {!apiKeyAvailable && (
          <div className="col">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setApiKey(editApiKey)}
            >
              OK
            </button>
          </div>
        )}
      </div>
      {alreadyChosen && (
        <div className="row">
          <div className="col-5">
            <div
              className={`alert alert-info alert-dismissible fade ${
                showAlert ? "show" : "hide"
              } p-2 mb-2`}
              role="alert"
            >
              Ingrediensen är redan tillagd
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddIngredient;
