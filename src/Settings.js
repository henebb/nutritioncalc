import { useState } from "react";
import { useNutritionData, nutritionActionTypes } from "./NutritionDataContext";

function Settings({ modalId }) {
  const [isCopied, setIsCopied] = useState(false);
  const { nutritionData, dispatch } = useNutritionData();

  const textAreaId = "nutritionData";

  function handleCopyClick() {
    var textArea = document.getElementById(textAreaId);

    // Copy the text inside the text field
    navigator.clipboard.writeText(textArea.value);

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  }

  function handleSaveClick() {
    var textArea = document.getElementById(textAreaId);

    try {
      dispatch({
        type: nutritionActionTypes.setState,
        payload: JSON.parse(textArea.value), //textArea.value,
      });

      // Hide modal by simulating close click
      const closeBtn = document.getElementById(`modalCloseFor${modalId}`);
      closeBtn.click();
    } catch (error) {
      alert(`Kunde inte spara. Fel: ${error}`);
    }
  }

  return (
    <>
      <button
        className="btn btn-outline-primary btn-sm"
        type="button"
        data-bs-toggle="modal"
        data-bs-target={`#${modalId}`}
      >
        <i className="bi bi-sliders" />
      </button>
      <div
        className="modal fade"
        id={modalId}
        tabIndex="-1"
        aria-labelledby={`${modalId}Label`}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id={`${modalId}Label`}>
                Inställningar
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id={`modalCloseFor${modalId}`}
              />
            </div>
            <div className="modal-body">
              <textarea
                name={textAreaId}
                id={textAreaId}
                cols="30"
                rows="10"
                defaultValue={JSON.stringify(nutritionData)}
              />
              {isCopied && (
                <div className="alert alert-info me-4" role="alert">
                  Kopierad!
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCopyClick}
              >
                Kopiera
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveClick}
              >
                Spara
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Stäng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
