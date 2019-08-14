SET xmloption = content;
CREATE TABLE public.documentos (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    size text NOT NULL,
    base64 text NOT NULL,
    user_id text NOT NULL,
    processo_id integer NOT NULL,
    description text
);
CREATE TABLE public.empreendedores (
    id integer NOT NULL,
    cpf text NOT NULL,
    name text NOT NULL,
    endereco text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.enderecos (
    id integer NOT NULL,
    processo_id integer NOT NULL,
    cep text NOT NULL,
    logradouro text NOT NULL,
    complemento text NOT NULL,
    bairro text NOT NULL,
    localidade text NOT NULL,
    uf text NOT NULL,
    ibge text,
    area double precision,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.historicos (
    id integer NOT NULL,
    processo_id integer NOT NULL,
    user_id text NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    historico_tipo_id integer NOT NULL
);
CREATE TABLE public.processos (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id text NOT NULL,
    description text,
    due_date timestamp with time zone DEFAULT now() NOT NULL,
    demandante_id integer NOT NULL,
    origem_id integer NOT NULL,
    status_id integer NOT NULL,
    municipio_id integer NOT NULL,
    empreendedor_id integer,
    CONSTRAINT namechk CHECK ((char_length(name) <= 255)),
    CONSTRAINT titlechkbchar CHECK ((char_length(name) > 3))
);
CREATE TABLE public.processos_status (
    id integer NOT NULL,
    status_id integer NOT NULL,
    processo_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    due_date timestamp with time zone DEFAULT now() NOT NULL,
    name text,
    user_id text NOT NULL
);
CREATE TABLE public.todos (
    id integer NOT NULL,
    title text NOT NULL,
    is_completed boolean DEFAULT false NOT NULL,
    is_public boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id text NOT NULL
);
CREATE TABLE public.demandantes (
    id integer NOT NULL,
    name text NOT NULL
);
CREATE SEQUENCE public.demandantes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.demandantes_id_seq OWNED BY public.demandantes.id;
CREATE SEQUENCE public.documentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.documentos_id_seq OWNED BY public.documentos.id;
CREATE SEQUENCE public.empreendedores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.empreendedores_id_seq OWNED BY public.empreendedores.id;
CREATE SEQUENCE public.enderecos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.enderecos_id_seq OWNED BY public.enderecos.id;
CREATE TABLE public.historico_tipos (
    id integer NOT NULL,
    name text NOT NULL,
    type text NOT NULL
);
CREATE SEQUENCE public.historico_tipos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.historico_tipos_id_seq OWNED BY public.historico_tipos.id;
CREATE SEQUENCE public.historicos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.historicos_id_seq OWNED BY public.historicos.id;
CREATE TABLE public.municipios (
    id integer NOT NULL,
    name text NOT NULL,
    zone text NOT NULL
);
CREATE SEQUENCE public.municipios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.municipios_id_seq OWNED BY public.municipios.id;
CREATE TABLE public.users (
    id text NOT NULL,
    name text,
    created_at timestamp with time zone DEFAULT now(),
    last_seen timestamp with time zone,
    email text NOT NULL,
    telefone text,
    email_verificado boolean DEFAULT false NOT NULL,
    cpf text,
    role text DEFAULT 'User'::text NOT NULL
);
CREATE VIEW public.online_users AS
 SELECT users.id,
    users.last_seen
   FROM public.users
  WHERE (users.last_seen >= (now() - '00:00:30'::interval));
CREATE TABLE public.origems (
    id integer NOT NULL,
    name text NOT NULL
);
CREATE SEQUENCE public.origems_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.origems_id_seq OWNED BY public.origems.id;
CREATE SEQUENCE public.processos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.processos_id_seq OWNED BY public.processos.id;
CREATE SEQUENCE public.processos_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.processos_status_id_seq OWNED BY public.processos_status.id;
CREATE TABLE public.status (
    id integer NOT NULL,
    name text NOT NULL,
    type text NOT NULL
);
CREATE SEQUENCE public.status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.status_id_seq OWNED BY public.status.id;
CREATE SEQUENCE public.todos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.todos_id_seq OWNED BY public.todos.id;
ALTER TABLE ONLY public.demandantes ALTER COLUMN id SET DEFAULT nextval('public.demandantes_id_seq'::regclass);
ALTER TABLE ONLY public.documentos ALTER COLUMN id SET DEFAULT nextval('public.documentos_id_seq'::regclass);
ALTER TABLE ONLY public.empreendedores ALTER COLUMN id SET DEFAULT nextval('public.empreendedores_id_seq'::regclass);
ALTER TABLE ONLY public.enderecos ALTER COLUMN id SET DEFAULT nextval('public.enderecos_id_seq'::regclass);
ALTER TABLE ONLY public.historico_tipos ALTER COLUMN id SET DEFAULT nextval('public.historico_tipos_id_seq'::regclass);
ALTER TABLE ONLY public.historicos ALTER COLUMN id SET DEFAULT nextval('public.historicos_id_seq'::regclass);
ALTER TABLE ONLY public.municipios ALTER COLUMN id SET DEFAULT nextval('public.municipios_id_seq'::regclass);
ALTER TABLE ONLY public.origems ALTER COLUMN id SET DEFAULT nextval('public.origems_id_seq'::regclass);
ALTER TABLE ONLY public.processos ALTER COLUMN id SET DEFAULT nextval('public.processos_id_seq'::regclass);
ALTER TABLE ONLY public.processos_status ALTER COLUMN id SET DEFAULT nextval('public.processos_status_id_seq'::regclass);
ALTER TABLE ONLY public.status ALTER COLUMN id SET DEFAULT nextval('public.status_id_seq'::regclass);
ALTER TABLE ONLY public.todos ALTER COLUMN id SET DEFAULT nextval('public.todos_id_seq'::regclass);
ALTER TABLE ONLY public.demandantes
    ADD CONSTRAINT demandantes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT documentos_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.empreendedores
    ADD CONSTRAINT empreendedores_cpf_key UNIQUE (cpf);
ALTER TABLE ONLY public.empreendedores
    ADD CONSTRAINT empreendedores_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.enderecos
    ADD CONSTRAINT enderecos_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.enderecos
    ADD CONSTRAINT enderecos_processo_id_key UNIQUE (processo_id);
ALTER TABLE ONLY public.historico_tipos
    ADD CONSTRAINT historico_tipos_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.historicos
    ADD CONSTRAINT historicos_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.municipios
    ADD CONSTRAINT municipios_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.origems
    ADD CONSTRAINT origems_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.processos
    ADD CONSTRAINT processos_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.processos_status
    ADD CONSTRAINT processos_status_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.status
    ADD CONSTRAINT status_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT documentos_processo_id_fkey FOREIGN KEY (processo_id) REFERENCES public.processos(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT documentos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.enderecos
    ADD CONSTRAINT enderecos_processo_id_fkey FOREIGN KEY (processo_id) REFERENCES public.processos(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.historicos
    ADD CONSTRAINT historicos_historico_tipo_id_fkey FOREIGN KEY (historico_tipo_id) REFERENCES public.historico_tipos(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.historicos
    ADD CONSTRAINT historicos_processo_id_fkey FOREIGN KEY (processo_id) REFERENCES public.processos(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.historicos
    ADD CONSTRAINT historicos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.processos
    ADD CONSTRAINT processos_demandante_id_fkey FOREIGN KEY (demandante_id) REFERENCES public.demandantes(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.processos
    ADD CONSTRAINT processos_empreendedor_id_fkey FOREIGN KEY (empreendedor_id) REFERENCES public.empreendedores(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.processos
    ADD CONSTRAINT processos_municipio_id_fkey FOREIGN KEY (municipio_id) REFERENCES public.municipios(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.processos
    ADD CONSTRAINT processos_origem_id_fkey FOREIGN KEY (origem_id) REFERENCES public.origems(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.processos
    ADD CONSTRAINT processos_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.status(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.processos_status
    ADD CONSTRAINT processos_status_processo_id_fkey FOREIGN KEY (processo_id) REFERENCES public.processos(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.processos_status
    ADD CONSTRAINT processos_status_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.status(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.processos_status
    ADD CONSTRAINT processos_status_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.processos
    ADD CONSTRAINT processos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
