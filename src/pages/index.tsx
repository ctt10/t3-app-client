import { type NextPage } from "next";
import { Wheel } from "@/components";

const Home: NextPage = () => {

  return (
    <div className="flex items-center min-h-screen justify-center py-32 h-full w-full">
      <Wheel />
    </div>
  );
}

export default Home;