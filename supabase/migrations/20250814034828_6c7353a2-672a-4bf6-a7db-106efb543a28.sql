-- Insert Cell Structure & Function Assessment quiz with correct module UUID
INSERT INTO public.quizzes (
  id,
  title,
  description,
  module_id,
  questions,
  time_limit,
  passing_score
) VALUES (
  gen_random_uuid(),
  'Cell Structure & Function Assessment',
  '20 WASSCE-style MCQs covering membranes, nucleus, organelles and mitosis',
  'eaad0f79-0eb8-4ac4-834b-21e17171d46c',
  '[
    {
      "id": "cs-q1",
      "type": "mcq",
      "question": "Which component is primarily responsible for the selective permeability of cell membranes?",
      "options": {
        "A": "Carbohydrate chains",
        "B": "Phospholipid bilayer with embedded proteins",
        "C": "Cholesterol molecules only",
        "D": "Cellulose fibers"
      },
      "correctAnswer": "B",
      "explanation": "The phospholipid bilayer creates a barrier while embedded proteins provide selective channels and carriers for specific molecules.",
      "difficulty": "basic",
      "topic": "Cell Membrane"
    },
    {
      "id": "cs-q2",
      "type": "mcq",
      "question": "A plant cell is placed in a hypotonic solution. What will most likely happen?",
      "options": {
        "A": "The cell will shrink due to water loss",
        "B": "The cell will swell but the cell wall prevents bursting",
        "C": "The cell membrane will dissolve",
        "D": "Active transport will stop immediately"
      },
      "correctAnswer": "B",
      "explanation": "In hypotonic solutions, water enters the cell by osmosis, causing swelling, but the rigid cell wall prevents the plant cell from bursting.",
      "difficulty": "intermediate",
      "topic": "Osmosis & Transport"
    },
    {
      "id": "cs-q3",
      "type": "mcq",
      "question": "Which process requires the direct use of ATP energy?",
      "options": {
        "A": "Simple diffusion of oxygen",
        "B": "Facilitated diffusion through protein channels",
        "C": "Active transport by sodium-potassium pump",
        "D": "Osmosis of water molecules"
      },
      "correctAnswer": "C",
      "explanation": "Active transport moves substances against concentration gradients using ATP-powered pumps like the sodium-potassium pump.",
      "difficulty": "basic",
      "topic": "Membrane Transport"
    },
    {
      "id": "cs-q4",
      "type": "mcq",
      "question": "The nucleolus is primarily involved in:",
      "options": {
        "A": "DNA replication",
        "B": "Synthesis of ribosomal RNA and ribosome assembly",
        "C": "Protein folding",
        "D": "Lipid metabolism"
      },
      "correctAnswer": "B",
      "explanation": "The nucleolus is the site where ribosomal RNA (rRNA) is synthesized and ribosomal subunits are assembled.",
      "difficulty": "basic",
      "topic": "Nucleus"
    },
    {
      "id": "cs-q5",
      "type": "mcq",
      "question": "Which sequence correctly represents the central dogma of molecular biology?",
      "options": {
        "A": "RNA → DNA → Protein",
        "B": "Protein → DNA → RNA",
        "C": "DNA → RNA → Protein",
        "D": "DNA → Protein → RNA"
      },
      "correctAnswer": "C",
      "explanation": "The central dogma describes information flow from DNA (transcription) to RNA (translation) to protein.",
      "difficulty": "basic",
      "topic": "Gene Expression"
    },
    {
      "id": "cs-q6",
      "type": "mcq",
      "question": "If nuclear pores become completely blocked, which cellular process would be most immediately affected?",
      "options": {
        "A": "ATP synthesis in mitochondria",
        "B": "Export of mRNA from nucleus to cytoplasm",
        "C": "Protein synthesis at ribosomes",
        "D": "DNA replication in the nucleus"
      },
      "correctAnswer": "B",
      "explanation": "Nuclear pores control the transport of mRNA from the nucleus to the cytoplasm where translation occurs.",
      "difficulty": "intermediate",
      "topic": "Nuclear Function"
    },
    {
      "id": "cs-q7",
      "type": "mcq",
      "question": "Which organelle is known as the powerhouse of the cell?",
      "options": {
        "A": "Chloroplast",
        "B": "Mitochondrion",
        "C": "Golgi apparatus",
        "D": "Endoplasmic reticulum"
      },
      "correctAnswer": "B",
      "explanation": "Mitochondria generate most of the cells ATP through cellular respiration, earning them the title powerhouse of the cell.",
      "difficulty": "basic",
      "topic": "Organelles"
    },
    {
      "id": "cs-q8",
      "type": "mcq",
      "question": "A cell with abundant rough endoplasmic reticulum would most likely specialize in:",
      "options": {
        "A": "Lipid synthesis and storage",
        "B": "Protein synthesis and secretion",
        "C": "Carbohydrate metabolism",
        "D": "DNA repair mechanisms"
      },
      "correctAnswer": "B",
      "explanation": "Rough ER has ribosomes attached and specializes in synthesizing proteins destined for secretion or membrane incorporation.",
      "difficulty": "intermediate",
      "topic": "Endoplasmic Reticulum"
    },
    {
      "id": "cs-q9",
      "type": "mcq",
      "question": "Which organelle contains digestive enzymes and is responsible for intracellular digestion?",
      "options": {
        "A": "Peroxisome",
        "B": "Lysosome",
        "C": "Ribosome",
        "D": "Centrosome"
      },
      "correctAnswer": "B",
      "explanation": "Lysosomes contain digestive enzymes that break down worn-out organelles, digest food particles, and destroy harmful substances.",
      "difficulty": "basic",
      "topic": "Lysosomes"
    },
    {
      "id": "cs-q10",
      "type": "mcq",
      "question": "In plant cells, which organelle is responsible for photosynthesis?",
      "options": {
        "A": "Mitochondrion",
        "B": "Golgi apparatus",
        "C": "Chloroplast",
        "D": "Vacuole"
      },
      "correctAnswer": "C",
      "explanation": "Chloroplasts contain chlorophyll and are the sites of photosynthesis in plant cells, converting light energy into chemical energy.",
      "difficulty": "basic",
      "topic": "Chloroplasts"
    },
    {
      "id": "cs-q11",
      "type": "mcq",
      "question": "During which phase of mitosis do chromosomes align at the cells equator?",
      "options": {
        "A": "Prophase",
        "B": "Metaphase",
        "C": "Anaphase",
        "D": "Telophase"
      },
      "correctAnswer": "B",
      "explanation": "During metaphase, chromosomes line up at the metaphase plate (cells equator) ensuring equal distribution to daughter cells.",
      "difficulty": "basic",
      "topic": "Mitosis"
    },
    {
      "id": "cs-q12",
      "type": "mcq",
      "question": "What happens during anaphase of mitosis?",
      "options": {
        "A": "Nuclear envelope breaks down",
        "B": "Chromosomes condense and become visible",
        "C": "Sister chromatids separate and move to opposite poles",
        "D": "Two new nuclear envelopes form"
      },
      "correctAnswer": "C",
      "explanation": "During anaphase, sister chromatids separate and are pulled by spindle fibers toward opposite poles of the cell.",
      "difficulty": "intermediate",
      "topic": "Mitosis Phases"
    },
    {
      "id": "cs-q13",
      "type": "mcq",
      "question": "Cell cycle checkpoints serve to:",
      "options": {
        "A": "Speed up cell division",
        "B": "Ensure DNA integrity before division proceeds",
        "C": "Increase chromosome number",
        "D": "Prevent protein synthesis"
      },
      "correctAnswer": "B",
      "explanation": "Checkpoints monitor DNA integrity and proper chromosome attachment, preventing division if errors are detected.",
      "difficulty": "intermediate",
      "topic": "Cell Cycle Control"
    },
    {
      "id": "cs-q14",
      "type": "mcq",
      "question": "Which statement best describes the difference between rough and smooth endoplasmic reticulum?",
      "options": {
        "A": "Rough ER synthesizes lipids, smooth ER synthesizes proteins",
        "B": "Rough ER has ribosomes attached, smooth ER does not",
        "C": "Rough ER is found in plant cells, smooth ER in animal cells",
        "D": "Rough ER stores calcium, smooth ER stores proteins"
      },
      "correctAnswer": "B",
      "explanation": "Rough ER has ribosomes on its surface giving it a rough appearance, while smooth ER lacks ribosomes.",
      "difficulty": "basic",
      "topic": "ER Structure"
    },
    {
      "id": "cs-q15",
      "type": "mcq",
      "question": "The Golgi apparatus functions primarily to:",
      "options": {
        "A": "Synthesize ATP",
        "B": "Modify, package, and ship proteins",
        "C": "Replicate DNA",
        "D": "Produce ribosomes"
      },
      "correctAnswer": "B",
      "explanation": "The Golgi apparatus modifies proteins from the ER, packages them into vesicles, and ships them to their destinations.",
      "difficulty": "basic",
      "topic": "Golgi Apparatus"
    },
    {
      "id": "cs-q16",
      "type": "mcq",
      "question": "A malfunction in which organelle would most directly affect a cells ability to produce ATP?",
      "options": {
        "A": "Nucleus",
        "B": "Mitochondrion",
        "C": "Golgi apparatus",
        "D": "Lysosome"
      },
      "correctAnswer": "B",
      "explanation": "Mitochondria are the primary sites of ATP production through cellular respiration; their malfunction would severely reduce ATP availability.",
      "difficulty": "intermediate",
      "topic": "Mitochondrial Function"
    },
    {
      "id": "cs-q17",
      "type": "mcq",
      "question": "When a cell undergoes apoptosis (programmed cell death), it is primarily a response to:",
      "options": {
        "A": "Nutrient abundance",
        "B": "DNA damage or cellular stress",
        "C": "Increased ATP production",
        "D": "Enhanced protein synthesis"
      },
      "correctAnswer": "B",
      "explanation": "Apoptosis is triggered by DNA damage, cellular stress, or developmental signals to remove damaged or unnecessary cells.",
      "difficulty": "intermediate",
      "topic": "Cell Death"
    },
    {
      "id": "cs-q18",
      "type": "mcq",
      "question": "The cytoskeleton is primarily responsible for:",
      "options": {
        "A": "Energy production",
        "B": "Protein synthesis",
        "C": "Cell shape and internal organization",
        "D": "DNA replication"
      },
      "correctAnswer": "C",
      "explanation": "The cytoskeleton provides structural support, maintains cell shape, and organizes organelles within the cell.",
      "difficulty": "basic",
      "topic": "Cytoskeleton"
    },
    {
      "id": "cs-q19",
      "type": "mcq",
      "question": "During interphase of the cell cycle, a cell primarily:",
      "options": {
        "A": "Divides its chromosomes",
        "B": "Grows and replicates its DNA",
        "C": "Forms the spindle apparatus",
        "D": "Undergoes cytokinesis"
      },
      "correctAnswer": "B",
      "explanation": "Interphase includes G1 (growth), S (DNA synthesis), and G2 (preparation for division) phases where the cell grows and duplicates its DNA.",
      "difficulty": "basic",
      "topic": "Cell Cycle"
    },
    {
      "id": "cs-q20",
      "type": "mcq",
      "question": "In a hypertonic solution, an animal cell will most likely:",
      "options": {
        "A": "Swell and potentially burst",
        "B": "Maintain its normal size",
        "C": "Shrink due to water loss",
        "D": "Increase its metabolic activity"
      },
      "correctAnswer": "C",
      "explanation": "In hypertonic solutions, water leaves the cell by osmosis causing the cell to shrink (crenation in red blood cells).",
      "difficulty": "basic",
      "topic": "Osmotic Effects"
    }
  ]'::jsonb,
  2400,
  70
);