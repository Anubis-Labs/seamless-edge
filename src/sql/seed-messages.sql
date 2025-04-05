-- Seed messages with correct structure
-- First clear existing messages
TRUNCATE TABLE messages;

-- Insert dummy messages
INSERT INTO public.messages (name, email, phone, message, source, status, archived)
VALUES 
(
  'David Miller',
  'david.miller@example.com',
  '(403) 555-1234',
  'I''m looking to finish my basement (approximately 800 sq ft) and need a quote for drywall installation. The framing is already complete. Would someone be available to come take a look next week? Thanks!',
  'contact_form',
  'new',
  FALSE
),
(
  'Jennifer Wilson',
  'jennifer.w@example.com',
  '(403) 555-8765',
  'We recently had a small pipe leak that damaged the drywall in our kitchen ceiling. The area is about 4x6 feet. The leak has been fixed, but we need the drywall repaired and matched to our existing texture. How soon could you look at this?',
  'contact_form',
  'new',
  FALSE
),
(
  'Tom Richardson',
  'tom.r@example.com',
  '(403) 555-3456',
  'I represent Altitude Business Solutions, and we''re renovating our office space (approximately 2500 sq ft). We need a complete drywall solution including some specialty sound-dampening requirements for our conference rooms. Would like to discuss your commercial services.',
  'contact_form',
  'read',
  FALSE
),
(
  'Sandra Lee',
  'sandra.lee@example.com',
  '(403) 555-7890',
  'We''re interested in having the popcorn ceiling removed from our 1990s home (approximately 1800 sq ft) and replaced with a modern flat or light texture finish. Could you provide information about this service and a general price range? Thanks!',
  'contact_form',
  'read',
  FALSE
),
(
  'Michael Jordan',
  'michael.j@example.com',
  '(403) 555-2345',
  'I''ve just built a new detached garage (24x24 ft) and need drywall installed and finished. Looking for a quote and your availability in the next month. Is fire-rated drywall required for this type of structure?',
  'contact_form',
  'read',
  TRUE
); 