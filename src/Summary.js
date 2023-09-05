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
    <div className="fixed-bottom summary">
      <div className="row header-row">
        <div className="col-2"></div>
        <div className="col-2">Energi</div>
        <div className="col-2">Proteiner</div>
        <div className="col-2">Fett</div>
        <div className="col-2">Kolh.</div>
      </div>
      <div className="row total-row">
        <div className="col-2">Total:</div>
        <div className="col-2">{totals.kcal} kcal</div>
        <div className="col-2">{totals.proteins} g</div>
        <div className="col-2">{totals.fat} g</div>
        <div className="col-2">{totals.carbs} g</div>
      </div>
      <div className="row target-row">
        <div className="col-2">Mål:</div>
        <div className="col-2">{target.kcal} kcal</div>
        <div className="col-2">{target.proteins} g</div>
        <div className="col-2">{target.fat} g</div>
        <div className="col-2">{target.carbs} g</div>
      </div>
    </div>
  );
}

export default Summary;
