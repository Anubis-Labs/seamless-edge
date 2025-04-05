import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTools, 
  FaHardHat, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaClipboardList, 
  FaChevronDown, 
  FaChevronUp,
  FaRegPlayCircle,
  FaInfoCircle,
  FaCamera,
  FaArrowRight,
  FaSeedling
} from 'react-icons/fa';

// Types
interface TimelineStep {
  id: number;
  name: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  materials: string[];
  tools: string[];
  challenges: {
    title: string;
    description: string;
    solution: string;
  }[];
  images: {
    before?: string;
    during?: string;
    after?: string;
  };
  videoUrl?: string;
  tipText?: string;
}

interface ProjectTimelineVisualizerProps {
  className?: string;
}

const ProjectTimelineVisualizer: React.FC<ProjectTimelineVisualizerProps> = ({ className = '' }) => {
  const [activeStepId, setActiveStepId] = useState<number | null>(1);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [projectScope, setProjectScope] = useState<'small' | 'medium' | 'large'>('medium');
  const timelineRef = useRef<HTMLDivElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');
  const [currentDay, setCurrentDay] = useState(1);
  const [totalDays, setTotalDays] = useState(10);
  const [timelineDays, setTimelineDays] = useState<number[]>([]);

  // Calculate days based on project scope
  useEffect(() => {
    let days = 7;
    if (projectScope === 'small') days = 5;
    if (projectScope === 'large') days = 14;
    
    setTotalDays(days);
    
    // Create array of days for timeline markers
    const daysArray = [];
    for (let i = 1; i <= days; i++) {
      daysArray.push(i);
    }
    setTimelineDays(daysArray);
    
    // Adjust current day if needed
    if (currentDay > days) {
      setCurrentDay(days);
    }
  }, [projectScope]);

  // Sample timeline steps data
  const timelineSteps: TimelineStep[] = [
    {
      id: 1,
      name: "Preparation & Planning",
      description: "The foundation of a successful drywall project lies in thorough preparation. During this phase, we measure the space, assess any existing conditions, determine material needs, and create a detailed plan that ensures smooth execution.",
      duration: "Day 1",
      icon: <FaClipboardList />,
      materials: ["Measuring tape", "Laser level", "Drywall panels", "Studs"],
      tools: ["Laser measurer", "Stud finder", "Layout tools", "Calculators"],
      challenges: [
        {
          title: "Uneven Existing Surfaces",
          description: "Existing walls or ceilings may have significant deviations that affect drywall installation.",
          solution: "We perform thorough laser measurements to identify irregularities and create compensation plans using shims and adjustable brackets."
        },
        {
          title: "Complex Architectural Features",
          description: "Features like curved walls, coffered ceilings, or unusual angles require special planning.",
          solution: "Our team creates detailed templates and develops custom cutting patterns to ensure perfect fits around complex features."
        }
      ],
      images: {
        before: "/images/services/timeline/preparation-before.jpg",
        during: "/images/services/tools.jpg", 
        after: "/images/services/timeline/preparation-after.jpg"
      },
      tipText: "Pro Tip: A detailed plan saves time during execution. We spend extra time at this stage to prevent issues later."
    },
    {
      id: 2,
      name: "Framing & Infrastructure",
      description: "Before any drywall installation begins, we ensure the underlying structure is sound. This phase involves installing or inspecting framing, addressing any structural issues, and preparing the space for drywall application.",
      duration: "Days 1-2",
      icon: <FaHardHat />,
      materials: ["Metal studs", "Wood studs", "Track", "Fasteners", "Backing materials"],
      tools: ["Laser level", "Stud cutter", "Screw guns", "Nail guns", "Framing square"],
      challenges: [
        {
          title: "Structural Variances",
          description: "Existing structures may not be square or plumb, creating challenges for new framing.",
          solution: "We use laser levels and advanced measuring techniques to create a perfectly level framing system independent of existing structural irregularities."
        },
        {
          title: "Utility Integration",
          description: "Electrical, plumbing, and HVAC systems need to be properly integrated into framing.",
          solution: "Coordination with other trades and use of specialized layout techniques ensures all utilities are properly placed and accessible."
        }
      ],
      images: {
        before: "/images/services/timeline/framing-before.jpg",
        during: "/images/services/timeline/framing-during.jpg",
        after: "/images/services/drywall-installation.jpg"
      },
      videoUrl: "https://www.youtube.com/embed/jhwYI9iIRaE",
      tipText: "Pro Tip: Quality framing makes for quality walls. We never rush this critical foundation step."
    },
    {
      id: 3,
      name: "Drywall Hanging",
      description: "This is when your space begins to take shape. Our team precisely measures, cuts, and installs drywall panels, creating the foundation for your new walls and ceilings with exacting precision.",
      duration: "Days 2-4",
      icon: <FaTools />,
      materials: ["Drywall sheets", "Screws", "Adhesive", "Corner bead", "Dust masks"],
      tools: ["Screw guns", "Utility knives", "T-square", "Drywall lifts", "Routers"],
      challenges: [
        {
          title: "Large or Heavy Panels",
          description: "Ceiling installations and large panels can be difficult to position precisely.",
          solution: "We use professional-grade drywall lifts and multi-person teams to ensure perfect placement without damage to panels."
        },
        {
          title: "Custom Cuts and Openings",
          description: "Fixtures, outlets, and architectural features require precise cutouts.",
          solution: "Our technique involves meticulous measuring and the use of specialized cutting tools to create clean, precise openings."
        }
      ],
      images: {
        before: "/images/services/timeline/hanging-before.jpg",
        during: "/images/services/drywall-installation.jpg",
        after: "/images/services/timeline/hanging-after.jpg"
      },
      videoUrl: "https://www.youtube.com/embed/qZUDdhd6G8Y",
      tipText: "Pro Tip: Proper spacing between panels is crucial for a seamless finish. We maintain perfect 1/8\" gaps at all seams."
    },
    {
      id: 4,
      name: "Taping & Mudding",
      description: "The artistry begins here. We apply joint tape and multiple layers of joint compound (mud) to create seamless transitions between panels, hiding seams and fasteners while building the foundation for a smooth final finish.",
      duration: "Days 4-6",
      icon: <FaTools />,
      materials: ["Joint tape", "Setting compound", "All-purpose compound", "Corner tools", "Sanding materials"],
      tools: ["Taping knives", "Mud pans", "Automatic tapers", "Corner tools", "Sanders"],
      challenges: [
        {
          title: "Environmental Conditions",
          description: "Temperature and humidity significantly affect drying times and compound performance.",
          solution: "We use climate control techniques and adjust our compound formulations based on environmental conditions to ensure optimal drying and performance."
        },
        {
          title: "Complex Corners and Joints",
          description: "Internal and external corners require specialized treatment for durability and aesthetics.",
          solution: "We use professional corner tools and reinforced corner products to create perfectly straight, durable corners that won't crack over time."
        }
      ],
      images: {
        before: "/images/services/timeline/taping-before.jpg",
        during: "/images/services/drywall-taping.jpg",
        after: "/images/services/timeline/taping-after.jpg"
      },
      videoUrl: "https://www.youtube.com/embed/AxLm_Y2zRVk",
      tipText: "Pro Tip: Multiple thin coats create stronger, smoother results than fewer thick coats. Patience is key."
    },
    {
      id: 5,
      name: "Sanding & Finishing",
      description: "This critical phase transforms rough surfaces into perfectly smooth walls and ceilings. Through meticulous sanding and skilled finishing techniques, we prepare the surface for painting or texturing.",
      duration: "Days 7-8",
      icon: <FaTools />,
      materials: ["Sanding screens", "Sanding paper", "Dust masks", "Final coat compound", "Dust collection systems"],
      tools: ["Pole sanders", "Hand sanders", "Sanding sponges", "Dust-free sanding systems", "Inspection lights"],
      challenges: [
        {
          title: "Dust Management",
          description: "Sanding creates significant dust that must be contained.",
          solution: "We use advanced vacuum-attached sanding systems and containment protocols to minimize dust migration throughout your space."
        },
        {
          title: "Achieving Level 5 Finish",
          description: "Premium finishes require extra steps for perfect smoothness.",
          solution: "For high-end projects, we apply a skim coat over the entire surface and use specialized lighting techniques to identify and address any imperfections."
        }
      ],
      images: {
        before: "/images/services/timeline/sanding-before.jpg",
        during: "/images/services/texture-application.jpg",
        after: "/images/services/timeline/sanding-after.jpg"
      },
      videoUrl: "https://www.youtube.com/embed/z9X_EgGOEX8",
      tipText: "Pro Tip: Critical lighting at shallow angles reveals imperfections invisible under normal light. We use this technique to ensure perfection."
    },
    {
      id: 6,
      name: "Texturing (Optional)",
      description: "For those seeking dimensional interest or specific aesthetic effects, we apply custom textures using specialized techniques. From subtle orange peel to dramatic knockdown or artistic hand-troweled finishes, this step adds character to your space.",
      duration: "Days 8-9",
      icon: <FaTools />,
      materials: ["Texturing compound", "Texture additives", "Primers", "Texture spray equipment", "Pattern stamps"],
      tools: ["Spray equipment", "Texture brushes", "Trowels", "Pattern tools", "Texture combs"],
      challenges: [
        {
          title: "Consistency Across Large Areas",
          description: "Maintaining uniform texture across large walls or connected spaces.",
          solution: "We use systematic application techniques and mix large batches of matching materials to ensure perfectly consistent textures throughout your space."
        },
        {
          title: "Custom Patterns",
          description: "Creating unique or matched textures for special projects or repairs.",
          solution: "Our artisans are trained in creating custom texture tools and techniques to match existing patterns or create one-of-a-kind textures to your specifications."
        }
      ],
      images: {
        before: "/images/services/timeline/texture-before.jpg",
        during: "/images/services/texture-application.jpg",
        after: "/images/services/timeline/texture-after.jpg"
      },
      videoUrl: "https://www.youtube.com/embed/GmEjzxO0NO0",
      tipText: "Pro Tip: Textures aren't just decorative—they can hide imperfections and reduce visible wear over time."
    },
    {
      id: 7,
      name: "Final Inspection & Cleanup",
      description: "Before we consider a job complete, we conduct a thorough inspection using specialized lighting to identify any imperfections. We then perform comprehensive cleanup, leaving your space ready for painting or immediate use.",
      duration: "Day 10",
      icon: <FaCheckCircle />,
      materials: ["Cleaning supplies", "Touch-up materials", "Inspection equipment", "Protective coverings"],
      tools: ["High-intensity inspection lights", "Straightedges", "Final touch-up tools", "Cleanup equipment"],
      challenges: [
        {
          title: "Hidden Imperfections",
          description: "Some flaws only appear under specific lighting or after primer application.",
          solution: "We use harsh side-lighting techniques and thorough inspection processes to identify and address issues invisible under normal conditions."
        },
        {
          title: "Thorough Dust Removal",
          description: "Drywall dust can settle in unexpected areas.",
          solution: "Our multi-stage cleanup process includes specialized equipment to capture fine dust particles from all surfaces and air spaces."
        }
      ],
      images: {
        before: "/images/services/timeline/cleanup-before.jpg",
        during: "/images/services/timeline/cleanup-during.jpg",
        after: "/images/services/timeline/cleanup-after.jpg"
      },
      tipText: "Pro Tip: Our quality control inspection uses lighting conditions far more revealing than normal home lighting, ensuring we catch every detail."
    }
  ];

  // Find active step details
  const activeStep = activeStepId ? timelineSteps.find(step => step.id === activeStepId) : null;

  // Handle day click on timeline
  const handleDayClick = (day: number) => {
    setCurrentDay(day);
    
    // Find appropriate step based on day
    let newActiveStep = 1;
    if (day === 1) newActiveStep = 1;
    else if (day <= 2) newActiveStep = 2;
    else if (day <= 4) newActiveStep = 3;
    else if (day <= 6) newActiveStep = 4;
    else if (day <= 8) newActiveStep = 5;
    else if (day <= 9) newActiveStep = 6;
    else newActiveStep = 7;
    
    setActiveStepId(newActiveStep);
  };

  // Handle dragging of timeline
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && dragStartX !== null && timelineRef.current) {
      const diff = e.clientX - dragStartX;
      if (Math.abs(diff) > 50) {
        // Determine direction and move day
        if (diff > 0 && currentDay > 1) {
          handleDayClick(currentDay - 1);
        } else if (diff < 0 && currentDay < totalDays) {
          handleDayClick(currentDay + 1);
        }
        setDragStartX(e.clientX);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStartX(null);
  };

  // Handle scope change
  const handleScopeChange = (scope: 'small' | 'medium' | 'large') => {
    setProjectScope(scope);
  };

  // Open video modal
  const handleVideoClick = (videoUrl: string) => {
    setCurrentVideo(videoUrl);
    setShowVideo(true);
  };

  // Close video modal
  const handleCloseVideo = () => {
    setShowVideo(false);
    setCurrentVideo('');
  };

  return (
    <div className={`project-timeline-visualizer bg-white rounded-lg overflow-hidden shadow-lg ${className}`}>
      {/* Modal for video */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg overflow-hidden w-full max-w-5xl">
            <div className="p-4 bg-accent-navy text-white flex justify-between items-center">
              <h3 className="font-heading text-xl">Process Video</h3>
              <button 
                onClick={handleCloseVideo}
                className="text-white hover:text-white/80"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="aspect-w-16 aspect-h-9">
              <iframe 
                className="w-full h-full"
                src={currentVideo}
                title="Process Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-accent-navy text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-heading font-bold mb-2">Project Timeline Visualizer</h2>
          <p className="text-white/80 max-w-3xl">
            Explore the craftsmanship and detail that goes into every Seamless Edge drywall project. 
            Drag the timeline or click a specific day to see what happens at each stage.
          </p>
          
          {/* Project scope selector */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="text-white font-medium">Project Size:</span>
            <div className="flex rounded-lg overflow-hidden border border-white/20">
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  projectScope === 'small' 
                    ? 'bg-accent-forest text-white' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                onClick={() => handleScopeChange('small')}
              >
                Small Room
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  projectScope === 'medium' 
                    ? 'bg-accent-forest text-white' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                onClick={() => handleScopeChange('medium')}
              >
                Standard Project
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  projectScope === 'large' 
                    ? 'bg-accent-forest text-white' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                onClick={() => handleScopeChange('large')}
              >
                Large Renovation
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Interactive Timeline */}
      <div 
        className="relative py-6 sm:py-8 px-4 sm:px-6 bg-gray-50 border-b border-gray-200"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        ref={timelineRef}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-accent-navy">
            Timeline: Day {currentDay} of {totalDays}
          </h3>
          <div className="text-sm text-gray-600 italic">
            {isDragging ? 'Dragging...' : 'Drag to explore timeline →'}
          </div>
        </div>
        
        {/* Timeline bar */}
        <div className="relative h-16 flex items-center">
          {/* Progress bar */}
          <div className="absolute h-2 bg-gray-200 rounded-full w-full z-0">
            <div 
              className="h-full bg-accent-forest rounded-full transition-all duration-300"
              style={{ width: `${(currentDay / totalDays) * 100}%` }}
            ></div>
          </div>
          
          {/* Day markers */}
          <div className="relative z-10 w-full flex justify-between">
            {timelineDays.map(day => (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 text-xs sm:text-sm ${
                  currentDay === day
                    ? 'bg-accent-forest text-white scale-110 sm:scale-125 shadow-md'
                    : currentDay > day
                    ? 'bg-accent-forest/30 text-accent-navy hover:bg-accent-forest/50'
                    : 'bg-white text-gray-500 border border-gray-300 hover:border-accent-forest hover:text-accent-forest'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
        
        {/* Phase markers */}
        <div className="relative mt-2 pt-4 sm:pt-6 flex flex-wrap justify-between">
          {timelineSteps.map((step, index) => (
            <div 
              key={step.id}
              className="text-center flex-1 min-w-[80px] px-1"
              style={{
                opacity: activeStepId === step.id ? 1 : 0.7,
                transform: activeStepId === step.id ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}
            >
              <div 
                className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-full flex items-center justify-center ${
                  activeStepId === step.id
                    ? 'bg-accent-forest text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.icon}
              </div>
              <p className={`text-xs mt-1 font-medium truncate max-w-[70px] mx-auto ${
                activeStepId === step.id ? 'text-accent-forest' : 'text-gray-600'
              }`}>
                {step.name.split(' ')[0]}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Active Step Details */}
      <AnimatePresence mode="wait">
        {activeStep && (
          <motion.div
            key={activeStep.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="p-4 sm:p-6 md:p-8"
          >
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 bg-accent-navy text-white text-2xl`}>
                {activeStep.icon}
              </div>
              
              <div className="flex-grow">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-accent-navy">{activeStep.name}</h3>
                    <p className="text-accent-forest font-medium">{activeStep.duration}</p>
                  </div>
                  
                  {activeStep.videoUrl && (
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-accent-forest text-white rounded-lg hover:bg-accent-forest/90 transition-colors"
                      onClick={() => handleVideoClick(activeStep.videoUrl!)}
                    >
                      <FaRegPlayCircle />
                      <span>Watch Process</span>
                    </button>
                  )}
                </div>
                
                <p className="text-gray-700 mt-4 mb-6">{activeStep.description}</p>
                
                {/* Image Gallery */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 sm:mb-8">
                  {activeStep.images.before && (
                    <div className="overflow-hidden rounded-lg border border-gray-200 h-48 group relative">
                      <img 
                        src={activeStep.images.before} 
                        alt={`Before ${activeStep.name}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                        <div className="text-white text-sm font-medium flex items-center gap-2">
                          <FaCamera className="text-accent-forest" />
                          <span>Before</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeStep.images.during && (
                    <div className="overflow-hidden rounded-lg border border-gray-200 h-48 group relative">
                      <img 
                        src={activeStep.images.during} 
                        alt={`During ${activeStep.name}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                        <div className="text-white text-sm font-medium flex items-center gap-2">
                          <FaCamera className="text-accent-forest" />
                          <span>During</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeStep.images.after && (
                    <div className="overflow-hidden rounded-lg border border-gray-200 h-48 group relative">
                      <img 
                        src={activeStep.images.after} 
                        alt={`After ${activeStep.name}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                        <div className="text-white text-sm font-medium flex items-center gap-2">
                          <FaCamera className="text-accent-forest" />
                          <span>After</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Materials and Tools */}
                <div className="flex flex-col gap-4 sm:flex-row mb-8">
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 flex-1">
                    <h4 className="text-accent-navy font-heading font-semibold mb-3 flex items-center gap-2">
                      <FaSeedling className="text-accent-forest" />
                      <span>Materials Used</span>
                    </h4>
                    <ul className="flex flex-wrap gap-2 mt-2">
                      {activeStep.materials.map((material, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-700 min-w-[45%]">
                          <svg className="h-1.5 w-1.5 fill-accent-forest flex-shrink-0" viewBox="0 0 6 6">
                            <circle cx="3" cy="3" r="3" />
                          </svg>
                          <span>{material}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 flex-1">
                    <h4 className="text-accent-navy font-heading font-semibold mb-3 flex items-center gap-2">
                      <FaTools className="text-accent-forest" />
                      <span>Professional Tools</span>
                    </h4>
                    <ul className="flex flex-wrap gap-2 mt-2">
                      {activeStep.tools.map((tool, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-700 min-w-[45%]">
                          <svg className="h-1.5 w-1.5 fill-accent-forest flex-shrink-0" viewBox="0 0 6 6">
                            <circle cx="3" cy="3" r="3" />
                          </svg>
                          <span>{tool}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Pro Tip */}
                {activeStep.tipText && (
                  <div className="bg-accent-forest/10 border-l-4 border-accent-forest rounded-r-lg p-4 mb-8">
                    <div className="flex gap-3">
                      <FaInfoCircle className="text-accent-forest text-xl flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-heading font-semibold text-accent-navy mb-1">Craftsman Insight</h4>
                        <p className="text-gray-700">{activeStep.tipText}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Common Challenges */}
                <div className="mb-4">
                  <h4 className="text-accent-navy font-heading font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg">
                    <FaExclamationTriangle className="text-accent-forest" />
                    <span>Common Challenges & Solutions</span>
                  </h4>
                  
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {activeStep.challenges.map((challenge, index) => (
                      <div 
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex-1 min-w-[280px]"
                      >
                        <div className="p-3 sm:p-4 border-b border-gray-100 bg-gray-50">
                          <h5 className="font-medium text-accent-navy text-sm sm:text-base">{challenge.title}</h5>
                        </div>
                        <div className="p-3 sm:p-4">
                          <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">{challenge.description}</p>
                          <div className="flex items-center gap-2 text-accent-forest font-medium text-xs sm:text-sm">
                            <FaArrowRight className="text-xs" />
                            <span>Our Solution:</span>
                          </div>
                          <p className="text-gray-700 text-xs sm:text-sm mt-1">{challenge.solution}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Call to Action */}
      <div className="bg-accent-navy text-white p-4 sm:p-6">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-lg sm:text-xl font-heading font-bold mb-2 sm:mb-3">Experience Our Craftsmanship on Your Project</h3>
          <p className="text-white/80 mb-4 sm:mb-6 text-sm sm:text-base">
            Ready to see the Seamless Edge difference? Our expert team brings this same attention to detail and craftsmanship to every project.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <a
              href="/contact"
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-accent-forest text-white font-medium rounded hover:bg-accent-forest/90 transition-colors text-sm sm:text-base"
            >
              Schedule a Consultation
            </a>
            <a
              href="/gallery"
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white/10 text-white font-medium rounded hover:bg-white/20 transition-colors text-sm sm:text-base mt-2 sm:mt-0"
            >
              View Our Work
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTimelineVisualizer; 