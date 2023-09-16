import { useMemo } from "react";
import { useNutritionData } from "./NutritionDataContext";
import SummaryModal from "./SummaryModal";
import "./summary.css";

function Summary() {
  const summaryModalId = "summaryModal";

  const { nutritionData, mealTargets, selectedMeal, selectedMealDescription } =
    useNutritionData();

  // Calculate day total:
  const dayTotals = useMemo(() => {
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

  // Calculate day target:
  const dayTargets = useMemo(() => {
    if (mealTargets == null) {
      return {
        kcal: 0,
        proteins: 0,
        fat: 0,
        carbs: 0,
      };
    }
    return {
      kcal: mealTargets.reduce((acc, value) => acc + value.kcal, 0),
      proteins: mealTargets.reduce((acc, value) => acc + value.proteins, 0),
      fat: mealTargets.reduce((acc, value) => acc + value.fat, 0),
      carbs: mealTargets.reduce((acc, value) => acc + value.carbs, 0),
    };
  }, [mealTargets]);

  // Calculate meal totals:
  // Fake:
  const mealTotals = useMemo(() => {
    if (nutritionData == null || nutritionData.chosenIngredients == null) {
      return {
        kcal: 0,
        proteins: 0,
        fat: 0,
        carbs: 0,
      };
    }

    // Only use ingredients with specific meal type and only that have valid numbers
    const validMealIngredients = nutritionData.chosenIngredients.filter(
      (i) =>
        i.meal === selectedMeal &&
        !isNaN(i.weight) &&
        !isNaN(i.kcal) &&
        !isNaN(i.proteins) &&
        !isNaN(i.fat) &&
        !isNaN(i.carbs)
    );

    const totalKcal = validMealIngredients.reduce(
      (acc, value) => acc + Number(value.weight) * 0.01 * Number(value.kcal),
      0
    );
    const totalProteins = validMealIngredients.reduce(
      (acc, value) =>
        acc + Number(value.weight) * 0.01 * Number(value.proteins),
      0
    );
    const totalFat = validMealIngredients.reduce(
      (acc, value) => acc + Number(value.weight) * 0.01 * Number(value.fat),
      0
    );
    const totalCarbs = validMealIngredients.reduce(
      (acc, value) => acc + Number(value.weight) * 0.01 * Number(value.carbs),
      0
    );

    return {
      kcal: totalKcal.toFixed(),
      proteins: totalProteins.toFixed(),
      fat: totalFat.toFixed(),
      carbs: totalCarbs.toFixed(),
    };
  }, [nutritionData, selectedMeal]);

  // Calculate meal target:
  const mealTarget =
    mealTargets != null
      ? mealTargets.find((t) => t.meal === selectedMeal)
      : {
          kcal: 0,
          proteins: 0,
          fat: 0,
          carbs: 0,
        };

  return (
    <>
      <div className="fixed-bottom bg-body summary pe-3 pt-2">
        <table className="table table-sm">
          <thead>
            <tr className="header-row">
              <th>
                <button
                  type="button"
                  className="btn btn-sm p-0"
                  data-bs-toggle="modal"
                  data-bs-target={`#${summaryModalId}`}
                >
                  <i
                    className="bi bi-info-circle text-warning"
                    aria-hidden="true"
                  >
                    <span>i</span>
                  </i>
                </button>
              </th>
              <th>Energi</th>
              <th>Proteiner</th>
              <th>Fett</th>
              <th>Kolh.</th>
            </tr>
          </thead>
          <tbody>
            <tr className="fw-bold">
              <td className="text-end">Total:</td>
              <td>{dayTotals.kcal} kcal</td>
              <td>{dayTotals.proteins} g</td>
              <td>{dayTotals.fat} g</td>
              <td>{dayTotals.carbs} g</td>
            </tr>
            <tr>
              <td className="text-end">Dagmål:</td>
              <td>{dayTargets.kcal} kcal</td>
              <td>{dayTargets.proteins} g</td>
              <td>{dayTargets.fat} g</td>
              <td>{dayTargets.carbs} g</td>
            </tr>
            <tr>
              <td className="text-end">{selectedMealDescription}:</td>
              <td>{mealTotals.kcal} kcal</td>
              <td>{mealTotals.proteins} g</td>
              <td>{mealTotals.fat} g</td>
              <td>{mealTotals.carbs} g</td>
            </tr>
            <tr>
              <td className="text-end">
                {selectedMealDescription.substring(0, 2)}.mål:
              </td>
              <td>{mealTarget.kcal} kcal</td>
              <td>{mealTarget.proteins} g</td>
              <td>{mealTarget.fat} g</td>
              <td>{mealTarget.carbs} g</td>
            </tr>
          </tbody>
        </table>
      </div>
      <SummaryModal
        summaryModalId={summaryModalId}
        meal={selectedMealDescription}
        totalKcalDiff={dayTotals.kcal - dayTargets.kcal}
        totalProteinsDiff={dayTotals.proteins - dayTargets.proteins}
        mealTotalKcalDiff={mealTotals.kcal - mealTarget.kcal}
        mealTotalProteinsDiff={mealTotals.proteins - mealTarget.proteins}
      />
    </>
  );
}

export default Summary;
