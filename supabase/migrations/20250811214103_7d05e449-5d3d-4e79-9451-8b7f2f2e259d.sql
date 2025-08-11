-- Add Biology modules if missing
DO $$
DECLARE
  bio_id uuid;
BEGIN
  -- Find Biology subject id
  SELECT id INTO bio_id
  FROM public.subjects
  WHERE lower(name) = 'biology'
  LIMIT 1;

  IF bio_id IS NULL THEN
    RAISE EXCEPTION 'Biology subject not found. Please create it first.';
  END IF;

  -- Add Photosynthesis & Respiration module (order 2)
  INSERT INTO public.modules (
    subject_id,
    order_index,
    estimated_duration,
    title,
    description,
    difficulty_level
  )
  SELECT bio_id, 2, 45,
         'Photosynthesis & Respiration',
         'Explore photosynthesis (light reactions, Calvin cycle) and cellular respiration (glycolysis, Krebs, ETC) with comparisons and energy flow.',
         'intermediate'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.modules
    WHERE subject_id = bio_id AND title = 'Photosynthesis & Respiration'
  );

  -- Add Human Body Systems module (order 3)
  INSERT INTO public.modules (
    subject_id,
    order_index,
    estimated_duration,
    title,
    description,
    difficulty_level
  )
  SELECT bio_id, 3, 60,
         'Human Body Systems',
         'Overview of circulatory, respiratory, digestive, nervous and endocrine systems with homeostasis focus.',
         'advanced'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.modules
    WHERE subject_id = bio_id AND title = 'Human Body Systems'
  );
END $$;