import { memo } from 'react';
import HomeCategory from '../components/HomeCategory';
import Navbar from '../components/Navbar';
import Header from '../components/Header';

const Home = () => {
  return (
    <div className="Home">
      <Header />
      <HomeCategory />
    </div>
  );
};

export default memo(Home);