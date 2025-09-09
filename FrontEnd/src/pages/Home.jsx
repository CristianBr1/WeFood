import { memo } from 'react';
import HomeCategory from '../components/HomeCategory';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="Home">
      <Navbar />
      <HomeCategory />
    </div>
  );
};

export default memo(Home);