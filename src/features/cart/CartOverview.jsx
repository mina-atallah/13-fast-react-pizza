import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTotalPizzasPrice, getTotalPizzasQuantity } from "./cartSlice";
import { formatCurrency } from "../../utils/helpers";

function CartOverview() {
  const totalCartQuantity = useSelector(getTotalPizzasQuantity);
  const totalPizzasPrice = useSelector(getTotalPizzasPrice);

  if (!totalCartQuantity) return null;

  return (
    <div className="flex items-center  justify-between bg-slate-800 px-4 py-4 text-sm uppercase text-stone-200 sm:px-6 md:text-base">
      <p className="space-x-4 font-semibold text-stone-300 sm:space-x-6">
        <span>{totalCartQuantity} pizzas</span>
        <span>{formatCurrency(totalPizzasPrice)}</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
