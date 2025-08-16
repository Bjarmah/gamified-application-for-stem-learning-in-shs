-- Continue updating remaining modules with gamification and Ghana context
-- Update Web Development module
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'HTML and CSS Fundamentals',
            'content', 'Building web pages with HTML structure and CSS styling',
            'duration', 60,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'code_editor',
                    'title', 'Web Page Builder',
                    'description', 'Create your first web page with HTML and CSS',
                    'points', 200
                ),
                jsonb_build_object(
                    'type', 'css_designer',
                    'title', 'CSS Styling Challenge',
                    'description', 'Style web pages using advanced CSS techniques',
                    'points', 180
                )
            ]
        ),
        jsonb_build_object(
            'title', 'JavaScript Interactivity',
            'content', 'Adding interactive features to web pages using JavaScript',
            'duration', 55,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'js_playground',
                    'title', 'JavaScript Interactive Lab',
                    'description', 'Create interactive web elements with JavaScript',
                    'points', 220
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 300,
        'achievements', ARRAY['Web Developer', 'Frontend Master'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Ghana Tourism Website',
                'description', 'Create a website showcasing Ghana''s tourist attractions',
                'points', 600,
                'difficulty', 'advanced'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Ghana government websites and portals',
            'Local e-commerce sites like Jumia Ghana',
            'Educational platforms serving Ghanaian students'
        ],
        'real_world_applications', ARRAY[
            'Building websites for Ghanaian businesses',
            'Creating digital solutions for local communities',
            'Developing educational platforms for Ghana'
        ]
    )
)
WHERE title = 'Web Development';

-- Update Calculus module
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Limits and Continuity',
            'content', 'Understanding limits as the foundation of calculus',
            'duration', 60,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'limit_calculator',
                    'title', 'Limit Explorer',
                    'description', 'Calculate and visualize limits of functions',
                    'points', 220
                ),
                jsonb_build_object(
                    'type', 'continuity_checker',
                    'title', 'Function Continuity Analyzer',
                    'description', 'Analyze function continuity at different points',
                    'points', 200
                )
            ]
        ),
        jsonb_build_object(
            'title', 'Derivatives and Applications',
            'content', 'Computing derivatives and applying them to real-world problems',
            'duration', 65,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'derivative_calculator',
                    'title', 'Derivative Problem Solver',
                    'description', 'Calculate derivatives using various rules',
                    'points', 240
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 350,
        'achievements', ARRAY['Calculus Master', 'Derivative Expert'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Ghana Economic Modeling',
                'description', 'Use calculus to model and optimize Ghana''s economic growth',
                'points', 700,
                'difficulty', 'expert'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Optimization problems in Ghana''s agriculture',
            'Population growth modeling for Ghana',
            'Economic rate analysis for Bank of Ghana'
        ],
        'real_world_applications', ARRAY[
            'Engineering design in Ghana''s infrastructure projects',
            'Economic forecasting and policy analysis',
            'Optimization in Ghana''s manufacturing sector'
        ]
    )
)
WHERE title = 'Calculus';

-- Update Organic Chemistry module
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Carbon Chemistry Fundamentals',
            'content', 'Understanding carbon bonding and organic compound structures',
            'duration', 55,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'molecule_builder_3d',
                    'title', '3D Organic Molecule Constructor',
                    'description', 'Build and manipulate 3D organic molecules',
                    'points', 230
                ),
                jsonb_build_object(
                    'type', 'isomer_identifier',
                    'title', 'Isomer Classification Game',
                    'description', 'Identify and classify different types of isomers',
                    'points', 200
                )
            ]
        ),
        jsonb_build_object(
            'title', 'Functional Groups',
            'content', 'Recognizing and understanding organic functional groups',
            'duration', 50,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'functional_group_lab',
                    'title', 'Functional Group Detective',
                    'description', 'Identify functional groups in complex molecules',
                    'points', 210
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 320,
        'achievements', ARRAY['Organic Chemistry Expert', 'Molecular Architect'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Ghana Pharmaceutical Development',
                'description', 'Design organic compounds for pharmaceutical applications in Ghana',
                'points', 650,
                'difficulty', 'expert'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Palm oil chemistry and processing in Ghana',
            'Cocoa bean organic compounds and chocolate production',
            'Traditional medicinal plants and their organic compounds'
        ],
        'real_world_applications', ARRAY[
            'Pharmaceutical manufacturing in Ghana',
            'Food processing and preservation industry',
            'Cosmetics production using local organic materials'
        ]
    )
)
WHERE title = 'Organic Chemistry';

-- Update Microbiology module
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Microorganism Diversity',
            'content', 'Exploring bacteria, viruses, fungi, and protists',
            'duration', 55,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'microscopy_simulator',
                    'title', 'Virtual Microscopy Lab',
                    'description', 'Observe and identify microorganisms under virtual microscopes',
                    'points', 220
                ),
                jsonb_build_object(
                    'type', 'microbe_classifier',
                    'title', 'Microorganism Classification Game',
                    'description', 'Classify microorganisms based on their characteristics',
                    'points', 190
                )
            ]
        ),
        jsonb_build_object(
            'title', 'Microbial Applications',
            'content', 'Understanding beneficial and harmful roles of microorganisms',
            'duration', 50,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'fermentation_lab',
                    'title', 'Fermentation Process Simulator',
                    'description', 'Explore microbial fermentation processes',
                    'points', 210
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 300,
        'achievements', ARRAY['Microbiology Master', 'Microbe Detective'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Ghana Public Health Initiative',
                'description', 'Design microbiological solutions for Ghana''s public health challenges',
                'points', 580,
                'difficulty', 'advanced'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Fermentation in traditional Ghanaian food production',
            'Water quality testing and microbiology in Ghana',
            'Disease-causing microorganisms in Ghana''s climate'
        ],
        'real_world_applications', ARRAY[
            'Public health and disease prevention in Ghana',
            'Food safety and quality control',
            'Biotechnology applications in agriculture'
        ]
    )
)
WHERE title = 'Microbiology';

-- Update Computer Graphics module
UPDATE modules SET content = jsonb_build_object(
    'lessons', ARRAY[
        jsonb_build_object(
            'title', 'Digital Graphics Fundamentals',
            'content', 'Understanding pixels, vectors, and digital image formats',
            'duration', 55,
            'interactive_elements', ARRAY[
                jsonb_build_object(
                    'type', 'graphics_editor',
                    'title', 'Digital Art Studio',
                    'description', 'Create digital artwork using various tools and techniques',
                    'points', 200
                ),
                jsonb_build_object(
                    'type', 'vector_designer',
                    'title', 'Vector Graphics Workshop',
                    'description', 'Design scalable vector graphics and logos',
                    'points', 180
                )
            ]
        )
    ],
    'gamification', jsonb_build_object(
        'xp_reward', 270,
        'achievements', ARRAY['Digital Artist', 'Graphics Designer'],
        'challenges', ARRAY[
            jsonb_build_object(
                'title', 'Ghana Cultural Art Project',
                'description', 'Create digital art celebrating Ghanaian culture and heritage',
                'points', 450,
                'difficulty', 'intermediate'
            )
        ]
    ),
    'ghana_context', jsonb_build_object(
        'local_examples', ARRAY[
            'Digital art in Ghana''s creative industry',
            'Graphics design for Ghanaian businesses',
            'Traditional Ghanaian art patterns in digital form'
        ],
        'real_world_applications', ARRAY[
            'Advertising and marketing design in Ghana',
            'Game development and animation',
            'Educational content creation'
        ]
    )
)
WHERE title = 'Computer Graphics';