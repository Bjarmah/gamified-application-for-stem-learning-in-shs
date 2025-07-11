-- Add comprehensive modules based on Ghanaian SHS curriculum

-- Mathematics modules
INSERT INTO modules (subject_id, title, description, difficulty_level, estimated_duration, order_index) VALUES
-- Get Mathematics subject ID first
((SELECT id FROM subjects WHERE name = 'Mathematics'), 'Functions and Their Graphs', 'Master linear, quadratic, exponential, and logarithmic functions through interactive graphing challenges', 'beginner', 45, 3),
((SELECT id FROM subjects WHERE name = 'Mathematics'), 'Trigonometry: Angles and Ratios', 'Navigate the world of sines, cosines, and tangents with practical applications', 'intermediate', 50, 4),
((SELECT id FROM subjects WHERE name = 'Mathematics'), 'Statistics and Probability', 'Analyze data and predict outcomes using statistical methods and probability theory', 'intermediate', 40, 5),
((SELECT id FROM subjects WHERE name = 'Mathematics'), 'Calculus: Limits and Derivatives', 'Explore rates of change and optimization through differential calculus', 'advanced', 55, 6),
((SELECT id FROM subjects WHERE name = 'Mathematics'), 'Sequences and Series', 'Discover patterns in arithmetic and geometric progressions', 'intermediate', 35, 7),
((SELECT id FROM subjects WHERE name = 'Mathematics'), 'Matrices and Determinants', 'Solve complex systems using matrix operations and transformations', 'advanced', 45, 8),

-- Physics modules  
((SELECT id FROM subjects WHERE name = 'Physics'), 'Waves and Sound', 'Explore wave properties, sound physics, and acoustic phenomena', 'intermediate', 50, 3),
((SELECT id FROM subjects WHERE name = 'Physics'), 'Light and Optics', 'Master reflection, refraction, and optical instruments', 'intermediate', 45, 4),
((SELECT id FROM subjects WHERE name = 'Physics'), 'Heat and Thermodynamics', 'Understanding temperature, heat transfer, and thermal engines', 'intermediate', 50, 5),
((SELECT id FROM subjects WHERE name = 'Physics'), 'Atomic and Nuclear Physics', 'Journey into the atom: structure, radioactivity, and nuclear reactions', 'advanced', 55, 6),
((SELECT id FROM subjects WHERE name = 'Physics'), 'Gravitational Fields', 'Explore planetary motion, satellites, and gravitational forces', 'advanced', 40, 7),
((SELECT id FROM subjects WHERE name = 'Physics'), 'Electric Fields and Capacitance', 'Master electric fields, potential, and energy storage in capacitors', 'advanced', 45, 8),

-- Chemistry modules
((SELECT id FROM subjects WHERE name = 'Chemistry'), 'Acids, Bases and Salts', 'Master pH, neutralization reactions, and salt formation', 'intermediate', 45, 3),
((SELECT id FROM subjects WHERE name = 'Chemistry'), 'Redox Reactions and Electrochemistry', 'Explore electron transfer and electrochemical cells', 'intermediate', 50, 4),
((SELECT id FROM subjects WHERE name = 'Chemistry'), 'Chemical Kinetics', 'Study reaction rates and factors affecting chemical reactions', 'advanced', 40, 5),
((SELECT id FROM subjects WHERE name = 'Chemistry'), 'Chemical Equilibrium', 'Master dynamic equilibrium and Le Chatelier''s principle', 'advanced', 45, 6),
((SELECT id FROM subjects WHERE name = 'Chemistry'), 'Thermochemistry', 'Explore energy changes in chemical reactions', 'intermediate', 40, 7),
((SELECT id FROM subjects WHERE name = 'Chemistry'), 'Environmental Chemistry', 'Study atmospheric chemistry, pollution, and green chemistry', 'intermediate', 35, 8),

-- Biology modules
((SELECT id FROM subjects WHERE name = 'Biology'), 'Ecology and Environmental Biology', 'Explore ecosystems, biodiversity, and environmental conservation', 'intermediate', 50, 3),
((SELECT id FROM subjects WHERE name = 'Biology'), 'Human Physiology', 'Journey through body systems: circulatory, respiratory, and nervous systems', 'intermediate', 55, 4),
((SELECT id FROM subjects WHERE name = 'Biology'), 'Plant Biology and Photosynthesis', 'Discover plant structure, function, and energy conversion processes', 'beginner', 40, 5),
((SELECT id FROM subjects WHERE name = 'Biology'), 'Microbiology and Disease', 'Study microorganisms, infectious diseases, and immune responses', 'intermediate', 45, 6),
((SELECT id FROM subjects WHERE name = 'Biology'), 'Evolution and Classification', 'Explore Darwin''s theory, natural selection, and species classification', 'intermediate', 40, 7),
((SELECT id FROM subjects WHERE name = 'Biology'), 'Biotechnology and Genetic Engineering', 'Modern applications of genetics in medicine and agriculture', 'advanced', 50, 8),

-- Elective ICT modules
((SELECT id FROM subjects WHERE name = 'Elective ICT'), 'Database Design and Management', 'Create and manage databases using SQL and relational design principles', 'intermediate', 50, 3),
((SELECT id FROM subjects WHERE name = 'Elective ICT'), 'Network Fundamentals', 'Understanding computer networks, protocols, and internet technologies', 'intermediate', 45, 4),
((SELECT id FROM subjects WHERE name = 'Elective ICT'), 'Computer Hardware and Architecture', 'Explore computer components, assembly, and system optimization', 'beginner', 40, 5),
((SELECT id FROM subjects WHERE name = 'Elective ICT'), 'Cybersecurity Essentials', 'Protect systems and data from cyber threats and attacks', 'advanced', 55, 6),
((SELECT id FROM subjects WHERE name = 'Elective ICT'), 'Mobile App Development', 'Build mobile applications for Android and iOS platforms', 'advanced', 60, 7),
((SELECT id FROM subjects WHERE name = 'Elective ICT'), 'Digital Graphics and Animation', 'Create stunning visuals using design software and animation tools', 'intermediate', 45, 8),

-- Robotics modules  
((SELECT id FROM subjects WHERE name = 'Robotics'), 'Advanced Sensors and IoT', 'Integrate smart sensors and Internet of Things connectivity', 'advanced', 50, 3),
((SELECT id FROM subjects WHERE name = 'Robotics'), 'Autonomous Navigation Systems', 'Program robots to navigate independently using GPS and mapping', 'advanced', 55, 4),
((SELECT id FROM subjects WHERE name = 'Robotics'), '3D Design and Manufacturing', 'Design robot parts using CAD software and 3D printing technology', 'intermediate', 45, 5),
((SELECT id FROM subjects WHERE name = 'Robotics'), 'Computer Vision Applications', 'Enable robots to see and interpret visual information', 'advanced', 60, 6),
((SELECT id FROM subjects WHERE name = 'Robotics'), 'Drone Technology and Control', 'Build and program unmanned aerial vehicles for various applications', 'advanced', 50, 7),
((SELECT id FROM subjects WHERE name = 'Robotics'), 'Industrial Automation', 'Design automated systems for manufacturing and production', 'advanced', 55, 8);