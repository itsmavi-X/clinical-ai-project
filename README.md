# Clinical AI Project

Clinical AI Project is a full-stack web application that analyzes patient symptoms with an AI-assisted workflow, stores diagnosis history, and presents results in a clean React dashboard.

The project combines a Spring Boot backend, a React + Vite frontend, MySQL persistence, and OpenAI-powered symptom interpretation through Spring AI.

## Overview

This application is built for a simple clinical-assistant style workflow:

- Enter patient details and symptoms
- Send the case to the backend for AI analysis
- Return a structured response with disease, severity, recommendation, and confidence
- Store each result in MySQL for later review
- View and delete previous diagnosis records from the history panel

## Features

- AI-powered symptom analysis using Spring AI + OpenAI
- Structured JSON response parsing for predictable results
- Persistent diagnosis history with MySQL and Spring Data JPA
- REST API for analysis, history, deletion, and health checks
- Modern React UI with Vite, Tailwind CSS, and toast notifications
- Clean separation between backend services and frontend presentation

## Tech Stack

**Frontend**

- React 18
- Vite
- Axios
- Tailwind CSS
- react-hot-toast

**Backend**

- Java 17
- Spring Boot 3
- Spring Web
- Spring Data JPA
- Spring AI
- MySQL
- Maven

## Project Structure

```text
clinical-ai-project/
|-- backend/
|   |-- src/main/java/com/clinical/ai/
|   |   |-- config/
|   |   |-- controller/
|   |   |-- dto/
|   |   |-- model/
|   |   |-- repository/
|   |   `-- service/
|   `-- src/main/resources/application.properties
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   `-- services/
|   |-- package.json
|   `-- vite.config.js
`-- README.md
```

## How It Works

1. The frontend sends symptom data to `POST /api/analyze`.
2. The backend builds a prompt and sends it to the configured OpenAI model through Spring AI.
3. The AI response is parsed into a strict JSON structure.
4. The result is saved as a diagnosis record in MySQL.
5. The frontend displays the analysis and lets users review past records from history.

## Prerequisites

Before running the project locally, make sure you have:

- Java 17+
- Maven 3.9+
- Node.js 18+ and npm
- MySQL 8+
- An OpenAI API key

## Backend Setup

Create a MySQL database:

```sql
CREATE DATABASE clinical_ai_db;
```

Update the backend configuration in `backend/src/main/resources/application.properties`:

- Set your MySQL username and password
- Replace `YOUR_OPENAI_API_KEY` with your real API key
- Keep the frontend origin aligned with your local frontend URL

Default backend settings currently expect:

- Backend port: `8081`
- Database: `clinical_ai_db`
- Frontend origin: `http://localhost:5173`

Start the backend:

```bash
cd backend
mvn spring-boot:run
```

The backend will be available at:

```text
http://localhost:8081
```

## Frontend Setup

Install dependencies and start the frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend will usually run at:

```text
http://localhost:5173
```

## API Endpoints

### `POST /api/analyze`

Analyze symptoms and create a diagnosis record.

Example request:

```json
{
  "patientName": "John Doe",
  "age": 32,
  "symptoms": "fever, sore throat, fatigue",
  "duration": "2 days"
}
```

Example response:

```json
{
  "id": 1,
  "patientName": "John Doe",
  "age": 32,
  "symptoms": "fever, sore throat, fatigue",
  "duration": "2 days",
  "disease": "Viral upper respiratory infection",
  "severity": "MODERATE",
  "recommendation": "Rest, hydrate, monitor symptoms, and consult a doctor if symptoms worsen.",
  "confidence": 0.82,
  "createdAt": "2026-04-13 15:10:00",
  "success": true
}
```

### `GET /api/history`

Fetch all saved diagnosis records ordered by newest first.

### `DELETE /api/history/{id}`

Delete a stored diagnosis record by ID.

### `GET /api/health`

Simple health-check endpoint.

## Development Notes

- The frontend API client is configured to call `http://localhost:8081/api`
- The backend currently uses `spring.jpa.hibernate.ddl-auto=update`
- Diagnosis output is AI-generated and should not be treated as professional medical advice
- The service expects the model to return JSON and includes cleanup logic for markdown-wrapped responses

## Important Configuration Note

If this repository is going to be shared publicly, avoid committing real secrets such as:

- OpenAI API keys
- Database passwords
- production-only hostnames

For a cleaner production-ready setup, move secrets into environment variables or a local untracked config file.

## Future Improvements

- Add authentication for clinician or patient access
- Add validation and safer prompt-guarding for medical responses
- Add Docker support for one-command local setup
- Add unit and integration tests for API and service logic
- Add environment-based configuration profiles

## Disclaimer

This project provides AI-assisted symptom analysis for educational and demonstration purposes. It is not a substitute for professional medical diagnosis, treatment, or emergency care.
