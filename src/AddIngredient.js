import { useEffect, useState } from "react";
import IdModal from "./IdModal";
import "./add-ingredient.css";

function AddIngredient({ added }) {
  const [name, setName] = useState("");

  const [preDefinedIngredients, setPreDefinedIngredients] = useState([]);

  // Empty dependency array will cause to only load once
  useEffect(() => {
    fetch("predef-ingredients.json", { method: "GET", cache: "no-store" })
      .then((response) => response.json())
      .then((json) => {
        setPreDefinedIngredients(json);
      });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const existingPreDef = preDefinedIngredients.find(
      (i) =>
        i.name === name.toLocaleLowerCase("sv-SE") ||
        i.short === name.toLocaleLowerCase("sv-SE")
    );

    let newItem = {};
    if (existingPreDef) {
      newItem = existingPreDef;
    } else {
      newItem = {
        name: name,
        weight: 0,
        kcal: 0,
        proteins: 0,
        fat: 0,
        carbs: 0,
      };
    }

    added(newItem);
    setName(""); // Clear input
  }

  return (
    <form className="row add-form " onSubmit={handleSubmit}>
      <div className="col-5">
        <label
          className="visually-hidden visually-hidden-focusable"
          htmlFor="newIngredientName"
        >
          Ingrediens
        </label>
        <input
          id="newIngredientName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control"
          placeholder="Ingrediens"
        />
      </div>
      <div className="col-4">
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          disabled={!name}
        >
          Lägg till
        </button>
      </div>
      <div className="col-1">
        <IdModal
          preDefinedIngredients={preDefinedIngredients}
          handleClick={setName}
        />
      </div>
    </form>
  );
}

export default AddIngredient;
