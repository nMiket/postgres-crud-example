-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.games (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  rawg_id integer,
  title text NOT NULL,
  slug text,
  release_date date,
  release_year smallint,
  cover_url text,
  rating smallint,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT games_pkey PRIMARY KEY (id),
  CONSTRAINT games_rawg_id_key UNIQUE (rawg_id)
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS games_title_idx ON public.games USING btree (title) TABLESPACE pg_default;

-- user_games: same schema but scoped for a single user (default user_id)
CREATE TABLE public.user_games (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL,
  user_id uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001',
  rawg_id integer,
  title text NOT NULL,
  slug text,
  release_date date,
  release_year smallint,
  cover_url text,
  rating smallint,
  status text NOT NULL DEFAULT 'wishlist',
  notes text,
  play_count integer NOT NULL DEFAULT 0,
  started_at date,
  completed_at date,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_games_pkey PRIMARY KEY (id),
  CONSTRAINT user_games_rawg_id_key UNIQUE (rawg_id),
  CONSTRAINT user_games_game_id_key UNIQUE (game_id)
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS user_games_title_idx ON public.user_games USING btree (title) TABLESPACE pg_default;
