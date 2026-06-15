


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."athlete_status" AS ENUM (
    'registered',
    'checked_in',
    'withdrawn'
);


ALTER TYPE "public"."athlete_status" OWNER TO "postgres";


CREATE TYPE "public"."event_status" AS ENUM (
    'draft',
    'active',
    'finished'
);


ALTER TYPE "public"."event_status" OWNER TO "postgres";


CREATE TYPE "public"."gender_type" AS ENUM (
    'male',
    'female',
    'mixed',
    'open'
);


ALTER TYPE "public"."gender_type" OWNER TO "postgres";


CREATE TYPE "public"."heat_status" AS ENUM (
    'pending',
    'active',
    'finished'
);


ALTER TYPE "public"."heat_status" OWNER TO "postgres";


CREATE TYPE "public"."ranking_method" AS ENUM (
    'points',
    'cumulative',
    'last_wod'
);


ALTER TYPE "public"."ranking_method" OWNER TO "postgres";


CREATE TYPE "public"."score_status" AS ENUM (
    'draft',
    'submitted',
    'confirmed',
    'disputed',
    'void'
);


ALTER TYPE "public"."score_status" OWNER TO "postgres";


CREATE TYPE "public"."scoring_direction" AS ENUM (
    'higher_is_better',
    'lower_is_better'
);


ALTER TYPE "public"."scoring_direction" OWNER TO "postgres";


CREATE TYPE "public"."sport_type" AS ENUM (
    'crossfit',
    'hyrox'
);


ALTER TYPE "public"."sport_type" OWNER TO "postgres";


CREATE TYPE "public"."station_status" AS ENUM (
    'pending',
    'confirmed',
    'dnf'
);


ALTER TYPE "public"."station_status" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    'admin',
    'judge'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE TYPE "public"."wod_type" AS ENUM (
    'amrap',
    'for_time',
    'max_weight',
    'ladder',
    'emom',
    'hyrox_race'
);


ALTER TYPE "public"."wod_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO profiles (id, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'judge')
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_assigned_judge"("p_athlete_id" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM heat_athletes
    WHERE athlete_id = p_athlete_id AND judge_id = auth.uid()
  );
$$;


ALTER FUNCTION "public"."is_assigned_judge"("p_athlete_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."athletes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "bib_number" "text",
    "box" "text",
    "status" "public"."athlete_status" DEFAULT 'registered'::"public"."athlete_status" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "email" "text",
    "phone" "text",
    "gender" "public"."gender_type"
);


ALTER TABLE "public"."athletes" OWNER TO "postgres";


COMMENT ON TABLE "public"."athletes" IS 'Persona individual. Se vincula a equipos vía team_members.';



CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "gender" "public"."gender_type" DEFAULT 'open'::"public"."gender_type" NOT NULL,
    "is_team" boolean DEFAULT false NOT NULL,
    "team_size_min" integer,
    "team_size_max" integer,
    "order_index" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "chk_team_size" CHECK (((("is_team" = false) AND ("team_size_min" IS NULL) AND ("team_size_max" IS NULL)) OR (("is_team" = true) AND ("team_size_min" IS NOT NULL) AND ("team_size_max" IS NOT NULL) AND ("team_size_min" <= "team_size_max"))))
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "sport_type" "public"."sport_type" NOT NULL,
    "date" "date" NOT NULL,
    "status" "public"."event_status" DEFAULT 'draft'::"public"."event_status" NOT NULL,
    "ranking_method" "public"."ranking_method" DEFAULT 'points'::"public"."ranking_method" NOT NULL,
    "location" "text",
    "config" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."heat_athletes" (
    "heat_id" "uuid" NOT NULL,
    "athlete_id" "uuid",
    "judge_id" "uuid",
    "lane" integer,
    "team_id" "uuid",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    CONSTRAINT "heat_athletes_entity_check" CHECK ((("team_id" IS NOT NULL) OR ("athlete_id" IS NOT NULL)))
);


ALTER TABLE "public"."heat_athletes" OWNER TO "postgres";


COMMENT ON TABLE "public"."heat_athletes" IS 'MVP: asignación de equipos a heats. athlete_id para uso individual futuro.';



COMMENT ON COLUMN "public"."heat_athletes"."team_id" IS 'MVP: el heat opera por equipo.';



