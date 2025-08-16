-- Continue with any remaining modules that need updates
-- Update additional modules that may exist
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'States of Matter',
            'content', 'Understanding solid, liquid, gas, and plasma states and their transitions',
            'duration', 50,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'phase_diagram_explorer',
                    'title', 'Phase Change Laboratory',
                    'description', 'Explore how matter changes between different states',
                    'points', 180
                ),
                jsonb_build_object(
                    'type', 'kinetic_theory_sim',
                    'title', 'Molecular Motion Simulator',
                    'description', 'Visualize molecular behavior in different states',
                    'points', 200
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 250,
        'achievements', ARRAY['Matter Master', 'Phase Expert'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Ghana Industrial Processes',
                'description', 'Apply knowledge of states of matter to Ghana''s industrial processes',
                'points', 400,
                'difficulty', 'intermediate'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Shea butter processing and phase changes',
            'Salt evaporation ponds in coastal Ghana',
            'Traditional food preservation methods'
        ],
        'real_world_applications', ARRAY[
            'Food processing industry in Ghana',
            'Pharmaceutical manufacturing',
            'Oil refining at Tema Oil Refinery'
        ]
    )
)
WHERE title = 'States of Matter';

-- Update Thermodynamics module
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Heat and Temperature',
            'content', 'Understanding the difference between heat and temperature and heat transfer methods',
            'duration', 50,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'heat_transfer_lab',
                    'title', 'Heat Transfer Explorer',
                    'description', 'Investigate conduction, convection, and radiation',
                    'points', 190
                ),
                jsonb_build_object(
                    'type', 'thermal_calculator',
                    'title', 'Thermal Energy Calculator',
                    'description', 'Calculate heat transfer and thermal equilibrium',
                    'points', 170
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 280,
        'achievements', ARRAY['Heat Master', 'Thermal Engineer'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Ghana Energy Efficiency',
                'description', 'Design energy-efficient solutions for Ghanaian buildings',
                'points', 450,
                'difficulty', 'advanced'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Solar heating applications in Ghana',
            'Traditional Ghanaian architecture for climate control',
            'Thermal power generation at Tema'
        ],
        'real_world_applications', ARRAY[
            'Building design for Ghana''s climate',
            'Industrial heating processes',
            'Renewable energy applications'
        ]
    )
)
WHERE title = 'Thermodynamics';

-- Update Probability and Statistics module
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Probability Fundamentals',
            'content', 'Understanding basic probability concepts and calculations',
            'duration', 55,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'probability_simulator',
                    'title', 'Probability Experiment Lab',
                    'description', 'Conduct virtual probability experiments',
                    'points', 180
                ),
                jsonb_build_object(
                    'type', 'dice_game_analyzer',
                    'title', 'Game Probability Analyzer',
                    'description', 'Analyze probabilities in games and real scenarios',
                    'points', 200
                )
            ]
        ),
        jsonb_build_object(
            'title', 'Statistical Analysis',
            'content', 'Learn to collect, organize, and interpret statistical data',
            'duration', 50,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'data_visualizer',
                    'title', 'Statistical Data Visualizer',
                    'description', 'Create charts and graphs from data sets',
                    'points', 190
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 290,
        'achievements', ARRAY['Probability Expert', 'Data Analyst'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Ghana Census Analysis',
                'description', 'Analyze statistical data from Ghana Statistical Service',
                'points', 500,
                'difficulty', 'advanced'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Ghana national census data analysis',
            'Election polling and statistics in Ghana',
            'Agricultural yield statistics from Ghana'
        ],
        'real_world_applications', ARRAY[
            'Market research for Ghanaian businesses',
            'Public health statistics and planning',
            'Economic indicators and policy planning'
        ]
    )
)
WHERE title = 'Probability and Statistics';

-- Update Evolution and Natural Selection module
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Theory of Evolution',
            'content', 'Understanding Darwin''s theory and evidence for evolution',
            'duration', 55,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'evolution_simulator',
                    'title', 'Natural Selection Simulator',
                    'description', 'Observe how species evolve over time',
                    'points', 220
                ),
                jsonb_build_object(
                    'type', 'fossil_timeline',
                    'title', 'Evolutionary Timeline Explorer',
                    'description', 'Explore the fossil record and evolutionary history',
                    'points', 200
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 310,
        'achievements', ARRAY['Evolution Expert', 'Natural Selection Master'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Ghana Biodiversity Study',
                'description', 'Study evolutionary relationships of Ghana''s unique species',
                'points', 550,
                'difficulty', 'expert'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Endemic species in Ghana''s forests',
            'Adaptive features of Ghana''s savanna animals',
            'Evolution of crop varieties in Ghana'
        ],
        'real_world_applications', ARRAY[
            'Conservation biology in Ghana',
            'Agricultural crop development',
            'Understanding antibiotic resistance'
        ]
    )
)
WHERE title = 'Evolution and Natural Selection';

-- Update Database Management module
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Database Fundamentals',
            'content', 'Understanding database concepts, tables, and relationships',
            'duration', 60,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'database_designer',
                    'title', 'Database Design Workshop',
                    'description', 'Design databases for real-world scenarios',
                    'points', 210
                ),
                jsonb_build_object(
                    'type', 'sql_query_builder',
                    'title', 'SQL Query Challenge',
                    'description', 'Write SQL queries to retrieve and manipulate data',
                    'points', 190
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 270,
        'achievements', ARRAY['Database Architect', 'SQL Master'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Ghana Health Records System',
                'description', 'Design a database system for Ghana''s healthcare facilities',
                'points', 480,
                'difficulty', 'advanced'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Student information systems in Ghanaian schools',
            'Banking database systems in Ghana',
            'Government data management systems'
        ],
        'real_world_applications', ARRAY[
            'E-government data management',
            'Business inventory systems',
            'Healthcare record management'
        ]
    )
)
WHERE title = 'Database Management';