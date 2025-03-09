import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-softgray py-12">
      <div className="content-container grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-2xl font-heading font-semibold text-accent-navy mb-4">Seamless Edge</h3>
          <p className="text-neutral-warmtaupe font-body mb-6">
            Calgary's premier drywall specialists. Delivering flawless finishes and precision in every detail across Alberta.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-heading font-semibold text-accent-navy mb-4">Our Services</h3>
          <ul className="space-y-3 font-body">
            <li><Link to="/services#boarding" className="hover:text-accent-forest transition-colors">Boarding & Installation</Link></li>
            <li><Link to="/services#sanding" className="hover:text-accent-forest transition-colors">Sanding & Finishing</Link></li>
            <li><Link to="/services#repairs" className="hover:text-accent-forest transition-colors">Repairs & Patches</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-heading font-semibold text-accent-navy mb-4">Contact Us</h3>
          <ul className="space-y-4 font-body">
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-accent-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>(403) 555-7890</span>
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-accent-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>info@seamlessedgeco.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-neutral-softgray mt-8 pt-6 text-center text-neutral-warmtaupe font-body">
        <p>© {new Date().getFullYear()} Seamless Edge. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-4">
          <Link to="/terms" className="hover:text-accent-forest transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-accent-forest transition-colors">Privacy Policy</Link>
          <Link to="/sitemap" className="hover:text-accent-forest transition-colors">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 