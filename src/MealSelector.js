import { Fragment } from "react";
import { useNutritionData } from "./NutritionDataContext";
import "./meal-selector.css";

function MealSelector() {
  const { mealTargets, selectedMeal, setSelectedMeal } = useNutritionData();

  return (
    <div className="meal-selector">
      <div
        className="btn-group"
        role="group"
        aria-label="Basic radio toggle button group"
      >
        {mealTargets &&
          mealTargets.map((mealTarget) => (
            <Fragment key={mealTarget.meal}>
              <input
                type="radio"
                value={mealTarget.meal}
                className="btn-check"
                name="selectedmeal"
                id={`selected-meal-${mealTarget.meal}`}
                checked={selectedMeal === mealTarget.meal}
                onChange={(e) => setSelectedMeal(e.target.value)}
              />
              <label
                className="btn btn-sm btn-outline-primary"
                htmlFor={`selected-meal-${mealTarget.meal}`}
              >
                {mealTarget.description}
              </label>
            </Fragment>
          ))}
      </div>
    </div>
  );
}

export default MealSelector;
