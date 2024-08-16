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
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name) FROM stdin;
1	Datagotchi Labs
2	PMBoard
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
\.


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.companies_id_seq', 5, true);


--
-- Name: evidence_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evidence_id_seq', 26, true);


--
-- Name: personas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personas_id_seq', 7, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 2, true);


--
-- Name: stories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stories_id_seq', 14, true);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tasks_id_seq', 26, true);


--
-- Name: trends_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.trends_id_seq', 177, true);


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
-- Name: evidence fk_sid_stories; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evidence
    ADD CONSTRAINT fk_sid_stories FOREIGN KEY (story_id) REFERENCES public.stories(id) NOT VALID;


--
-- PostgreSQL database dump complete
--

