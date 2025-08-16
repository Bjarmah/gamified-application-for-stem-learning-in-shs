-- Continue updating modules with gamification and Ghana context
-- Update ICT modules
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Introduction to Computers',
            'content', 'Understanding the basic components and functions of computer systems',
            'duration', 45,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'simulation',
                    'title', 'Computer Assembly Challenge',
                    'description', 'Build a virtual computer system step by step',
                    'points', 150
                ),
                jsonb_build_object(
                    'type', 'quiz',
                    'title', 'Hardware Components Quiz',
                    'description', 'Test your knowledge of computer hardware',
                    'points', 100
                )
            ]
        ),
        jsonb_build_object(
            'title', 'Types of Computers',
            'content', 'Exploring different categories of computers and their applications',
            'duration', 40,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'classification_game',
                    'title', 'Computer Classification Challenge',
                    'description', 'Sort different computers into their correct categories',
                    'points', 120
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 200,
        'achievements', ARRAY['Computer Basics Master', 'Hardware Expert'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Build the Perfect Computer Lab',
                'description', 'Design a computer lab setup for a Ghanaian school',
                'points', 300,
                'difficulty', 'intermediate'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Ghana''s National ICT Policy initiatives',
            'Computer labs in Ghanaian schools',
            'Local computer assembly businesses in Accra and Kumasi'
        ],
        'real_world_applications', ARRAY[
            'Using computers for digital banking in Ghana',
            'E-government services like Ghana.gov portal',
            'Computer-based examinations in Ghanaian universities'
        ]
    )
)
WHERE title = 'Introduction to Computer Systems';

-- Update Chemistry modules
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Understanding Chemical Bonding',
            'content', 'Learn how atoms combine to form compounds through ionic, covalent, and metallic bonds',
            'duration', 50,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'molecular_builder',
                    'title', 'Molecule Construction Lab',
                    'description', 'Build molecules by combining atoms with different bonding types',
                    'points', 180
                ),
                jsonb_build_object(
                    'type', 'bonding_predictor',
                    'title', 'Bond Type Predictor',
                    'description', 'Predict the type of bond between different elements',
                    'points', 140
                )
            ]
        ),
        jsonb_build_object(
            'title', 'Ionic vs Covalent Bonds',
            'content', 'Distinguish between ionic and covalent bonding mechanisms',
            'duration', 45,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'electron_transfer_sim',
                    'title', 'Electron Transfer Simulation',
                    'description', 'Visualize how electrons are shared or transferred in chemical bonds',
                    'points', 160
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 250,
        'achievements', ARRAY['Bonding Master', 'Molecular Architect'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Design New Materials',
                'description', 'Create hypothetical materials with specific bonding properties for Ghanaian industries',
                'points', 400,
                'difficulty', 'advanced'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Salt production in Ada and Winneba using ionic compounds',
            'Polymer production for plastic manufacturing in Ghana',
            'Gold extraction processes involving chemical bonding'
        ],
        'real_world_applications', ARRAY[
            'Understanding fertilizer chemistry for Ghanaian agriculture',
            'Material science in construction industry',
            'Water treatment using chemical bonding principles'
        ]
    )
)
WHERE title = 'Chemical Bonding';