CREATE TABLE IF NOT EXISTS "public"."heats" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "wod_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "scheduled_at" timestamp with time zone,
    "status" "public"."heat_status" DEFAULT 'pending'::"public"."heat_status" NOT NULL,
    "started_at" timestamp with time zone,
    "finished_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."heats" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."levels" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "code" "text" NOT NULL,
    "order_index" integer DEFAULT 0 NOT NULL,
    "color" "text" DEFAULT '#6366f1'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."levels" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."scores" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "wod_id" "uuid" NOT NULL,
    "athlete_id" "uuid",
    "level_id" "uuid" NOT NULL,
    "heat_id" "uuid",
    "judge_id" "uuid",
    "value" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "tiebreak_seconds" integer,
    "penalty_reps" integer DEFAULT 0 NOT NULL,
    "status" "public"."score_status" DEFAULT 'draft'::"public"."score_status" NOT NULL,
    "submitted_at" timestamp with time zone,
    "confirmed_at" timestamp with time zone,
    "dispute_reason" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "team_id" "uuid"
);


ALTER TABLE "public"."scores" OWNER TO "postgres";


COMMENT ON COLUMN "public"."scores"."team_id" IS 'MVP: score a nivel equipo. athlete_id para scores individuales futuros.';



CREATE TABLE IF NOT EXISTS "public"."teams" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "category_id" "uuid" NOT NULL,
    "level_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "bib_number" "text",
    "box" "text",
    "status" "public"."athlete_status" DEFAULT 'registered'::"public"."athlete_status" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."teams" OWNER TO "postgres";


COMMENT ON TABLE "public"."teams" IS 'Equipo que compite como unidad. Tiene category_id + level_id propios.';



CREATE TABLE IF NOT EXISTS "public"."wods" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "category_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "type" "public"."wod_type" NOT NULL,
    "scoring_direction" "public"."scoring_direction" DEFAULT 'higher_is_better'::"public"."scoring_direction" NOT NULL,
    "base_config" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "order_index" integer DEFAULT 0 NOT NULL,
    "points_table" "jsonb",
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."wods" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."leaderboard" AS
 SELECT "s"."id" AS "score_id",
    "s"."wod_id",
    "s"."team_id",
    "s"."athlete_id",
    "s"."level_id",
    "s"."value",
    "s"."tiebreak_seconds",
    "s"."penalty_reps",
    "s"."status",
    "s"."submitted_at",
    COALESCE("t"."name", "a"."name") AS "competitor_name",
    COALESCE("t"."bib_number", "a"."bib_number") AS "bib_number",
    COALESCE("t"."box", "a"."box") AS "box",
    COALESCE("t"."category_id", NULL::"uuid") AS "category_id",
    "c"."name" AS "category_name",
    "c"."gender",
    "l"."name" AS "level_name",
    "l"."code" AS "level_code",
    "l"."color" AS "level_color",
    "w"."name" AS "wod_name",
    "w"."type" AS "wod_type",
    "w"."scoring_direction",
    "rank"() OVER (PARTITION BY "s"."wod_id", "s"."level_id" ORDER BY
        CASE "w"."scoring_direction"
            WHEN 'higher_is_better'::"public"."scoring_direction" THEN
            CASE "s"."status"
                WHEN 'confirmed'::"public"."score_status" THEN 0
                WHEN 'submitted'::"public"."score_status" THEN 1
                ELSE 2
            END
            ELSE
            CASE "s"."status"
                WHEN 'confirmed'::"public"."score_status" THEN 0
                WHEN 'submitted'::"public"."score_status" THEN 1
                ELSE 2
            END
        END,
        CASE "w"."scoring_direction"
            WHEN 'higher_is_better'::"public"."scoring_direction" THEN (- (COALESCE((("s"."value" ->> 'reps'::"text"))::integer, ((("s"."value" ->> 'weight_kg'::"text"))::numeric)::integer, 0) - "s"."penalty_reps"))
            ELSE COALESCE((("s"."value" ->> 'time_seconds'::"text"))::integer, (("s"."value" ->> 'total_seconds'::"text"))::integer, 999999)
        END, "s"."tiebreak_seconds") AS "rank_in_level",
    "rank"() OVER (PARTITION BY "s"."wod_id", COALESCE("t"."category_id", NULL::"uuid") ORDER BY
        CASE "w"."scoring_direction"
            WHEN 'higher_is_better'::"public"."scoring_direction" THEN (- (COALESCE((("s"."value" ->> 'reps'::"text"))::integer, ((("s"."value" ->> 'weight_kg'::"text"))::numeric)::integer, 0) - "s"."penalty_reps"))
            ELSE COALESCE((("s"."value" ->> 'time_seconds'::"text"))::integer, (("s"."value" ->> 'total_seconds'::"text"))::integer, 999999)
        END, "s"."tiebreak_seconds") AS "rank_in_category"
   FROM ((((("public"."scores" "s"
     LEFT JOIN "public"."teams" "t" ON (("t"."id" = "s"."team_id")))
     LEFT JOIN "public"."athletes" "a" ON (("a"."id" = "s"."athlete_id")))
     LEFT JOIN "public"."categories" "c" ON (("c"."id" = COALESCE("t"."category_id", NULL::"uuid"))))
     LEFT JOIN "public"."levels" "l" ON (("l"."id" = "s"."level_id")))
     JOIN "public"."wods" "w" ON (("w"."id" = "s"."wod_id")))
  WHERE ("s"."status" = ANY (ARRAY['submitted'::"public"."score_status", 'confirmed'::"public"."score_status"]));


