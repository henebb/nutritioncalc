import { useReducer, useState } from "react";
import { useNutritionData, nutritionActionTypes } from "./NutritionDataContext";
import { getAllNutritions, isIdAvailable } from "./api";

const initialmanagePreDefinedData = {
  isAddMode: false,
  isEditMode: false,
  isEditModeInit: false,
  formId: "",
  formName: "",
  formDescription: "",
  formIsValid: false,
  formIsIdAvailable: false,
  formIdAvailabilityCheckInProgress: false,
  formIdAvailabilityChecked: false,
};

const managePreDefinedActionTypes = {
  setAddMode: "SET_ADD_MODE",
  initEditMode: "INIT_EDIT_MODE",
  cancelInitEditMode: "CANCEL_INIT_EDIT_MODE",
  setFormIdValue: "SET_FORM_ID_VALUE",
  setFormIdAvailable: "SET_FORM_ID_AVAILABLE",
  setFormIdAvailabilityInProgress: "SET_FORM_ID_AVAILABLITY_IN_PROGRESS",
  resetFormIdAvailabilityChecked: "RESET_FORM_ID_AVAILABLILITY_CHECKED",
  setFormName: "SET_FORM_NAME",
  setFormDescription: "SET_FORM_DESCRIPTION",
  cancelForm: "CANCEL_FORM",
};

function managePreDefinedReducer(state, action) {
  switch (action.type) {
    case managePreDefinedActionTypes.setAddMode:
      return {
        ...state,
        isAddMode: true,
        isEditMode: false,
        isEditModeInit: false,
      };
    case managePreDefinedActionTypes.initEditMode:
      return {
        ...state,
        isAddMode: false,
        isEditMode: false,
        isEditModeInit: true,
      };
    case managePreDefinedActionTypes.cancelInitEditMode:
      return {
        ...state,
        isEditModeInit: false,
        isAddMode: false,
        isEditMode: false,
      };
    case managePreDefinedActionTypes.setFormIdValue:
      return {
        ...state,
        formId: action.payload,
      };
    case managePreDefinedActionTypes.setFormIdAvailabilityInProgress:
      return {
        ...state,
        formIdAvailabilityCheckInProgress: action.payload,
      };
    case managePreDefinedActionTypes.setFormIdAvailable:
      const isAvailable = action.payload;
      return {
        ...state,
        formIsIdAvailable: isAvailable,
        formIdAvailabilityChecked: true,
        formIdAvailabilityCheckInProgress: false,
        // If not avaible, mark form as not valid. Otherwise keep current flag
        formIsValid: isFormValid(state.formId, isAvailable, state.formName),
      };
    case managePreDefinedActionTypes.resetFormIdAvailabilityChecked:
      return {
        ...state,
        formIdAvailabilityChecked: false,
        formIsIdAvailable: false,
        formIsValid: false,
      };
    case managePreDefinedActionTypes.setFormName:
      return {
        ...state,
        formName: action.payload,
        formIsValid: isFormValid(
          state.formId,
          state.formIsIdAvailable,
          action.payload
        ),
      };
    case managePreDefinedActionTypes.setFormDescription:
      return {
        ...state,
        formDescription: action.payload,
      };
    case managePreDefinedActionTypes.cancelForm:
      return initialmanagePreDefinedData;
    default:
      return state;
  }
}

function isFormValid(id, idAvailable, name) {
  return id && idAvailable && name && name.trim();
}

