import { NutritionDataProvider } from "./NutritionDataContext";
import AddIngredient from "./AddIngredient";
import MealSelector from "./MealSelector";
import CardList from "./CardList";
import Summary from "./Summary";
import "./App.css";

function App() {
  return (
    <NutritionDataProvider>
      <AddIngredient />
      <MealSelector />
      <CardList />
      <Summary />
    </NutritionDataProvider>
  );
}

export default App;
