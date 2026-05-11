--
-- PostgreSQL database dump
--

\restrict Po8MMbiba8jzFcWT5h0U6ACVIXYTdxd5AJFT0JgcZ19RzfDeGtupjFgT8Hisk4c

-- Dumped from database version 16.13 (Homebrew)
-- Dumped by pg_dump version 16.13 (Homebrew)

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
-- Name: topup_orders; Type: TABLE; Schema: public; Owner: fakhrullm
--

CREATE TABLE public.topup_orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    merchant_ref character varying(100),
    amount numeric(15,2),
    payment_method character varying(50),
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.topup_orders OWNER TO fakhrullm;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: fakhrullm
--

CREATE TABLE public.transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    phone_number character varying(20),
    product_code character varying(50),
    amount numeric(15,2),
    status character varying(20) DEFAULT 'pending'::character varying,
    provider_ref character varying(100),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.transactions OWNER TO fakhrullm;

--
-- Name: users; Type: TABLE; Schema: public; Owner: fakhrullm
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255),
    avatar text,
    role character varying(20) DEFAULT 'seller'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'seller'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO fakhrullm;

--
-- Name: wallet_logs; Type: TABLE; Schema: public; Owner: fakhrullm
--

CREATE TABLE public.wallet_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    type character varying(10),
    amount numeric(15,2),
    description text,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT wallet_logs_type_check CHECK (((type)::text = ANY ((ARRAY['credit'::character varying, 'debit'::character varying])::text[])))
);


ALTER TABLE public.wallet_logs OWNER TO fakhrullm;

--
-- Name: wallets; Type: TABLE; Schema: public; Owner: fakhrullm
--

CREATE TABLE public.wallets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    balance numeric(15,2) DEFAULT 0,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.wallets OWNER TO fakhrullm;

--
-- Name: withdrawals; Type: TABLE; Schema: public; Owner: fakhrullm
--

CREATE TABLE public.withdrawals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    amount numeric(15,2),
    bank_name character varying(50),
    bank_account character varying(50),
    status character varying(20) DEFAULT 'pending'::character varying,
    approved_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.withdrawals OWNER TO fakhrullm;

--
-- Data for Name: topup_orders; Type: TABLE DATA; Schema: public; Owner: fakhrullm
--

COPY public.topup_orders (id, user_id, merchant_ref, amount, payment_method, status, created_at) FROM stdin;
755e842f-f970-47a2-8263-f049d7b8f59c	22134973-3360-4a31-9118-c75d2bc4b5bb	TOPUP-1778332197552	50000.00	QRIS	pending	2026-05-09 20:09:57.55313
9726bedd-fbb2-4bec-ad3f-a5561c8310b1	e0e390de-77cc-4b41-ac7b-daf44d6565ff	TOPUP-1778333131801	100000.00	QRIS	pending	2026-05-09 20:25:31.808918
db605f59-3e5d-4fcc-9542-7028a6bf2173	e0e390de-77cc-4b41-ac7b-daf44d6565ff	TOPUP-1778375072374	1000000.00	QRIS	pending	2026-05-10 08:04:32.384071
89a81585-3688-4e67-b442-d9a486af4e3f	e0e390de-77cc-4b41-ac7b-daf44d6565ff	TOPUP-1778459953164	100000.00	QRIS	pending	2026-05-11 07:39:13.165029
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: fakhrullm
--

COPY public.transactions (id, user_id, phone_number, product_code, amount, status, provider_ref, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: fakhrullm
--

COPY public.users (id, name, email, password, avatar, role, created_at) FROM stdin;
22134973-3360-4a31-9118-c75d2bc4b5bb	admin	admin@gmail.com	$2b$12$HVry7q9VyG5CDa2fBZBj4OcjjcHvN1IPeLuv0gJrXJpMRPnxwBV8.	\N	seller	2026-05-09 20:00:05.313416
9799c1e9-2279-48e0-9826-c73ce5b39cda	Admin Pulsa	admin@pulsa.com	$2b$12$6SsI6Fnk6mlrVzy4YyoXVe8z/kLTgvywPoAh3eZAZSKXEuCxy2efq	\N	admin	2026-05-09 20:21:22.218451
e0e390de-77cc-4b41-ac7b-daf44d6565ff	Seller 1	seller@pulsa.com	$2b$12$QZJ.IBL5GB73rAGboiBAOeZ5k16QcvCIs6GihuKsZKwsfT/2stjKK	\N	seller	2026-05-09 20:22:54.144756
095f0588-4c6e-4d4f-a0c7-b24126424ae2	fakhrul	fakhrul@gmail.com	$2b$12$94gpagEoGyYrp1KolgL1wOpZjzkvOYt6BwiH6SNuv19dSYYdyDbhO	\N	seller	2026-05-10 08:15:08.197857
\.


--
-- Data for Name: wallet_logs; Type: TABLE DATA; Schema: public; Owner: fakhrullm
--

COPY public.wallet_logs (id, user_id, type, amount, description, created_at) FROM stdin;
\.


--
-- Data for Name: wallets; Type: TABLE DATA; Schema: public; Owner: fakhrullm
--

COPY public.wallets (id, user_id, balance, updated_at) FROM stdin;
\.


--
-- Data for Name: withdrawals; Type: TABLE DATA; Schema: public; Owner: fakhrullm
--

COPY public.withdrawals (id, user_id, amount, bank_name, bank_account, status, approved_at, created_at) FROM stdin;
\.


--
-- Name: topup_orders topup_orders_merchant_ref_key; Type: CONSTRAINT; Schema: public; Owner: fakhrullm
--

ALTER TABLE ONLY public.topup_orders
    ADD CONSTRAINT topup_orders_merchant_ref_key UNIQUE (merchant_ref);


--
-- Name: topup_orders topup_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: fakhrullm
--

ALTER TABLE ONLY public.topup_orders
    ADD CONSTRAINT topup_orders_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: fakhrullm
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: fakhrullm
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: fakhrullm
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: wallet_logs wallet_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: fakhrullm
--

ALTER TABLE ONLY public.wallet_logs
    ADD CONSTRAINT wallet_logs_pkey PRIMARY KEY (id);


--
-- Name: wallets wallets_pkey; Type: CONSTRAINT; Schema: public; Owner: fakhrullm
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_pkey PRIMARY KEY (id);


--
-- Name: withdrawals withdrawals_pkey; Type: CONSTRAINT; Schema: public; Owner: fakhrullm
--

ALTER TABLE ONLY public.withdrawals
    ADD CONSTRAINT withdrawals_pkey PRIMARY KEY (id);


--
-- Name: topup_orders topup_orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fakhrullm
--

ALTER TABLE ONLY public.topup_orders
    ADD CONSTRAINT topup_orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: transactions transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fakhrullm
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: wallet_logs wallet_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fakhrullm
--

ALTER TABLE ONLY public.wallet_logs
    ADD CONSTRAINT wallet_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: wallets wallets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fakhrullm
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: withdrawals withdrawals_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fakhrullm
--

ALTER TABLE ONLY public.withdrawals
    ADD CONSTRAINT withdrawals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict Po8MMbiba8jzFcWT5h0U6ACVIXYTdxd5AJFT0JgcZ19RzfDeGtupjFgT8Hisk4c

