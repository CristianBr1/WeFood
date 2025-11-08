import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FreeMode, Mousewheel, Autoplay, Navigation } from "swiper/modules";
import "swiper/css/autoplay";
import "../styles/HomeSlider.css";

import { getImageUrl, API_URL } from "../services/config";

const HomeSlider = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_URL}/banners`);
        const data = await res.json();
        setBanners(data);
      } catch (error) {
        console.error("Erro ao carregar banners:", error);
      }
    };
    fetchBanners();
  }, []);

  return (
    <div style={{ marginTop: "70px" }}>
      <Swiper
        slidesPerView={1}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        speed={4000}
        loop
        modules={[FreeMode, Mousewheel, Autoplay, Navigation]}
        freeMode
        mousewheel={{ forceToAxis: true }}
        grabCursor
        className="mySwiper"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner._id}>
            <div
              style={{
                width: "100%",
                position: "relative",
                paddingTop: "40%", // controla a proporção do banner (altura = 40% da largura)
              }}
            >
              <img
                src={getImageUrl(banner.image)}
                alt={banner.title || "Banner"}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 8, // opcional: cantos arredondados
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeSlider;
