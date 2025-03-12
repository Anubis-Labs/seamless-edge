import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfWeek, addDays, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';

// Define time slots for the day (9 AM to 5 PM)
const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

// Sample booked slots data - in a real application, this would come from backend
// Format: 'YYYY-MM-DD-HH:MM' (24 hour format)
const SAMPLE_BOOKED_SLOTS = [
  '2023-11-15-09:00', '2023-11-15-10:00', 
  '2023-11-16-14:00', '2023-11-16-15:00', '2023-11-16-16:00',
  '2023-11-17-09:00', '2023-11-17-11:00', '2023-11-17-13:00',
  '2023-11-18-15:00', '2023-11-18-16:00',
  '2023-11-20-09:00', '2023-11-20-10:00', '2023-11-20-11:00'
];

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

interface DaySchedule {
  date: Date;
  slots: TimeSlot[];
  hasAvailableSlots: boolean;
}

interface BookingCalendarProps {
  onSelectSlot?: (date: Date, time: string) => void;
  selectedDate?: Date | null;
  selectedTime?: string | null;
  isEmbedded?: boolean;
  onDateTimeSelected?: (date: Date, time: string) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  onSelectSlot,
  selectedDate = null,
  selectedTime = null,
  isEmbedded = false,
  onDateTimeSelected
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekSchedule, setWeekSchedule] = useState<DaySchedule[]>([]);
  const [showTimeSlots, setShowTimeSlots] = useState<number | null>(null);
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(selectedDate);
  const [internalSelectedTime, setInternalSelectedTime] = useState<string | null>(selectedTime);
  const [calendarView, setCalendarView] = useState<'week' | 'month'>('week');
  
  // Generate the week schedule based on the current date
  useEffect(() => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start week on Monday
    const newWeekSchedule: DaySchedule[] = [];
    
    // Create 7 days (full week)
    for (let i = 0; i < 7; i++) {
      const date = addDays(startDate, i);
      const dateString = format(date, 'yyyy-MM-dd');
      
      // Generate time slots for this day
      const slots: TimeSlot[] = TIME_SLOTS.map(time => {
        const hourFormat = time.includes('PM') && !time.startsWith('12') 
          ? (parseInt(time) + 12).toString() 
          : time.startsWith('12') && time.includes('PM') 
            ? '12' 
            : time.startsWith('12') && time.includes('AM') 
              ? '0' 
              : time.split(':')[0].padStart(2, '0');
              
        const timeString = `${hourFormat}:00`;
        const slotIdentifier = `${dateString}-${timeString}`;
        
        // Check if this slot is booked
        return {
          time,
          isAvailable: !SAMPLE_BOOKED_SLOTS.includes(slotIdentifier)
        };
      });
      
      // Check if this day has any available slots
      const hasAvailableSlots = slots.some(slot => slot.isAvailable);
      
      newWeekSchedule.push({
        date,
        slots,
        hasAvailableSlots
      });
    }
    
    setWeekSchedule(newWeekSchedule);
  }, [currentDate]);
  
  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentDate(prev => addDays(prev, -7));
    setShowTimeSlots(null);
  };
  
  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentDate(prev => addDays(prev, 7));
    setShowTimeSlots(null);
  };
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
    setShowTimeSlots(null);
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
    setShowTimeSlots(null);
  };
  
  // Toggle display of time slots for a specific day
  const toggleTimeSlots = (index: number) => {
    setShowTimeSlots(prev => prev === index ? null : index);
  };
  
  // Handle slot selection
  const handleSelectSlot = (date: Date, time: string) => {
    setInternalSelectedDate(date);
    setInternalSelectedTime(time);
    
    if (onSelectSlot) {
      onSelectSlot(date, time);
    }
    
    if (onDateTimeSelected) {
      onDateTimeSelected(date, time);
    }
    
    // Auto-close time slots after selection if embedded
    if (isEmbedded) {
      setShowTimeSlots(null);
    }
  };
  
  // Format date for display
  const formatDateDisplay = (date: Date) => {
    return format(date, 'EEE, MMM d');
  };
  
  // Convert time like "9:00 AM" to a comparable value like 9
  const timeToValue = (time: string): number => {
    const hour = parseInt(time.split(':')[0]);
    const isPM = time.includes('PM') && hour !== 12;
    return isPM ? hour + 12 : hour === 12 && !isPM ? 0 : hour;
  };
  
  // Motion variants for animations
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  const timeSlotsVariant = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { 
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };
  
  return (
    <div className={`${isEmbedded ? '' : 'bg-white p-6 rounded-lg shadow-sm'} w-full`}>
      {/* Header with navigation and month/year display */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button 
            onClick={calendarView === 'week' ? goToPreviousWeek : goToPreviousMonth}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label={calendarView === 'week' ? "Previous week" : "Previous month"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-medium text-accent-navy">{format(currentDate, 'MMMM yyyy')}</h2>
          <button 
            onClick={calendarView === 'week' ? goToNextWeek : goToNextMonth}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label={calendarView === 'week' ? "Next week" : "Next month"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setCalendarView('week')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
              calendarView === 'week' 
                ? 'bg-accent-navy text-white' 
                : 'text-accent-navy hover:bg-gray-100'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setCalendarView('month')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
              calendarView === 'month' 
                ? 'bg-accent-navy text-white' 
                : 'text-accent-navy hover:bg-gray-100'
            }`}
          >
            Month
          </button>
        </div>
      </div>
      
      {/* Selected date and time display */}
      {(internalSelectedDate && internalSelectedTime) && (
        <div className="mb-6 p-4 bg-accent-forest/10 border border-accent-forest/20 rounded-md text-accent-navy">
          <p className="font-medium">Selected Appointment:</p>
          <p className="text-lg">{formatDateDisplay(internalSelectedDate)} at {internalSelectedTime}</p>
        </div>
      )}
      
      {/* Week View */}
      {calendarView === 'week' && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariant}
          className="space-y-3"
        >
          {weekSchedule.map((day, index) => (
            <motion.div 
              key={format(day.date, 'yyyy-MM-dd')}
              variants={itemVariant}
              className={`border rounded-lg overflow-hidden ${
                day.hasAvailableSlots 
                  ? 'border-gray-200 hover:border-accent-forest/30' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <button
                onClick={() => toggleTimeSlots(index)}
                disabled={!day.hasAvailableSlots}
                className={`w-full flex items-center justify-between p-4 text-left ${
                  !day.hasAvailableSlots ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                aria-expanded={showTimeSlots === index}
                aria-controls={`time-slots-${index}`}
              >
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    isSameDay(day.date, new Date()) 
                      ? 'bg-accent-navy text-white' 
                      : day.hasAvailableSlots 
                        ? 'bg-accent-forest/10 text-accent-forest' 
                        : 'bg-red-100 text-red-600'
                  }`}>
                    <span className="text-xl font-semibold">{format(day.date, 'd')}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-accent-navy">
                      {format(day.date, 'EEEE')}
                    </h3>
                    <p className="text-sm text-gray-500">{format(day.date, 'MMMM d, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`mr-2 text-sm font-medium ${
                    day.hasAvailableSlots ? 'text-accent-forest' : 'text-red-500'
                  }`}>
                    {day.hasAvailableSlots 
                      ? `${day.slots.filter(slot => slot.isAvailable).length} Available` 
                      : 'Fully Booked'}
                  </span>
                  <div className={`transform transition-transform duration-300 ${
                    showTimeSlots === index ? 'rotate-180' : ''
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>
              
              {/* Time slots */}
              <AnimatePresence>
                {showTimeSlots === index && (
                  <motion.div
                    id={`time-slots-${index}`}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={timeSlotsVariant}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 border-t border-gray-200">
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {day.slots.map((slot, slotIndex) => (
                          <button
                            key={`${index}-${slotIndex}`}
                            disabled={!slot.isAvailable}
                            onClick={() => slot.isAvailable && handleSelectSlot(day.date, slot.time)}
                            className={`p-2 rounded-md text-center transition-colors duration-200 ${
                              internalSelectedDate && 
                              internalSelectedTime === slot.time && 
                              isSameDay(internalSelectedDate, day.date)
                                ? 'bg-accent-navy text-white'
                                : slot.isAvailable
                                  ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-100'
                                  : 'bg-red-50 text-red-300 cursor-not-allowed border border-red-100'
                            }`}
                            aria-label={`${slot.isAvailable ? 'Available' : 'Booked'} at ${slot.time}`}
                          >
                            <span className="text-sm font-medium">{slot.time}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Month View (simplified, shows availability by day) */}
      {calendarView === 'month' && (
        <div className="grid grid-cols-7 gap-2">
          {/* Days of week headers */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center text-gray-500 text-sm p-2">
              {day}
            </div>
          ))}
          
          {/* Day cells - simplified implementation, in a real app would show entire month */}
          {weekSchedule.map((day) => (
            <motion.button
              key={format(day.date, 'yyyy-MM-dd')}
              variants={itemVariant}
              onClick={() => {
                setCurrentDate(day.date);
                setCalendarView('week');
              }}
              className={`p-3 rounded-lg text-center ${
                day.hasAvailableSlots 
                  ? 'bg-green-50 hover:bg-green-100 text-accent-navy' 
                  : 'bg-red-50 text-gray-500'
              }`}
            >
              <span className="text-lg">{format(day.date, 'd')}</span>
              <div className={`text-xs mt-1 ${
                day.hasAvailableSlots ? 'text-green-600' : 'text-red-500'
              }`}>
                {day.hasAvailableSlots 
                  ? `${day.slots.filter(slot => slot.isAvailable).length} Available` 
                  : 'Booked'}
              </div>
            </motion.button>
          ))}
        </div>
      )}
      
      {/* Instructions */}
      <div className="mt-6 text-sm text-gray-600">
        <p>• Green indicates available time slots</p>
        <p>• Red indicates booked time slots</p>
        <p>• Click on a day to view available time slots</p>
      </div>
    </div>
  );
};

export default BookingCalendar; 