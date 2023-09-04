import { useState } from "react";
import IdModal from "./IdModal";
import "./add-ingredient.css";
import { useNutritionData, nutritionActionTypes } from "./NutritionDataContext";

function AddIngredient() {
  const [name, setName] = useState("");
  const [editApiKey, setEditApiKey] = useState("");
  const [alreadyChosen, setAlreadyChosen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { nutritionData, dispatch, apiKey, handleApiKey } = useNutritionData();

  const apiKeyAvailable = apiKey != null && apiKey !== "";

  function handleSubmit(e) {
    e.preventDefault();

    const nameLowerCased = name.toLocaleLowerCase("sv-SE");

    // Check if the name exists in the list of predefined,
    // if so, fetch it from that list and use it as the added item.
    const existingPreDef = nutritionData.preDefinedIngredients.find(
      (i) => i.name === nameLowerCased || i.short === nameLowerCased
    );

    let newItem = {};
    if (existingPreDef) {
      newItem = existingPreDef;
    } else {
      newItem = {
        name: name,
        weight: 0,
        kcal: 0,
        proteins: 0,
        fat: 0,
        carbs: 0,
      };
    }

    // Check if already a chosen ingredient
    if (nutritionData.chosenIngredients.some((i) => i.name === newItem.name)) {
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
      <form className="row add-form mb-2" onSubmit={handleSubmit}>
        <div className="col-5">
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
            className="form-control"
            placeholder="Ingrediens"
          />
        </div>
        <div className="col-6">
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={!name}
          >
            Lägg till
          </button>
        </div>
      </form>
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
      <div className="row mb-2 id-modal">
        <div className="col-5">
          {apiKeyAvailable ? (
            <IdModal />
          ) : (
            <input
              type="text"
              className="form-control"
              value={editApiKey}
              onChange={(e) => setEditApiKey(e.target.value)}
            />
          )}
        </div>
        {!apiKeyAvailable && (
          <div className="col-6">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleApiKey(editApiKey)}
            >
              OK
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default AddIngredient;
