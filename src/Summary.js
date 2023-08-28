import "./summary.css";

function Summary({ totals, target }) {
  return (
    <div className="fixed-bottom summary">
      <div className="row header-row">
        <div className="col-2"></div>
        <div className="col-2">Energi</div>
        <div className="col-2">Proteiner</div>
        <div className="col-2">Fett</div>
        <div className="col-2">Kolh.</div>
        {/*
            {totals.kcal} kcal, Proteiner: , Fett:{" "}
        , Kolh.: {totals.carbs} g
        */}
      </div>
      <div className="row total-row">
        <div className="col-2">Total:</div>
        <div className="col-2">{totals.kcal} kcal</div>
        <div className="col-2">{totals.proteins} g</div>
        <div className="col-2">{totals.fat} g</div>
        <div className="col-2">{totals.carbs} g</div>
      </div>
      <div className="row target-row">
        <div className="col-2">Mål:</div>
        <div className="col-2">{target.kcal} kcal</div>
        <div className="col-2">{target.proteins} g</div>
        <div className="col-2">{target.fat} g</div>
        <div className="col-2">{target.carbs} g</div>
      </div>
    </div>
  );
}

export default Summary;
