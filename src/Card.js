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
    <div className="ingredient-card shadow-sm bg-body rounded border p-2 mb-2">
      <div className="mb-1">
        <div className="d-flex flex-row justify-content-between">
          <input
            type="text"
            value={name}
            className="ingredient-name border-0"
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
          {/* Delete ingredient */}
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
            <i className="bi bi-trash3"></i>
          </button>
        </div>
        {ingredient.description && (
          <div style={{ marginTop: "-10px", paddingLeft: "2px" }}>
            <i style={{ fontSize: "smaller" }}>{ingredient.description}</i>
          </div>
        )}
      </div>
      <div className="d-flex flex-row justify-content-start">
        <div>
          <div className="row">
            <label className="col-3 col-form-label pe-1">Vikt</label>
            <div className="col-4 pe-1">
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
            <div className="col-4 col-form-label ps-0">g</div>
          </div>
          <div className="row">
            <label className="col-3 col-form-label pe-1">Energi</label>
            <div className="col-4 pe-1">
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
            <div className="col-4 col-form-label ps-0">kcal/100g</div>
          </div>
          <div className="row">
            <label className="col-3 col-form-label pe-1">Protein</label>
            <div className="col-4 pe-1">
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
            <div className="col-4 col-form-label ps-0">g/100g</div>
          </div>
          <div className="row">
            <label className="col-3 col-form-label pe-1">Fett</label>
            <div className="col-4 pe-1">
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
            <div className="col-4 col-form-label ps-0">g/100g</div>
          </div>
          <div className="row">
            <label className="col-3 col-form-label pe-1">Kolhydrater</label>
            <div className="col-4 pe-1">
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
            <div className="col-4 col-form-label ps-0">g/100g</div>
          </div>
        </div>
        <div className="flex-grow-1 bg-primary rounded shadow-sm border text-white">
          <div
            className="d-flex flex-column justify-content-around p-2 ps-3"
            style={{ height: "100%" }}
          >
            <strong className="border-bottom">Totalt</strong>
            <span className="text-nowrap">{totalKcal} kcal</span>
            <span className="text-nowrap">{totalProteins}g protein</span>
            <span className="text-nowrap">{totalFat}g fett</span>
            <span className="text-nowrap">{totalCarbs}g kolhydrater</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
