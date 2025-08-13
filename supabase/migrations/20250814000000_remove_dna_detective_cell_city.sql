-- Migration to remove DNA Detective and Cell City modules
-- These modules are being replaced with new structured learning content

-- Remove the DNA Detective module
DELETE FROM modules 
WHERE title = 'DNA Detective: Genetic Mystery Solver' 
AND subject_id IN (SELECT id FROM subjects WHERE name = 'Biology');

-- Remove the Cell City module  
DELETE FROM modules 
WHERE title = 'Cell City: Microscopic Metropolis Manager' 
AND subject_id IN (SELECT id FROM subjects WHERE name = 'Biology');

-- Note: This migration removes the old gamified biology modules
-- New structured biology content will be added separately
-- The existing legitimate biology modules (Cell Structure & Function, 
-- Photosynthesis & Respiration, Human Body Systems) remain intact
