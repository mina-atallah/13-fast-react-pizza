import { formatCurrency } from "../../utils/helpers";
// i got a pizza img to replace the imageUrl coming from api because of (err.name-not-resolved error)
import "../../../src/pizza.jpg";

function MenuItem({ pizza }) {
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;

  return (
    <li>
      {/* <img src={imageUrl} alt={name} /> */}
      <img src="/src/pizza.jpg" alt={name} />
      <div>
        <p>{name}</p>
        <p>{ingredients.join(", ")}</p>
        <div>
          {!soldOut ? <p>{formatCurrency(unitPrice)}</p> : <p>Sold out</p>}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
