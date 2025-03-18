import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import PageHero from '../components/common/PageHero';
import { FaLinkedin, FaEnvelope, FaTools, FaQuoteLeft } from 'react-icons/fa';

const teamMembers = [
  {
    id: 1,
    name: 'John Davis',
    role: 'Founder & Lead Drywall Specialist',
    bio: 'With over 15 years of experience in drywall installation and finishing, John founded Seamless Edge with a vision to elevate the standards of drywall craftsmanship in Calgary.',
    quote: "Quality isn't just about materials—it's about precision, patience, and pride in every seam.",
    expertise: ['Level 5 Finishing', 'Custom Textures', 'Project Management'],
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&q=80&auto=format',
    social: {
      linkedin: 'https://linkedin.com',
      email: 'john@seamlessedgeco.com'
    }
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    role: 'Senior Drywall Technician',
    bio: 'Sarah brings a unique blend of technical precision and artistic vision to every project. She specializes in custom textures and decorative finishes that transform ordinary spaces.',
    quote: 'I see every wall as a canvas waiting for the perfect finish to bring it to life.',
    expertise: ['Decorative Finishes', 'Patch Repairs', 'Texture Matching'],
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80&auto=format',
    social: {
      linkedin: 'https://linkedin.com',
      email: 'sarah@seamlessedgeco.com'
    }
  },
  {
    id: 3,
    name: 'Michael Chen',
    role: 'Installation Specialist',
    bio: 'Michael\'s attention to detail and commitment to perfect measurements make him invaluable for complex installation projects. He excels at creating solid foundations for perfect finishes.',
    quote: 'Precision in the beginning creates perfection in the end. Each measurement matters.',
    expertise: ['Precision Boarding', 'Steel Framing', 'Soundproofing'],
    image: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=500&q=80&auto=format',
    social: {
      linkedin: 'https://linkedin.com',
      email: 'michael@seamlessedgeco.com'
    }
  },
  {
    id: 4,
    role: 'Customer Experience Manager',
    name: 'Emily Rodriguez',
    bio: 'Emily ensures that every client receives personalized attention and clear communication throughout their project. Her dedication to customer satisfaction is the cornerstone of our service.',
    quote: 'The best projects begin with clear communication and end with delighted clients.',
    expertise: ['Project Coordination', 'Client Relations', 'Design Consultation'],
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&q=80&auto=format',
    social: {
      linkedin: 'https://linkedin.com',
      email: 'emily@seamlessedgeco.com'
    }
  }
];

const TeamPage: React.FC = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <>
      <Helmet>
        <title>Meet Our Team | Drywall Specialists | Seamless Edge</title>
        <meta name="description" content="Meet the skilled craftsmen and service professionals behind Seamless Edge - Calgary's premier drywall specialists delivering flawless results." />
      </Helmet>

      <PageHero
        title="Meet Our Team"
        subtitle="The skilled professionals dedicated to delivering flawless drywall results for your project"
        backgroundImage="/images/updated/services/consultation-meeting.jpg"
        showAIAssistant={true}
      />

      <section className="py-20 bg-gradient-to-b from-white to-neutral-offwhite/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto mb-20 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-accent-sage">Craftsmanship & Expertise</h2>
            <div className="w-20 h-1 bg-accent-gold mx-auto mb-8"></div>
            <p className="text-lg text-neutral-charcoal/80 mb-6 font-body leading-relaxed">
              At Seamless Edge, our team combines decades of experience with a passion for excellence. 
              Each member brings specialized skills and a commitment to delivering the highest quality 
              drywall solutions for your home or business.
            </p>
            <p className="text-neutral-charcoal/70 italic">
              "Together, we transform spaces with precision, artistry, and uncompromising attention to detail."
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="md:flex flex-col lg:flex-row">
                  <div className="lg:w-2/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-charcoal/70 to-transparent z-10"></div>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-72 lg:h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-4 z-20 lg:hidden">
                      <h3 className="text-2xl font-bold text-white font-heading mb-1">{member.name}</h3>
                      <p className="text-accent-gold font-medium">{member.role}</p>
                    </div>
                  </div>
                  <div className="p-6 lg:w-3/5 flex flex-col">
                    <div className="lg:block hidden mb-4">
                      <h3 className="text-2xl font-bold text-accent-sage font-heading mb-1">{member.name}</h3>
                      <p className="text-accent-gold font-medium mb-1">{member.role}</p>
                      <div className="w-12 h-px bg-accent-gold mb-4"></div>
                    </div>
                    
                    <div className="mb-4 italic text-neutral-charcoal/70 pl-8 relative">
                      <FaQuoteLeft className="absolute left-0 top-0 text-accent-gold/30 text-xl" />
                      {member.quote}
                    </div>
                    
                    <p className="text-neutral-charcoal/80 mb-5 font-body">{member.bio}</p>
                    
                    <h4 className="text-sm font-semibold text-accent-sage mb-3 font-heading uppercase tracking-wide">Areas of Expertise:</h4>
                    <ul className="mb-6">
                      {member.expertise.map((skill, idx) => (
                        <li key={idx} className="flex items-center mb-2 text-sm text-neutral-charcoal/70 font-body">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-gold/10 text-accent-gold mr-3 flex-shrink-0">
                            <FaTools className="text-xs" />
                          </span>
                          {skill}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-auto flex gap-3">
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-offwhite hover:bg-accent-sage hover:text-white transition-colors duration-300"
                        aria-label="LinkedIn Profile"
                      >
                        <FaLinkedin />
                      </a>
                      <a
                        href={`mailto:${member.social.email}`}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-offwhite hover:bg-accent-gold hover:text-white transition-colors duration-300"
                        aria-label="Email Contact"
                      >
                        <FaEnvelope />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="bg-gradient-to-r from-accent-sage/10 to-accent-gold/10 p-12 rounded-xl shadow-inner text-center max-w-4xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-accent-sage mb-4 font-heading">Join Our Team</h3>
            <div className="w-12 h-px bg-accent-gold mx-auto mb-6"></div>
            <p className="text-neutral-charcoal/80 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals who share our passion for quality and craftsmanship.
              If you're interested in joining the Seamless Edge team, we'd love to hear from you.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-accent-gold text-white font-medium hover:bg-accent-gold/90 transition-colors duration-300 shadow-md hover:shadow-lg rounded"
            >
              Apply Today
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default TeamPage; 