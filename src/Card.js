import { useCallback, useMemo, useState } from "react";
import { useNutritionData, nutritionActionTypes } from "./NutritionDataContext";
import CardIngredientEdit from "./CardIngredientEdit";
import "./card.css";
import { isIdAvailable, upsertNutrition } from "./api";

function Card({ ingredient }) {
  const [name, setName] = useState(`${ingredient.name}`);
  const [newManualId, setNewManualId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { dispatch } = useNutritionData();

  const calcTotal = useCallback(
    (value) => (value * 0.01 * ingredient.weight).toFixed(),
    [ingredient.weight]
  );
  const totalKcal = useMemo(
    () => calcTotal(ingredient.kcal),
    [ingredient.kcal, calcTotal]
  );
  const totalProteins = useMemo(
    () => calcTotal(ingredient.proteins),
    [ingredient.proteins, calcTotal]
  );
  const totalFat = useMemo(
    () => calcTotal(ingredient.fat),
    [ingredient.fat, calcTotal]
  );
  const totalCarbs = useMemo(
    () => calcTotal(ingredient.carbs),
    [ingredient.carbs, calcTotal]
  );

  const isNewItem = ingredient.short == null || ingredient.short === "";

  async function handleAddManualItem() {
    if (newManualId == null || newManualId.trim() === "") {
      return;
    }

    setIsSaving(true);

    const isAvailable = await isIdAvailable(newManualId.trim());
    if (!isAvailable) {
      alert(`${newManualId} är tyvärr upptaget.`);
      setIsSaving(false);
      return;
    }

    const itemToAdd = {
      short: newManualId,
      name: ingredient.name,
      description: "",
      weight: ingredient.weight,
      kcal: ingredient.kcal,
      proteins: ingredient.proteins,
      fat: ingredient.fat,
      carbs: ingredient.carbs,
    };
    try {
      await upsertNutrition(itemToAdd);
    } catch (error) {
      console.error(error);
    }

    // Update the id
    dispatch({
      type: nutritionActionTypes.updateChosenIngredientId,
      payload: { name: itemToAdd.name, short: itemToAdd.short },
    });

    // Also add it to list of predefined ingredients.
    dispatch({
      type: nutritionActionTypes.addPreDefIngredient,
      payload: itemToAdd,
    });

    setIsSaving(false);
  }

  return (
    <div
      className={`ingredient-card shadow-sm bg-body rounded border p-2 mb-2 ${
        isNewItem ? "border-primary" : null
      }`}
    >
      <div className="row ms-1 me-0 mb-2 justify-content-around">
        <input
          type="text"
          value={name}
          className="col ps-0 border-0"
          onChange={(e) => setName(e.target.value.toLocaleLowerCase("sv-SE"))}
          onBlur={(e) => {
            if (name === ingredient.name) {
              // Unchanged
              return;
            }
            dispatch({
              type: nutritionActionTypes.updateChosenIngredientName,
              payload: { oldName: ingredient.name, newName: name },
            });
          }}
        />
        {isNewItem && (
          <input
            id="manual-new-id"
            type="text"
            value={newManualId}
            onChange={(e) => setNewManualId(e.target.value)}
            placeholder="Nytt kortnamn..."
            className="col border rounded p-1"
            style={{ borderColor: "gray", fontSize: "0.8em" }}
          />
        )}
        {/* Delete, or save, ingredient */}
        <div className="col text-end text-nowrap pe-0">
          {isNewItem && (
            <button
              className="btn btn-outline-primary btn-sm me-2"
              type="button"
              onClick={handleAddManualItem}
            >
              {/* Show save icon, or loading icon */}
              <i
                className={`bi ${isSaving ? "bi-arrow-clockwise" : "bi-save"}`}
              />
            </button>
          )}
          <button
            className="btn btn-outline-danger btn-sm"
            type="button"
            onClick={() => {
              dispatch({
                type: nutritionActionTypes.deleteChosenIngredient,
                // Use "name" as payload, since it might be added as a manual ingredient,
                // and then it has no "short".
                payload: ingredient.name,
              });
            }}
          >
            <i className="bi bi-trash3" />
          </button>
        </div>
      </div>
      {ingredient.description && (
        <div style={{ marginTop: "-14px", marginLeft: "4px" }} className="mb-1">
          <i style={{ fontSize: "smaller" }}>{ingredient.description}</i>
        </div>
      )}

      <div className="row pe-2">
        <div className="col">
          <CardIngredientEdit
            ingredientValue={ingredient.weight}
            ingredientTitle="Vikt"
            ingredientUnit="g"
            handleOnChange={(e) => {
              dispatch({
                type: nutritionActionTypes.updateChosenIngredient,
                payload: { ...ingredient, weight: e.target.value },
              });
            }}
            handleOnBlur={(e) => {
              // Reset to 0 if empty field
              if (e.target.value === "") {
                dispatch({
                  type: nutritionActionTypes.updateChosenIngredient,
                  payload: { ...ingredient, weight: 0 },
                });
              }
            }}
          />
          <CardIngredientEdit
            ingredientValue={ingredient.kcal}
            ingredientTitle="Energi"
            ingredientUnit="kcal/100g"
            handleOnChange={(e) => {
              dispatch({
                type: nutritionActionTypes.updateChosenIngredient,
                payload: { ...ingredient, kcal: e.target.value },
              });
            }}
            handleOnBlur={(e) => {
              // Reset to 0 if empty field
              if (e.target.value === "") {
                dispatch({
                  type: nutritionActionTypes.updateChosenIngredient,
                  payload: { ...ingredient, kcal: 0 },
                });
              }
            }}
          />
          <CardIngredientEdit
            ingredientValue={ingredient.proteins}
            ingredientTitle="Proteiner"
            ingredientUnit="g/100g"
            handleOnChange={(e) => {
              dispatch({
                type: nutritionActionTypes.updateChosenIngredient,
                payload: { ...ingredient, proteins: e.target.value },
              });
            }}
            handleOnBlur={(e) => {
              // Reset to 0 if empty field
              if (e.target.value === "") {
                dispatch({
                  type: nutritionActionTypes.updateChosenIngredient,
                  payload: { ...ingredient, proteins: 0 },
                });
              }
            }}
          />
          <CardIngredientEdit
            ingredientValue={ingredient.fat}
            ingredientTitle="Fett"
            ingredientUnit="g/100g"
            handleOnChange={(e) => {
              dispatch({
                type: nutritionActionTypes.updateChosenIngredient,
                payload: { ...ingredient, fat: e.target.value },
              });
            }}
            handleOnBlur={(e) => {
              // Reset to 0 if empty field
              if (e.target.value === "") {
                dispatch({
                  type: nutritionActionTypes.updateChosenIngredient,
                  payload: { ...ingredient, fat: 0 },
                });
              }
            }}
          />
          <CardIngredientEdit
            ingredientValue={ingredient.carbs}
            ingredientTitle="Kolh."
            ingredientUnit="g/100g"
            handleOnChange={(e) => {
              dispatch({
                type: nutritionActionTypes.updateChosenIngredient,
                payload: { ...ingredient, carbs: e.target.value },
              });
            }}
            handleOnBlur={(e) => {
              // Reset to 0 if empty field
              if (e.target.value === "") {
                dispatch({
                  type: nutritionActionTypes.updateChosenIngredient,
                  payload: { ...ingredient, carbs: 0 },
                });
              }
            }}
          />
        </div>
        <div className="col bg-primary rounded shadow-sm border text-white">
          <div
            className="d-flex flex-column justify-content-around p-2"
            style={{ height: "100%" }}
          >
            <strong className="border-bottom">Totalt</strong>
            <span className="text-nowrap">{totalKcal} kcal</span>
            <span className="text-nowrap">{totalProteins} g protein</span>
            <span className="text-nowrap">{totalFat} g fett</span>
            <span className="text-nowrap">{totalCarbs} g kolhydrater</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
