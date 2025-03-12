import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      
      setLastScrollY(currentScrollY);
      
      // Set scrolled state for styling
      if (currentScrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // CSS animations
  const animationKeyframes = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    
    @keyframes slideInDown {
      from { transform: translateY(-100%); }
      to { transform: translateY(0); }
    }
    
    @keyframes borderFade {
      from { width: 0; }
      to { width: 100%; }
    }
  `;

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ease-in-out 
      ${scrollDirection === 'down' ? '-top-20' : 'top-0'}
      ${scrolled ? 'bg-white/95 shadow-sm backdrop-blur-sm py-3' : 'bg-white/80 py-5'}`}
    >
      <style dangerouslySetInnerHTML={{ __html: animationKeyframes }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo with refined typography */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-accent-navy font-heading tracking-tight transition-all duration-300"
              style={{ 
                fontWeight: scrolled ? 500 : 600,
                fontSize: scrolled ? '1.5rem' : '1.75rem',
                letterSpacing: '-0.025em',
                animation: 'fadeIn 0.5s ease'
              }}
            >
              <span className="relative inline-block">
                Seamless Edge
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation with refined typography and hover effects */}
          <nav className="hidden md:flex space-x-2 lg:space-x-6 items-center">
            {['Home', 'About', 'Services', 'Gallery', 'Team', 'Blog', 'Booking', 'Jobs', 'Contact'].map((item, index) => (
              <Link 
                key={index}
                to={item.toLowerCase() === 'home' ? '/' : `/${item.toLowerCase()}`}
                className="group relative px-2 py-2 font-heading text-sm lg:text-base tracking-wide text-accent-navy/90 hover:text-accent-navy transition-all duration-300"
                style={{ animation: `fadeIn 0.5s ease ${index * 0.1}s` }}
              >
                <span className="relative z-10 inline-block">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent-forest group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            ))}
            <Link 
              to="/quote" 
              className="ml-3 px-5 py-2 font-heading text-sm lg:text-base font-medium bg-accent-forest text-white rounded-none hover:bg-accent-navy transition-all duration-300 shadow-sm hover:shadow"
              style={{ animation: 'fadeIn 0.5s ease 0.6s' }}
            >
              Get a Quote
            </Link>
          </nav>
          
          {/* Mobile Menu Button with refined styling */}
          <div className="md:hidden flex items-center">
            <a href="tel:4035557890" className="mr-6 text-accent-navy" aria-label="Call us">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
            <button
              onClick={toggleMobileMenu}
              className="text-accent-navy transition-colors duration-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-white z-40 md:hidden pt-24"
          style={{ animation: 'slideInRight 0.3s ease-in-out' }}
        >
          <div className="px-6 py-4 space-y-0 divide-y divide-neutral-softgray/20">
            {['Home', 'About', 'Services', 'Gallery', 'Team', 'Blog', 'Booking', 'Jobs', 'Contact', 'Payments'].map((item, index) => (
              <Link 
                key={index}
                to={item.toLowerCase() === 'home' ? '/' : `/${item.toLowerCase()}`}
                className="block py-5 font-heading text-accent-navy text-lg"
                onClick={toggleMobileMenu}
                style={{ animation: `fadeIn 0.3s ease ${index * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <span>{item}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent-forest" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </Link>
            ))}
            
            <div className="pt-8 pb-6 px-3">
              <Link 
                to="/quote" 
                className="block w-full py-4 text-center font-heading bg-accent-forest text-white shadow-sm"
                onClick={toggleMobileMenu}
              >
                Get a Quote
              </Link>
              <div className="flex items-center justify-center mt-10 text-sm text-accent-navy/80">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:4035557890" className="hover:text-accent-forest">
                  (403) 555-7890
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 