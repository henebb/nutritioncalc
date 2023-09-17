function SummaryModal({
  summaryModalId,
  meal,
  totalKcalDiff,
  totalProteinsDiff,
  mealTotalKcalDiff,
  mealTotalProteinsDiff,
}) {
  return (
    <div
      className="modal fade"
      id={summaryModalId}
      tabIndex="-1"
      aria-labelledby="summaryModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header pt-2 pb-1">
            <h5 className="modal-title" id="summaryModalLabel">
              Skillnad
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <table
              className="table table-sm"
              style={{ fontFamily: "Roboto Mono", fontSize: "smaller" }}
            >
              <thead>
                <tr style={{ fontSize: "smaller" }}>
                  <th></th>
                  <th className="text-end">Energi</th>
                  <th className="text-end">Protein</th>
                </tr>
              </thead>
              <tbody>
                <tr className="fw-bold">
                  <td>Total:</td>
                  <td>
                    {totalKcalDiff >= 0 && "+"}
                    {totalKcalDiff} kcal
                  </td>
                  <td>
                    {totalProteinsDiff >= 0 && "+"}
                    {totalProteinsDiff} g
                  </td>
                </tr>
                <tr>
                  <td>{meal}:</td>
                  <td>
                    {mealTotalKcalDiff >= 0 && "+"}
                    {mealTotalKcalDiff} kcal
                  </td>
                  <td>
                    {mealTotalProteinsDiff >= 0 && "+"}
                    {mealTotalProteinsDiff} g
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryModal;
