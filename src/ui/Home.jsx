import CreateUser from "../features/user/CreateUser";
import { useSelector } from "react-redux";
import Button from "./Button";

function Home() {
  const userName = useSelector((state) => state.user.userName);
  return (
    <div className="my-9 text-center sm:my-16">
      <h1 className="mb-8 px-4 text-xl font-semibold md:text-3xl">
        The best pizza.
        <br />
        <span className="text-yellow-500">
          Straight out of the oven, straight to you.
        </span>
      </h1>

      {userName === "" ? (
        <CreateUser />
      ) : (
        <Button to="/menu" type="primary">
          continue ordering, {userName}
        </Button>
      )}
    </div>
  );
}

export default Home;
