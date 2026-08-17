'use client';

import React from 'react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import HeroSwiper from '../components/home/HeroSwiper';
import TopFundedCampaigns from '../components/home/TopFundedCampaigns';
import HowItWorks from '../components/home/HowItWorks';
import ExploreCategories from '../components/home/ExploreCategories';
import PlatformImpact from '../components/home/PlatformImpact';
import TestimonialSwiper from '../components/home/TestimonialSwiper';
import CallToAction from '../components/home/CallToAction';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Homepage Sections */}
      <main id="main-content" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 w-full">
        {/* 1. Hero Slider */}
        <section aria-label="Hero Carousel">
          <HeroSwiper />
        </section>

        {/* 2. Top Funded Campaigns */}
        <section aria-label="Top Funded Campaigns">
          <TopFundedCampaigns />
        </section>

        {/* 3. How It Works */}
        <section aria-label="How It Works">
          <HowItWorks />
        </section>

        {/* 4. Explore by Category */}
        <section aria-label="Explore Categories">
          <ExploreCategories />
        </section>

        {/* 5. Platform Impact */}
        <section aria-label="Platform Impact">
          <PlatformImpact />
        </section>

        {/* 6. Testimonials */}
        <section aria-label="Community Testimonials">
          <TestimonialSwiper />
        </section>

        {/* 7. Call To Action */}
        <section aria-label="Call To Action">
          <CallToAction />
        </section>
      </main>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
