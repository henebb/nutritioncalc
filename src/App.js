import { useCallback, useEffect, useState } from "react";
import Card from "./Card";
import Summary from "./Summary";
import AddIngredient from "./AddIngredient";
import "./App.css";

const storageKey = "ingredients";
const initialIngredients = JSON.parse(localStorage.getItem(storageKey));
//[
// {
//   name: "Köttfärs 5%",
//   weight: 140,
//   kcal: 129,
//   proteins: 21,
//   fat: 5,
//   carbs: 0,
// },
// {
//   name: "Parmesan",
//   weight: 30,
//   kcal: 400,
//   proteins: 32,
//   fat: 30,
//   carbs: 0,
// },
//];

function App() {
  const [ingredients, setIngredients] = useState(initialIngredients ?? []);

  useEffect(
    () => localStorage.setItem(storageKey, JSON.stringify(ingredients)),
    [ingredients]
  );

  const calcTotals = useCallback(() => {
    // Only use ingredients that have valid numbers
    const validIngredients = ingredients.filter(
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
    const totalProteins = ingredients.reduce(
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
  }, [ingredients]);

  function updateName(name, newName) {
    setIngredients(
      ingredients.map((ingredient) =>
        ingredient.name === name ? { ...ingredient, name: newName } : ingredient
      )
    );
  }

  function updateWeight(name, weight) {
    setIngredients(
      ingredients.map((ingredient) =>
        ingredient.name === name
          ? { ...ingredient, weight: weight.replace(",", ".") }
          : ingredient
      )
    );
  }

  function updateKcal(name, kcal) {
    setIngredients(
      ingredients.map((ingredient) =>
        ingredient.name === name
          ? { ...ingredient, kcal: kcal.replace(",", ".") }
          : ingredient
      )
    );
  }

  function updateProteins(name, proteins) {
    setIngredients(
      ingredients.map((ingredient) =>
        ingredient.name === name
          ? { ...ingredient, proteins: proteins.replace(",", ".") }
          : ingredient
      )
    );
  }

  function updateFat(name, fat) {
    setIngredients(
      ingredients.map((ingredient) =>
        ingredient.name === name
          ? { ...ingredient, fat: fat.replace(",", ".") }
          : ingredient
      )
    );
  }

  function updateCarbs(name, carbs) {
    setIngredients(
      ingredients.map((ingredient) =>
        ingredient.name === name
          ? { ...ingredient, carbs: carbs.replace(",", ".") }
          : ingredient
      )
    );
  }

  function addIngredient(newItem) {
    if (ingredients.some((i) => i.name === newItem.name)) {
      alert("Denna ingrediens finns redan");
      return;
    }
    setIngredients([newItem, ...ingredients]);
  }

  function deleteIngredient(name) {
    setIngredients(ingredients.filter((i) => i.name !== name));
  }

  return (
    <div>
      <div className="ingredients-container">
        <AddIngredient added={addIngredient} />
        {ingredients.length > 0 ? (
          ingredients.map((ingredient) => (
            <Card
              ingredient={ingredient}
              key={ingredient.name}
              updateName={updateName}
              updateWeight={updateWeight}
              updateKcal={updateKcal}
              updateProteins={updateProteins}
              updateFat={updateFat}
              updateCarbs={updateCarbs}
              deleteIngredient={deleteIngredient}
            />
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
      <Summary
        totals={calcTotals()}
        target={{ kcal: 550, proteins: 40, fat: 20, carbs: 55 }}
      />
    </div>
  );
}

export default App;
