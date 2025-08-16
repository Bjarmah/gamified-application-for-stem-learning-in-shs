-- Final batch of module updates with gamification and Ghana context
-- Update remaining Chemistry modules
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Periodic Table Organization',
            'content', 'Understand how elements are organized in the periodic table based on their properties',
            'duration', 50,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'periodic_explorer',
                    'title', 'Element Property Explorer',
                    'description', 'Explore periodic trends and element properties',
                    'points', 180
                ),
                jsonb_build_object(
                    'type', 'element_predictor',
                    'title', 'Property Prediction Challenge',
                    'description', 'Predict element properties based on periodic position',
                    'points', 200
                )
            ]
        ),
        jsonb_build_object(
            'title', 'Periodic Trends',
            'content', 'Learn about trends in atomic radius, ionization energy, and electronegativity',
            'duration', 45,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'trend_analyzer',
                    'title', 'Periodic Trend Visualizer',
                    'description', 'Visualize and analyze periodic trends across the table',
                    'points', 190
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 280,
        'achievements', ARRAY['Periodic Master', 'Element Explorer'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Ghana Mineral Resource Analysis',
                'description', 'Analyze the periodic properties of elements found in Ghana''s mineral deposits',
                'points', 480,
                'difficulty', 'advanced'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Gold mining in Ghana and its periodic properties',
            'Bauxite deposits in Ghana and aluminum chemistry',
            'Diamond mining in Ghana and carbon allotropes'
        ],
        'real_world_applications', ARRAY[
            'Mineral processing in Ghana''s mining industry',
            'Quality control in Ghana''s pharmaceutical companies',
            'Environmental impact assessment of mining activities'
        ]
    )
)
WHERE title = 'Periodic Table and Trends';

-- Update remaining Mathematics modules
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Trigonometric Functions',
            'content', 'Understand sine, cosine, and tangent functions and their applications',
            'duration', 55,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'trig_calculator',
                    'title', 'Trigonometric Function Explorer',
                    'description', 'Explore trigonometric functions and their graphs',
                    'points', 200
                ),
                jsonb_build_object(
                    'type', 'triangle_solver',
                    'title', 'Right Triangle Problem Solver',
                    'description', 'Solve right triangle problems using trigonometry',
                    'points', 180
                )
            ]
        ),
        jsonb_build_object(
            'title', 'Trigonometric Applications',
            'content', 'Apply trigonometry to solve real-world problems involving angles and distances',
            'duration', 50,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'surveying_sim',
                    'title', 'Land Surveying Simulator',
                    'description', 'Use trigonometry to measure distances and heights',
                    'points', 220
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 300,
        'achievements', ARRAY['Trigonometry Master', 'Angle Calculator'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Ghana Architectural Design',
                'description', 'Use trigonometry to design buildings and structures in Ghana',
                'points', 520,
                'difficulty', 'expert'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Calculating heights of buildings in Accra skyline',
            'Navigation using trigonometry on Lake Volta',
            'Surveying for road construction projects in Ghana'
        ],
        'real_world_applications', ARRAY[
            'Construction and engineering projects in Ghana',
            'GPS navigation systems used in Ghana',
            'Satellite communication tower positioning'
        ]
    )
)
WHERE title = 'Trigonometry';

