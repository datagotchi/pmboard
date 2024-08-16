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
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    name text NOT NULL,
    product_id bigint NOT NULL
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.companies_id_seq OWNER TO postgres;

--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- Name: evidence; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evidence (
    id integer NOT NULL,
    name text NOT NULL,
    url text,
    icon text,
    persona_id bigint,
    created_date date,
    modified_date date,
    story_id bigint
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
-- Name: journey_steps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.journey_steps (
    id integer NOT NULL,
    x text NOT NULL,
    y text NOT NULL,
    journey_id bigint,
    tag_id text NOT NULL,
    tag_class_name text
);


ALTER TABLE public.journey_steps OWNER TO postgres;

--
-- Name: journeySteps_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."journeySteps_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."journeySteps_id_seq" OWNER TO postgres;

--
-- Name: journeySteps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."journeySteps_id_seq" OWNED BY public.journey_steps.id;


--
-- Name: journeys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.journeys (
    id integer NOT NULL,
    story_id bigint NOT NULL
);


ALTER TABLE public.journeys OWNER TO postgres;

--
-- Name: journeys_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.journeys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.journeys_id_seq OWNER TO postgres;

--
-- Name: journeys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.journeys_id_seq OWNED BY public.journeys.id;


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
-- Name: stories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stories (
    id integer NOT NULL,
    name text NOT NULL,
    product_id bigint NOT NULL
);


ALTER TABLE public.stories OWNER TO postgres;

--
-- Name: stories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stories_id_seq OWNER TO postgres;

--
-- Name: stories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stories_id_seq OWNED BY public.stories.id;


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    name text NOT NULL,
    product_id bigint NOT NULL
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tasks_id_seq OWNER TO postgres;

--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


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
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: evidence id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evidence ALTER COLUMN id SET DEFAULT nextval('public.evidence_id_seq'::regclass);


--
-- Name: journey_steps id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journey_steps ALTER COLUMN id SET DEFAULT nextval('public."journeySteps_id_seq"'::regclass);


--
-- Name: journeys id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journeys ALTER COLUMN id SET DEFAULT nextval('public.journeys_id_seq'::regclass);


--
-- Name: personas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas ALTER COLUMN id SET DEFAULT nextval('public.personas_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: stories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stories ALTER COLUMN id SET DEFAULT nextval('public.stories_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: trends id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trends ALTER COLUMN id SET DEFAULT nextval('public.trends_id_seq'::regclass);


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (id, name, product_id) FROM stdin;
1	CRA	1
2	SRI	1
3	Y-Combinator	1
4	Start Garden	1
5	Productboard	2
6	New technologies (e.g., on Product Hunt)	5
7	Digg	3
8	Slashdot	3
9	Apple News(+)	3
10	Twitter	3
11	Twitch	3
12	c1	4
13	c2	4
14	All Job Boards	6
15	Fiverr	6
16	Upwork	6
\.


--
-- Data for Name: evidence; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.evidence (id, name, url, icon, persona_id, created_date, modified_date, story_id) FROM stdin;
1	Datagotchi Proposal	https://docs.google.com/document/d/1RPeGXVGPUrk8QH6lbqhpY_5ir7IHRzseGDIGhnr5KhM/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	1	\N	\N	\N
2	Self user research notes - DG Labs	https://docs.google.com/document/d/1hynxBUqOSq8o_0Y2zAkbNHeUVQ36f_U1cNZTwKhubp4/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	2	\N	\N	\N
22	R&D Scientist	\N	\N	\N	\N	\N	7
3	Neuroscience Says This Quality Is Key for Entrepreneurial Success, and It Has Nothing to Do With Intelligence or Grit _ Inc.com.pdf	https://drive.google.com/file/d/1U-rbRJb5nwqx7XE32id_ghTYPaaQ6FCE/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	2	2024-08-13	2024-08-13	\N
4	Dear Founders, Before Pitching to an Investor, Prepare an Investment Memo _ by Wayne Wee _ Jun, 2024 _ Startup Stash.pdf	https://drive.google.com/file/d/1KSqZXEJqZVhAQEKEWUJxnIEvfuHyHyQP/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	3	2024-08-11	2024-08-11	\N
5	Strategies For Getting VCs To Compete For Your Startup _ Medium.pdf	https://drive.google.com/file/d/1SRnaY-gf8m2Z8Ihw0_U-0862ZI7WUI1v/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	3	2024-08-11	2024-08-11	\N
6	You Are Being Lied to About Building a Business in Your 40s _ by Sarina Chiu _ Career Paths _ Jul, 2024 _ Medium.pdf	https://drive.google.com/file/d/1qlGCGwL64Ym1A8g0KJJm9RBZmIxHgQOC/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	3	2024-08-11	2024-08-11	\N
7	Actual tactics (not strategies) for growing a bootstrapped B2B startup _ by Nevo David _ Aug, 2024 _ Entrepreneurship Handbook.pdf	https://drive.google.com/file/d/1Fsbw0ha6qkwTo3DopH2rV1aKerLOY3VQ/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	3	2024-08-11	2024-08-11	\N
8	SaaS Is Under Pressure. SaaS has been the holy grail of… _ by Ryan Frederick _ Medium.pdf	https://drive.google.com/file/d/1xPbVyD3JBkRh3kCuJ6hbj-twGFtZkgwy/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	3	2024-08-13	2024-08-13	\N
9	How To Stay Motivated When Your Dreams Keep Drifting Into The Future _ by Alberto Cabas Vidani _ Aug, 2024 _ Entrepreneurship Handbook.pdf	https://drive.google.com/file/d/1xDjgq3UmlgGiGKoh-eK08MVUZo2WCx62/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	3	2024-08-13	2024-08-13	\N
10	Neuroscience Says This Quality Is Key for Entrepreneurial Success, and It Has Nothing to Do With Intelligence or Grit _ Inc.com.pdf	https://drive.google.com/file/d/1U-rbRJb5nwqx7XE32id_ghTYPaaQ6FCE/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	3	2024-08-13	2024-08-13	\N
11	Venture capitalists move toward _pay to play_.pdf	https://drive.google.com/file/d/1PnyAVHteY4quNPbWGmO8n-bKH2i5Wq_Y/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	4	2024-08-13	2024-08-13	\N
12	Entrepreneur	\N	\N	\N	\N	\N	1
13	Investor	\N	\N	\N	\N	\N	2
14	PMBoard proposal	https://docs.google.com/document/d/1KzD6QLuWW0qv7SJreMW0G3Piw96x7zBmUgdLC-vCIoE/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	5	\N	\N	\N
23	R&D Scientist	\N	\N	\N	\N	\N	8
15	PMboard Self user research notes - R&D scientist	https://docs.google.com/document/d/1fDUyMO5GRTokJn5khMWPAhJCsuFUmQp62m-lYmhfDGo/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	5	2024-08-08	2024-08-08	\N
16	Self user research notes - DG Labs	https://docs.google.com/document/d/1hynxBUqOSq8o_0Y2zAkbNHeUVQ36f_U1cNZTwKhubp4/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	5	2024-08-07	2024-08-07	\N
17	We Need to Raise the Bar for AI Product Managers _ by Julia Winn _ Aug, 2024 _ Towards Data Science.pdf	https://drive.google.com/file/d/1EpBkloFburQh-EC1n_1wSM8rKd1tQIsS/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	6	2024-08-12	2024-08-12	\N
18	Proposal for Supply	https://docs.google.com/document/d/1kACV_wMgDPCnFiPtAgqMGamSzgAkNJYsid8Ku6Fhf24/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	7	\N	\N	\N
19	Counteroffer self user research notes -- Driven	https://docs.google.com/document/d/1Z0NPKFz1AshUPttLePROeVEgmbQgujyVwR8IFfzmQ1c/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	7	\N	\N	\N
20	Counteroffer self user research notes -- Collusion	https://docs.google.com/document/d/1zPEtCLeSYJCT_3iLFYuR4U3NqAY8-ZoptGnN0RiR3XI/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	7	2024-08-06	2024-08-06	\N
21	Counteroffer self user research notes -- Exaptive	https://docs.google.com/document/d/1I-kxJBTBNjiuUEgaYEW0dYNDFy98sWc1CnqPJ3KJfbc/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	7	2024-08-06	2024-08-06	\N
24	Product Manager	\N	\N	\N	\N	\N	8
25	Entrepreneurs/Startups	\N	\N	\N	\N	\N	8
26	Entrepreneurs/Startups	\N	\N	\N	\N	\N	11
27	Interview - Megan	https://docs.google.com/document/d/1udeKLySXsdG4VQp_OO8QGR4LhI6Q6fqHz4SPZpziDTg/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	8	\N	\N	\N
28	Interview - Molly	https://docs.google.com/document/d/1WjmDXTRvzQ_G1n80Yb3MrJqjU9XUd4q4LsAYWmifL-4/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	8	\N	\N	\N
29	Inspect: Self user research notes outline -- US citizen	https://docs.google.com/document/d/1WDL5N38AVfiZY5UGxkv3Et0H8cMnQ1WZJcID0DLlBto/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	8	\N	\N	\N
30	Inspect proposal for information tracking	https://docs.google.com/document/d/1UI8zBNhSGD31j6YuBpH3rFm0wrJwLeyXt7iaZR-M1yU/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	8	\N	\N	\N
31	Tracking the Reliability of Information _ Datagotchi Labs.pdf	https://drive.google.com/file/d/1KCxhnd6j8XPr5dZHJ-MaNVK3BTmUS-TF/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	8	\N	\N	\N
32	Trump bizarrely blames Harris for turned-Black remark_ _She said it. I didn't say it_ (video) - Boing Boing.pdf	https://drive.google.com/file/d/1xFDIjHTSpLPZ_D5TVff92nfJz-i-YZFQ/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	8	2024-08-11	2024-08-11	\N
33	Inspect proposal for information tracking	https://docs.google.com/document/d/1UI8zBNhSGD31j6YuBpH3rFm0wrJwLeyXt7iaZR-M1yU/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	9	\N	\N	\N
34	$$$ Plans	https://docs.google.com/spreadsheets/d/1Kr8kb82eSsRiRC09rPkbbII6nom8-yWMmFp9JObk0EY/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.spreadsheet	12	2023-02-14	2024-08-10	\N
35	Is Your Rent an Antitrust Violation_ - The Atlantic.pdf	https://drive.google.com/file/d/1Y-XQbq-dnVOde9GjSjjQ4lPzDaXU6de1/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	14	2024-08-11	2024-08-11	\N
36	New Google Pixel 9 voice assistant Gemini is a trainwreck - Fast Company.pdf	https://drive.google.com/file/d/1v1fwScg0uJz2Q1gUCNnMnrd9Skm9JkKB/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	14	2024-08-15	2024-08-15	\N
37	We All Know AI Can’t Code, Right_ _ by Joe Procopio _ Aug, 2024 _ Entrepreneurship Handbook.pdf	https://drive.google.com/file/d/1Q2SncKXRLoNMBpdIOZF9HD5-8oV7aeJU/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	15	2024-08-11	2024-08-11	\N
38	The Braindead Senior Dev Hypothesis _ by Andrew Zuo _ Aug, 2024 _ Medium.pdf	https://drive.google.com/file/d/1WlOWFq7uFUpUACaEaheSWvl_HThR6f5Z/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	15	2024-08-12	2024-08-12	\N
39	Flood of 'junk'_ How AI is changing scientific publishing.pdf	https://drive.google.com/file/d/1oq8fJ7ur33fnvkVWij2onoHu6sN4yCJj/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	16	2024-08-11	2024-08-11	\N
40	We Need to Raise the Bar for AI Product Managers _ by Julia Winn _ Aug, 2024 _ Towards Data Science.pdf	https://drive.google.com/file/d/1EpBkloFburQh-EC1n_1wSM8rKd1tQIsS/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	17	2024-08-12	2024-08-12	\N
41	6 hard truths of generative AI in the enterprise _ CIO.pdf	https://drive.google.com/file/d/10XYXrur15fUetRiweVg455N7aVCbxk0m/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	18	2024-08-13	2024-08-13	\N
42	Remote work is bad for you. How people willingly slow down their… _ by Michal Malewicz _ Jul, 2024 _ Medium.pdf	https://drive.google.com/file/d/1jFUtbEavbyI7LmqUiysqrv75_mtET3lX/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	19	2024-08-13	2024-08-13	\N
43	There is no Developer Shortage. None of this crap really needs to exist _ by Kenneth Reilly _ Medium.pdf	https://drive.google.com/file/d/1GKgAON8U43XwIWaXr23YLQvIhLHxbj9K/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	19	2024-08-13	2024-08-13	\N
44	Tech Companies Can’t Find Good Employees and It’s Their Own Fault _ by Joe Procopio _ Aug, 2024 _ Entrepreneurship Handbook.pdf	https://drive.google.com/file/d/1IWBIk1pTXS7Szc-LTa32CrlZbusU1u7e/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	19	2024-08-13	2024-08-13	\N
45	Hard Core Programming is Dead. Software developers voted with their… _ by The Secret Developer _ Jun, 2024 _ Medium.pdf	https://drive.google.com/file/d/1f_8Hlk5zttqi_NrUrnT-GsqOCmz5st9o/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	19	2024-08-12	2024-08-12	\N
46	Why Most Programmers Burn Out After the Age of 40 _ by Aleena _ Jul, 2024 _ Level Up Coding.pdf	https://drive.google.com/file/d/1TWYLquN7LZwSm6Fj6pxGglvsd85EqpH-/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	19	2024-08-11	2024-08-11	\N
47	HackerX	https://docs.google.com/document/d/1rXwkoYJIM9ybNDFC7AsKWYTIw0cmegAw9JSJN5YqKvU/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	20	\N	\N	\N
48	My past jobs' task breakdown	https://docs.google.com/document/d/1Sr5l76cOj8SO9R4iW2aOxfj7IqdFdpM5sjP6ahaUQ4k/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	20	\N	\N	\N
49	Consulting brainstorming	https://docs.google.com/document/d/1gxjaEB-2YLZyx2slPN7VpZcAx_JUdnbDjGX2yIqsUN0/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	20	\N	\N	\N
50	Petaluma businesses	https://docs.google.com/spreadsheets/d/1XbXRtRk0wm5YRRw_2A67rSS4WCDXuzpqhuQGHQbeFkA/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.spreadsheet	20	\N	\N	\N
51	Counteroffer v3 (combined marketplace) proposal	https://docs.google.com/document/d/1YjKfPKhnFZZkUIuVCqEOKnumhzyQmG5iENBmhhqKNXw/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	20	\N	\N	\N
52	Jobhunters Flood Recruiters With AI-Generated CVs - Slashdot.pdf	https://drive.google.com/file/d/1nVcQPKz-GFQeLhNE1IX-T5fKEn6RgGH6/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	20	2024-08-13	2024-08-13	\N
53	Counteroffer self user research notes -- Tanium (#1)	https://docs.google.com/document/d/17-ErdWqh0nhy03n90tsHjLDNSmhseAmW6QkaT1MEj6c/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	21	\N	\N	\N
54	Counteroffer self user research notes -- Driven	https://docs.google.com/document/d/1Z0NPKFz1AshUPttLePROeVEgmbQgujyVwR8IFfzmQ1c/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	21	\N	\N	\N
55	Counteroffer self user research notes -- Collusion	https://docs.google.com/document/d/1zPEtCLeSYJCT_3iLFYuR4U3NqAY8-ZoptGnN0RiR3XI/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	21	\N	\N	\N
56	Counteroffer self user research notes -- Exaptive	https://docs.google.com/document/d/1I-kxJBTBNjiuUEgaYEW0dYNDFy98sWc1CnqPJ3KJfbc/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	21	\N	\N	\N
57	Counteroffer v1 proposal	https://docs.google.com/document/d/1sncONQyNV2mrYZftuwtOll4CoHU1uJvQAx3_OR2TMPQ/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	21	\N	\N	\N
58	Using Leverage to Make Demands from Employers _ Datagotchi Labs.pdf	https://drive.google.com/file/d/1d2AGhDcn9JQX9KQWz8yhmEWUqoBlOBsF/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	21	\N	\N	\N
59	My New Tech Job Strategy is Doing Nothing _ by The Secret Developer _ Jun, 2024 _ Medium.pdf	https://drive.google.com/file/d/13KKCg7nQh1PU8tH2O5dQtqydP4dK3MNW/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	21	2024-08-11	2024-08-11	\N
60	There is no Developer Shortage. None of this crap really needs to exist _ by Kenneth Reilly _ Medium.pdf	https://drive.google.com/file/d/1GKgAON8U43XwIWaXr23YLQvIhLHxbj9K/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	22	2024-08-13	2024-08-13	\N
61	Hard Core Programming is Dead. Software developers voted with their… _ by The Secret Developer _ Jun, 2024 _ Medium.pdf	https://drive.google.com/file/d/1f_8Hlk5zttqi_NrUrnT-GsqOCmz5st9o/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	22	2024-08-12	2024-08-12	\N
62	Tech Companies Can’t Find Good Employees and It’s Their Own Fault _ by Joe Procopio _ Aug, 2024 _ Entrepreneurship Handbook.pdf	https://drive.google.com/file/d/1IWBIk1pTXS7Szc-LTa32CrlZbusU1u7e/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	22	2024-08-13	2024-08-13	\N
63	Recruiter research: Barry Kwok	https://docs.google.com/document/d/1XyIbba5H05ckeBVqADJ3iG5PeUeX5IcQaTIoIdQWihc/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	23	\N	\N	\N
64	Career Nebula	https://docs.google.com/document/d/1NhY2KogMo0ik8bqYwH1KPu6qTXv2ngeOgwGcpY44qlY/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	23	\N	\N	\N
65	Counteroffer v2 (employer side, "Illuminate") proposal	https://docs.google.com/document/d/1y6aUf9A1BrprUvvlVzl-6rEpPqyNGLuvRT4tNAn32rU/edit?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document	23	\N	\N	\N
66	Jobhunters Flood Recruiters With AI-Generated CVs - Slashdot.pdf	https://drive.google.com/file/d/1nVcQPKz-GFQeLhNE1IX-T5fKEn6RgGH6/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	23	2024-08-13	2024-08-13	\N
67	Bandana lands new investment to help hourly wage workers find good jobs _ TechCrunch.pdf	https://drive.google.com/file/d/1WInVBD1wlZPReuL3RvGgSkPjnDAx1luN/view?usp=drivesdk	https://drive-thirdparty.googleusercontent.com/16/type/application/pdf	24	2024-08-11	2024-08-11	\N
68	Social Thought Leader	\N	\N	\N	\N	\N	15
69	Social Thought Leader	\N	\N	\N	\N	\N	16
70	All People	\N	\N	\N	\N	\N	17
71	Techie	\N	\N	\N	\N	\N	20
72	Techie	\N	\N	\N	\N	\N	21
73	Unemployed Techie	\N	\N	\N	\N	\N	21
74	Employed Techie	\N	\N	\N	\N	\N	21
\.


--
-- Data for Name: journey_steps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.journey_steps (id, x, y, journey_id, tag_id, tag_class_name) FROM stdin;
1	350px	70px	6	There is so much information involved in the creation of new products	objective
\.


--
-- Data for Name: journeys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.journeys (id, story_id) FROM stdin;
6	1
\.


--
-- Data for Name: personas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personas (id, name, product_id) FROM stdin;
1	All People	1
2	Me	1
3	Entrepreneur	1
4	Investor	1
5	R&D Scientist	2
6	Product Manager	2
7	Entrepreneurs/Startups	2
8	All People	3
9	Social Thought Leader	3
10	Journalist	3
11	News Employee	3
12	p1	4
13	p2	4
14	All People	5
15	Software Engineer	5
16	Researchers	5
17	Product Manager	5
18	CIO	5
19	Techie	6
20	Unemployed Techie	6
21	Employed Techie	6
22	Hiring Manager	6
23	Recruiter	6
24	Wage Workers	6
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name) FROM stdin;
1	Datagotchi Labs
2	PMBoard
3	Inspect
4	Test
5	Collaborative Copilot
6	Counteroffer
\.


--
-- Data for Name: stories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stories (id, name, product_id) FROM stdin;
1	Help Entrepreneurs create new startups by understanding stakeholders	1
2	Reduce investor risk aversion by being able to empathize with all stakeholders	1
3	Make it easier to do light-weight entrepreneurship	1
4	Make new products useful to yourself first	1
5	Then rely on word-of-mouth marketing	1
6	Improve Michigan's startup scenes	1
7	Enable R&D Scientists to cite stakeholder needs in the stories widget	2
8	After entering trends, they should be typed, then combined across evidence files	2
9	Enable users to link trends at different levels/types	2
10	Integrated product teams will retain employees better, make them less upset/burned put/etc.	2
11	Assist Entrepreneurs/Startups empathizing with stakeholders using PMBoard	2
12	Enable R&D Scientists, Entrepreneurs, and Product Managers to quickly & effectively pivot when markets/stakeholder needs change	2
13	For MVP iteration, users need a timeline view of lessons learned	2
14	Enable R&D Scientists to compare several revenue streams	2
15	Make sharing important news on social media easier for Thought Leaders	3
16	Enable Thought Leaders to synthesize news articles into new insights	3
17	Enable People to consume news according to its reliability	3
18	s1	4
19	s2	4
20	Enable all kinds of Techies to quickly apply to gigs based on specific skills	6
21	Enable Techies to use CO as a career dashboard their entire lives	6
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, name, product_id) FROM stdin;
1	My jobs are broad about and at early stage startups	1
2	Come up with a DG labs pitch for accelerators	1
3	Michigan Founder's Fund meets at Start Garden once a month -- \\"founder's first friday\\"	1
4	MSU organization is *not* just for MSU people -- it's called Conquer	1
5	I'm very good at identifying problem trends in news, analyzing root causes, and analyzing possible solutions	1
6	Mention my information science education/training and introduction to concepts like information asymmetries and information overload	1
7	I'm incubating Datagotchi Labs to be about addressing these issues (in underserved markets/communities?) and finding novel business models to support them	1
8	Mention interdisciplinary vs multidisciplinary: my backgrounds + DG's multiple focuses	1
9	The key is documenting things (information)	1
10	For MI-centric messaging, maybe focus on local hires rather than remote gig workers	1
11	Either way, become an expert at building teams (with Counteroffer?)	1
12	Maybe pitch startup incubation based on stakeholder empathy	1
13	But unless I get donations up front, perhaps with equity promises (profit dividends), this will take forever and not make much money	1
14	I'd have to brand myself as very good at early & ongoing research, mvp testing, problem-solving, etc...	1
15	Also my experience in R&D, startups in SF, and early DG Labs (wearing many hats)	1
16	Don't forget about consulting and coaching about these lessons -- after documenting them and *organizing* them	1
17	I worked for startups to learn how they commercialize their technologies. So my heart is really in new technology R&D	1
18	DG, Inspect, and CO initial ideas are low profit margin and slow growth, so investors won't be interested	1
19	Could pitch the interpretable analytics now	1
20	With my skills, EIR @ SG would be great (focused on nearly stage opportunity discovery &  validation) -- ask Laurie or her contact?	1
21	Come up with an argument that empathy improves R&D/startups/or something	1
22	Empathy makes your startup more resilient in the face of changing markets because you can more easily hypothesize what stakeholders need even if they didn't tell you directly	1
23	Create a proxy, so I can use one easy to instance for all three projects	1
24	Reduce ec2 size while it's just me	1
25	Show product name \\u003E item type \\u003E item name on modal	2
26	Enable custom trend types	2
27	t1	4
28	t2	4
29	Add web links to dg.net/inspect	3
30	Fix Android app	3
31	Reach out to thought leaders	3
32	Base source reliability on # of shares / #of article summaries	3
33	Implement user analytics	3
34	Interesting because of the compartmentalization of discussions (and to some extent the knowledge base stuff)	3
35	People mostly are not interested in creating summaries or spending time finding people to follow	3
36	Use favorite flag to show summaries/meta-summaries on your profile	3
37	Apply to gigs based on React, Express, Webpack, databases, etc.	6
38	Put CO live on AWS & invite Alex	6
39	MVP lesson: just visualizing skills, even ones from the job listing, is not sufficient to get a job	6
40	Fiverr/client-searchable gigs are risky because it’s likely no one will ever find us	6
41	No one will ever find us Partly because I don’t do hype-y things like generative AI	6
42	And partly because I’m great at things no one thinks they need	6
43	\tGet basic resume creation from LinkedIn CVS working again	6
\.


--
-- Data for Name: trends; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trends (id, name, type, evidence_id) FROM stdin;
1	Information is important to quickly and effectively make decisions	objective	1
2	People are overloaded with information	goal	1
3	They also have information hidden from them	goal	1
4	They also often don’t know what to do with the information	goal	1
5	People need access to information without being overloaded	activity	1
6	People need access to information that is hidden from them	activity	1
7	People need access to information that they can use	activity	1
8	Any solution must enable people to opt-in to relevant information, and, if that’s not possible, to at least allow them to opt-out	task	1
9	Any solution must incentivize information sources to release it to those who desire/could use it	task	1
10	Any solution must both suggest relevant actions from information and flexibility to use it in novel ways	task	1
11	Focusing on opt-in experiences with opt-out & never experiences that have neither (advertising)	resource	1
12	Focusing on creating two-sided marketplaces so people can share information to their benefit	resource	1
13	Always enabling exporting and using data in other contexts	resource	1
14	Upwork	resource	2
15	Fiverr	resource	2
16	Wordpress	resource	2
17	Medium	resource	2
18	Applying to gigs	task	2
19	Blogging	task	2
20	Software development	task	2
21	Prototype empowering information products	activity	2
22	Provide services to companies	activity	2
23	Write online content and share it	activity	2
24	To reduce information overload	goal	2
25	To expose hidden information	goal	2
26	To frame information so it can be used	goal	2
27	Documenting my knowledge and skills	goal	2
28	Sharing my knowledge and skills	goal	2
29	To empower myself & other people with information	objective	2
30	To use my knowledge and skills	objective	2
31	The UX for creating empathy maps & citing those tags in the StoriesWidget needs to be MUCH better		12
32	Probably through generation of pitches		13
33	There is so much information involved in the creation of new products	objective	14
34	Also a lot of information in MVP iteration	objective	14
35	The biggest problem with startups and R&D teams is that they rarely collaborate enough	objective	14
36	Integration of product information to everyone on a team creates integrated product teams (IPTs)	goal	14
37	IPT members need to do stakeholder research to deeply understand the problems and the stakeholders affected by them	activity	14
38	IPT members need to do market research to be able to explain why their solution is better than all other possible solutions	activity	14
39	Any solution must integrate multimodal and qual/quant stakeholder data	task	14
40	Any solution must link stakeholder needs to value propositions, then value propositions to features and their roadmap	task	14
41	IPT members need to do MVP iteration to commercialize their product / find p-s fit and p-m fit	activity	14
42	Any solution must any solution must track and link stakeholder research (original and with your product), market research, and product development/launches over time	task	14
43	Incrementally-Formalized Stakeholder Empathy Visualizations	resource	14
44	Semantic Widget Citations	resource	14
45	Linked Widget Timelines	resource	14
46	Feedly	resource	15
47	Google News	resource	15
48	Twitter	resource	15
49	Email	resource	15
50	GitHub	resource	15
51	Visual Studio Code	resource	15
52	Reacat	resource	15
53	Node.js	resource	15
54	Kickstarter	resource	15
55	AngelList	resource	15
56	Product Hunt	resource	15
57	Google Ads	resource	15
58	Talk to friends and family	task	15
59	Email myself insights from talking to friends and family	task	15
60	Network to gain professional connections	task	15
61	Email myself insights from professional connections	task	15
62	Read Feedly, Google News, Twitter	task	15
63	Share articles/posts to myself via email	task	15
64	Prototype in React & Node.js in Visual Studio Code	task	15
65	Analyze, approve, & push code reviews on GitHub	task	15
66	Create campaigns on Kickstarter, AngelList, Product Hunt, Google Ads	task	15
67	Talk to people who might be associated to a problem space	activity	15
68	Document insights from talking to people	activity	15
69	Stay aware of news in my feeds	activity	15
70	Document important articles/posts	activity	15
71	Develop & test prototypes locally	activity	15
72	Commit code to GitHub to document it"	activity	15
73	Try crowdfunding, investors, subscriptions, transaction fees, etc…	activity	15
74	Research & document stakeholder needs	goal	15
75	Research & document markets	goal	15
76	Prototype & document solutions	goal	15
77	Try & document various revenue streams	goal	15
78	To explore social problem spaces, potential solutions, & novel revenue streams	objective	15
79	To document my learnings so I can get better/make others better over time	objective	15
80	To empower myself & other people with information	objective	15
81	PMBoard	resource	15
82	Upwork	resource	16
83	Fiverr	resource	16
84	Medium	resource	16
85	Wordpress	resource	16
86	Software development	task	16
87	Blogging	task	16
88	Applying to/posting gigs on Fiverr/Upwork	task	16
89	Prototype empowering information products	activity	16
90	Provide services to companies	activity	16
91	Write online content and share it	activity	16
92	Sharing my knowledge and skills	goal	16
93	Documenting my knowledge and skills	goal	16
94	To frame information so it can be used	goal	16
95	To expose hidden information	goal	16
96	To reduce information overload	goal	16
97	To empower myself & other people with information	objective	16
98	To use my knowledge and skills	objective	16
99	LinkedIn job alerts	resource	16
100	Counteroffer	resource	16
101	PMBoard	resource	16
102	Apply to jobs from LinkedIn job alerts	task	16
103	Improving my cover letter & Fiverr/Upwork profiles with PMBoard screenshots	task	16
104	Improving my resume with Counteroffer	task	16
105	Get a job	activity	16
106	Make money	goal	16
107	Afford to live by myself	objective	16
108	There is so much information involved in the creation of new products	objective	18
109	There is a lot of information with through MVP iteration	objective	18
110	There is a lot of information through growth	objective	18
111	The biggest problem with startups and R&D teams is that they rarely collaborate enough	objective	18
112	Integration of product information to everyone on a team creates integrated product teams (IPTs)	goal	18
116	Any solution must integrate multimodal and qual/quant stakeholder data	task	18
117	Any solution must link stakeholder needs to value propositions, then value propositions to features and their roadmaps	task	18
118	Any solution must track and link stakeholder research (original and with your product), market research, and product development/launches over time	task	18
113	IPT members need to do stakeholder research to deeply understand the problems and the stakeholders affected by them	activity	18
114	IPT members need to do market research to be able to explain why their solution is better than all other possible solutions	activity	18
115	IPT members need to do MVP iteration to commercialize their product / find p-s fit and p-m fit	activity	18
119	AngularJS	resource	19
120	Java	resource	19
121	Google Drawing	resource	19
122	Code Reviews	task	19
123	Pair programming	task	19
124	Talking with my boss/other executives	task	19
125	Other meetings	task	19
126	Constantly doing heuristic UX reviews of the product	activity	19
127	Repeatedly measuring times between components	activity	19
128	Checking in with teammates	activity	19
129	Getting required tasks	activity	19
130	To quickly and effectively accomplish engineering tasks I was given	goal	19
131	To ensure my teammates were not blocked	goal	19
132	To ensure our product performed well	goal	19
133	To ensure our product had great UX	goal	19
134	To be a productive engineer	objective	19
135	To be an effective team leader	objective	19
136	To be a productive product manager	objective	19
137	Google Docs	resource	19
138	Reading sales meeting notes & enumerating insights in Google Docs	task	19
139	Continuously documenting & analyzing user research	activity	19
140	Standup meetings	task	19
141	Javascript	resource	20
142	PHP	resource	20
143	Node.js	resource	20
144	The Collusion app	resource	20
145	Other meetings	task	20
146	Talking with the founders/executives	task	20
147	Constantly doing heuristic UX reviews of the product	activity	20
148	Checking in with teammates	activity	20
149	Getting required tasks	activity	20
150	To design cross-platform (iPhone, iPad, laptop) user journeys	activity	20
151	To ensure our product had great UX	goal	20
152	To quickly and effectively accomplish engineering tasks I was given	goal	20
153	To be a productive engineer	objective	20
154	To be a productive UX designer	objective	20
155	To be a productive product lead"	objective	20
156	Javascript	resource	21
157	D3.js	resource	21
158	Python	resource	21
159	Rserve	resource	21
160	Standup meetings	task	21
161	Other meetings	task	21
162	Talking with the founders/executives	task	21
163	Constantly doing heuristic UX reviews of the product	activity	21
164	Checking in with teammates	activity	21
165	Getting required tasks	activity	21
166	To ensure our product had great UX	goal	21
167	To quickly and effectively accomplish engineering tasks I was given	goal	21
168	To be a productive engineer	objective	21
169	To apply my recently-gained human-systems integration (HSI)/government R&D knowledge to startups	objective	21
170	To be a productive assistant product lead	objective	21
171	Need to get trends from the other widget		22
172	I find myself tagging subtasks on stories, so maybe that's the other "direction" vs personas?		22
173	There is so much information involved in the creation of new products	objective	23
174	To document my learnings so I can get better/make others better over time	objective	23
175	There is a lot of information with through MVP iteration	objective	25
176	There is a lot of information through growth	objective	25
177	Need to improve the empathy map visualization		26
178	Finds news in social media	activity	27
179	Gets news from talking to friends	task	27
180	Google News	resource	27
181	Facebook	resource	27
182	Nextdoor	resource	27
183	Pays for NYT	resource	27
184	Uses Instagram, but not for news	resource	27
185	Trust news based on source reliability	goal	27
186	Does not prioritize news	goal	27
187	LinkedIn	resource	27
188	Cross-checks stories with other sources	task	27
189	Overloaded by the news	objective	27
190	Friends	resource	27
191	Social media	resource	27
192	Gets alerts from Apple News	task	28
193	Overloaded by the news	objective	28
194	Heavy iPhone User	resource	28
195	Trust news based on source reliability	goal	28
196	Avoids sources with strong feelings	goal	28
197	Cross-checks stories with other sources	task	28
198	Apple News	resource	28
199	Does not prioritize news	goal	28
200	Friends	resource	29
201	Family	resource	29
202	Feedly	resource	29
203	Google News	resource	29
204	Skim news on my feeds	activity	29
205	Read the news online	goal	29
206	Talk to friends and family about current events	task	29
207	Text my friends about current events	activity	29
208	Eat dinner with my parents with the tv on	activity	29
209	To be well-informed about current events	objective	29
210	Email myself news that seem important	task	29
211	Many of the articles are hidden behind paywalls	objective	30
212	Social media posts about news need to be taken seriously	goal	30
213	Overloaded by the news	objective	30
214	Social media	resource	30
215	Any solution must include reliability and context visualizations in summaries and shared social media posts	task	30
216	Many articles have clickbait headlines	objective	30
217	Many articles have sensationalist headlines	objective	30
218	Much news is fake: misinformation & disinformation	objective	30
219	News is quickly forgotten	objective	30
220	Trust news based on source reliability	goal	30
221	The Thorough, Multimodal Summary Reposter	resource	30
222	Adaptable Reliability & Context Visualizations	resource	30
223	As the world becomes more connected and more complex, it is increasingly difficult to know what to believe	objective	31
224	Events happen far away from us, to other people, and we usually hear about them after the fact	objective	31
225	Since we can no longer rely on many institutions, we will need to make sense of the world ourselves	objective	31
226	Some information sources are more reliable than others	objective	31
227	It's difficult to know which sources are reliable	goal	31
228	We need to determine what sources we should trust	activity	31
229	We may also want other ways to verify the truth of claims	activity	31
230	We still need to share true information with others in a way that they can use it both immediately and in the future	activity	31
231	A solution is needed to reliably create and share source trust data	task	31
232	A solution is needed to consistently evaluate the truth of claims	task	31
233	A solution is needed to use true claims to improve source trust data that will help them evaluate claims against the trustworthiness of the source	task	31
234	Overloaded by the news	objective	31
235	Reach people on more online platforms	goal	33
236	Unify discussions from their posts	goal	33
237	Need to be able to get people to take their posts seriously, trust them, and take action from them	activity	33
238	Need to provide context with posts	task	33
239	Need to make posts easily actionable	task	33
240	Want to get the word out about important issues	objective	33
241	The Thorough, Multimodal Summary Reposter	resource	33
242	Adaptable Reliability & Context Visualizations	resource	33
243	Resource	resource	34
244	Task	task	34
245	Activity	activity	34
246	Goal	goal	34
247	Objective	objective	34
248	Remote work is bad for you	task	42
249	Remote work can kill a junior's career	activity	42
250	Techies won't grow if they stay at one company in one domain	objective	42
251	Digital collaboration tools don't let you really connect on ideas	goal	42
252	Digital collaboration doesn't let you absorb everything from your coworkers	objective	42
253	In-office work teaches you about how the business works	objective	42
254	In-office work teaches you more strategic knowledge & skills	objective	42
255	People tend to be more productive when there’s a possibility someone may directly oversee their work	objective	42
256	To capture the in-office benefits and support remote work, hybrid roles are becoming common	goal	42
257	Office work is stressful	objective	42
258	Techies that need to work remotely will have slower-growing careers	goal	42
259	Junior candidates should work at local businesses, even if they aren't very good	resource	42
260	In-office work is good for you	task	42
261	Working at local businesses is "real experience"	task	42
262	In-office collaboration is better than remote, especially for junior people	activity	42
263	In the United States alone there are over one million “unfilled roles” in software engineering as of 2024 and the number is rising every year	goal	43
264	There are many roles because of Unrealistic Expectations	objective	43
265	There are many roles because of Manipulative Practices	objective	43
266	There are many roles because of Overdigitalization of our lives	objective	43
267	There are many roles because of employee burnout	objective	43
268	We should seek meaningful work in other industries to build real products or fulfill legitimate service needs for others and actually see your work being completed and appreciated by employers and customers alike	resource	43
269	Many of the open roles are not good fits for us	task	43
270	Existing talent can override knowing one specific technology or having a lot of experience in it	activity	43
271	Hiring managers think that we need to have experience in their exact tech stacks	activity	43
272	Hiring managers are rarely as talented as the people they are hiring (and that's the point)	goal	43
273	Senior stakeholders abuse us for their own career growth/ego	goal	43
274	Many tech companies have laid off techies to save money	objective	44
275	Techies were the reasons tech companies succeeded	objective	44
276	Many job listings posted on LInkedIn aren't real/available jobs	activity	44
277	AI rejects resume out of hand	activity	44
278	No one can wade through so many bad job applications	goal	44
279	Junior employees/interns also reject resumes unreasonably	activity	44
280	lack of capacity to be able to filter the technically elite from the barely literate	task	44
281	Increasing lack of participation in a hiring process	goal	44
282	Even extremely talented and accomplished candidates have to jump through hoops to get a job	resource	44
283	There are a large number of interview sessions	goal	44
284	There are intelligence-insulting aptitude tests	goal	44
285	There are requests to do actual work for the company as part of the interview	goal	44
286	Companies need to hire techies to keep releasing their products well	objective	44
287	Software engineers value making quality software	objective	45
288	Leaders of software engineers don't value quality software, just long hours	objective	45
289	Software engineers & leaders have conflicting perspectives on software quality	goal	45
290	Software engineers traditionally valued increased pay	objective	45
291	Now software engineers are starting to value work-life balance	objective	45
292	Continuous learning is essential for software engineers	goal	45
293	Software engineers still seek new jobs for a pay raise	goal	45
294	Software engineers are also looking for more fulfillment and better company culture	objective	45
295	Since the pandemic, software engineers want to work from home more and have more control over their work	goal	45
296	Companies are still trying to hire people to work long hours in their offices	objective	45
297	Many people want to make impact at work	objective	45
298	Many jobs deny software engineers from making impact	activity	45
299	Many applications for new jobs are rejected due to not having impact at previous jobs	task	45
300	Technical interviews rarely filter out bad candidates, or even find good candidates	task	45
301	The world is changing: software engineers want more & hiring managers want to give less	objective	45
302	Software engineers think they can find better jobs, so they are not held down by one company	resource	45
303	Many software engineers can't get new jobs	resource	45
304	Working from home wasn't always an option	objective	46
305	Many of us could work from home during the pandemic	objective	46
306	Many companies want their employees back at the office	goal	46
307	Many people still want to work from anywhere in the world and make good money	goal	46
308	Most companies don’t allow employees to work from anywhere	goal	46
309	You’re expected to attend pointless daily meetings every day	goal	46
310	There are many approaches to writing software	objective	46
311	Many software engineers have big egos	objective	46
312	Rewriting someone else's code can conflict with their ego	objective	46
313	The implementation of Agile at most companies is called Scrum	objective	46
314	The reason Scrum is so popular is that it’s easy to understand, easy to implement, and easy to teach	objective	46
315	One could argue that Scrum is an inflexible, rigid process	objective	46
316	Software is supposed to be changeable	objective	46
317	Many software engineers are assigned to on-call rotations, where they need to be prepared to handle urgent customer calls during weekends or at night	goal	46
318	Software engineers are stressed	activity	46
319	Changing requirements can stress people out	goal	46
320	Technologies change very fast	objective	46
321	Engineers need to stay aware of all of them, regardless of their quality	goal	46
322	Many technologies that were fads are not used anymore	objective	46
323	Most engineers over 40 are experiencing burnout	task	46
324	One option for engineers over 40 is to go into management	resource	46
325	Another option for engineers over 40 is to keep job hopping to find something actually good	resource	46
326	The third option for engineers over 40 is to try to treat it like a hobby again rather than a job	resource	46
327	Speed dating is employer-friendly	goal	47
328	Junior developers are willing to put themselves in job opening categories	activity	47
329	Employers were confused by my unique/seasoned skills	activity	47
423	Javascript	resource	55
330	Senior label is for 5-6 years of experience	goal	47
331	Speed dating with employers	activity	47
332	I have more than 20 years of software development experience	objective	48
333	I have 19 years of user research experience	objective	48
334	Main gig idea is to help with various user research tasks	task	48
335	I can't get a job	goal	48
336	Looking for jobs	activity	48
337	Looking for gigs	activity	48
338	I thought about consulting on AI	activity	49
339	AI is trendy right now	objective	49
340	I have a lot of AI knowledge and experience	goal	49
341	Most people are not aware of the true risks of AI	goal	49
342	I thought about framing AI risks as high costs and low revenue	task	49
343	I thought about consulting for R&D/startups	activity	49
344	Most people are not aware of problem-solution and product-market fit	goal	49
345	I can't get a job	goal	49
346	I made several versions of this file	task	49
347	Rather than consult on saving money from AI, I decided to let the hype bubble burst	resource	49
348	I have > 20 years of R&D and startups	objective	49
349	I can't get a job	goal	50
350	I looked into consulting for local businesses	activity	50
351	I talked to several local businesses	task	50
352	Local businesses are not interested in tech help	resource	50
353	We were burned out/micromanaged at previous jobs	objective	51
354	So many of us quit to find something better	goal	51
355	Now we can't find any jobs	activity	51
356	Our main desire is to work remotely	goal	51
357	Thousands of applications for remote jobs	goal	51
358	40% of job listings are fake	goal	51
359	Many of us were laid off because of AI doing our work	objective	51
360	Employers like gig jobs because they don't have to pay benefits	objective	51
361	Many fake job listings are to collect resumes	objective	51
362	Other fake job listings are to make it look like the company is doing well	objective	51
363	Some of these fake listings have unicorn-like requirements	goal	51
364	Some suggest outright lying on your resume to meet these requirements	goal	51
365	Applicant tracking systems reject resumes due to missing keywords	goal	51
366	Some keywords might not even be on job listings	goal	51
367	Applicant tracking systems also compare us to "ideal candidate" profiles	goal	51
368	We need to be able to apply to many job listings	task	51
369	Our applying needs to be fast and immediately when they are posted	resource	51
370	We especially want to be confident in our applications	resource	51
371	To be a productive engineer	goal	53
372	To be an effective team leader	goal	53
373	To quickly and effectively accomplish engineering tasks I was given	goal	53
374	To make sure my teammates were not blocked	goal	53
375	Getting required tasks	activity	53
376	Getting schedules	activity	53
377	Checking in with teammates	activity	53
378	Standup meetings	task	53
379	Code reviews	task	53
380	Talking to platform engineers	task	53
381	Talking to my boss	task	53
382	Other meetings	task	53
383	Javascript	resource	53
384	Node.js	resource	53
385	The ability to talk to some of the platform engineers anytime I wanted	resource	53
386	AngularJS	resource	53
387	Remotely worked	goal	53
388	To learn how mature startups commercialize their technologies	objective	53
389	To be a productive product manager	goal	54
390	To ensure our product had great UX	goal	54
391	To ensure our product performed well	goal	54
392	Constantly doing heuristic UX reviews of the product	activity	54
393	Repeatedly measuring times between components	activity	54
394	Checking in with teammates	activity	54
395	Getting required tasks	activity	54
396	Standup meetings	task	54
397	Code reviews	task	54
398	Other meetings	task	54
399	Talking to my boss	task	54
400	Talking with executives	task	54
401	Javascript	resource	54
402	Java	resource	54
403	Freedom to design most things how I wanted	resource	54
404	To be a productive engineer	goal	54
405	To be an effective team leader	goal	54
406	To make sure my teammates were not blocked	goal	54
407	To quickly and effectively accomplish engineering tasks I was given	goal	54
408	AngularJS	resource	54
409	Worked in office	goal	54
410	To learn how mid-stage startups commercialize their technologies	objective	54
411	To be a productive engineer	goal	55
412	To be a productive UX designer	goal	55
413	To be a productive product lead	goal	55
414	To ensure our product had great UX	goal	55
415	To quickly and effectively accomplish engineering tasks I was given	goal	55
416	Constantly doing heuristic UX reviews of the product	activity	55
417	To design cross-platform (iPhone, iPad, laptop) user journeys	activity	55
418	Checking in with teammates	activity	55
419	Getting required tasks	activity	55
420	Standup meetings	task	55
421	Other meetings	task	55
422	Talking with executives	task	55
424	PHP	resource	55
425	Node.js	resource	55
426	The Collusion app	resource	55
427	Worked in office	goal	55
428	To learn how early-stage startups commercialize their technologies	objective	55
429	To apply my recently-gained HSI/government R&D knowledge to startups	objective	56
430	To be a productive engineer	goal	56
431	To be a productive assistant product lead	goal	56
432	To ensure our product had great UX	goal	56
433	To quickly and effectively accomplish engineering tasks I was given	goal	56
434	Constantly doing heuristic UX reviews of the product	activity	56
435	Checking in with teammates	activity	56
436	Getting required tasks	activity	56
437	Standup meetings	task	56
438	Other meetings	task	56
439	Talking with executives	task	56
440	Javascript	resource	56
441	D3.js	resource	56
442	Python	resource	56
443	Rserve	resource	56
444	Remotely worked	goal	56
445	Worked in office	goal	56
446	We need to acquire more information to decide to focus on opportunities	goal	57
447	We need to find, compare between, and decide whether or not to apply to jobs	goal	57
448	We need to target our application materials for each job to which we apply	goal	57
449	Cultural norms against leaving & NC agreements keep us from working for similar companies	objective	57
450	Seeking a better job is a tremendous commitment of time and energy	activity	57
451	Top developers are approached by recruiters on social media platforms like LinkedIn	objective	57
452	A solution is needed to more easily and quickly solicit additional information from recruiters	activity	57
453	A solution is needed to more easily apply to jobs via prioritization, and measuring their fitness for the job requirements across more opportunities	activity	57
454	A solution is needed to more easily adjust one’s application materials based directly on the job opportunities	activity	57
455	In the pandemic, 40-95% of workers wanted to quit their jobs	goal	58
456	Those who didn't want to quit their jobs because they are happy at their job or because they are paralyzed by the fear of not finding a new one	goal	58
457	Many employees became less happy because they are realizing that they prefer working from home while their employer is asking them to come back to the office	objective	58
458	Work conditions have become so bad that they are not sure how they can manage their jobs and their lives at the same time	objective	58
459	Lack of recognition for performing well at their job and lack of support for improving are becoming all too common	objective	58
460	Recruiting has pain points throughout the process	objective	63
461	Many of the problems exist after sourcing	goal	63
462	Uses GitHub to find candidates	resource	63
463	Uses LinkedIn to find candidates	resource	63
464	Teams often have no idea what they are looking for	goal	63
465	Existing systems largely miss the point	objective	63
466	Continues to rely on manual sourcing for his jobs	objective	63
467	Seems like recruiters need help at all levels	objective	63
468	Wants feedback collected from the recruiter	activity	63
469	Wants to group candidates into (ideal) personas over time	activity	63
470	Wants better initial sourcing	goal	63
471	Focused on early-stage/funded startups	objective	64
472	Pivoted to mostly founders	objective	64
473	Worked with CTOs on technical jobs to get skill requirements	activity	64
474	With CPO has to ask what does “product sense” mean to you?	activity	64
475	Recruiters’ biggest challenge is hiring managers	goal	64
476	First hiring manager challenge is lack of clarity and nepotism	activity	64
477	Second hiring manager challenge is wanting unicorns	activity	64
478	Recruiters can’t (yet?) be replaced by AI because of the human touch	resource	64
479	He’s found that recruiters don’t need his help on how to recruit	goal	64
480	Reach people on more online platforms	goal selected	68
481	Unify discussions from their posts	goal selected	68
482	Want to get the word out about important issues	objective selected	68
483	Need to be able to get people to take their posts seriously, trust them, and take action from them	activity	68
484	Need to provide context with posts	task	68
485	Need to make posts easily actionable	task	68
486	The Thorough, Multimodal Summary Reposter	resource	68
487	Adaptable Reliability & Context Visualizations	resource	68
488	This means implement meta-summaries, but the current idea is to cite personas here, not tasks		69
489	Visualize reliability on the article discussion page/screen		70
490	Visualize reliability on social media posts		70
491	Techies won't grow if they stay at one company in one domain	objective	71
492	Office work is stressful	objective	71
493	There are many roles because of Unrealistic Expectations	objective	71
494	There are many roles because of Unrealistic Expectations	objective	71
495	There are many roles because of Manipulative Practices	objective	71
496	There are many roles because of Unrealistic Expectations	objective	71
497	There are many roles because of Manipulative Practices	objective	71
498	There are many roles because of Overdigitalization of our lives	objective	71
\.


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.companies_id_seq', 16, true);


--
-- Name: evidence_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evidence_id_seq', 74, true);


--
-- Name: journeySteps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."journeySteps_id_seq"', 1, true);


--
-- Name: journeys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.journeys_id_seq', 6, true);


--
-- Name: personas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personas_id_seq', 24, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 6, true);


--
-- Name: stories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stories_id_seq', 21, true);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tasks_id_seq', 43, true);


--
-- Name: trends_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.trends_id_seq', 498, true);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: evidence evidence_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evidence
    ADD CONSTRAINT evidence_pkey PRIMARY KEY (id);


--
-- Name: journey_steps journeySteps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journey_steps
    ADD CONSTRAINT "journeySteps_pkey" PRIMARY KEY (id);


--
-- Name: journeys journeys_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journeys
    ADD CONSTRAINT journeys_pkey PRIMARY KEY (id);


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
-- Name: stories stories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: trends trends_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trends
    ADD CONSTRAINT trends_pkey PRIMARY KEY (id);


--
-- Name: journey_steps u_jid_tid; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journey_steps
    ADD CONSTRAINT u_jid_tid UNIQUE (journey_id, tag_id);


--
-- Name: journeys u_sid; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journeys
    ADD CONSTRAINT u_sid UNIQUE (story_id);


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
-- Name: tasks fk_pid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT fk_pid FOREIGN KEY (product_id) REFERENCES public.products(id) NOT VALID;


--
-- Name: evidence fk_pid_personas; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evidence
    ADD CONSTRAINT fk_pid_personas FOREIGN KEY (persona_id) REFERENCES public.personas(id) NOT VALID;


--
-- Name: journey_steps fk_sid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journey_steps
    ADD CONSTRAINT fk_sid FOREIGN KEY (journey_id) REFERENCES public.journeys(id) NOT VALID;


--
-- Name: journeys fk_sid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journeys
    ADD CONSTRAINT fk_sid FOREIGN KEY (story_id) REFERENCES public.stories(id) NOT VALID;


--
-- Name: evidence fk_sid_stories; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evidence
    ADD CONSTRAINT fk_sid_stories FOREIGN KEY (story_id) REFERENCES public.stories(id) NOT VALID;


--
-- PostgreSQL database dump complete
--

