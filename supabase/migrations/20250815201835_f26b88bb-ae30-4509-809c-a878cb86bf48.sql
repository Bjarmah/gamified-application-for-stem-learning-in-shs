-- Delete gaming modules and their associated quizzes
-- First delete any quizzes linked to these modules
DELETE FROM quizzes WHERE module_id IN (
  '3c598fbc-e2bd-482b-ba07-698051d01559', -- Algebra Quest: Solving the Mystery of X
  '0f325af7-8c16-4fd6-baf9-529f1ed51b61', -- Geometry Wars: Shapes, Angles & Proofs
  '694b5022-0fce-4ef8-b350-79cc09a33536', -- Motion Master: The Physics Racing Championship
  'f2e95a61-f9f4-479a-9100-f0f0898c9d1a', -- Energy Empire: Power Up the Future
  '98198175-69b2-47d5-bf14-e5dea0b09ccb', -- Alchemy Academy: The Periodic Table Adventure
  'faec09fd-ba11-4ad8-a622-ddb72b978d91', -- Molecular Kitchen: Organic Chemistry Cooking Show
  '2d80d343-3848-44f3-90d2-b5e2ec76cb49', -- Code Warriors: Programming Battle Arena
  '4d74ab67-7995-4820-b851-18c02f694393'  -- Web Builder Tycoon: Digital Empire Creator
);

-- Delete the gaming modules
DELETE FROM modules WHERE id IN (
  '3c598fbc-e2bd-482b-ba07-698051d01559', -- Algebra Quest: Solving the Mystery of X
  '0f325af7-8c16-4fd6-baf9-529f1ed51b61', -- Geometry Wars: Shapes, Angles & Proofs
  '694b5022-0fce-4ef8-b350-79cc09a33536', -- Motion Master: The Physics Racing Championship
  'f2e95a61-f9f4-479a-9100-f0f0898c9d1a', -- Energy Empire: Power Up the Future
  '98198175-69b2-47d5-bf14-e5dea0b09ccb', -- Alchemy Academy: The Periodic Table Adventure
  'faec09fd-ba11-4ad8-a622-ddb72b978d91', -- Molecular Kitchen: Organic Chemistry Cooking Show
  '2d80d343-3848-44f3-90d2-b5e2ec76cb49', -- Code Warriors: Programming Battle Arena
  '4d74ab67-7995-4820-b851-18c02f694393'  -- Web Builder Tycoon: Digital Empire Creator
);