import { memo } from "react";
import Navbar from "../components/Navbar";
import HomeSlider from "../components/HomeSlider";
import HomeCategory from "../components/HomeCategory";

const Home = () => {
  return (
    <div className="Home">
      <Navbar />

      <div className="flex justify-center w-full my-6">
        <div className="w-full max-w-[1200px]">
          <HomeSlider />
        </div>
      </div>

      <div className="w-full">
        <HomeCategory />
      </div>
    </div>
  );
};

export default memo(Home);
