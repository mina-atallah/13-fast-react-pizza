import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: "Mediterranean",
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: "Vegetale",
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: "Spinach and Mushroom",
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // the returned data from the action
  const formErrors = useActionData();

  // const [withPriority, setWithPriority] = useState(false);
  const cart = fakeCart;

  return (
    <div>
      <h2>Ready to order? Let's go!</h2>

      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        <div>
          <label>First Name</label>
          <input type="text" name="customer" required />
        </div>

        <div>
          <label>Phone number</label>
          <div>
            <input type="tel" name="phone" required />
          </div>
          {formErrors?.phone && <p>{formErrors.phone}</p>}
        </div>

        <div>
          <label>Address</label>
          <div>
            <input
              className="w-full rounded-full border border-stone-300 px-3 py-2 text-sm transition-all duration-300 placeholder:text-stone-500 focus:outline-none focus:ring focus:ring-yellow-400 md:px-5 md:py-4"
              type="text"
              name="address"
              required
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            className="h-6 w-6  accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          {/* to pass the cart data to the action */}
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <button
            disabled={isSubmitting}
            className="inline-block rounded-full bg-yellow-400 px-4 py-3 font-semibold tracking-wide text-stone-800 transition-colors duration-300 hover:bg-yellow-300 focus:bg-yellow-300 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Placing order..." : "Order now"}
          </button>
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
    priority: data.priority === "on",
  };

  const errors = {};
  // add phone property to the error object
  if (!isValidPhone(order.phone))
    errors.phone =
      "Please write a correct number. We might need it to contact you.";
  if (Object.keys(errors).length > 0) return errors;

  // Submit the new created Object with "POST" req in createOrder function
  const newOrder = await createOrder(order);
  // redirect to the new created order
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
