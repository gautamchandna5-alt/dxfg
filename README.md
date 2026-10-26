# Wind Forecast Dashboard - UK Energy Market

**Live Links**

* **Frontend (Vercel):** [https://dxfg-sigma.vercel.app/]
* **Backend API (Render):** [https://energy-dashboard-gtze.onrender.com]

**Architecture Overview**
This project features a React (Vite) frontend and a Django REST Framework (DRF) backend. It utilizes a local SQLite database for data caching, ensuring instantaneous API responses and zero mid-session rate-limiting when parsing the Elexon API's 30-minute settlement blocks.

**Directory Structure**

* **/frontend:** Contains the Vite/React application, Framer Motion animations, Recharts configurations, and dark mode state management.
* **/backend:** Contains the Django project (`core`), the DRF application (`api`), Docker environment configurations, and the SQLite database.
* **/backend/api/management/commands/fetch_january_data.py:** Custom Django management command that requests, normalizes, forward-fills missing intervals, and merges the Elexon `FUELHH` (actuals) and `WINDFOR` (forecasts) datasets into the caching layer using `update_or_create`.

**How to Start Locally**
Ensure Docker Desktop is running, navigate to the root directory, and execute the following commands to build the containers, apply database schemas, and seed the local cache:

1. `docker-compose up --build -d`
2. `docker-compose exec backend python3 manage.py migrate`
3. `docker-compose exec backend python3 manage.py fetch_january_data`(this may take some time)

**AI Disclosure**
As permitted in the requirements, I used AI tools (Gemini) to assist with brainstorming the Django data-caching strategy, scaffolding boilerplate Docker configurations, and reviewing semantic HTML best practices.

