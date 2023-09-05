import { useState } from "react";
import { useNutritionData, nutritionActionTypes } from "./NutritionDataContext";

function IdModal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newId, setNewId] = useState("");
  const [isNewIdValid, setIsNewIdValid] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);

  const { nutritionData, dispatch } = useNutritionData();

  const filteredIngredients = nutritionData.preDefinedIngredients
    .map((ingredient) => {
      return {
        ...ingredient,
        // Set "disabled" if already a chosen ingredient
        disabled: nutritionData.chosenIngredients.some(
          (i) => i.name === ingredient.name
        ),
      };
    })
    .filter((ingredient) =>
      ingredient.name.toLocaleLowerCase("sv-SE").includes(searchTerm)
    );

  async function checkNewIdAvailable() {
    await setTimeout(() => {
      setIsNewIdValid(false);
      setIsFormValid(false);
    }, 2000);
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        data-bs-toggle="modal"
        data-bs-target="#shortIdModal"
      >
        Id:n
      </button>
      <div
        className="modal fade"
        id="shortIdModal"
        role="dialog"
        aria-labelledby="shortIdModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="shortIdModalLabel">
                Kortnamn
              </h5>
              {!(isAddMode || isEditMode) && (
                <div className="ms-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm d-flex flex-row justify-content-between"
                    onClick={() => setIsAddMode(true)}
                  >
                    <i className="bi bi-plus-circle-fill pe-1" />
                    <span className="me-4">Ny</span>
                  </button>
                </div>
              )}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            {isAddMode || isEditMode ? (
              /* Add or edit form */
              <div className="modal-body">
                <strong className="d-block mb-2">
                  {isAddMode ? "Ny" : "Ändra"} ingrediens
                </strong>
                <form>
                  {isAddMode && (
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="id-field"
                        placeholder="abc"
                        value={newId}
                        onChange={(e) => setNewId(e.target.value)}
                        onBlur={checkNewIdAvailable}
                      />
                      <label htmlFor="id-field">Kortnamn/Id</label>
                      {!isNewIdValid && (
                        <div
                          className="alert alert-danger p-1 mb-2 mt-1"
                          role="alert"
                          style={{ fontSize: "smaller" }}
                        >
                          Kortnamnet är redan upptaget
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!isFormValid}
                  >
                    Spara
                  </button>
                </form>
              </div>
            ) : (
              /* List of items */
              <div className="modal-body">
                <div className="pb-1 border-bottom">
                  <label htmlFor="searchTerm">Sök</label>
                  <input
                    type="text"
                    id="searchTerm"
                    className="form-control"
                    placeholder="Ange namn..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value.toLocaleLowerCase("sv-SE"))
                    }
                  />
                </div>
                <ul className="list-group pt-1">
                  {filteredIngredients != null &&
                    filteredIngredients
                      .sort((a, b) => (a.name > b.name ? 1 : -1))
                      .map((filteredIngredient) => (
                        <button
                          type="button"
                          className={
                            "list-group-item list-group-item-action " +
                            (filteredIngredient.disabled ? "bg-light" : null) +
                            " bg-gradient d-flex flex-row justify-content-between"
                          }
                          data-bs-dismiss="modal"
                          onClick={() => {
                            dispatch({
                              type: nutritionActionTypes.addChosenIngredient,
                              // Don't add "filteredIngredient" as payload since it contains "disabled" prop as well.
                              payload: nutritionData.preDefinedIngredients.find(
                                (pre) => pre.short === filteredIngredient.short
                              ),
                            });
                            // Clear field
                            setSearchTerm("");
                          }}
                          key={filteredIngredient.short}
                          disabled={filteredIngredient.disabled}
                        >
                          <span
                            style={{
                              color: filteredIngredient.disabled
                                ? "lightgray"
                                : "inherit",
                            }}
                          >
                            {filteredIngredient.name}
                          </span>
                          <strong
                            style={{
                              color: filteredIngredient.disabled
                                ? "lightgray"
                                : "inherit",
                            }}
                          >
                            {filteredIngredient.short}
                          </strong>
                        </button>
                      ))}
                </ul>
              </div>
            )}
            {filteredIngredients != null && filteredIngredients.length > 20 ? (
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default IdModal;
