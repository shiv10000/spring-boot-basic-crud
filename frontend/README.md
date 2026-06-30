# Jobly frontend

## Run locally

Start the Spring Boot API from the repository root:

```bash
./mvnw spring-boot:run
```

Then start the React app:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Vite proxies `/api` requests to the backend at
http://localhost:8080.
