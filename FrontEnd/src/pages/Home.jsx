import { memo } from 'react';
import HomeCategory from '../components/HomeCategory';

const Home = () => {
  return (
    <div className="Home">
      <h2>Home</h2>
      <HomeCategory />
    </div>
  );
};

export default memo(Home);