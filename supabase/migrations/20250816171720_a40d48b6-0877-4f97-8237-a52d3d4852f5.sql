-- Continue updating remaining modules with gamification and Ghana context
-- Update more Chemistry modules
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Acids and Bases Fundamentals',
            'content', 'Understanding the properties and behavior of acids and bases in solutions',
            'duration', 50,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'ph_meter_sim',
                    'title', 'pH Testing Laboratory',
                    'description', 'Test the pH of various solutions using virtual pH meters',
                    'points', 180
                ),
                jsonb_build_object(
                    'type', 'acid_base_reactions',
                    'title', 'Neutralization Reactions',
                    'description', 'Perform acid-base neutralization reactions and predict products',
                    'points', 200
                )
            ]
        ),
        jsonb_build_object(
            'title', 'pH Scale and Indicators',
            'content', 'Learn to use the pH scale and natural indicators to identify acids and bases',
            'duration', 45,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'indicator_lab',
                    'title', 'Natural Indicator Discovery',
                    'description', 'Create and test natural indicators from local plants',
                    'points', 160
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 260,
        'achievements', ARRAY['Acid-Base Master', 'pH Expert'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Ghana Water Quality Assessment',
                'description', 'Test and analyze water quality from different regions in Ghana using acid-base chemistry',
                'points', 450,
                'difficulty', 'advanced'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Testing soil pH for optimal cocoa farming in Ghana',
            'Water quality testing in Lake Volta',
            'Traditional use of plant indicators in Ghanaian communities'
        ],
        'real_world_applications', ARRAY[
            'Agricultural soil management in Ghana',
            'Water treatment plant operations',
            'Quality control in Ghanaian food processing industries'
        ]
    )
)
WHERE title = 'Acids and Bases';

-- Update more Mathematics modules
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Exponential Growth and Decay',
            'content', 'Model real-world phenomena using exponential functions',
            'duration', 50,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'exponential_modeler',
                    'title', 'Population Growth Predictor',
                    'description', 'Model population growth using exponential functions',
                    'points', 190
                ),
                jsonb_build_object(
                    'type', 'compound_interest_calc',
                    'title', 'Investment Growth Calculator',
                    'description', 'Calculate compound interest and investment growth',
                    'points', 170
                )
            ]
        ),
        jsonb_build_object(
            'title', 'Logarithmic Functions',
            'content', 'Understand logarithms as inverse functions of exponentials',
            'duration', 45,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'log_calculator',
                    'title', 'Logarithm Problem Solver',
                    'description', 'Solve logarithmic equations step by step',
                    'points', 180
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 250,
        'achievements', ARRAY['Exponential Expert', 'Logarithm Master'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Ghana Economic Growth Model',
                'description', 'Create mathematical models for Ghana''s economic indicators using exponential functions',
                'points', 400,
                'difficulty', 'advanced'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Modeling Ghana''s population growth trends',
            'Calculating interest rates for Ghana commercial banks',
            'Analyzing cocoa export growth patterns'
        ],
        'real_world_applications', ARRAY[
            'Investment planning with Ghanaian banks',
            'Population planning for Ghana Statistical Service',
            'Economic modeling for Bank of Ghana'
        ]
    )
)
WHERE title = 'Exponential and Logarithmic Functions';

