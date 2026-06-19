import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/pagination';

interface Slide {
  id: number;
  title: string;
  description: string;
  image: string;
}

const Carousel = () => {
  const [slides, setSlides] = useState<Slide[]>([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/carousel/get-slides`)
      .then((res) => setSlides(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!slides.length) return null;

  return (
    <div className="relative overflow-hidden bg-[#050505] py-2">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-10 pointer-events-none"></div>

      {/* Lights */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="volumetric-light-red"></div>
        <div className="volumetric-light-secondary opacity-50"></div>
      </div>

      {/* Heading Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-metallic mb-6 tracking-tighter drop-shadow-2xl">
            Our Glimpses
          </h2>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed mb-8">
            Discover the moments that define our community through featured
            highlights and inspiring visuals.
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto rounded-full opacity-80"></div>
        </div>
      </div>

      {/* Full Width Slider */}
      <div className="relative z-10 w-full">
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          spaceBetween={0}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          loop={true}
          className="w-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-[400px] w-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-center px-6">
                  <div className="max-w-4xl">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                      {slide.title}
                    </h2>

                    <p className="text-lg md:text-xl text-gray-200">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Carousel;