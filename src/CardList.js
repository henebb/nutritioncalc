import { useNutritionData } from "./NutritionDataContext";
import Card from "./Card";

function CardList() {
  const { nutritionData } = useNutritionData();

  return (
    <div>
      {nutritionData != null &&
      nutritionData.chosenIngredients != null &&
      nutritionData.chosenIngredients.length > 0 ? (
        nutritionData.chosenIngredients.map((ingredient) => (
          // use "name" as key, since "short" might not be set (if added manually)
          <Card ingredient={ingredient} key={ingredient.name} />
        ))
      ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="col-10 alert alert-info">
              Inga ingredienser tillagda ännu...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CardList;
