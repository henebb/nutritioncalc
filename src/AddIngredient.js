import { useState } from "react";
import IdModal from "./IdModal";
import "./add-ingredient.css";

function AddIngredient() {
  const [name, setName] = useState("");

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

  function handleIdClick(shortName) {
    const newItem = preDefinedIngredients.find((i) => i.short === shortName);
    if (newItem == null) {
      // Shouldn ot happen, but anyway...
      return;
    }
    added(newItem);
  }

  return (
    <>
      <form className="row add-form mb-2" onSubmit={handleSubmit}>
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
        <div className="col-6">
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={!name}
          >
            Lägg till
          </button>
        </div>
      </form>
      <div className="row mb-2 id-modal">
        <div className="col-5">
          {apiKeyAvailable ? (
            <IdModal
              preDefinedIngredients={preDefinedIngredients}
              handleClick={handleIdClick}
              ingredients={ingredients}
              functionKeyAvailable={apiKeyAvailable}
            />
          ) : (
            <input
              type="text"
              className="form-control"
              value={editApiKey}
              onChange={(e) => setEditApiKey(e.target.value)}
            />
          )}
        </div>
        {!apiKeyAvailable && (
          <div className="col-6">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleApiKey(editApiKey)}
            >
              OK
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default AddIngredient;
