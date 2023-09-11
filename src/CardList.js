import { useNutritionData } from "./NutritionDataContext";
import Card from "./Card";

function CardList() {
  const { nutritionData, selectedMeal } = useNutritionData();

  const ingredientsForSelectedMeal =
    nutritionData != null && nutritionData.chosenIngredients != null
      ? nutritionData.chosenIngredients.filter(
          (ingredient) => ingredient.meal === selectedMeal
        )
      : [];

  return (
    <div className="card-list-container">
      {ingredientsForSelectedMeal.length > 0 ? (
        ingredientsForSelectedMeal.map((ingredient) => (
          // use "name" as key, since "short" might not be set (if added manually)
          <Card ingredient={ingredient} key={ingredient.name} />
        ))
      ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="col-10 alert alert-info">
              Inga ingredienser tillagda för vald måltid...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CardList;