ALTER VIEW "public"."leaderboard" OWNER TO "postgres";


COMMENT ON VIEW "public"."leaderboard" IS 'Rankings calculados on-the-fly. Soporta scores de equipo (team_id) e individuales (athlete_id).';



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "display_name" "text" NOT NULL,
    "role" "public"."user_role" DEFAULT 'judge'::"public"."user_role" NOT NULL,
    "event_ids" "uuid"[] DEFAULT '{}'::"uuid"[] NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."score_stations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "score_id" "uuid" NOT NULL,
    "station_index" integer NOT NULL,
    "label" "text" NOT NULL,
    "split_seconds" integer,
    "cumulative_seconds" integer,
    "status" "public"."station_status" DEFAULT 'pending'::"public"."station_status" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "score_stations_station_index_check" CHECK ((("station_index" >= 0) AND ("station_index" <= 15)))
);


ALTER TABLE "public"."score_stations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."team_members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "team_id" "uuid" NOT NULL,
    "athlete_id" "uuid",
    "name" "text" NOT NULL,
    "bib_number" "text",
    "role" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."team_members" OWNER TO "postgres";


COMMENT ON TABLE "public"."team_members" IS 'Miembro de un equipo. athlete_id nullable si el atleta aún no tiene perfil.';



CREATE TABLE IF NOT EXISTS "public"."wod_level_configs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "wod_id" "uuid" NOT NULL,
    "level_id" "uuid" NOT NULL,
    "config" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "description_override" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."wod_level_configs" OWNER TO "postgres";


ALTER TABLE ONLY "public"."athletes"
    ADD CONSTRAINT "athletes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."heat_athletes"
    ADD CONSTRAINT "heat_athletes_heat_team_unique" UNIQUE ("heat_id", "team_id");



ALTER TABLE ONLY "public"."heat_athletes"
    ADD CONSTRAINT "heat_athletes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."heats"
    ADD CONSTRAINT "heats_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."levels"
    ADD CONSTRAINT "levels_category_id_code_key" UNIQUE ("category_id", "code");



ALTER TABLE ONLY "public"."levels"
    ADD CONSTRAINT "levels_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."score_stations"
    ADD CONSTRAINT "score_stations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."score_stations"
    ADD CONSTRAINT "score_stations_score_id_station_index_key" UNIQUE ("score_id", "station_index");



ALTER TABLE ONLY "public"."scores"
    ADD CONSTRAINT "scores_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."scores"
    ADD CONSTRAINT "scores_wod_id_athlete_id_key" UNIQUE ("wod_id", "athlete_id");



ALTER TABLE ONLY "public"."team_members"
    ADD CONSTRAINT "team_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."team_members"
    ADD CONSTRAINT "team_members_team_id_athlete_id_key" UNIQUE ("team_id", "athlete_id");



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_event_id_bib_number_key" UNIQUE ("event_id", "bib_number");



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wod_level_configs"
    ADD CONSTRAINT "wod_level_configs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wod_level_configs"
    ADD CONSTRAINT "wod_level_configs_wod_id_level_id_key" UNIQUE ("wod_id", "level_id");



ALTER TABLE ONLY "public"."wods"
    ADD CONSTRAINT "wods_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_categories_event" ON "public"."categories" USING "btree" ("event_id");



CREATE INDEX "idx_events_created_by" ON "public"."events" USING "btree" ("created_by");



CREATE INDEX "idx_events_status" ON "public"."events" USING "btree" ("status");



