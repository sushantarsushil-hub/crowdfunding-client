'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, Rocket } from 'lucide-react';
import Button from '../ui/Button';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export const HeroSwiper = () => {
  const slides = [
    {
      id: 1,
      badge: 'Transparent Backing',
      badgeIcon: Sparkles,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      title: 'Fund Ideas That Matter',
      description: 'Back verified community campaigns, urgent medical relief, and clean energy causes with complete credit transparency.',
      image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?w=1400&auto=format&fit=crop&q=80',
      primaryBtnText: 'Explore Active Causes',
      primaryBtnLink: '/campaigns',
    },
    {
      id: 2,
      badge: 'Community Action',
      badgeIcon: Heart,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      title: 'Turn Community Support into Real Impact',
      description: 'Join thousands of supporters directly funding clean water filtration, emergency pediatric care, and youth learning labs.',
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1400&auto=format&fit=crop&q=80',
      primaryBtnText: 'Support Relief Causes',
      primaryBtnLink: '/campaigns?category=Medical',
    },
    {
      id: 3,
      badge: 'Creator Empowerment',
      badgeIcon: Rocket,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      title: 'Help Creators Bring Meaningful Projects to Life',
      description: 'Launch your cause for moderator review, raise supporter pledges, and convert credits into direct USD bank payouts.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&auto=format&fit=crop&q=80',
      primaryBtnText: 'Start a Campaign',
      primaryBtnLink: '/dashboard/creator/campaigns/new',
    },
  ];

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-950">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        loop={true}
        className="hero-swiper-container"
      >
        {slides.map((slide) => {
          const BadgeIcon = slide.badgeIcon;
          return (
            <SwiperSlide key={slide.id}>
              <div className="relative min-h-[480px] sm:min-h-[560px] md:min-h-[600px] flex items-center justify-center p-6 sm:p-12 md:p-16">
                <div className="absolute inset-0 z-0">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover opacity-35 scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10 max-w-3xl space-y-6 text-left w-full"
                >
                  <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs font-bold backdrop-blur-md ${slide.badgeColor}`}>
                    <BadgeIcon className="w-4 h-4 shrink-0" />
                    <span>{slide.badge}</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
                    {slide.title}
                  </h1>

                  <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
                    {slide.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Link href={slide.primaryBtnLink}>
                      <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                        {slide.primaryBtnText}
                      </Button>
                    </Link>

                    <Link href="/dashboard/creator/campaigns/new">
                      <Button
                        variant="darkOutline"
                        size="lg"
                      >
                        Start Your Cause
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default HeroSwiper;