-- Update Mathematics modules
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Linear Equations and Inequalities',
            'content', 'Solve and graph linear equations and inequalities in one and two variables',
            'duration', 55,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'equation_solver',
                    'title', 'Equation Detective',
                    'description', 'Solve increasingly complex linear equations step by step',
                    'points', 170
                ),
                jsonb_build_object(
                    'type', 'graphing_tool',
                    'title', 'Linear Graph Master',
                    'description', 'Graph linear equations and interpret their meaning',
                    'points', 150
                )
            ]
        ),
        jsonb_build_object(
            'title', 'Systems of Linear Equations',
            'content', 'Solve systems of equations using substitution, elimination, and graphing',
            'duration', 50,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'system_solver',
                    'title', 'System Solutions Challenge',
                    'description', 'Find solutions to systems using multiple methods',
                    'points', 200
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 220,
        'achievements', ARRAY['Linear Logic Master', 'System Solver'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Business Optimization Problem',
                'description', 'Use linear programming to optimize a Ghanaian business scenario',
                'points', 350,
                'difficulty', 'advanced'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Calculating profit margins for Ghana cocoa exports',
            'Optimizing transportation routes between Accra and Kumasi',
            'Planning resource allocation for Ghana Education Service'
        ],
        'real_world_applications', ARRAY[
            'Budget planning for Ghanaian households',
            'Agricultural yield optimization',
            'Mobile money transaction calculations'
        ]
    )
)
WHERE title = 'Linear Functions and Equations';

-- Update Biology modules
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Cellular Respiration Process',
            'content', 'Understand how cells break down glucose to produce ATP energy',
            'duration', 50,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'metabolic_pathway_sim',
                    'title', 'Cellular Energy Factory',
                    'description', 'Follow glucose through glycolysis, Krebs cycle, and electron transport',
                    'points', 190
                ),
                jsonb_build_object(
                    'type', 'atp_counter',
                    'title', 'ATP Production Tracker',
                    'description', 'Count ATP molecules produced at each stage of respiration',
                    'points', 160
                )
            ]
        ),
        jsonb_build_object(
            'title', 'Aerobic vs Anaerobic Respiration',
            'content', 'Compare oxygen-dependent and oxygen-independent cellular respiration',
            'duration', 45,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'respiration_comparison',
                    'title', 'Respiration Type Analyzer',
                    'description', 'Analyze different organisms and their respiration strategies',
                    'points', 170
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 270,
        'achievements', ARRAY['Energy Master', 'Metabolic Engineer'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Optimize Athletic Performance',
                'description', 'Design training programs based on cellular respiration principles for Ghanaian athletes',
                'points', 420,
                'difficulty', 'expert'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Fermentation in traditional Ghanaian foods like kenkey and banku',
            'Yeast respiration in local bread and akpeteshie production',
            'Muscle respiration during traditional dancing and sports'
        ],
        'real_world_applications', ARRAY[
            'Understanding metabolism for nutrition in Ghana',
            'Athletic training for Ghana national teams',
            'Food preservation techniques using fermentation'
        ]
    )
)
WHERE title = 'Cellular Respiration';

-- Update Physics modules  
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Electric Current and Circuits',
            'content', 'Understand electric current, voltage, and resistance in electrical circuits',
            'duration', 55,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'circuit_builder',
                    'title', 'Virtual Circuit Lab',
                    'description', 'Build and test electrical circuits with different components',
                    'points', 200
                ),
                jsonb_build_object(
                    'type', 'ohms_law_calculator',
                    'title', 'Ohm''s Law Master',
                    'description', 'Apply Ohm''s law to solve circuit problems',
                    'points', 180
                )
            ]
        ),
        jsonb_build_object(
            'title', 'Series and Parallel Circuits',
            'content', 'Analyze the behavior of components in series and parallel configurations',
            'duration', 50,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'circuit_analyzer',
                    'title', 'Circuit Configuration Challenge',
                    'description', 'Compare current and voltage in different circuit types',
                    'points', 190
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 280,
        'achievements', ARRAY['Circuit Master', 'Electrical Engineer'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Power Grid Design',
                'description', 'Design an electrical distribution system for a Ghanaian community',
                'points', 500,
                'difficulty', 'expert'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Volta River Authority power generation and distribution',
            'Solar panel installations in rural Ghana communities',
            'Electrical wiring in Ghanaian homes and offices'
        ],
        'real_world_applications', ARRAY[
            'Understanding electricity bills and consumption in Ghana',
            'Electrical safety in Ghanaian workplaces',
            'Renewable energy solutions for Ghana''s energy needs'
        ]
    )
)
WHERE title = 'Electricity and Circuits';