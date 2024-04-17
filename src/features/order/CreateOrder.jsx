import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import EmptyCart from "../cart/EmptyCart";
import { clearCart, getCart, getTotalPizzasPrice } from "../cart/cartSlice";
import store from "../../store";
import { formatCurrency } from "../../utils/helpers";
import { fetchAdress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const {
    userName,
    address,
    status: addressStatus,
    position,
    error: errorAddress,
  } = useSelector((state) => state.user);

  const navigation = useNavigation();
  const disptach = useDispatch();
  const isSubmitting = navigation.state === "submitting";
  const isLoadingAdress = addressStatus === "loading";

  // the returned data from the action
  const formErrors = useActionData();

  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalPizzasPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            className="input grow"
            type="text"
            defaultValue={userName}
            name="customer"
            required
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
            {formErrors?.phone && (
              <p className="mt-2 rounded-3xl bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              className="input w-full"
              type="text"
              name="address"
              disabled={isLoadingAdress}
              defaultValue={address}
              required
            />
            {addressStatus === "error" && (
              <p className="mt-2 rounded-3xl bg-red-100 p-2 text-xs text-red-700">
                {errorAddress}
              </p>
            )}
          </div>
          {!position.longitude && !position.latitude && (
            <span className="absolute right-[3px] top-[35px] z-10 md:right-[5px] md:top-[9px]">
              <Button
                disabled={isLoadingAdress}
                type="small"
                onClick={(e) => {
                  e.preventDefault();
                  disptach(fetchAdress());
                }}
              >
                Get Position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6  accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          {/* to pass the cart data to the action */}
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.longitude && position.latitude
                ? `${position.latitude},${position.longitude}`
                : ""
            }
          />
          <Button disabled={isSubmitting || isLoadingAdress} type="primary">
            {isSubmitting
              ? "Placing order..."
              : `Order now ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

// After Submitting Form, it will create a request that will be passed to the action function that will write data (manage remote server state)
export async function action({ request }) {
  // get the data from the form
  const formData = await request.formData();
  // convert the data to an object
  const data = Object.fromEntries(formData);

  // create order object with the received data
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    // so it can be read after being checked or not
    priority: data.priority === "true",
  };

  const errors = {};
  // add phone property to the error object
  if (!isValidPhone(order.phone))
    errors.phone =
      "Please write a correct number. We might need it to contact you.";
  if (Object.keys(errors).length > 0) return errors;

  // Submit the new created Object with "POST" req in createOrder function
  const newOrder = await createOrder(order);

  // can't use useDisptach hook in func, so we call the store object it self (SHOULD NOT BE OVER USED ==> because it deactivates performance optimization of Redux on this page)
  store.dispatch(clearCart());

  // redirect to the new created order
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
