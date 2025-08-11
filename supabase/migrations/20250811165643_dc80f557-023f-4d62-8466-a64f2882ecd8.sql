-- Upsert Biology subject, modules, quizzes and remove empty modules
DO $$
DECLARE 
  v_subject_id uuid;
  v_module1_id uuid;
  v_module2_id uuid;
  v_module3_id uuid;
BEGIN
  -- Ensure Biology subject exists
  SELECT id INTO v_subject_id FROM public.subjects WHERE lower(name) = 'biology' LIMIT 1;
  IF v_subject_id IS NULL THEN
    INSERT INTO public.subjects (name, description, color, icon)
    VALUES ('Biology', 'Senior High School Biology modules aligned to WASSCE (Ghana).', '#10B981', 'beaker')
    RETURNING id INTO v_subject_id;
  END IF;

  -- Upsert Module 1: Cell Structure & Function
  SELECT id INTO v_module1_id FROM public.modules 
   WHERE lower(title) = 'cell structure & function' AND subject_id = v_subject_id LIMIT 1;
  IF v_module1_id IS NULL THEN
    INSERT INTO public.modules (subject_id, order_index, estimated_duration, title, description, content, difficulty_level)
    VALUES (
      v_subject_id,
      1,
      45,
      'Cell Structure & Function',
      'Cells, membranes and transport; nucleus and genetic control; organelles; mitosis and controlled division.',
      'Learn the foundations of cell biology: membrane structure and selective permeability; passive and active transport (diffusion, osmosis, facilitated diffusion, pumps); the nucleus—nuclear envelope, pores, chromatin and nucleolus—and how DNA is expressed via transcription and translation; major organelles and their roles (mitochondria, chloroplasts, ribosomes, ER, Golgi, lysosomes, peroxisomes, cytoskeleton); and the cell cycle with mitosis (prophase, metaphase, anaphase, telophase) and why regulated division prevents cancer. Ghana-focused contexts include food preservation by salting (osmosis), crop wilting in saline soils, and public-health links to DNA damage and cancer.',
      'beginner'
    ) RETURNING id INTO v_module1_id;
  ELSE
    UPDATE public.modules
      SET order_index = 1,
          estimated_duration = 45,
          description = 'Cells, membranes and transport; nucleus and genetic control; organelles; mitosis and controlled division.',
          content = 'Learn the foundations of cell biology: membrane structure and selective permeability; passive and active transport (diffusion, osmosis, facilitated diffusion, pumps); the nucleus—nuclear envelope, pores, chromatin and nucleolus—and how DNA is expressed via transcription and translation; major organelles and their roles (mitochondria, chloroplasts, ribosomes, ER, Golgi, lysosomes, peroxisomes, cytoskeleton); and the cell cycle with mitosis (prophase, metaphase, anaphase, telophase) and why regulated division prevents cancer. Ghana-focused contexts include food preservation by salting (osmosis), crop wilting in saline soils, and public-health links to DNA damage and cancer.',
          difficulty_level = 'beginner',
          updated_at = now()
    WHERE id = v_module1_id;
  END IF;

  -- Upsert Module 2: Photosynthesis & Respiration
  SELECT id INTO v_module2_id FROM public.modules 
   WHERE lower(title) = 'photosynthesis & respiration' AND subject_id = v_subject_id LIMIT 1;
  IF v_module2_id IS NULL THEN
    INSERT INTO public.modules (subject_id, order_index, estimated_duration, title, description, content, difficulty_level)
    VALUES (
      v_subject_id,
      2,
      50,
      'Photosynthesis & Respiration',
      'Light reactions and Calvin cycle; glycolysis, Krebs cycle, ETC; ATP and energy flow; compare photosynthesis vs respiration.',
      'Master energy transformations: in chloroplasts, light reactions on thylakoid membranes generate ATP and NADPH and release O2; the Calvin cycle in stroma fixes CO2 into glucose. In mitochondria, glycolysis (cytosol), Krebs cycle (matrix) and the electron transport chain (inner membrane) release energy to make ATP via chemiosmosis; O2 is the terminal electron acceptor. Link concepts to Ghanaian agriculture (CO2 enrichment, shade/irrigation) and sports (aerobic vs anaerobic performance).',
      'intermediate'
    ) RETURNING id INTO v_module2_id;
  ELSE
    UPDATE public.modules
      SET order_index = 2,
          estimated_duration = 50,
          description = 'Light reactions and Calvin cycle; glycolysis, Krebs cycle, ETC; ATP and energy flow; compare photosynthesis vs respiration.',
          content = 'Master energy transformations: in chloroplasts, light reactions on thylakoid membranes generate ATP and NADPH and release O2; the Calvin cycle in stroma fixes CO2 into glucose. In mitochondria, glycolysis (cytosol), Krebs cycle (matrix) and the electron transport chain (inner membrane) release energy to make ATP via chemiosmosis; O2 is the terminal electron acceptor. Link concepts to Ghanaian agriculture (CO2 enrichment, shade/irrigation) and sports (aerobic vs anaerobic performance).',
          difficulty_level = 'intermediate',
          updated_at = now()
    WHERE id = v_module2_id;
  END IF;

  -- Upsert Module 3: Human Body Systems
  SELECT id INTO v_module3_id FROM public.modules 
   WHERE lower(title) = 'human body systems' AND subject_id = v_subject_id LIMIT 1;
  IF v_module3_id IS NULL THEN
    INSERT INTO public.modules (subject_id, order_index, estimated_duration, title, description, content, difficulty_level)
    VALUES (
      v_subject_id,
      3,
      60,
      'Human Body Systems',
      'Circulatory and respiratory systems; coordination and control (nervous and endocrine); homeostasis with Ghana health links.',
      'Explore how body systems sustain life: heart structure and double circulation; arteries, veins and capillaries; blood components and pressure. Respiratory mechanics (diaphragm, intercostals), gas exchange in alveoli and diffusion gradients. Coordination and control via neurons and hormones; homeostasis through negative feedback (with positive feedback exceptions). Ghana context: hypertension risk, altitude effects, diabetes management.',
      'advanced'
    ) RETURNING id INTO v_module3_id;
  ELSE
    UPDATE public.modules
      SET order_index = 3,
          estimated_duration = 60,
          description = 'Circulatory and respiratory systems; coordination and control (nervous and endocrine); homeostasis with Ghana health links.',
          content = 'Explore how body systems sustain life: heart structure and double circulation; arteries, veins and capillaries; blood components and pressure. Respiratory mechanics (diaphragm, intercostals), gas exchange in alveoli and diffusion gradients. Coordination and control via neurons and hormones; homeostasis through negative feedback (with positive feedback exceptions). Ghana context: hypertension risk, altitude effects, diabetes management.',
          difficulty_level = 'advanced',
          updated_at = now()
    WHERE id = v_module3_id;
  END IF;

  -- Upsert quizzes from JSON assessments
  -- Quiz for Module 1
  PERFORM 1 FROM public.quizzes WHERE module_id = v_module1_id AND lower(title) = 'cell structure & function - assessment';
  IF NOT FOUND THEN
    INSERT INTO public.quizzes (module_id, title, description, questions, time_limit, passing_score)
    VALUES (
      v_module1_id,
      'Cell Structure & Function - Assessment',
      '20 WASSCE-style MCQs covering membranes, nucleus, organelles and mitosis.',
      $json$
      {"questions": [
        {"id":"m1-fa-q1","type":"mcq","difficulty":"basic","stem":"Which component primarily forms channels for ion transport?","options":{"A":"Phospholipids","B":"Membrane proteins","C":"Cholesterol","D":"Carbohydrates"},"answer":"B","explanation":"Transmembrane proteins create selective channels."},
        {"id":"m1-fa-q2","type":"mcq","difficulty":"basic","stem":"Which statement about osmosis is correct?","options":{"A":"Requires ATP","B":"Moves solute only","C":"Water moves to hypertonic side","D":"Occurs only in plants"},"answer":"C","explanation":"Water moves toward higher solute (hypertonic)."},
        {"id":"m1-fa-q3","type":"mcq","difficulty":"basic","stem":"Nuclear pores allow:","options":{"A":"ATP synthesis","B":"mRNA export","C":"Photosynthesis","D":"Protein folding"},"answer":"B","explanation":"mRNA exits nucleus for translation."},
        {"id":"m1-fa-q4","type":"mcq","difficulty":"basic","stem":"Which organelle packages proteins for secretion?","options":{"A":"Golgi apparatus","B":"Nucleolus","C":"Lysosome","D":"Chloroplast"},"answer":"A","explanation":"Golgi modifies, sorts, and packages proteins."},
        {"id":"m1-fa-q5","type":"mcq","difficulty":"basic","stem":"During which phase do chromosomes condense?","options":{"A":"Metaphase","B":"Prophase","C":"Anaphase","D":"Telophase"},"answer":"B","explanation":"Condensation marks prophase."},
        {"id":"m1-fa-q6","type":"mcq","difficulty":"basic","stem":"Ribosomes are composed mainly of:","options":{"A":"rRNA and proteins","B":"DNA and lipids","C":"Phospholipids","D":"Cholesterol"},"answer":"A","explanation":"Ribosomes = rRNA + protein."},
        {"id":"m1-fa-q7","type":"mcq","difficulty":"basic","stem":"Function of lysosomes is:","options":{"A":"Protein synthesis","B":"Intracellular digestion","C":"ATP production","D":"Transcription"},"answer":"B","explanation":"Contain hydrolytic enzymes."},
        {"id":"m1-fa-q8","type":"mcq","difficulty":"intermediate","stem":"Blocking Na+/K+ pump will immediately affect:","options":{"A":"Facilitated diffusion","B":"Membrane potential","C":"Osmosis","D":"Endocytosis"},"answer":"B","explanation":"Pump maintains ion gradients essential for membrane potential."},
        {"id":"m1-fa-q9","type":"mcq","difficulty":"intermediate","stem":"A maize leaf with pale chloroplasts likely has reduced:","options":{"A":"Respiration","B":"Photosynthesis","C":"Protein translation","D":"DNA replication"},"answer":"B","explanation":"Chlorosis reduces photosynthesis."},
        {"id":"m1-fa-q10","type":"mcq","difficulty":"intermediate","stem":"Checkpoint failure most directly increases:","options":{"A":"Apoptosis","B":"Mutation accumulation","C":"Protein secretion","D":"Chromosome number"},"answer":"B","explanation":"Unchecked errors persist as mutations."},
        {"id":"m1-fa-q11","type":"mcq","difficulty":"basic","stem":"Chromosomes separate at:","options":{"A":"Anaphase","B":"Prophase","C":"Metaphase","D":"Telophase"},"answer":"A","explanation":"Sister chromatids pulled apart."},
        {"id":"m1-fa-q12","type":"mcq","difficulty":"basic","stem":"Which is NOT part of the endomembrane system?","options":{"A":"Golgi","B":"Rough ER","C":"Mitochondrion","D":"Vesicles"},"answer":"C","explanation":"Mitochondria are not endomembrane components."},
        {"id":"m1-fa-q13","type":"mcq","difficulty":"intermediate","stem":"If aquaporins are inhibited, what decreases most?","options":{"A":"Active transport","B":"Water permeability","C":"Protein synthesis","D":"DNA replication"},"answer":"B","explanation":"Aquaporins facilitate water movement."},
        {"id":"m1-fa-q14","type":"mcq","difficulty":"basic","stem":"Genetic information is stored primarily in:","options":{"A":"rRNA","B":"DNA","C":"ATP","D":"Lipids"},"answer":"B","explanation":"DNA stores hereditary information."},
        {"id":"m1-fa-q15","type":"mcq","difficulty":"intermediate","stem":"A liver cell has extensive smooth ER. It likely specializes in:","options":{"A":"Protein export","B":"Lipid metabolism and detoxification","C":"Photosynthesis","D":"DNA repair"},"answer":"B","explanation":"Smooth ER handles lipids and detox enzymes."},
        {"id":"m1-fa-q16","type":"mcq","difficulty":"advanced","stem":"A drug stabilizes microtubules, preventing depolymerization. Mitosis arrests at:","options":{"A":"G1","B":"Metaphase","C":"Anaphase","D":"Telophase"},"answer":"B","explanation":"Chromosomes cannot segregate if spindles cannot shorten, triggering metaphase arrest."},
        {"id":"m1-fa-q17","type":"mcq","difficulty":"basic","stem":"Which best describes chromatin?","options":{"A":"DNA + proteins","B":"RNA + lipids","C":"Proteins only","D":"DNA only"},"answer":"A","explanation":"Chromatin consists of DNA wrapped around histones."},
        {"id":"m1-fa-q18","type":"mcq","difficulty":"basic","stem":"Primary site of transcription is the:","options":{"A":"Cytoplasm","B":"Nucleus","C":"Mitochondrion","D":"Golgi"},"answer":"B","explanation":"Transcription occurs in the nucleus."},
        {"id":"m1-fa-q19","type":"mcq","difficulty":"intermediate","stem":"Cells in salty soil often wilt because:","options":{"A":"Gain water by osmosis","B":"Lose water to hypertonic soil","C":"Lack ATP","D":"Undergo meiosis"},"answer":"B","explanation":"Water leaves cells into hypertonic environment, reducing turgor."},
        {"id":"m1-fa-q20","type":"mcq","difficulty":"basic","stem":"Function common to mitochondria and chloroplasts:","options":{"A":"ATP generation","B":"DNA replication of nucleus","C":"Protein secretion","D":"Chromosome condensation"},"answer":"A","explanation":"Both generate ATP (via respiration/photosynthesis)."}
      ]}
      $json$::jsonb,
      900,
      70
    );
  ELSE
    UPDATE public.quizzes 
      SET description = '20 WASSCE-style MCQs covering membranes, nucleus, organelles and mitosis.',
          questions = $json$
      {"questions": [
        {"id":"m1-fa-q1","type":"mcq","difficulty":"basic","stem":"Which component primarily forms channels for ion transport?","options":{"A":"Phospholipids","B":"Membrane proteins","C":"Cholesterol","D":"Carbohydrates"},"answer":"B","explanation":"Transmembrane proteins create selective channels."},
        {"id":"m1-fa-q2","type":"mcq","difficulty":"basic","stem":"Which statement about osmosis is correct?","options":{"A":"Requires ATP","B":"Moves solute only","C":"Water moves to hypertonic side","D":"Occurs only in plants"},"answer":"C","explanation":"Water moves toward higher solute (hypertonic)."},
        {"id":"m1-fa-q3","type":"mcq","difficulty":"basic","stem":"Nuclear pores allow:","options":{"A":"ATP synthesis","B":"mRNA export","C":"Photosynthesis","D":"Protein folding"},"answer":"B","explanation":"mRNA exits nucleus for translation."},
        {"id":"m1-fa-q4","type":"mcq","difficulty":"basic","stem":"Which organelle packages proteins for secretion?","options":{"A":"Golgi apparatus","B":"Nucleolus","C":"Lysosome","D":"Chloroplast"},"answer":"A","explanation":"Golgi modifies, sorts, and packages proteins."},
        {"id":"m1-fa-q5","type":"mcq","difficulty":"basic","stem":"During which phase do chromosomes condense?","options":{"A":"Metaphase","B":"Prophase","C":"Anaphase","D":"Telophase"},"answer":"B","explanation":"Condensation marks prophase."},
        {"id":"m1-fa-q6","type":"mcq","difficulty":"basic","stem":"Ribosomes are composed mainly of:","options":{"A":"rRNA and proteins","B":"DNA and lipids","C":"Phospholipids","D":"Cholesterol"},"answer":"A","explanation":"Ribosomes = rRNA + protein."},
        {"id":"m1-fa-q7","type":"mcq","difficulty":"basic","stem":"Function of lysosomes is:","options":{"A":"Protein synthesis","B":"Intracellular digestion","C":"ATP production","D":"Transcription"},"answer":"B","explanation":"Contain hydrolytic enzymes."},
        {"id":"m1-fa-q8","type":"mcq","difficulty":"intermediate","stem":"Blocking Na+/K+ pump will immediately affect:","options":{"A":"Facilitated diffusion","B":"Membrane potential","C":"Osmosis","D":"Endocytosis"},"answer":"B","explanation":"Pump maintains ion gradients essential for membrane potential."},
        {"id":"m1-fa-q9","type":"mcq","difficulty":"intermediate","stem":"A maize leaf with pale chloroplasts likely has reduced:","options":{"A":"Respiration","B":"Photosynthesis","C":"Protein translation","D":"DNA replication"},"answer":"B","explanation":"Chlorosis reduces photosynthesis."},
        {"id":"m1-fa-q10","type":"mcq","difficulty":"intermediate","stem":"Checkpoint failure most directly increases:","options":{"A":"Apoptosis","B":"Mutation accumulation","C":"Protein secretion","D":"Chromosome number"},"answer":"B","explanation":"Unchecked errors persist as mutations."},
        {"id":"m1-fa-q11","type":"mcq","difficulty":"basic","stem":"Chromosomes separate at:","options":{"A":"Anaphase","B":"Prophase","C":"Metaphase","D":"Telophase"},"answer":"A","explanation":"Sister chromatids pulled apart."},
        {"id":"m1-fa-q12","type":"mcq","difficulty":"basic","stem":"Which is NOT part of the endomembrane system?","options":{"A":"Golgi","B":"Rough ER","C":"Mitochondrion","D":"Vesicles"},"answer":"C","explanation":"Mitochondria are not endomembrane components."},
        {"id":"m1-fa-q13","type":"mcq","difficulty":"intermediate","stem":"If aquaporins are inhibited, what decreases most?","options":{"A":"Active transport","B":"Water permeability","C":"Protein synthesis","D":"DNA replication"},"answer":"B","explanation":"Aquaporins facilitate water movement."},
        {"id":"m1-fa-q14","type":"mcq","difficulty":"basic","stem":"Genetic information is stored primarily in:","options":{"A":"rRNA","B":"DNA","C":"ATP","D":"Lipids"},"answer":"B","explanation":"DNA stores hereditary information."},
        {"id":"m1-fa-q15","type":"mcq","difficulty":"intermediate","stem":"A liver cell has extensive smooth ER. It likely specializes in:","options":{"A":"Protein export","B":"Lipid metabolism and detoxification","C":"Photosynthesis","D":"DNA repair"},"answer":"B","explanation":"Smooth ER handles lipids and detox enzymes."},
        {"id":"m1-fa-q16","type":"mcq","difficulty":"advanced","stem":"A drug stabilizes microtubules, preventing depolymerization. Mitosis arrests at:","options":{"A":"G1","B":"Metaphase","C":"Anaphase","D":"Telophase"},"answer":"B","explanation":"Chromosomes cannot segregate if spindles cannot shorten, triggering metaphase arrest."},
        {"id":"m1-fa-q17","type":"mcq","difficulty":"basic","stem":"Which best describes chromatin?","options":{"A":"DNA + proteins","B":"RNA + lipids","C":"Proteins only","D":"DNA only"},"answer":"A","explanation":"Chromatin consists of DNA wrapped around histones."},
        {"id":"m1-fa-q18","type":"mcq","difficulty":"basic","stem":"Primary site of transcription is the:","options":{"A":"Cytoplasm","B":"Nucleus","C":"Mitochondrion","D":"Golgi"},"answer":"B","explanation":"Transcription occurs in the nucleus."},
        {"id":"m1-fa-q19","type":"mcq","difficulty":"intermediate","stem":"Cells in salty soil often wilt because:","options":{"A":"Gain water by osmosis","B":"Lose water to hypertonic soil","C":"Lack ATP","D":"Undergo meiosis"},"answer":"B","explanation":"Water leaves cells into hypertonic environment, reducing turgor."},
        {"id":"m1-fa-q20","type":"mcq","difficulty":"basic","stem":"Function common to mitochondria and chloroplasts:","options":{"A":"ATP generation","B":"DNA replication of nucleus","C":"Protein secretion","D":"Chromosome condensation"},"answer":"A","explanation":"Both generate ATP (via respiration/photosynthesis)."}
      ]}
      $json$::jsonb,
          time_limit = 900,
          passing_score = 70,
          updated_at = now()
    WHERE module_id = v_module1_id AND lower(title) = 'cell structure & function - assessment';
  END IF;

  -- Quiz for Module 2
  PERFORM 1 FROM public.quizzes WHERE module_id = v_module2_id AND lower(title) = 'photosynthesis & respiration - assessment';
  IF NOT FOUND THEN
    INSERT INTO public.quizzes (module_id, title, description, questions, time_limit, passing_score)
    VALUES (
      v_module2_id,
      'Photosynthesis & Respiration - Assessment',
      '20 mixed MCQs on light reactions, Calvin cycle, respiration and energy flow.',
      $json${"questions":[
        {"id":"m2-fa-q1","type":"mcq","stem":"Main products of light reactions are:","options":{"A":"Glucose and O2","B":"ATP and NADPH","C":"Pyruvate and CO2","D":"Ethanol and CO2"},"answer":"B","explanation":"ATP and NADPH power Calvin cycle."},
        {"id":"m2-fa-q2","type":"mcq","stem":"Calvin cycle occurs in the:","options":{"A":"Thylakoid lumen","B":"Stroma","C":"Matrix","D":"Cytosol"},"answer":"B","explanation":"Stroma houses enzymes for carbon fixation."},
        {"id":"m2-fa-q3","type":"mcq","stem":"Where is the ETC for respiration located?","options":{"A":"Outer membrane","B":"Inner mitochondrial membrane","C":"Chloroplast stroma","D":"Cytosol"},"answer":"B","explanation":"ETC complexes sit in the inner membrane."},
        {"id":"m2-fa-q4","type":"mcq","stem":"During vigorous exercise, muscles produce:","options":{"A":"Ethanol","B":"Lactate","C":"Glucose","D":"RuBP"},"answer":"B","explanation":"Anaerobic pathway produces lactate."},
        {"id":"m2-fa-q5","type":"mcq","stem":"Which factor increases photosynthesis up to a point then plateaus?","options":{"A":"Light intensity","B":"Salt concentration","C":"Pigment color","D":"Leaf age only"},"answer":"A","explanation":"Light is a classic limiting factor with saturation."},
        {"id":"m2-fa-q6","type":"mcq","stem":"Most ATP per glucose comes from:","options":{"A":"Glycolysis","B":"Krebs cycle","C":"Oxidative phosphorylation","D":"Fermentation"},"answer":"C","explanation":"ETC-driven ATP synthase yields majority."},
        {"id":"m2-fa-q7","type":"mcq","stem":"If mitochondrial membrane is uncoupled, what happens?","options":{"A":"More ATP","B":"Heat production increases, ATP drops","C":"No glycolysis","D":"No oxygen use"},"answer":"B","explanation":"Proton gradient dissipates as heat; ATP synthesis falls."},
        {"id":"m2-fa-q8","type":"mcq","stem":"Which molecule is reduced in light reactions?","options":{"A":"NADP+","B":"O2","C":"ATP","D":"CO2"},"answer":"A","explanation":"NADP+ is reduced to NADPH."},
        {"id":"m2-fa-q9","type":"mcq","stem":"Net ATP from glycolysis is:","options":{"A":"0","B":"2","C":"4","D":"6"},"answer":"B","explanation":"Gross 4, net 2 ATP."},
        {"id":"m2-fa-q10","type":"mcq","stem":"Best comparison of processes:","options":{"A":"Both release CO2","B":"Photosynthesis releases CO2","C":"Respiration consumes CO2","D":"Photosynthesis consumes CO2; respiration releases CO2"},"answer":"D","explanation":"Accurate complementarity."},
        {"id":"m2-fa-q11","type":"mcq","stem":"Increased CO2 in a greenhouse will:","options":{"A":"Always decrease yield","B":"Increase photosynthesis up to a limit","C":"Stop light reactions","D":"Cause fermentation"},"answer":"B","explanation":"CO2 enhances Calvin cycle when other factors are adequate."},
        {"id":"m2-fa-q12","type":"mcq","stem":"Which is directly required for Calvin cycle?","options":{"A":"Light","B":"ATP and NADPH","C":"O2","D":"Lactate"},"answer":"B","explanation":"Uses products of light reactions."},
        {"id":"m2-fa-q13","type":"mcq","stem":"Which statement about trophic levels is true?","options":{"A":"Energy transfer is efficient (~90%)","B":"About 10% transfers between levels","C":"Producers rely on respiration only","D":"Consumers perform photosynthesis"},"answer":"B","explanation":"~10% rule."},
        {"id":"m2-fa-q14","type":"mcq","stem":"ETC requires which gas?","options":{"A":"CO2","B":"O2","C":"N2","D":"CH4"},"answer":"B","explanation":"Oxygen is terminal electron acceptor."},
        {"id":"m2-fa-q15","type":"mcq","stem":"Photolysis directly produces:","options":{"A":"RuBP","B":"O2","C":"Glucose","D":"Pyruvate"},"answer":"B","explanation":"Water splitting releases oxygen."},
        {"id":"m2-fa-q16","type":"mcq","stem":"Which situation favors fermentation?","options":{"A":"High oxygen availability","B":"Low oxygen in muscle","C":"Bright sunlight","D":"High CO2"},"answer":"B","explanation":"Oxygen debt triggers anaerobic metabolism."},
        {"id":"m2-fa-q17","type":"mcq","stem":"Main role of ATP synthase is to:","options":{"A":"Pump electrons","B":"Synthesize ATP using proton gradient","C":"Fix CO2","D":"Split water"},"answer":"B","explanation":"Chemiosmosis produces ATP."},
        {"id":"m2-fa-q18","type":"mcq","stem":"Which agricultural practice can increase photosynthesis?","options":{"A":"Overcrowding plants","B":"Optimizing spacing and irrigation","C":"Removing all shade in dry season","D":"Low CO2 greenhouse"},"answer":"B","explanation":"Improved light and water access optimize rates."},
        {"id":"m2-fa-q19","type":"mcq","stem":"How many CO2 molecules are fixed to produce one glucose?","options":{"A":"3","B":"6","C":"12","D":"2"},"answer":"B","explanation":"Six CO2 are required per glucose."},
        {"id":"m2-fa-q20","type":"mcq","stem":"ETC inhibition immediately decreases:","options":{"A":"ATP yield","B":"Light absorption","C":"CO2 levels","D":"Glycolysis rate to zero"},"answer":"A","explanation":"No gradient means less ATP."}
      ]}$json$::jsonb,
      900,
      70
    );
  ELSE
    UPDATE public.quizzes 
      SET description = '20 mixed MCQs on light reactions, Calvin cycle, respiration and energy flow.',
          questions = $json${"questions":[
        {"id":"m2-fa-q1","type":"mcq","stem":"Main products of light reactions are:","options":{"A":"Glucose and O2","B":"ATP and NADPH","C":"Pyruvate and CO2","D":"Ethanol and CO2"},"answer":"B","explanation":"ATP and NADPH power Calvin cycle."},
        {"id":"m2-fa-q2","type":"mcq","stem":"Calvin cycle occurs in the:","options":{"A":"Thylakoid lumen","B":"Stroma","C":"Matrix","D":"Cytosol"},"answer":"B","explanation":"Stroma houses enzymes for carbon fixation."},
        {"id":"m2-fa-q3","type":"mcq","stem":"Where is the ETC for respiration located?","options":{"A":"Outer membrane","B":"Inner mitochondrial membrane","C":"Chloroplast stroma","D":"Cytosol"},"answer":"B","explanation":"ETC complexes sit in the inner membrane."},
        {"id":"m2-fa-q4","type":"mcq","stem":"During vigorous exercise, muscles produce:","options":{"A":"Ethanol","B":"Lactate","C":"Glucose","D":"RuBP"},"answer":"B","explanation":"Anaerobic pathway produces lactate."},
        {"id":"m2-fa-q5","type":"mcq","stem":"Which factor increases photosynthesis up to a point then plateaus?","options":{"A":"Light intensity","B":"Salt concentration","C":"Pigment color","D":"Leaf age only"},"answer":"A","explanation":"Light is a classic limiting factor with saturation."},
        {"id":"m2-fa-q6","type":"mcq","stem":"Most ATP per glucose comes from:","options":{"A":"Glycolysis","B":"Krebs cycle","C":"Oxidative phosphorylation","D":"Fermentation"},"answer":"C","explanation":"ETC-driven ATP synthase yields majority."},
        {"id":"m2-fa-q7","type":"mcq","stem":"If mitochondrial membrane is uncoupled, what happens?","options":{"A":"More ATP","B":"Heat production increases, ATP drops","C":"No glycolysis","D":"No oxygen use"},"answer":"B","explanation":"Proton gradient dissipates as heat; ATP synthesis falls."},
        {"id":"m2-fa-q8","type":"mcq","stem":"Which molecule is reduced in light reactions?","options":{"A":"NADP+","B":"O2","C":"ATP","D":"CO2"},"answer":"A","explanation":"NADP+ is reduced to NADPH."},
        {"id":"m2-fa-q9","type":"mcq","stem":"Net ATP from glycolysis is:","options":{"A":"0","B":"2","C":"4","D":"6"},"answer":"B","explanation":"Gross 4, net 2 ATP."},
        {"id":"m2-fa-q10","type":"mcq","stem":"Best comparison of processes:","options":{"A":"Both release CO2","B":"Photosynthesis releases CO2","C":"Respiration consumes CO2","D":"Photosynthesis consumes CO2; respiration releases CO2"},"answer":"D","explanation":"Accurate complementarity."},
        {"id":"m2-fa-q11","type":"mcq","stem":"Increased CO2 in a greenhouse will:","options":{"A":"Always decrease yield","B":"Increase photosynthesis up to a limit","C":"Stop light reactions","D":"Cause fermentation"},"answer":"B","explanation":"CO2 enhances Calvin cycle when other factors are adequate."},
        {"id":"m2-fa-q12","type":"mcq","stem":"Which is directly required for Calvin cycle?","options":{"A":"Light","B":"ATP and NADPH","C":"O2","D":"Lactate"},"answer":"B","explanation":"Uses products of light reactions."},
        {"id":"m2-fa-q13","type":"mcq","stem":"Which statement about trophic levels is true?","options":{"A":"Energy transfer is efficient (~90%)","B":"About 10% transfers between levels","C":"Producers rely on respiration only","D":"Consumers perform photosynthesis"},"answer":"B","explanation":"~10% rule."},
        {"id":"m2-fa-q14","type":"mcq","stem":"ETC requires which gas?","options":{"A":"CO2","B":"O2","C":"N2","D":"CH4"},"answer":"B","explanation":"Oxygen is terminal electron acceptor."},
        {"id":"m2-fa-q15","type":"mcq","stem":"Photolysis directly produces:","options":{"A":"RuBP","B":"O2","C":"Glucose","D":"Pyruvate"},"answer":"B","explanation":"Water splitting releases oxygen."},
        {"id":"m2-fa-q16","type":"mcq","stem":"Which situation favors fermentation?","options":{"A":"High oxygen availability","B":"Low oxygen in muscle","C":"Bright sunlight","D":"High CO2"},"answer":"B","explanation":"Oxygen debt triggers anaerobic metabolism."},
        {"id":"m2-fa-q17","type":"mcq","stem":"Main role of ATP synthase is to:","options":{"A":"Pump electrons","B":"Synthesize ATP using proton gradient","C":"Fix CO2","D":"Split water"},"answer":"B","explanation":"Chemiosmosis produces ATP."},
        {"id":"m2-fa-q18","type":"mcq","stem":"Which agricultural practice can increase photosynthesis?","options":{"A":"Overcrowding plants","B":"Optimizing spacing and irrigation","C":"Removing all shade in dry season","D":"Low CO2 greenhouse"},"answer":"B","explanation":"Improved light and water access optimize rates."},
        {"id":"m2-fa-q19","type":"mcq","stem":"How many CO2 molecules are fixed to produce one glucose?","options":{"A":"3","B":"6","C":"12","D":"2"},"answer":"B","explanation":"Six CO2 are required per glucose."},
        {"id":"m2-fa-q20","type":"mcq","stem":"ETC inhibition immediately decreases:","options":{"A":"ATP yield","B":"Light absorption","C":"CO2 levels","D":"Glycolysis rate to zero"},"answer":"A","explanation":"No gradient means less ATP."}
      ]}$json$::jsonb,
          time_limit = 900,
          passing_score = 70,
          updated_at = now()
    WHERE module_id = v_module2_id AND lower(title) = 'photosynthesis & respiration - assessment';
  END IF;

  -- Quiz for Module 3
  PERFORM 1 FROM public.quizzes WHERE module_id = v_module3_id AND lower(title) = 'human body systems - assessment';
  IF NOT FOUND THEN
    INSERT INTO public.quizzes (module_id, title, description, questions, time_limit, passing_score)
    VALUES (
      v_module3_id,
      'Human Body Systems - Assessment',
      '20 MCQs across circulatory, respiratory and coordination & control.',
      $json${"questions":[
        {"id":"m3-fa-q1","type":"mcq","stem":"Which vessel returns blood to the heart?","options":{"A":"Aorta","B":"Vena cava","C":"Pulmonary artery","D":"Coronary artery"},"answer":"B","explanation":"Venae cavae drain systemic circulation."},
        {"id":"m3-fa-q2","type":"mcq","stem":"Blood leaving the lungs via pulmonary veins is:","options":{"A":"Deoxygenated","B":"Oxygenated","C":"Mixed","D":"Carbonated"},"answer":"B","explanation":"Pulmonary veins carry oxygenated blood to the left atrium."},
        {"id":"m3-fa-q3","type":"mcq","stem":"Which structure prevents backflow in veins?","options":{"A":"Sphincters","B":"Valves","C":"Thick muscle","D":"Elastic lamina"},"answer":"B","explanation":"Valves ensure one-way flow in low-pressure veins."},
        {"id":"m3-fa-q4","type":"mcq","stem":"Primary site of gas exchange in lungs:","options":{"A":"Bronchi","B":"Alveoli","C":"Trachea","D":"Bronchioles"},"answer":"B","explanation":"Alveoli provide thin surfaces for diffusion."},
        {"id":"m3-fa-q5","type":"mcq","stem":"Which change occurs during inhalation?","options":{"A":"Diaphragm relaxes","B":"Thoracic volume decreases","C":"Intrapulmonary pressure falls","D":"Ribs move down"},"answer":"C","explanation":"Volume increases, pressure falls, air flows in."},
        {"id":"m3-fa-q6","type":"mcq","stem":"Most CO2 is transported as:","options":{"A":"Dissolved gas","B":"Bicarbonate","C":"Carbaminohemoglobin","D":"Carbonic acid only"},"answer":"B","explanation":"Converted to bicarbonate in plasma."},
        {"id":"m3-fa-q7","type":"mcq","stem":"Which is a positive feedback loop?","options":{"A":"Blood glucose regulation","B":"Thermoregulation","C":"Labor contractions","D":"Blood pressure control"},"answer":"C","explanation":"Oxytocin amplifies uterine contractions."},
        {"id":"m3-fa-q8","type":"mcq","stem":"Hormones travel mainly via:","options":{"A":"Nerves","B":"Bloodstream","C":"Lymph only","D":"Air"},"answer":"B","explanation":"Endocrine hormones reach distant targets in blood."},
        {"id":"m3-fa-q9","type":"mcq","stem":"Insulin is secreted by:","options":{"A":"Thyroid","B":"Pituitary","C":"Pancreas","D":"Adrenal"},"answer":"C","explanation":"Beta cells in pancreatic islets."},
        {"id":"m3-fa-q10","type":"mcq","stem":"Which blood component carries oxygen?","options":{"A":"Platelets","B":"Leukocytes","C":"Erythrocytes","D":"Plasma proteins"},"answer":"C","explanation":"Red cells with hemoglobin transport O2."},
        {"id":"m3-fa-q11","type":"mcq","stem":"Gas exchange efficiency decreases when:","options":{"A":"Surface area increases","B":"Membrane thickens","C":"Gradient increases","D":"Moisture is adequate"},"answer":"B","explanation":"Thicker membranes slow diffusion."},
        {"id":"m3-fa-q12","type":"mcq","stem":"Dendrites function to:","options":{"A":"Transmit signals away","B":"Receive signals","C":"Secrete hormones","D":"Store glucose"},"answer":"B","explanation":"Dendrites receive input toward the soma."},
        {"id":"m3-fa-q13","type":"mcq","stem":"Explain homeostasis mainly uses:","options":{"A":"Negative feedback","B":"Positive feedback","C":"Random fluctuation","D":"No feedback"},"answer":"A","explanation":"Negative feedback stabilizes internal conditions."},
        {"id":"m3-fa-q14","type":"mcq","stem":"Which vessel carries oxygenated blood?","options":{"A":"Pulmonary artery","B":"Vena cava","C":"Pulmonary vein","D":"Coronary sinus"},"answer":"C","explanation":"Pulmonary veins carry oxygenated blood from lungs to heart."},
        {"id":"m3-fa-q15","type":"mcq","stem":"During exercise, which change occurs?","options":{"A":"Heart rate decreases","B":"Breathing rate decreases","C":"Cardiac output increases","D":"Blood pressure falls to zero"},"answer":"C","explanation":"More blood is pumped per minute to meet demand."},
        {"id":"m3-fa-q16","type":"mcq","stem":"Glucagon acts to:","options":{"A":"Lower blood glucose","B":"Raise blood glucose","C":"Lower insulin levels only","D":"Stop respiration"},"answer":"B","explanation":"Glucagon stimulates glycogen breakdown and gluconeogenesis."},
        {"id":"m3-fa-q17","type":"mcq","stem":"Alveoli are suited for exchange because they:","options":{"A":"Have thick walls","B":"Provide large surface area and thin walls","C":"Contain more platelets","D":"Hold solid nutrients"},"answer":"B","explanation":"Structure optimizes diffusion."},
        {"id":"m3-fa-q18","type":"mcq","stem":"Which prevents blood backflow between atrium and ventricle?","options":{"A":"Semilunar valve","B":"Atrioventricular valve","C":"Capillary sphincter","D":"Chordae only"},"answer":"B","explanation":"AV valves separate atria and ventricles."},
        {"id":"m3-fa-q19","type":"mcq","stem":"Neurotransmitters cross synapses mainly by:","options":{"A":"Active pumping","B":"Diffusion","C":"Osmosis of water","D":"Photosynthesis"},"answer":"B","explanation":"They diffuse across the cleft."},
        {"id":"m3-fa-q20","type":"mcq","stem":"Lifestyle change most beneficial for hypertension:","options":{"A":"Increase salt","B":"Quit smoking, reduce salt, exercise","C":"Avoid all water","D":"Only rest"},"answer":"B","explanation":"Combined lifestyle changes reduce blood pressure risk."}
      ]}$json$::jsonb,
      900,
      70
    );
  ELSE
    UPDATE public.quizzes 
      SET description = '20 MCQs across circulatory, respiratory and coordination & control.',
          questions = $json${"questions":[
        {"id":"m3-fa-q1","type":"mcq","stem":"Which vessel returns blood to the heart?","options":{"A":"Aorta","B":"Vena cava","C":"Pulmonary artery","D":"Coronary artery"},"answer":"B","explanation":"Venae cavae drain systemic circulation."},
        {"id":"m3-fa-q2","type":"mcq","stem":"Blood leaving the lungs via pulmonary veins is:","options":{"A":"Deoxygenated","B":"Oxygenated","C":"Mixed","D":"Carbonated"},"answer":"B","explanation":"Pulmonary veins carry oxygenated blood to the left atrium."},
        {"id":"m3-fa-q3","type":"mcq","stem":"Which structure prevents backflow in veins?","options":{"A":"Sphincters","B":"Valves","C":"Thick muscle","D":"Elastic lamina"},"answer":"B","explanation":"Valves ensure one-way flow in low-pressure veins."},
        {"id":"m3-fa-q4","type":"mcq","stem":"Primary site of gas exchange in lungs:","options":{"A":"Bronchi","B":"Alveoli","C":"Trachea","D":"Bronchioles"},"answer":"B","explanation":"Alveoli provide thin surfaces for diffusion."},
        {"id":"m3-fa-q5","type":"mcq","stem":"Which change occurs during inhalation?","options":{"A":"Diaphragm relaxes","B":"Thoracic volume decreases","C":"Intrapulmonary pressure falls","D":"Ribs move down"},"answer":"C","explanation":"Volume increases, pressure falls, air flows in."},
        {"id":"m3-fa-q6","type":"mcq","stem":"Most CO2 is transported as:","options":{"A":"Dissolved gas","B":"Bicarbonate","C":"Carbaminohemoglobin","D":"Carbonic acid only"},"answer":"B","explanation":"Converted to bicarbonate in plasma."},
        {"id":"m3-fa-q7","type":"mcq","stem":"Which is a positive feedback loop?","options":{"A":"Blood glucose regulation","B":"Thermoregulation","C":"Labor contractions","D":"Blood pressure control"},"answer":"C","explanation":"Oxytocin amplifies uterine contractions."},
        {"id":"m3-fa-q8","type":"mcq","stem":"Hormones travel mainly via:","options":{"A":"Nerves","B":"Bloodstream","C":"Lymph only","D":"Air"},"answer":"B","explanation":"Endocrine hormones reach distant targets in blood."},
        {"id":"m3-fa-q9","type":"mcq","stem":"Insulin is secreted by:","options":{"A":"Thyroid","B":"Pituitary","C":"Pancreas","D":"Adrenal"},"answer":"C","explanation":"Beta cells in pancreatic islets."},
        {"id":"m3-fa-q10","type":"mcq","stem":"Which blood component carries oxygen?","options":{"A":"Platelets","B":"Leukocytes","C":"Erythrocytes","D":"Plasma proteins"},"answer":"C","explanation":"Red cells with hemoglobin transport O2."},
        {"id":"m3-fa-q11","type":"mcq","stem":"Gas exchange efficiency decreases when:","options":{"A":"Surface area increases","B":"Membrane thickens","C":"Gradient increases","D":"Moisture is adequate"},"answer":"B","explanation":"Thicker membranes slow diffusion."},
        {"id":"m3-fa-q12","type":"mcq","stem":"Dendrites function to:","options":{"A":"Transmit signals away","B":"Receive signals","C":"Secrete hormones","D":"Store glucose"},"answer":"B","explanation":"Dendrites receive input toward the soma."},
        {"id":"m3-fa-q13","type":"mcq","stem":"Explain homeostasis mainly uses:","options":{"A":"Negative feedback","B":"Positive feedback","C":"Random fluctuation","D":"No feedback"},"answer":"A","explanation":"Negative feedback stabilizes internal conditions."},
        {"id":"m3-fa-q14","type":"mcq","stem":"Which vessel carries oxygenated blood?","options":{"A":"Pulmonary artery","B":"Vena cava","C":"Pulmonary vein","D":"Coronary sinus"},"answer":"C","explanation":"Pulmonary veins carry oxygenated blood from lungs to heart."},
        {"id":"m3-fa-q15","type":"mcq","stem":"During exercise, which change occurs?","options":{"A":"Heart rate decreases","B":"Breathing rate decreases","C":"Cardiac output increases","D":"Blood pressure falls to zero"},"answer":"C","explanation":"More blood is pumped per minute to meet demand."},
        {"id":"m3-fa-q16","type":"mcq","stem":"Glucagon acts to:","options":{"A":"Lower blood glucose","B":"Raise blood glucose","C":"Lower insulin levels only","D":"Stop respiration"},"answer":"B","explanation":"Glucagon stimulates glycogen breakdown and gluconeogenesis."},
        {"id":"m3-fa-q17","type":"mcq","stem":"Alveoli are suited for exchange because they:","options":{"A":"Have thick walls","B":"Provide large surface area and thin walls","C":"Contain more platelets","D":"Hold solid nutrients"},"answer":"B","explanation":"Structure optimizes diffusion."},
        {"id":"m3-fa-q18","type":"mcq","stem":"Which prevents blood backflow between atrium and ventricle?","options":{"A":"Semilunar valve","B":"Atrioventricular valve","C":"Capillary sphincter","D":"Chordae only"},"answer":"B","explanation":"AV valves separate atria and ventricles."},
        {"id":"m3-fa-q19","type":"mcq","stem":"Neurotransmitters cross synapses mainly by:","options":{"A":"Active pumping","B":"Diffusion","C":"Osmosis of water","D":"Photosynthesis"},"answer":"B","explanation":"They diffuse across the cleft."},
        {"id":"m3-fa-q20","type":"mcq","stem":"Lifestyle change most beneficial for hypertension:","options":{"A":"Increase salt","B":"Quit smoking, reduce salt, exercise","C":"Avoid all water","D":"Only rest"},"answer":"B","explanation":"Combined lifestyle changes reduce blood pressure risk."}
      ]}$json$::jsonb,
          time_limit = 900,
          passing_score = 70,
          updated_at = now()
    WHERE module_id = v_module3_id AND lower(title) = 'human body systems - assessment';
  END IF;

  -- Remove empty modules (no content text)
  DELETE FROM public.modules WHERE (content IS NULL OR btrim(content) = '')
    AND id NOT IN (v_module1_id, v_module2_id, v_module3_id);
END $$;