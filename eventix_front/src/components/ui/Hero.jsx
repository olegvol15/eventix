// src/components/ui/Hero.jsx
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import { Link } from 'react-router-dom'
import '../../styles/hero.css'
import '../../styles/buttons.css'

const slides = [
  {
    title: 'Find your next event',
    subtitle: 'Concerts, sports, theatre and more — in one place.',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop',
  },
  {
    title: 'Feel the stadium vibes',
    subtitle: 'Top matches and tournaments — don’t miss the big moments.',
    img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1600&auto=format&fit=crop',
  },
  {
    title: 'Festivals all summer',
    subtitle: 'From Glastonbury to local gems — book your tickets now.',
    img: 'https://www.visit.alsace/wp-content/uploads/2018/11/festival-decibulles-2017-laurent-khram-longvixay-1-1600x900.jpg',
  },
]

export default function Hero() {
  return (
    <div className="hero">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        loop
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div className="hero-slide">
              <img className="hero-img" src={s.img} alt={s.title} />
              <div className="hero-overlay" />
              <div className="hero-content">
                <div className="hero-title">{s.title}</div>
                <div className="hero-subtitle">{s.subtitle}</div>
                <div className="hero-buttons">
                  <Link to="/" className="btn-primary">
                    Browse events
                  </Link>
                  <a href="#upcoming" className="btn-ghost">
                    See what’s on
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

