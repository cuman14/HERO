-- Add level_id column to athletes table (nullable, FK to levels)
-- Allows individual athletes to have a level assigned for scoring purposes

ALTER TABLE ONLY public.athletes
  ADD COLUMN level_id uuid;

COMMENT ON COLUMN public.athletes.level_id IS 'Nivel/división del atleta. Nullable porque un atleta puede existir sin estar asignado a un nivel aún.';

-- FK constraint with RESTRICT (same pattern as teams.level_id)
ALTER TABLE ONLY public.athletes
  ADD CONSTRAINT athletes_level_id_fkey
  FOREIGN KEY (level_id) REFERENCES public.levels(id)
  ON DELETE RESTRICT;

-- Index for performance (follows existing idx_* pattern)
CREATE INDEX IF NOT EXISTS idx_athletes_level ON public.athletes USING btree (level_id);
