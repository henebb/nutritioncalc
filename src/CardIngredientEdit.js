function CardIngredientEdit({
  ingredientValue,
  ingredientTitle,
  ingredientUnit,
  handleOnChange,
  handleOnBlur,
}) {
  return (
    <div className="row">
      <label className="col-4 col-form-label pe-1 text-end">
        {ingredientTitle}:
      </label>
      <div className="col-4 ps-1 pe-1">
        <input
          type="number"
          className="form-control form-control-sm"
          value={ingredientValue}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
        />
      </div>
      <div className="col-4 col-form-label ps-1">{ingredientUnit}</div>
    </div>
  );
}

export default CardIngredientEdit;