CREATE INDEX "idx_heat_athletes_athlete" ON "public"."heat_athletes" USING "btree" ("athlete_id");



CREATE INDEX "idx_heat_athletes_heat" ON "public"."heat_athletes" USING "btree" ("heat_id");



CREATE INDEX "idx_heat_athletes_judge" ON "public"."heat_athletes" USING "btree" ("judge_id");



CREATE INDEX "idx_heat_athletes_team" ON "public"."heat_athletes" USING "btree" ("team_id");



CREATE INDEX "idx_heats_status" ON "public"."heats" USING "btree" ("status");



CREATE INDEX "idx_heats_wod" ON "public"."heats" USING "btree" ("wod_id");



CREATE INDEX "idx_levels_category" ON "public"."levels" USING "btree" ("category_id");



CREATE INDEX "idx_score_stations_score" ON "public"."score_stations" USING "btree" ("score_id");



CREATE INDEX "idx_scores_athlete" ON "public"."scores" USING "btree" ("athlete_id");



CREATE INDEX "idx_scores_heat" ON "public"."scores" USING "btree" ("heat_id");



CREATE INDEX "idx_scores_judge" ON "public"."scores" USING "btree" ("judge_id");



CREATE INDEX "idx_scores_level" ON "public"."scores" USING "btree" ("level_id");



CREATE INDEX "idx_scores_status" ON "public"."scores" USING "btree" ("status");



CREATE INDEX "idx_scores_team" ON "public"."scores" USING "btree" ("team_id");



CREATE INDEX "idx_scores_wod" ON "public"."scores" USING "btree" ("wod_id");



CREATE INDEX "idx_team_members_athlete" ON "public"."team_members" USING "btree" ("athlete_id");



CREATE INDEX "idx_team_members_team" ON "public"."team_members" USING "btree" ("team_id");



CREATE INDEX "idx_teams_category" ON "public"."teams" USING "btree" ("category_id");



CREATE INDEX "idx_teams_event" ON "public"."teams" USING "btree" ("event_id");



CREATE INDEX "idx_teams_level" ON "public"."teams" USING "btree" ("level_id");



CREATE INDEX "idx_wod_level_configs_level" ON "public"."wod_level_configs" USING "btree" ("level_id");



CREATE INDEX "idx_wod_level_configs_wod" ON "public"."wod_level_configs" USING "btree" ("wod_id");



CREATE INDEX "idx_wods_category" ON "public"."wods" USING "btree" ("category_id");



CREATE INDEX "idx_wods_event" ON "public"."wods" USING "btree" ("event_id");



