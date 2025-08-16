-- Continue updating remaining modules with gamification and Ghana context

-- Update Object-Oriented Programming (ICT)
UPDATE modules SET
  gamification = jsonb_build_object(
    'xp_reward', 120,
    'difficulty_level', 'advanced',
    'estimated_time', 45,
    'game_elements', jsonb_build_array(
      'Code Architect Game',
      'Class Designer Challenge',
      'Inheritance Explorer',
      'Polymorphism Puzzle'
    ),
    'achievements', jsonb_build_array(
      'OOP Master',
      'Class Creator',
      'Inheritance Expert',
      'Code Architect'
    )
  ),
  ghana_context = jsonb_build_object(
    'local_examples', jsonb_build_array(
      'Ghana Revenue Authority tax calculation system',
      'Mobile Money transaction processing',
      'Trotro route management system',
      'Agricultural supply chain tracking'
    ),
    'cultural_relevance', 'Learn OOP by building systems used in Ghana''s digital transformation',
    'practical_applications', jsonb_build_array(
      'Design banking software architecture',
      'Create mobile money class hierarchies',
      'Build government service systems',
      'Develop e-commerce platforms'
    )
  )
WHERE title = 'Object-Oriented Programming';

-- Update Trigonometry (Mathematics)
UPDATE modules SET
  gamification = jsonb_build_object(
    'xp_reward', 110,
    'difficulty_level', 'intermediate',
    'estimated_time', 40,
    'game_elements', jsonb_build_array(
      'Triangle Detective',
      'Angle Hunter',
      'Wave Navigator',
      'Height Calculator Challenge'
    ),
    'achievements', jsonb_build_array(
      'Trig Master',
      'Angle Expert',
      'Wave Rider',
      'Height Solver'
    )
  ),
  ghana_context = jsonb_build_object(
    'local_examples', jsonb_build_array(
      'Calculating heights of Kwame Nkrumah Mausoleum',
      'Navigation in Lake Volta',
      'Surveying cocoa farm boundaries',
      'Telecommunications tower placement'
    ),
    'cultural_relevance', 'Apply trigonometry to solve real problems in Ghanaian construction and navigation',
    'practical_applications', jsonb_build_array(
      'Survey land for development projects',
      'Calculate building heights and distances',
      'Navigate using traditional and modern methods',
      'Design architectural structures'
    )
  )
WHERE title = 'Trigonometry';

-- Update Biochemistry (Chemistry)
UPDATE modules SET
  gamification = jsonb_build_object(
    'xp_reward', 130,
    'difficulty_level', 'advanced',
    'estimated_time', 50,
    'game_elements', jsonb_build_array(
      'Enzyme Factory',
      'Metabolic Pathway Explorer',
      'Protein Folding Puzzle',
      'Cellular Energy Game'
    ),
    'achievements', jsonb_build_array(
      'Biochemist',
      'Enzyme Engineer',
      'Metabolism Master',
      'Protein Expert'
    )
  ),
  ghana_context = jsonb_build_object(
    'local_examples', jsonb_build_array(
      'Palm oil extraction biochemistry',
      'Fermentation in pito and palm wine',
      'Nutritional analysis of local foods',
      'Medicinal plant compound analysis'
    ),
    'cultural_relevance', 'Understand the biochemistry behind traditional Ghanaian food processing and medicine',
    'practical_applications', jsonb_build_array(
      'Improve food preservation methods',
      'Analyze nutritional content of indigenous foods',
      'Study traditional medicine biochemistry',
      'Develop biotechnology solutions'
    )
  )
WHERE title = 'Biochemistry';

-- Update Ecology and Environment (Biology)
UPDATE modules SET
  gamification = jsonb_build_object(
    'xp_reward', 115,
    'difficulty_level', 'intermediate',
    'estimated_time', 45,
    'game_elements', jsonb_build_array(
      'Ecosystem Builder',
      'Conservation Hero',
      'Food Web Master',
      'Climate Challenge'
    ),
    'achievements', jsonb_build_array(
      'Eco Warrior',
      'Conservation Expert',
      'Habitat Protector',
      'Green Champion'
    )
  ),
  ghana_context = jsonb_build_object(
    'local_examples', jsonb_build_array(
      'Kakum National Park ecosystem',
      'Volta River watershed management',
      'Deforestation in Ashanti Region',
      'Marine conservation at Cape Coast'
    ),
    'cultural_relevance', 'Study Ghana''s unique ecosystems and environmental challenges',
    'practical_applications', jsonb_build_array(
      'Design conservation strategies',
      'Study climate change impacts',
      'Protect endangered species',
      'Promote sustainable practices'
    )
  )
WHERE title = 'Ecology and Environment';

-- Update Network Security (ICT)
UPDATE modules SET
  gamification = jsonb_build_object(
    'xp_reward', 125,
    'difficulty_level', 'advanced',
    'estimated_time', 50,
    'game_elements', jsonb_build_array(
      'Cyber Defense Challenge',
      'Encryption Master',
      'Network Guardian',
      'Security Scanner'
    ),
    'achievements', jsonb_build_array(
      'Cyber Guardian',
      'Encryption Expert',
      'Network Defender',
      'Security Specialist'
    )
  ),
  ghana_context = jsonb_build_object(
    'local_examples', jsonb_build_array(
      'Mobile money security systems',
      'Government database protection',
      'Banking network security',
      'E-commerce platform safety'
    ),
    'cultural_relevance', 'Learn cybersecurity to protect Ghana''s growing digital infrastructure',
    'practical_applications', jsonb_build_array(
      'Secure mobile payment systems',
      'Protect personal data',
      'Defend against cyber attacks',
      'Implement security protocols'
    )
  )
WHERE title = 'Network Security';