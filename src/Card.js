import { useCallback, useMemo, useState } from "react";
import "./card.css";
import { useNutritionData, nutritionActionTypes } from "./NutritionDataContext";

function Card({ ingredient }) {
  const [name, setName] = useState(`${ingredient.name}`);
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

  return (
    <div className="container-fluid ingredient-card">
      <div className="row">
        <div className="col-10">
          <input
            type="text"
            value={name}
            className="ingredient-name"
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
        </div>
        <div className="col-2" style={{ textAlign: "right" }}>
          {/* Delete ingredient */}
          <button
            className="btn btn-sm btn-danger"
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
            <i className="bi bi-trash3"></i>
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-2">Vikt</div>
        <div className="col-2">Kcal</div>
        <div className="col-2">Proteiner</div>
        <div className="col-2">Fett</div>
        <div className="col-2">Kolh.</div>
      </div>
      <div className="row">
        <div className="col-2">
          <input
            type="number"
            className="form-control form-control-sm"
            value={ingredient.weight}
            onChange={(e) => {
              dispatch({
                type: nutritionActionTypes.updateChosenIngredient,
                payload: { ...ingredient, weight: e.target.value },
              });
            }}
            onBlur={(e) => {
              // Reset to 0 if empty field
              if (e.target.value === "") {
                dispatch({
                  type: nutritionActionTypes.updateChosenIngredient,
                  payload: { ...ingredient, weight: 0 },
                });
              }
            }}
          />
        </div>
        <div className="col-2">
          <input
            type="number"
            className="form-control form-control-sm"
            value={ingredient.kcal}
            onChange={(e) => {
              dispatch({
                type: nutritionActionTypes.updateChosenIngredient,
                payload: { ...ingredient, kcal: e.target.value },
              });
            }}
            onBlur={(e) => {
              // Reset to 0 if empty field
              if (e.target.value === "") {
                dispatch({
                  type: nutritionActionTypes.updateChosenIngredient,
                  payload: { ...ingredient, kcal: 0 },
                });
              }
            }}
          />
        </div>
        <div className="col-2">
          <input
            type="number"
            className="form-control form-control-sm"
            value={ingredient.proteins}
            onChange={(e) => {
              dispatch({
                type: nutritionActionTypes.updateChosenIngredient,
                payload: { ...ingredient, proteins: e.target.value },
              });
            }}
            onBlur={(e) => {
              // Reset to 0 if empty field
              if (e.target.value === "") {
                dispatch({
                  type: nutritionActionTypes.updateChosenIngredient,
                  payload: { ...ingredient, proteins: 0 },
                });
              }
            }}
          />
        </div>
        <div className="col-2">
          <input
            type="number"
            className="form-control form-control-sm"
            value={ingredient.fat}
            onChange={(e) => {
              dispatch({
                type: nutritionActionTypes.updateChosenIngredient,
                payload: { ...ingredient, fat: e.target.value },
              });
            }}
            onBlur={(e) => {
              // Reset to 0 if empty field
              if (e.target.value === "") {
                dispatch({
                  type: nutritionActionTypes.updateChosenIngredient,
                  payload: { ...ingredient, fat: 0 },
                });
              }
            }}
          />
        </div>
        <div className="col-2">
          <input
            type="number"
            className="form-control form-control-sm"
            value={ingredient.carbs}
            onChange={(e) => {
              dispatch({
                type: nutritionActionTypes.updateChosenIngredient,
                payload: { ...ingredient, carbs: e.target.value },
              });
            }}
            onBlur={(e) => {
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
      </div>
      <div className="row total">
        <div className="col-2">Totalt:</div>
        <div className="col-2">{totalKcal} kcal</div>
        <div className="col-2">{totalProteins} g</div>
        <div className="col-2">{totalFat} g</div>
        <div className="col-2">{totalCarbs} g</div>
      </div>
    </div>
  );
}

export default Card;
