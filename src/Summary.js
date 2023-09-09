import { useMemo } from "react";
import { useNutritionData } from "./NutritionDataContext";
import "./summary.css";

function Summary({ target }) {
  const { nutritionData } = useNutritionData();

  const totals = useMemo(() => {
    if (nutritionData == null || nutritionData.chosenIngredients == null) {
      return {
        kcal: 0,
        proteins: 0,
        fat: 0,
        carbs: 0,
      };
    }

    // Only use ingredients that have valid numbers
    const validIngredients = nutritionData.chosenIngredients.filter(
      (i) =>
        !isNaN(i.weight) &&
        !isNaN(i.kcal) &&
        !isNaN(i.proteins) &&
        !isNaN(i.fat) &&
        !isNaN(i.carbs)
    );

    const totalKcal = validIngredients.reduce(
      (acc, value) => acc + Number(value.weight) * 0.01 * Number(value.kcal),
      0
    );
    const totalProteins = validIngredients.reduce(
      (acc, value) =>
        acc + Number(value.weight) * 0.01 * Number(value.proteins),
      0
    );
    const totalFat = validIngredients.reduce(
      (acc, value) => acc + Number(value.weight) * 0.01 * Number(value.fat),
      0
    );
    const totalCarbs = validIngredients.reduce(
      (acc, value) => acc + Number(value.weight) * 0.01 * Number(value.carbs),
      0
    );

    return {
      kcal: totalKcal.toFixed(),
      proteins: totalProteins.toFixed(),
      fat: totalFat.toFixed(),
      carbs: totalCarbs.toFixed(),
    };
  }, [nutritionData]);

  return (
    <div className="fixed-bottom bg-body summary p-2">
      <div className="row header-row fw-bold">
        <div className="col"></div>
        <div className="col">Energi</div>
        <div className="col">Proteiner</div>
        <div className="col">Fett</div>
        <div className="col">Kolh.</div>
      </div>
      <div className="row total-row fw-bold text-nowrap">
        <div className="col text-end">Total:</div>
        <div className="col ">{totals.kcal} kcal</div>
        <div className="col">{totals.proteins} g</div>
        <div className="col">{totals.fat} g</div>
        <div className="col">{totals.carbs}g</div>
      </div>
      <div className="row target-row text-nowrap">
        <div className="col text-end">Mål:</div>
        <div className="col">{target.kcal} kcal</div>
        <div className="col">{target.proteins} g</div>
        <div className="col">{target.fat} g</div>
        <div className="col">{target.carbs} g</div>
      </div>
    </div>
  );
}

export default Summary;