function IdModal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [managePreDefinedData, dispatchForPreDef] = useReducer(
    managePreDefinedReducer,
    initialmanagePreDefinedData
  );
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

  async function loadAllPreDefIngredients() {
    // Already loaded?
    if (nutritionData.preDefinedIngredients.length > 0) {
      return;
    }

    const jsonResult = await getAllNutritions();
    dispatch({
      type: nutritionActionTypes.loadPreDefIngredients,
      payload: jsonResult,
    });
  }

  async function checkNewIdAvailable() {
    if (
      managePreDefinedData.formId == null ||
      managePreDefinedData.formId.trim() === ""
    ) {
      return;
    }
    dispatchForPreDef({
      action: managePreDefinedActionTypes.setFormIdAvailabilityInProgress,
      payload: true,
    });

    const isAvailable = await isIdAvailable(managePreDefinedData.formId);
    dispatchForPreDef({
      type: managePreDefinedActionTypes.setFormIdAvailable,
      payload: isAvailable,
    });
  }

  function handleEditFormSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        data-bs-toggle="modal"
        data-bs-target="#shortIdModal"
        onClick={loadAllPreDefIngredients}
      >
        Kortnamn
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
              {!(
                managePreDefinedData.isAddMode ||
                managePreDefinedData.isEditMode
              ) && (
                <div className="ms-2 d-flex flex-row">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm d-flex flex-row justify-content-between"
                    onClick={() => {
                      dispatchForPreDef({
                        type: managePreDefinedActionTypes.setAddMode,
                        payload: null,
                      });
                    }}
                  >
                    <i className="bi bi-plus-circle-fill" />
                    <span className="me-4">Ny</span>
                  </button>
                  {managePreDefinedData.isEditModeInit ? (
                    // Cancel init edit mode
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm d-flex flex-row justify-content-between ms-1"
                      onClick={() => {
                        dispatchForPreDef({
                          type: managePreDefinedActionTypes.cancelInitEditMode,
                          payload: null,
                        });
                      }}
                    >
                      <i className="bi bi-x-circle" />
                      <span className="me-3">Avbryt</span>
                    </button>
                  ) : (
                    // Activate init edit mode
                    <button
                      type="button"
                      className="btn btn-primary btn-sm d-flex flex-row justify-content-between ms-1"
                      onClick={() => {
                        dispatchForPreDef({
                          type: managePreDefinedActionTypes.initEditMode,
                          payload: null,
                        });
                      }}
                    >
                      <i className="bi bi-pencil-square" />
                      <span>Ändra rad</span>
                    </button>
                  )}
                </div>
              )}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            {/* Add, or edit, form: */}
            {managePreDefinedData.isAddMode ||
            managePreDefinedData.isEditMode ? (
              <div className="modal-body">
                <strong className="d-block mb-2">
                  {managePreDefinedData.isAddMode ? "Ny" : "Ändra"} ingrediens
                </strong>
                <form onSubmit={handleEditFormSubmit}>
                  {managePreDefinedData.isAddMode && (
                    <div className="form-floating mb-3">
                      {/* For new id; availability is checked on blur */}
                      <input
                        type="text"
                        className="form-control"
                        id="id-field"
                        placeholder="short"
                        value={managePreDefinedData.formId}
                        onChange={(e) => {
                          dispatchForPreDef({
                            type: managePreDefinedActionTypes.setFormIdValue,
                            payload: e.target.value,
                          });
                          dispatchForPreDef({
                            type: managePreDefinedActionTypes.resetFormIdAvailabilityChecked,
                            payload: null,
                          });
                        }}
                        onBlur={checkNewIdAvailable}
                      />
                      <label htmlFor="id-field">Kortnamn/Id</label>
                      {!managePreDefinedData.formIsIdAvailable &&
                        managePreDefinedData.formIdAvailabilityChecked && (
                          <div
                            className="alert alert-danger p-1 mb-2 mt-1"
                            role="alert"
                            style={{ fontSize: "smaller" }}
                          >
                            Kortnamnet är redan upptaget
                          </div>
                        )}
                      {managePreDefinedData.formIdAvailabilityCheckInProgress && (
                        <div
                          className="spinner-border float-end"
                          style={{ marginTop: "-2.6em", marginRight: "0.5em" }}
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="name-field"
                      placeholder="Ange namn..."
                      value={managePreDefinedData.formName}
                      onChange={(e) =>
                        dispatchForPreDef({
                          type: managePreDefinedActionTypes.setFormName,
                          payload: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="name-field">Namn</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="description-field"
                      placeholder="Ange beskrivning..."
                      value={managePreDefinedData.formDescription}
                      onChange={(e) =>
                        dispatchForPreDef({
                          type: managePreDefinedActionTypes.setFormDescription,
                          payload: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="description-field">Beskrivning</label>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!managePreDefinedData.formIsValid}
                  >
                    Spara
                  </button>
                  <button
                    type="reset"
                    className="btn btn-secondary ms-1"
                    onClick={() => {
                      dispatchForPreDef({
                        type: managePreDefinedActionTypes.cancelForm,
                        payload: null,
                      });
                    }}
                  >
                    Avbryt
                  </button>
                </form>
              </div>
            ) : (
              /* Search box */
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
                {/* List of items */}
                <ul className="list-group pt-1">
                  {filteredIngredients == null ||
                  filteredIngredients.length === 0 ? (
                    <li
                      className="list-group-item fst-italic"
                      style={{ color: "gray" }}
                    >
                      Laddar...
                    </li>
                  ) : (
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
                          data-bs-dismiss={
                            managePreDefinedData.isEditModeInit ? "" : "modal"
                          }
                          onClick={() => {
                            if (managePreDefinedData.isEditModeInit) {
                              return;
                            }
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
                            {managePreDefinedData.isEditModeInit && (
                              <i className="bi bi-pencil pe-1" />
                            )}
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
                      ))
                  )}
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