CREATE OR REPLACE TRIGGER "teams_updated_at" BEFORE UPDATE ON "public"."teams" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "trg_athletes_updated_at" BEFORE UPDATE ON "public"."athletes" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_events_updated_at" BEFORE UPDATE ON "public"."events" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_scores_updated_at" BEFORE UPDATE ON "public"."scores" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_wod_level_configs_updated_at" BEFORE UPDATE ON "public"."wod_level_configs" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_wods_updated_at" BEFORE UPDATE ON "public"."wods" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."heat_athletes"
    ADD CONSTRAINT "heat_athletes_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."heat_athletes"
    ADD CONSTRAINT "heat_athletes_heat_id_fkey" FOREIGN KEY ("heat_id") REFERENCES "public"."heats"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."heat_athletes"
    ADD CONSTRAINT "heat_athletes_judge_id_fkey" FOREIGN KEY ("judge_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."heat_athletes"
    ADD CONSTRAINT "heat_athletes_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."heats"
    ADD CONSTRAINT "heats_wod_id_fkey" FOREIGN KEY ("wod_id") REFERENCES "public"."wods"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."levels"
    ADD CONSTRAINT "levels_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."score_stations"
    ADD CONSTRAINT "score_stations_score_id_fkey" FOREIGN KEY ("score_id") REFERENCES "public"."scores"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."scores"
    ADD CONSTRAINT "scores_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."scores"
    ADD CONSTRAINT "scores_heat_id_fkey" FOREIGN KEY ("heat_id") REFERENCES "public"."heats"("id");



ALTER TABLE ONLY "public"."scores"
    ADD CONSTRAINT "scores_judge_id_fkey" FOREIGN KEY ("judge_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."scores"
    ADD CONSTRAINT "scores_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id");



ALTER TABLE ONLY "public"."scores"
    ADD CONSTRAINT "scores_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."scores"
    ADD CONSTRAINT "scores_wod_id_fkey" FOREIGN KEY ("wod_id") REFERENCES "public"."wods"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."team_members"
    ADD CONSTRAINT "team_members_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."team_members"
    ADD CONSTRAINT "team_members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."wod_level_configs"
    ADD CONSTRAINT "wod_level_configs_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wod_level_configs"
    ADD CONSTRAINT "wod_level_configs_wod_id_fkey" FOREIGN KEY ("wod_id") REFERENCES "public"."wods"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wods"
    ADD CONSTRAINT "wods_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wods"
    ADD CONSTRAINT "wods_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



CREATE POLICY "Enable read access for all users" ON "public"."teams" FOR SELECT USING (true);



ALTER TABLE "public"."athletes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "athletes_delete_admin" ON "public"."athletes" FOR DELETE USING ("public"."is_admin"());



CREATE POLICY "athletes_insert_admin" ON "public"."athletes" FOR INSERT WITH CHECK ("public"."is_admin"());



CREATE POLICY "athletes_select_all" ON "public"."athletes" FOR SELECT USING (true);



CREATE POLICY "athletes_update_admin" ON "public"."athletes" FOR UPDATE USING ("public"."is_admin"());



ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "categories_delete_admin" ON "public"."categories" FOR DELETE USING ("public"."is_admin"());



CREATE POLICY "categories_insert_admin" ON "public"."categories" FOR INSERT WITH CHECK ("public"."is_admin"());



CREATE POLICY "categories_select_all" ON "public"."categories" FOR SELECT USING (true);



CREATE POLICY "categories_update_admin" ON "public"."categories" FOR UPDATE USING ("public"."is_admin"());



ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "events_delete_admin" ON "public"."events" FOR DELETE USING ("public"."is_admin"());



CREATE POLICY "events_insert_admin" ON "public"."events" FOR INSERT WITH CHECK ("public"."is_admin"());



CREATE POLICY "events_select_all" ON "public"."events" FOR SELECT USING (true);



CREATE POLICY "events_update_admin" ON "public"."events" FOR UPDATE USING ("public"."is_admin"());



CREATE POLICY "ha_delete_admin" ON "public"."heat_athletes" FOR DELETE USING ("public"."is_admin"());



CREATE POLICY "ha_insert_admin" ON "public"."heat_athletes" FOR INSERT WITH CHECK ("public"."is_admin"());



CREATE POLICY "ha_select_all" ON "public"."heat_athletes" FOR SELECT USING (true);



CREATE POLICY "ha_update_admin" ON "public"."heat_athletes" FOR UPDATE USING ("public"."is_admin"());



ALTER TABLE "public"."heat_athletes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."heats" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "heats_delete_admin" ON "public"."heats" FOR DELETE USING ("public"."is_admin"());



CREATE POLICY "heats_insert_admin" ON "public"."heats" FOR INSERT WITH CHECK ("public"."is_admin"());



CREATE POLICY "heats_select_all" ON "public"."heats" FOR SELECT USING (true);



CREATE POLICY "heats_update_admin" ON "public"."heats" FOR UPDATE USING ("public"."is_admin"());



ALTER TABLE "public"."levels" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "levels_delete_admin" ON "public"."levels" FOR DELETE USING ("public"."is_admin"());



CREATE POLICY "levels_insert_admin" ON "public"."levels" FOR INSERT WITH CHECK ("public"."is_admin"());



CREATE POLICY "levels_select_all" ON "public"."levels" FOR SELECT USING (true);



CREATE POLICY "levels_update_admin" ON "public"."levels" FOR UPDATE USING ("public"."is_admin"());



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles_select_own" ON "public"."profiles" FOR SELECT USING ((("id" = "auth"."uid"()) OR "public"."is_admin"()));



CREATE POLICY "profiles_update_own" ON "public"."profiles" FOR UPDATE USING (("id" = "auth"."uid"()));



ALTER TABLE "public"."score_stations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."scores" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "scores_delete_admin" ON "public"."scores" FOR DELETE USING ("public"."is_admin"());



CREATE POLICY "scores_insert_anon" ON "public"."scores" FOR INSERT TO "anon" WITH CHECK (true);



CREATE POLICY "scores_insert_authenticated" ON "public"."scores" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "scores_select_all" ON "public"."scores" FOR SELECT USING (true);



CREATE POLICY "scores_update_admin" ON "public"."scores" FOR UPDATE USING ("public"."is_admin"());



CREATE POLICY "scores_update_anon" ON "public"."scores" FOR UPDATE TO "anon" USING (true) WITH CHECK (true);



CREATE POLICY "scores_update_authenticated" ON "public"."scores" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "ss_insert_judge" ON "public"."score_stations" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."scores" "s"
  WHERE (("s"."id" = "score_stations"."score_id") AND ("s"."judge_id" = "auth"."uid"())))));



