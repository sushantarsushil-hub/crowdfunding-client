'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck, Code, Globe, Mail } from 'lucide-react';
import CONFIG from '../../constants/config';
import Logo from '../common/Logo';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Description & Social Icons */}
        <div className="space-y-4 md:col-span-1">
          <Logo variant="dark" size="md" />
          <p className="leading-relaxed text-slate-400">
            A credit-backed crowdfunding network powering medical relief, youth education, and community initiatives transparently.
          </p>
          
          {/* Social Icons: GitHub, LinkedIn, Facebook */}
          <div className="flex items-center space-x-2.5 pt-2">
            {/* GitHub */}
            <a
              href={CONFIG.SOCIAL_LINKS.GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="GitHub Repository"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href={CONFIG.SOCIAL_LINKS.LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="LinkedIn Page"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href={CONFIG.SOCIAL_LINKS.FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Facebook Page"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 1: Explore Causes */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Explore Causes</h4>
          <ul className="space-y-2">
            <li><Link href="/campaigns?category=Medical" className="hover:text-emerald-400 transition-colors">Medical Relief</Link></li>
            <li><Link href="/campaigns?category=Education" className="hover:text-emerald-400 transition-colors">Education & Youth</Link></li>
            <li><Link href="/campaigns?category=Environment" className="hover:text-emerald-400 transition-colors">Green & Eco Energy</Link></li>
            <li><Link href="/campaigns?category=Tech" className="hover:text-emerald-400 transition-colors">Tech Innovation</Link></li>
          </ul>
        </div>

        {/* Column 2: Useful Navigation Links */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Useful Links</h4>
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Support</Link></li>
            <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Supporter Login</Link></li>
            <li><Link href="/register" className="hover:text-emerald-400 transition-colors">Creator Signup</Link></li>
            <li>
              <a href={CONFIG.GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center space-x-1">
                <Code className="w-3 h-3 text-emerald-400" />
                <span>Join as Developer</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Trust Badges */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Security & Integrity</h4>
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Audited Payouts</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Campaigns undergo moderator review. Backer pledges are safely ledgered until milestones are met.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 text-center text-slate-500 font-medium">
        <p>© {new Date().getFullYear()} FundFlow Inc. All rights reserved. Express.js REST API Client Architecture.</p>
      </div>
    </footer>
  );
};

export default Footer;
