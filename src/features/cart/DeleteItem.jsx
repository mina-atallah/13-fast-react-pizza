import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { deleteItem } from "./cartSlice";

function DeleteItem({ pizzaId }) {
  const disptach = useDispatch();
  return (
    <Button type="small" onClick={() => disptach(deleteItem(pizzaId))}>
      Delete
    </Button>
  );
}

export default DeleteItem;
