import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { FreeMode, Mousewheel, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css/autoplay';
import '../styles/HomeSlider.css';

import slider1 from "../assets/banners/slider1.jpg";
import slider2 from "../assets/banners/slider2.jpg";
import slider3 from "../assets/banners/slider3.jpg";
import slider4 from "../assets/banners/slider4.jpg";

const HomeSlider = () => {
  return (
    <div style={{ marginTop: "70px" }}>
      <Swiper
        slidesPerView={1}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        speed={5000}
        loop={true}
        modules={[FreeMode, Mousewheel, Autoplay, Navigation]}
        freeMode={true}
        mousewheel={{ forceToAxis: true }}
        grabCursor={true}
        className="mySwiper"
      >
        <SwiperSlide><img src={slider1} alt="Slide 1" /></SwiperSlide>
        <SwiperSlide><img src={slider2} alt="Slide 2" /></SwiperSlide>
        <SwiperSlide><img src={slider3} alt="Slide 3" /></SwiperSlide>
        <SwiperSlide><img src={slider4} alt="Slide 4" /></SwiperSlide>
      </Swiper>
    </div>
  );
};

export default HomeSlider;
