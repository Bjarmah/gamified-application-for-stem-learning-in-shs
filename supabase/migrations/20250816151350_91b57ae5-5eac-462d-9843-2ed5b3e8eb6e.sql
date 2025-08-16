-- Update the large Chemistry module that already has some structured content to improve it further
-- First, let me get the subject IDs to ensure I'm updating the right modules
UPDATE modules SET 
content = '{
  "text": {
    "introduction": "Atomic structure forms the foundation of all chemistry. Understanding how protons, neutrons, and electrons are arranged helps explain chemical behavior, bonding patterns, and the organization of the periodic table.",
    "sections": [
      {
        "title": "Historical Development",
        "content": "Our understanding of atomic structure evolved from ancient Greek atomism through Dalton''s atomic theory, Thomson''s electron discovery, Rutherford''s nuclear model, Bohr''s quantized orbits, to the modern quantum mechanical model. Each model refined our understanding and explained more observations."
      },
      {
        "title": "Subatomic Particles",
        "content": "Atoms consist of protons (positive charge, mass ≈ 1 amu), neutrons (no charge, mass ≈ 1 amu), and electrons (negative charge, mass ≈ 1/1836 amu). Protons and neutrons occupy the nucleus, while electrons exist in orbitals around the nucleus. The number of protons defines the element."
      },
      {
        "title": "Electron Configuration",
        "content": "Electrons occupy orbitals in order of increasing energy: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, etc. The Aufbau principle, Pauli exclusion principle, and Hund''s rule govern electron arrangement. Electron configuration determines chemical properties and bonding behavior."
      },
      {
        "title": "Periodic Trends",
        "content": "Atomic radius decreases across periods (increasing nuclear charge) and increases down groups (additional electron shells). Ionization energy shows the opposite trend. Electronegativity increases across periods and up groups. These trends explain chemical reactivity patterns."
      }
    ]
  },
  "questions": [
    {
      "type": "multiple-choice",
      "question": "Which particle determines the identity of an element?",
      "options": ["Neutrons", "Protons", "Electrons", "Nucleons"],
      "correctAnswer": 1,
      "explanation": "The number of protons (atomic number) uniquely identifies each element and determines its position in the periodic table."
    },
    {
      "type": "multiple-choice",
      "question": "What is the electron configuration of carbon (Z = 6)?",
      "options": ["1s²2s²2p²", "1s²2s²2p⁶", "1s²2p⁴", "2s²2p⁴"],
      "correctAnswer": 0,
      "explanation": "Carbon has 6 electrons: 2 in 1s, 2 in 2s, and 2 in 2p orbitals, giving 1s²2s²2p²."
    }
  ],
  "exercises": [
    {
      "type": "configuration",
      "title": "Electron Configuration Practice",
      "instructions": "Write the electron configurations for the first 20 elements and identify which are metals, nonmetals, or metalloids based on their electron arrangements.",
      "hint": "Use the aufbau principle and consider the number of valence electrons to determine chemical behavior."
    }
  ],
  "scenarioChallenges": [
    {
      "title": "Gold Mining in Ghana",
      "scenario": "Ghana is a major gold producer, and understanding atomic structure helps explain gold''s properties - why it doesn''t corrode, its conductivity, and its chemical inertness that makes it valuable for electronics and jewelry.",
      "tasks": [
        "Explain gold''s electron configuration and how it relates to its chemical stability",
        "Describe why gold is an excellent conductor of electricity",
        "Analyze how gold''s atomic properties make it useful in modern technology"
      ],
      "learningObjectives": [
        "Connect atomic structure to macroscopic properties",
        "Understand the relationship between electron configuration and chemical behavior",
        "Apply atomic theory to real-world materials"
      ],
      "ghanaContext": "Gold mining contributes significantly to Ghana''s economy, and understanding its atomic properties helps explain its enduring value and technological applications."
    }
  ]
}',
estimated_duration = 60,
difficulty_level = 'intermediate'
WHERE title LIKE '%Atomic Structure%' AND subject_id = (SELECT id FROM subjects WHERE name = 'Chemistry');