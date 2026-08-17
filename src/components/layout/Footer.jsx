'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HeartHandshake, Send, Globe, ShieldCheck, Share2, MessageSquare, Compass } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import Logo from '../common/Logo';

export const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Thank you for subscribing to FundFlow updates!');
    setEmail('');
  };

  return (
    <footer role="contentinfo" className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="dark" size="md" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering change-makers, innovators, and communities across the globe to bring impactful ideas to life through transparent crowdfunding.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="#community" aria-label="Community" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-400 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-emerald-900/30">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#messages" aria-label="Support Forum" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-400 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-emerald-900/30">
                <MessageSquare className="w-4 h-4" />
              </a>
              <a href="#explore" aria-label="Explore" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-400 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-emerald-900/30">
                <Compass className="w-4 h-4" />
              </a>
              <a href="#share" aria-label="Share Platform" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-400 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-emerald-900/30">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/campaigns" className="hover:text-emerald-400 transition-colors">All Campaigns</Link></li>
              <li><Link href="/campaigns?category=Medical" className="hover:text-emerald-400 transition-colors">Medical & Relief</Link></li>
              <li><Link href="/campaigns?category=Education" className="hover:text-emerald-400 transition-colors">Education & Youth</Link></li>
              <li><Link href="/campaigns?category=Creative" className="hover:text-emerald-400 transition-colors">Creative Projects</Link></li>
              <li><Link href="/campaigns?category=Environment" className="hover:text-emerald-400 transition-colors">Green & Eco</Link></li>
            </ul>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link href="/dashboard/add-campaign" className="hover:text-emerald-400 transition-colors">Start a Campaign</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Support</Link></li>
              <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Stay Connected</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get weekly highlights of life-changing campaigns directly in your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address for newsletter"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/30 transition-all"
              />
              <Button type="submit" variant="primary" size="sm" fullWidth icon={<Send className="w-3.5 h-3.5" />}>
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 space-y-4 md:space-y-0">
          <p className="flex items-center space-x-1">
            <span>&copy; {new Date().getFullYear()} FundFlow Inc. Built with passion for human progress.</span>
          </p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>SSL Secured Platform</span>
            </span>
            <span className="flex items-center space-x-1">
              <Globe className="w-4 h-4 text-emerald-500" />
              <span>Global Support</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
