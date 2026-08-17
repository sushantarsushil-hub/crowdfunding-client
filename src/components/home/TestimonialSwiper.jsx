'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Quote, Star, ShieldCheck } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';

export const TestimonialSwiper = () => {
  const testimonials = [
    {
      id: 1,
      quote: "When our rural school needed urgent clean water infrastructure, FundFlow helped us connect with over 340 generous backers in just 14 days. The transparency and ease of setup were incredible.",
      author: "Elena Rostova",
      role: "Campaign Organizer",
      cause: "Clean Water Well Project",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      rating: 5,
    },
    {
      id: 2,
      quote: "Knowing that my credit contributions were securely held until verified progress updates were posted gave me complete peace of mind. FundFlow sets the gold standard for backer trust.",
      author: "Marcus Chen",
      role: "Verified Backer",
      cause: "Supported 12 Medical & Education Causes",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      rating: 5,
    },
    {
      id: 3,
      quote: "As a tech educator, launching our digital laptop lab campaign on FundFlow allowed us to reach global donors. The credit-to-USD conversion and Stripe payouts were seamless.",
      author: "Sarah Jenkins",
      role: "STEM Foundation Leader",
      cause: "Digital Learning Hub",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      rating: 5,
    },
  ];

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center max-w-xl mx-auto mb-8 space-y-2 relative z-10">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          Community Stories
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Trusted by Backers & Creators Worldwide</h2>
      </div>

      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="testimonial-swiper py-6"
      >
        {testimonials.map((t) => (
          <SwiperSlide key={t.id}>
            <div className="max-w-2xl mx-auto text-center space-y-6 px-4">
              <Quote className="w-10 h-10 text-emerald-400/40 mx-auto" />
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-medium italic">
                "{t.quote}"
              </p>

              <div className="flex items-center justify-center space-x-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <div className="flex items-center justify-center space-x-3">
                <img src={t.avatar} alt={t.author} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500" />
                <div className="text-left">
                  <h4 className="font-bold text-white text-sm flex items-center gap-1">
                    {t.author} <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </h4>
                  <p className="text-xs text-slate-400">{t.role} • <span className="text-emerald-400">{t.cause}</span></p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TestimonialSwiper;