-- Update more Biology modules
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Genetics and Inheritance',
            'content', 'Understand how traits are passed from parents to offspring through genes',
            'duration', 55,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'punnett_square_lab',
                    'title', 'Genetic Cross Predictor',
                    'description', 'Predict offspring traits using Punnett squares',
                    'points', 200
                ),
                jsonb_build_object(
                    'type', 'dna_builder',
                    'title', 'DNA Structure Explorer',
                    'description', 'Build DNA models and understand genetic code',
                    'points', 180
                )
            ]
        ),
        jsonb_build_object(
            'title', 'Mutations and Genetic Variation',
            'content', 'Explore how genetic mutations create diversity in populations',
            'duration', 50,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'mutation_simulator',
                    'title', 'Genetic Mutation Lab',
                    'description', 'Simulate different types of genetic mutations and their effects',
                    'points', 190
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 290,
        'achievements', ARRAY['Genetics Master', 'DNA Detective'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Ghana Crop Improvement Program',
                'description', 'Design breeding programs to improve crop varieties for Ghanaian farmers',
                'points', 500,
                'difficulty', 'expert'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Genetic diversity in Ghanaian populations',
            'Traditional breeding practices for yam and cassava',
            'Sickle cell trait prevalence in Ghana'
        ],
        'real_world_applications', ARRAY[
            'Crop improvement at CSIR research institutes',
            'Genetic counseling in Ghanaian hospitals',
            'Conservation of native plant varieties'
        ]
    )
)
WHERE title = 'Genetics and Heredity';

-- Update more Physics modules
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Wave Properties and Behavior',
            'content', 'Understand the fundamental properties of waves including frequency, wavelength, and amplitude',
            'duration', 50,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'wave_simulator',
                    'title', 'Wave Motion Visualizer',
                    'description', 'Generate and analyze different types of waves',
                    'points', 180
                ),
                jsonb_build_object(
                    'type', 'interference_lab',
                    'title', 'Wave Interference Explorer',
                    'description', 'Study constructive and destructive interference patterns',
                    'points', 190
                )
            ]
        ),
        jsonb_build_object(
            'title', 'Sound Waves and Acoustics',
            'content', 'Explore sound as a mechanical wave and its properties',
            'duration', 45,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'sound_analyzer',
                    'title', 'Audio Frequency Analyzer',
                    'description', 'Analyze the frequency content of different sounds',
                    'points', 170
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 270,
        'achievements', ARRAY['Wave Master', 'Sound Engineer'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Ghana Broadcasting Optimization',
                'description', 'Design optimal radio wave propagation for Ghana Broadcasting Corporation',
                'points', 450,
                'difficulty', 'advanced'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Radio wave propagation across Ghana''s terrain',
            'Acoustic design of Ghana National Theatre',
            'Seismic wave studies from Ghana''s geological surveys'
        ],
        'real_world_applications', ARRAY[
            'Telecommunications infrastructure in Ghana',
            'Music production in Ghanaian recording studios',
            'Earthquake monitoring by Ghana Meteorological Agency'
        ]
    )
)
WHERE title = 'Waves and Sound';

-- Update ICT modules
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Programming Fundamentals',
            'content', 'Introduction to programming concepts and basic coding structures',
            'duration', 60,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'code_editor',
                    'title', 'First Programming Challenge',
                    'description', 'Write your first program using basic programming concepts',
                    'points', 200
                ),
                jsonb_build_object(
                    'type', 'algorithm_builder',
                    'title', 'Algorithm Design Workshop',
                    'description', 'Create step-by-step algorithms to solve problems',
                    'points', 180
                )
            ]
        ),
        jsonb_build_object(
            'title', 'Variables and Data Types',
            'content', 'Understanding how to store and manipulate different types of data',
            'duration', 50,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'data_type_explorer',
                    'title', 'Data Type Detective',
                    'description', 'Identify and work with different data types in programming',
                    'points', 160
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 240,
        'achievements', ARRAY['Code Explorer', 'Algorithm Architect'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Ghana Tech Solution',
                'description', 'Develop a simple program to solve a real problem in Ghana',
                'points', 380,
                'difficulty', 'intermediate'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Ghana''s growing tech hubs in Accra and Kumasi',
            'Local software companies like Farmerline and AgroCenta',
            'Ghana''s digital transformation initiatives'
        ],
        'real_world_applications', ARRAY[
            'Mobile app development for Ghanaian businesses',
            'Digital solutions for Ghana''s agricultural sector',
            'E-commerce platforms serving Ghanaian markets'
        ]
    )
)
WHERE title = 'Introduction to Programming';