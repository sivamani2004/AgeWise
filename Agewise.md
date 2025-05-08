# AgeWise

LINK FOR DEMO VIDEO : "https://youtu.be/gEtYHSk9ATQ?si=QpfMBhpWGXx0LCre"


## Overview

AgeWise is a socially impactful, web-based platform tailored to empower senior citizens by enhancing their access to essential digital services. With a user-friendly interface inspired by WhatsApp and voice-enabled interaction, AgeWise bridges the digital divide for elderly users.

### Key Features

* **Government Services Access**: Easy-to-use links and guides to access central and state government schemes and digital portals.
* **Smart Reminders**: Users can set medication, appointment, or activity reminders via text or voice in a familiar chat-like layout.
* **Digital Literacy**: Access to tutorials and resources to develop digital skills for everyday online activities.
* **Voice-Enabled Navigation**: Speech recognition integration allows hands-free access and interaction with the platform.
* **Secure Authentication**: Google Sign-In (OAuth 2.0) for fast and secure user authentication.

AgeWise promotes digital inclusion and independence for older adults, enabling them to confidently engage with the digital world.

---

## Teammates / Contributors

| Name         | Ids         | Email                                |
|:-------------|:------------|:-------------------------------------|
| Chetan Naidu | se22uari137 | se22uari137@mahindrauniversity.edu.in|
| Rahul Kaja   | se22uari139 | se22uari139@mahindrauniversity.edu.in|
| Sivamani     | se22uari119 | se22uari119@mahindrauniversity.edu.in|
| Nandan       | se22uari001 | se22uari001@mahindrauniversity.edu.in|
| Goutham      | se22uari010 | se22uari010@mahindrauniversity.edu.in|

---

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- Firebase Realtime Database

### Authentication
- Google OAuth 2.0

### Additional Technologies
- Gemini API for chatbot
- ElevenLabs / Web Speech API for voice commands
- Complete voice navigation throughout website

---

## Prerequisites

Ensure the following tools are installed:

* **Node.js** (v14 or higher)
* **Git**
* **Firebase CLI**: `npm install -g firebase-tools`
* **Live Server**: `npm install -g live-server`

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/AgeWise.git
cd AgeWise/Project
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

---

## Configuration

### 1. Use the given `.env` file in `backend/` directory:

### 2. Firebase Client SDK

Firebase Client SDK is already integrated in the HTML and JS files.

---

## Running the Project Locally

You need to run both the backend server and the frontend with live preview.

### Step 1: Start the Backend Server

```bash
cd Project/backend
npm start
```
Backend runs at: `http://localhost:3000`

### Step 2: Start the Frontend with Live Server

In a new terminal:

```bash
cd Project
live-server
```

Frontend runs at: `http://127.0.0.1:PORT` (auto reload enabled)

> **Important**: Ensure both frontend and backend are running for full functionality.

---

## Project Structure

```
Project/
├── index.html
├── login.html
├── reminders.html
├── resources.html
├── tutorials.html
├── community.html
├── wellness.html
├── styles.css
├── gemini.js
├── translate.js
├── reminder_db.js
├── reminder_guest.js
├── auth.js
├── community.js
├── tutorials.js
├── zoom.js
├── news.js
├── assets/
│   ├── image.jpg
│   └── sounds/
│       └── start.mp3

├── client_secret_*.json
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env
```

---

## Dependencies

### Backend
* `express`
* `dotenv`
* `cors`
* `jsonwebtoken`
* `passport`
* `passport-google-oauth20`
* `firebase-admin`
* `body-parser`
* `nodemon` *(for development)*

### Frontend
* Firebase Client SDK
* Web Speech API
* `live-server` *(for local testing)*

---

## Scripts

| Command       | Description                               |
|:--------------|:------------------------------------------|
| `npm start`   | Start backend server                      |  |
| `live-server` | Run frontend with live reload             |

---

## Documentation

This repository includes:
* Codebase (Project directory)
* Software Requirements Specification (SRS)
* Software Requirements Document (SDD)
* Test Documentation
* Problem statement

---

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Create a Pull Request

---

## Contact

Have questions, feedback, or want to collaborate? Contact the Project Lead at se22uari137@mahindrauniversity.edu.in
