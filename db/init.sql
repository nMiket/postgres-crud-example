-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.especialidades (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  descripcion text NOT NULL,
  CONSTRAINT especialidades_pkey PRIMARY KEY (id),
  CONSTRAINT especialidades_descripcion_key UNIQUE (descripcion)
) TABLESPACE pg_default;

CREATE TABLE public.estado_laboral (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  descripcion text NOT NULL,
  CONSTRAINT estado_laboral_pkey PRIMARY KEY (id),
  CONSTRAINT estado_laboral_descripcion_key UNIQUE (descripcion)
) TABLESPACE pg_default;

CREATE TABLE public.barberos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre_completo text NOT NULL,
  telefono text,
  especialidad_id uuid NOT NULL,
  estado_laboral_id uuid NOT NULL,
  CONSTRAINT barberos_pkey PRIMARY KEY (id),
  CONSTRAINT barberos_especialidad_fkey FOREIGN KEY (especialidad_id)
    REFERENCES public.especialidades (id) ON DELETE RESTRICT,
  CONSTRAINT barberos_estado_laboral_fkey FOREIGN KEY (estado_laboral_id)
    REFERENCES public.estado_laboral (id) ON DELETE RESTRICT
) TABLESPACE pg_default;

CREATE TABLE public.clientes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre_completo text NOT NULL,
  telefono text,
  correo_electronico text,
  fecha_registro date NOT NULL DEFAULT CURRENT_DATE,
  CONSTRAINT clientes_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

CREATE TABLE public.servicios (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  precio numeric(10, 2) NOT NULL,
  duracion_minutos integer NOT NULL,
  CONSTRAINT servicios_pkey PRIMARY KEY (id),
  CONSTRAINT servicios_nombre_key UNIQUE (nombre)
) TABLESPACE pg_default;

CREATE TABLE public.estado_cita (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  descripcion text NOT NULL,
  CONSTRAINT estado_cita_pkey PRIMARY KEY (id),
  CONSTRAINT estado_cita_descripcion_key UNIQUE (descripcion)
) TABLESPACE pg_default;

CREATE TABLE public.citas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  fecha_cita date NOT NULL,
  hora_cita time NOT NULL,
  cliente_id uuid NOT NULL,
  barbero_id uuid NOT NULL,
  servicio_id uuid NOT NULL,
  estado_cita_id uuid NOT NULL,
  CONSTRAINT citas_pkey PRIMARY KEY (id),
  CONSTRAINT citas_cliente_fkey FOREIGN KEY (cliente_id)
    REFERENCES public.clientes (id) ON DELETE RESTRICT,
  CONSTRAINT citas_barbero_fkey FOREIGN KEY (barbero_id)
    REFERENCES public.barberos (id) ON DELETE RESTRICT,
  CONSTRAINT citas_servicio_fkey FOREIGN KEY (servicio_id)
    REFERENCES public.servicios (id) ON DELETE RESTRICT,
  CONSTRAINT citas_estado_cita_fkey FOREIGN KEY (estado_cita_id)
    REFERENCES public.estado_cita (id) ON DELETE RESTRICT
) TABLESPACE pg_default;

CREATE TABLE public.metodo_pago (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  descripcion text NOT NULL,
  CONSTRAINT metodo_pago_pkey PRIMARY KEY (id),
  CONSTRAINT metodo_pago_descripcion_key UNIQUE (descripcion)
) TABLESPACE pg_default;

CREATE TABLE public.facturas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  fecha_emision timestamptz NOT NULL DEFAULT now(),
  metodo_pago_id uuid NOT NULL,
  total_pagado numeric(10, 2) NOT NULL,
  cita_id uuid NOT NULL,
  CONSTRAINT facturas_pkey PRIMARY KEY (id),
  CONSTRAINT facturas_metodo_pago_fkey FOREIGN KEY (metodo_pago_id)
    REFERENCES public.metodo_pago (id) ON DELETE RESTRICT,
  CONSTRAINT facturas_cita_fkey FOREIGN KEY (cita_id)
    REFERENCES public.citas (id) ON DELETE RESTRICT,
  CONSTRAINT facturas_cita_key UNIQUE (cita_id)
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS barberos_nombre_idx ON public.barberos USING btree (nombre_completo) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS clientes_nombre_idx ON public.clientes USING btree (nombre_completo) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS servicios_nombre_idx ON public.servicios USING btree (nombre) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS citas_fecha_idx ON public.citas USING btree (fecha_cita) TABLESPACE pg_default;
