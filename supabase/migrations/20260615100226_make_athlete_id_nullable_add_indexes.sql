ALTER TABLE ONLY public.scores ALTER COLUMN athlete_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS scores_heat_id_status_idx ON public.scores (heat_id, status);