-- Update remaining Biology modules
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Ecosystem Structure and Function',
            'content', 'Understand how organisms interact in ecosystems and energy flow',
            'duration', 55,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'ecosystem_builder',
                    'title', 'Ecosystem Design Challenge',
                    'description', 'Build and balance virtual ecosystems',
                    'points', 220
                ),
                jsonb_build_object(
                    'type', 'food_web_creator',
                    'title', 'Food Web Constructor',
                    'description', 'Create complex food webs showing energy transfer',
                    'points', 200
                )
            ]
        ),
        jsonb_build_object(
            'title', 'Biodiversity and Conservation',
            'content', 'Explore biodiversity importance and conservation strategies',
            'duration', 50,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'conservation_planner',
                    'title', 'Wildlife Conservation Strategy',
                    'description', 'Plan conservation strategies for endangered species',
                    'points', 240
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 320,
        'achievements', ARRAY['Ecosystem Engineer', 'Conservation Champion'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Ghana National Park Management',
                'description', 'Develop management plans for Ghana''s national parks and wildlife reserves',
                'points', 600,
                'difficulty', 'expert'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Kakum National Park canopy walkway ecosystem',
            'Mole National Park wildlife conservation',
            'Coastal ecosystems along Ghana''s shoreline'
        ],
        'real_world_applications', ARRAY[
            'Wildlife conservation in Ghana''s protected areas',
            'Sustainable fishing practices along Ghana''s coast',
            'Forest management in Ghana''s timber industry'
        ]
    )
)
WHERE title = 'Ecology and Ecosystems';

-- Update remaining Physics modules
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Light and Optics Fundamentals',
            'content', 'Understand the behavior of light including reflection, refraction, and dispersion',
            'duration', 50,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'optics_lab',
                    'title', 'Virtual Optics Laboratory',
                    'description', 'Experiment with mirrors, lenses, and prisms',
                    'points', 200
                ),
                jsonb_build_object(
                    'type', 'ray_tracer',
                    'title', 'Light Ray Tracer',
                    'description', 'Trace light rays through optical systems',
                    'points', 180
                )
            ]
        ),
        jsonb_build_object(
            'title', 'Electromagnetic Spectrum',
            'content', 'Explore the full electromagnetic spectrum and its applications',
            'duration', 45,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'spectrum_explorer',
                    'title', 'EM Spectrum Interactive',
                    'description', 'Explore different regions of the electromagnetic spectrum',
                    'points', 190
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 290,
        'achievements', ARRAY['Optics Master', 'Light Engineer'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Ghana Solar Energy Optimization',
                'description', 'Design optimal solar panel systems for Ghana''s climate conditions',
                'points', 550,
                'difficulty', 'expert'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Solar energy installations across Ghana',
            'Fiber optic communications in Ghana''s cities',
            'Medical imaging technology in Ghanaian hospitals'
        ],
        'real_world_applications', ARRAY[
            'Solar power generation for rural Ghana communities',
            'Telecommunications infrastructure using fiber optics',
            'Medical equipment maintenance in Ghana''s hospitals'
        ]
    )
)
WHERE title = 'Optics and Light';

-- Update remaining ICT modules
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Computer Networks Basics',
            'content', 'Understanding how computers communicate and share information',
            'duration', 55,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'network_builder',
                    'title', 'Network Design Challenge',
                    'description', 'Design and configure computer networks',
                    'points', 210
                ),
                jsonb_build_object(
                    'type', 'protocol_simulator',
                    'title', 'Internet Protocol Explorer',
                    'description', 'Learn how data travels across networks',
                    'points', 190
                )
            ]
        ),
        jsonb_build_object(
            'title', 'Internet and World Wide Web',
            'content', 'Explore the structure and function of the internet and web technologies',
            'duration', 50,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'web_analyzer',
                    'title', 'Website Structure Analyzer',
                    'description', 'Analyze how websites are built and function',
                    'points', 180
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 260,
        'achievements', ARRAY['Network Architect', 'Internet Explorer'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Ghana Digital Infrastructure',
                'description', 'Design network infrastructure to connect rural Ghana communities',
                'points', 460,
                'difficulty', 'advanced'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Ghana''s national fiber optic backbone network',
            'Mobile network coverage across Ghana',
            'Internet connectivity in Ghanaian schools and universities'
        ],
        'real_world_applications', ARRAY[
            'Improving internet access in rural Ghana',
            'E-government services and digital platforms',
            'Mobile banking and fintech solutions in Ghana'
        ]
    )
)
WHERE title = 'Computer Networks and Internet';