import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";

import MenuItem from "./MenuItem";

function Menu() {
  // Provide the data to the component using custom hook
  const menu = useLoaderData();

  return (
    <ul>
      {menu.map((pizza) => (
        <MenuItem pizza={pizza} key={pizza.id} />
      ))}
    </ul>
  );
}

// Loader
export async function loader() {
  const menu = await getMenu();
  return menu;
}

export default Menu;
