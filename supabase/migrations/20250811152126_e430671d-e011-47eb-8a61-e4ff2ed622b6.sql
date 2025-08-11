BEGIN;

-- 1) Ensure updated_at auto-maintenance
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2) Ensure RLS is enabled on all relevant tables (idempotent if already enabled)
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3) Strengthen data integrity with NOT NULLs & FKs
-- Modules must belong to a subject
ALTER TABLE public.modules ALTER COLUMN subject_id SET NOT NULL;
ALTER TABLE public.modules
  ADD CONSTRAINT modules_subject_id_fkey
  FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE RESTRICT;

-- Quizzes must belong to a module
ALTER TABLE public.quizzes ALTER COLUMN module_id SET NOT NULL;
ALTER TABLE public.quizzes
  ADD CONSTRAINT quizzes_module_id_fkey
  FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;

-- User progress must be tied to a user & module
ALTER TABLE public.user_progress ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.user_progress ALTER COLUMN module_id SET NOT NULL;
ALTER TABLE public.user_progress
  ADD CONSTRAINT user_progress_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.user_progress
  ADD CONSTRAINT user_progress_module_id_fkey
  FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;

-- Quiz attempts must be tied to a user & quiz
ALTER TABLE public.quiz_attempts ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.quiz_attempts ALTER COLUMN quiz_id SET NOT NULL;
ALTER TABLE public.quiz_attempts
  ADD CONSTRAINT quiz_attempts_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.quiz_attempts
  ADD CONSTRAINT quiz_attempts_quiz_id_fkey
  FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;

-- Messages should always have a room and author
ALTER TABLE public.messages ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.messages ALTER COLUMN room_id SET NOT NULL;
ALTER TABLE public.messages
  ADD CONSTRAINT messages_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.messages
  ADD CONSTRAINT messages_room_id_fkey
  FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;

-- Rooms should have a creator; subject is optional but if provided must be valid
ALTER TABLE public.rooms ALTER COLUMN created_by SET NOT NULL;
ALTER TABLE public.rooms
  ADD CONSTRAINT rooms_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.rooms
  ADD CONSTRAINT rooms_subject_id_fkey
  FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE SET NULL;

-- 4) Add helpful indexes & a uniqueness guarantee
CREATE UNIQUE INDEX IF NOT EXISTS uniq_user_progress_user_module ON public.user_progress (user_id, module_id);

CREATE INDEX IF NOT EXISTS idx_modules_subject_id ON public.modules(subject_id);
CREATE INDEX IF NOT EXISTS idx_modules_subject_id_order ON public.modules(subject_id, order_index);
CREATE INDEX IF NOT EXISTS idx_quizzes_module_id ON public.quizzes(module_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_module_id ON public.user_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON public.messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);

-- 5) Attach updated_at triggers
DROP TRIGGER IF EXISTS set_modules_updated_at ON public.modules;
CREATE TRIGGER set_modules_updated_at
BEFORE UPDATE ON public.modules
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_quizzes_updated_at ON public.quizzes;
CREATE TRIGGER set_quizzes_updated_at
BEFORE UPDATE ON public.quizzes
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_rooms_updated_at ON public.rooms;
CREATE TRIGGER set_rooms_updated_at
BEFORE UPDATE ON public.rooms
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

COMMIT;