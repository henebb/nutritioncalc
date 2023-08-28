function IdModal({ preDefinedIngredients, handleClick }) {
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
              <ul className="list-group">
                {preDefinedIngredients
                  .sort((a, b) => (a.name > b.name ? 1 : -1))
                  .map((i) => (
                    <button
                      type="button"
                      class="list-group-item list-group-item-action"
                      data-bs-dismiss="modal"
                      onClick={() => handleClick(i.short)}
                      key={i.short}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "16em",
                          borderRight: "1px solid gray",
                        }}
                      >
                        {i.name}
                      </span>
                      <strong style={{ paddingLeft: "1em" }}>{i.short}</strong>
                    </button>
                  ))}
              </ul>
            </div>
            {preDefinedIngredients.length > 20 ? (
              <div class="modal-footer">
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
