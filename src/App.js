import { NutritionDataProvider } from "./NutritionDataContext";
import CardList from "./CardList";
import Summary from "./Summary";
import AddIngredient from "./AddIngredient";
import "./App.css";

function App() {
  return (
    <NutritionDataProvider>
      <div className="ingredients-container">
        <AddIngredient />
        <CardList />
      </div>
      <Summary target={{ kcal: 550, proteins: 40, fat: 20, carbs: 55 }} />
    </NutritionDataProvider>
  );
}

export default App;
