--
-- PostgreSQL database dump
--

-- Dumped from database version 13.4
-- Dumped by pg_dump version 14.12 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: evidence; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evidence (
    id integer NOT NULL,
    name text NOT NULL,
    url text,
    icon text,
    persona_id bigint
);


ALTER TABLE public.evidence OWNER TO postgres;

--
-- Name: evidence_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.evidence_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.evidence_id_seq OWNER TO postgres;

--
-- Name: evidence_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.evidence_id_seq OWNED BY public.evidence.id;


--
-- Name: personas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personas (
    id integer NOT NULL,
    name text NOT NULL,
    product_id bigint NOT NULL
);


ALTER TABLE public.personas OWNER TO postgres;

--
-- Name: personas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.personas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.personas_id_seq OWNER TO postgres;

--
-- Name: personas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personas_id_seq OWNED BY public.personas.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: trends; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trends (
    id integer NOT NULL,
    name text NOT NULL,
    type text,
    evidence_id bigint NOT NULL
);


ALTER TABLE public.trends OWNER TO postgres;

--
-- Name: trends_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trends_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trends_id_seq OWNER TO postgres;

--
-- Name: trends_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trends_id_seq OWNED BY public.trends.id;


--
-- Name: evidence id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evidence ALTER COLUMN id SET DEFAULT nextval('public.evidence_id_seq'::regclass);


--
-- Name: personas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas ALTER COLUMN id SET DEFAULT nextval('public.personas_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: trends id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trends ALTER COLUMN id SET DEFAULT nextval('public.trends_id_seq'::regclass);


--
-- Data for Name: evidence; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.evidence (id, name, url, icon, persona_id) FROM stdin;
1	Datagotchi Proposal	https://docs.google.com/document/d/1RPeGXVGPUrk8QH6lbqhpY_5ir7IHRzseGDIGhnr5KhM/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	1
\.


--
-- Data for Name: personas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personas (id, name, product_id) FROM stdin;
1	All People	1
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name) FROM stdin;
1	Datagotchi Labs
\.


--
-- Data for Name: trends; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trends (id, name, type, evidence_id) FROM stdin;
1	Information is important to quickly and effectively make decisions	objective	1
\.


--
-- Name: evidence_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evidence_id_seq', 1, true);


--
-- Name: personas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personas_id_seq', 1, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 1, true);


--
-- Name: trends_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.trends_id_seq', 1, true);


--
-- Name: evidence evidence_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evidence
    ADD CONSTRAINT evidence_pkey PRIMARY KEY (id);


--
-- Name: personas personas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: trends trends_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trends
    ADD CONSTRAINT trends_pkey PRIMARY KEY (id);


--
-- Name: trends fk_eid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trends
    ADD CONSTRAINT fk_eid FOREIGN KEY (evidence_id) REFERENCES public.evidence(id) NOT VALID;


--
-- Name: personas fk_pid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT fk_pid FOREIGN KEY (product_id) REFERENCES public.products(id) NOT VALID;


--
-- Name: evidence fk_pid_personas; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evidence
    ADD CONSTRAINT fk_pid_personas FOREIGN KEY (persona_id) REFERENCES public.personas(id) NOT VALID;


--
-- PostgreSQL database dump complete
--

