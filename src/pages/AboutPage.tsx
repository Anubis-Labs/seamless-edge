import React from 'react';
import { Helmet } from 'react-helmet';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <Helmet>
        <title>About Seamless Edge | Our Story & Team</title>
        <meta name="description" content="Learn about Seamless Edge, our story, our dedicated team, and our commitment to excellence in drywall and finishing services in Calgary, Alberta." />
      </Helmet>

      {/* Page Header */}
      <section className="w-full py-20 bg-primary text-white">
        <div className="content-container">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Seamless Edge</h1>
          <p className="text-xl max-w-3xl">Get to know the passionate team behind Calgary's premier drywall finishing experts.</p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="w-full py-16 bg-white">
        <div className="content-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded by Steve & Allie, Seamless Edge Co. began as a family passion for quality and precision. 
                What started as a small local operation has grown into a trusted name in drywall and interior finishing, 
                with every project reflecting our dedication to craftsmanship and personal service.
              </p>
              <p className="text-gray-700">
                Based in Calgary, we've spent years perfecting our craft and building a reputation for excellence
                throughout Alberta. Our journey has been defined by a commitment to doing things right the first time
                and treating every client's space with the same care we would our own.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://placehold.co/600x400/e2e8f0/1e293b?text=Our+Story" 
                alt="The founding team of Seamless Edge Co." 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Philosophy */}
      <section className="w-full py-16 bg-gray-50">
        <div className="content-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://placehold.co/600x400/e2e8f0/1e293b?text=Our+Craftsmanship" 
                alt="Seamless Edge craftsman at work" 
                className="w-full h-auto"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6">Craftsmanship Philosophy</h2>
              <p className="text-gray-700 mb-4">
                Our philosophy is simple: never settle for second best. Every board, every tape, every finish 
                is executed with an unwavering commitment to perfection. We believe that your home or business 
                deserves the very best—and we deliver that every time.
              </p>
              <p className="text-gray-700">
                This dedication to quality means we never cut corners, we always use premium materials, and we take 
                the time to ensure every detail is perfect. It's not just about completing a job—it's about creating 
                spaces that stand the test of time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="w-full py-16 bg-white">
        <div className="content-container">
          <h2 className="text-3xl font-bold mb-10 text-center">Meet the Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src="https://placehold.co/300x300/e2e8f0/1e293b?text=Steve" 
                    alt="Steve, Co-founder" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Steve</h3>
                  <p className="text-primary font-medium mb-3">Co-founder & Master Craftsman</p>
                  <p className="text-gray-700">
                    With over 15 years of experience in drywall installation and finishing, 
                    Steve brings unparalleled expertise to every project. His attention to detail
                    and commitment to quality craftsmanship sets the standard for our entire team.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src="https://placehold.co/300x300/e2e8f0/1e293b?text=Allie" 
                    alt="Allie, Co-founder" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Allie</h3>
                  <p className="text-primary font-medium mb-3">Co-founder & Operations Director</p>
                  <p className="text-gray-700">
                    Allie's keen eye for detail and project management expertise ensures that 
                    every job runs smoothly from start to finish. She oversees client communications,
                    scheduling, and quality control to deliver a seamless experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-center">Our Skilled Team</h3>
            <p className="text-gray-700 text-center mb-6">
              Our team is more than just professionals—we're artisans. Each member shares our passion for quality, 
              working together to deliver results that not only meet but exceed client expectations.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-2">
                    <img 
                      src={`https://placehold.co/200x200/e2e8f0/1e293b?text=Team${num}`}
                      alt={`Team member ${num}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-medium">Team Member {num}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Future Vision */}
      <section className="w-full py-16 bg-primary text-white">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Future Vision</h2>
            <p className="mb-6 text-lg">
              Looking ahead, we're committed to mentoring the next generation of drywall experts and expanding 
              our service footprint. Our vision is to set new industry standards, blending traditional techniques 
              with innovative practices to create lasting beauty in every space.
            </p>
            <p className="mb-8">
              As we grow, we remain dedicated to our core values of quality, integrity, and customer satisfaction.
              We're excited about the future of Seamless Edge Co. and look forward to continuing to serve the 
              Calgary area with excellence for years to come.
            </p>
            <a href="/contact" className="btn bg-white text-primary hover:bg-opacity-90 shadow-md">
              Join Us on Our Journey
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 