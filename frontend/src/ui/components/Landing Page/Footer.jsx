import React from "react";
import { Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white pt-16">
      <div className="container mx-auto px-6">

        {/* Top: Logo Section */}
        <div className="flex items-center gap-3 mb-8">
          <img src="/flux-logo.png" alt="Flux Hire AI Logo" className="h-10 w-10 flex-shrink-0" />
          <span className="text-2xl font-bold text-slate-900 tracking-tight">Flux Hire AI</span>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-slate-100 mb-12"></div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20 text-sm">

          {/* Column 1 */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 text-base">About Flux</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-500 hover:text-[#ED5E29] transition-colors font-medium">About</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#ED5E29] transition-colors font-medium">Careers</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#ED5E29] transition-colors font-medium">Testimonials</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 text-base">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-500 hover:text-[#ED5E29] transition-colors font-medium">Help Center</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#ED5E29] transition-colors font-medium">Case Studies</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 text-base">Support & Contact</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-500 hover:text-[#ED5E29] transition-colors font-medium">Contact Us</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#ED5E29] transition-colors font-medium">Feedback</a></li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 text-base">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center gap-2 text-slate-500 hover:text-[#ED5E29] transition-colors font-medium">
                  <Instagram className="h-4 w-4" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-slate-500 hover:text-[#ED5E29] transition-colors font-medium">
                  <Twitter className="h-4 w-4" />
                  <span>Twitter / X</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-slate-500 hover:text-[#ED5E29] transition-colors font-medium">
                  <Linkedin className="h-4 w-4" />
                  <span>Linkedin</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar Separator */}
        <div className="w-full h-px bg-slate-100 mb-8"></div>

        {/* Bottom Bar Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium tracking-wide mb-20">
          <p>© 2026 FLUX HIRE AI · All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-600 transition-colors">Term of use</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy policy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}