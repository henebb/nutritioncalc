import { useState } from "react";

function IdModal({ preDefinedIngredients, ingredients, handleClick }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIngredients = preDefinedIngredients
    .map((ingredient) => {
      return {
        ...ingredient,
        disabled: ingredients.some((i) => i.name === ingredient.name),
      };
    })
    .filter((ingredient) =>
      ingredient.name.toLocaleLowerCase("sv-SE").includes(searchTerm)
    );

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
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
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
                {filteredIngredients
                  .sort((a, b) => (a.name > b.name ? 1 : -1))
                  .map((i) => (
                    <button
                      type="button"
                      className={
                        "list-group-item list-group-item-action " +
                        (i.disabled ? "bg-light" : null) +
                        " bg-gradient"
                      }
                      data-bs-dismiss="modal"
                      onClick={() => {
                        handleClick(i.short);
                        setSearchTerm("");
                      }}
                      key={i.short}
                      disabled={i.disabled}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "16em",
                          borderRight: "1px solid gray",
                          color: i.disabled ? "lightgray" : "inherit",
                        }}
                      >
                        {i.name}
                      </span>
                      <strong
                        style={{
                          paddingLeft: "1em",
                          color: i.disabled ? "lightgray" : "inherit",
                        }}
                      >
                        {i.short}
                      </strong>
                    </button>
                  ))}
              </ul>
            </div>
            {filteredIngredients.length > 20 ? (
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