CREATE POLICY "ss_select_all" ON "public"."score_stations" FOR SELECT USING (true);



CREATE POLICY "ss_update_admin" ON "public"."score_stations" FOR UPDATE USING ("public"."is_admin"());



CREATE POLICY "ss_update_judge" ON "public"."score_stations" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."scores" "s"
  WHERE (("s"."id" = "score_stations"."score_id") AND ("s"."judge_id" = "auth"."uid"())))));



ALTER TABLE "public"."teams" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "wlc_delete_admin" ON "public"."wod_level_configs" FOR DELETE USING ("public"."is_admin"());



CREATE POLICY "wlc_insert_admin" ON "public"."wod_level_configs" FOR INSERT WITH CHECK ("public"."is_admin"());



CREATE POLICY "wlc_select_all" ON "public"."wod_level_configs" FOR SELECT USING (true);



CREATE POLICY "wlc_update_admin" ON "public"."wod_level_configs" FOR UPDATE USING ("public"."is_admin"());



ALTER TABLE "public"."wod_level_configs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."wods" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "wods_delete_admin" ON "public"."wods" FOR DELETE USING ("public"."is_admin"());



CREATE POLICY "wods_insert_admin" ON "public"."wods" FOR INSERT WITH CHECK ("public"."is_admin"());



CREATE POLICY "wods_select_all" ON "public"."wods" FOR SELECT USING (true);



CREATE POLICY "wods_update_admin" ON "public"."wods" FOR UPDATE USING ("public"."is_admin"());





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."heats";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."scores";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_assigned_judge"("p_athlete_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_assigned_judge"("p_athlete_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_assigned_judge"("p_athlete_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."athletes" TO "anon";
GRANT ALL ON TABLE "public"."athletes" TO "authenticated";
GRANT ALL ON TABLE "public"."athletes" TO "service_role";



GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";



GRANT ALL ON TABLE "public"."heat_athletes" TO "anon";
GRANT ALL ON TABLE "public"."heat_athletes" TO "authenticated";
GRANT ALL ON TABLE "public"."heat_athletes" TO "service_role";



GRANT ALL ON TABLE "public"."heats" TO "anon";
GRANT ALL ON TABLE "public"."heats" TO "authenticated";
GRANT ALL ON TABLE "public"."heats" TO "service_role";



GRANT ALL ON TABLE "public"."levels" TO "anon";
GRANT ALL ON TABLE "public"."levels" TO "authenticated";
GRANT ALL ON TABLE "public"."levels" TO "service_role";



GRANT ALL ON TABLE "public"."scores" TO "anon";
GRANT ALL ON TABLE "public"."scores" TO "authenticated";
GRANT ALL ON TABLE "public"."scores" TO "service_role";



GRANT ALL ON TABLE "public"."teams" TO "anon";
GRANT ALL ON TABLE "public"."teams" TO "authenticated";
GRANT ALL ON TABLE "public"."teams" TO "service_role";



GRANT ALL ON TABLE "public"."wods" TO "anon";
GRANT ALL ON TABLE "public"."wods" TO "authenticated";
GRANT ALL ON TABLE "public"."wods" TO "service_role";



GRANT ALL ON TABLE "public"."leaderboard" TO "anon";
GRANT ALL ON TABLE "public"."leaderboard" TO "authenticated";
GRANT ALL ON TABLE "public"."leaderboard" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."score_stations" TO "anon";
GRANT ALL ON TABLE "public"."score_stations" TO "authenticated";
GRANT ALL ON TABLE "public"."score_stations" TO "service_role";



GRANT ALL ON TABLE "public"."team_members" TO "anon";
GRANT ALL ON TABLE "public"."team_members" TO "authenticated";
GRANT ALL ON TABLE "public"."team_members" TO "service_role";



GRANT ALL ON TABLE "public"."wod_level_configs" TO "anon";
GRANT ALL ON TABLE "public"."wod_level_configs" TO "authenticated";
GRANT ALL ON TABLE "public"."wod_level_configs" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


