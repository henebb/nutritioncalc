import { useCallback, useMemo } from "react";
import "./card.css";
import { useNutritionData, nutritionActionTypes } from "./NutritionDataContext";

function Card({ ingredient }) {
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
            value={ingredient.name}
            className="ingredient-name"
            onChange={(e) => {
              dispatch({
                type: nutritionActionTypes.updateChosenIngredient,
                payload: { ...ingredient, name: e.target.value },
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
            value={ingredient.weight}
            onChange={(e) => {
              dispatch({
                type: nutritionActionTypes.updateChosenIngredient,
                payload: { ...ingredient, weight: e.target.value },
              });
            }}
            className="form-control form-control-sm"
          />
        </div>
        <div className="col-2">
          <input
            type="number"
            value={ingredient.kcal}
            onChange={(e) => {
              dispatch({
                type: nutritionActionTypes.updateChosenIngredient,
                payload: { ...ingredient, kcal: e.target.value },
              });
            }}
            className="form-control form-control-sm"
          />
        </div>
        <div className="col-2">
          <input
            type="number"
            value={ingredient.proteins}
            onChange={(e) => {
              dispatch({
                type: nutritionActionTypes.updateChosenIngredient,
                payload: { ...ingredient, proteins: e.target.value },
              });
            }}
            className="form-control form-control-sm"
          />
        </div>
        <div className="col-2">
          <input
            type="number"
            value={ingredient.fat}
            onChange={(e) => {
              dispatch({
                type: nutritionActionTypes.updateChosenIngredient,
                payload: { ...ingredient, fat: e.target.value },
              });
            }}
            className="form-control form-control-sm"
          />
        </div>
        <div className="col-2">
          <input
            type="number"
            value={ingredient.carbs}
            onChange={(e) => {
              dispatch({
                type: nutritionActionTypes.updateChosenIngredient,
                payload: { ...ingredient, carbs: e.target.value },
              });
            }}
            className="form-control form-control-sm"
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
