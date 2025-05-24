# ft_transcendence
ft_transcendence is a full-stack web project developed as part of the 42 curriculum. It is designed to showcase advanced concepts in web development, real-time communication, and user authentication by building a multi-functional platform inspired by pong game and social features.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Project Overview
The goal of ft_transcendence is to create a real-time, multiplayer pong game where users can authenticate, challenge each other, and social features. The project emphasizes teamwork, using modern technologies, and applying best practices in web development.

# Features
- Real-time communication using WebSockets
- Multiplayer game
- User profile management
- Friends system and chat functionalities

## Technologies
- Frontend: TypeScript, Tailwind
- Backend: Node.js, Fastify
- Database: SQLite
- Other: Docker, Git

## Installation
### Prerequisites
- Docker and Docker Compose
- Make CLI

### Setup
1. Clone the repository
   ```bash
   git clone https://github.com/DailyCraft/ft_transcendence
   cd ft_transcendence
   ```

2. Create .env file\
   Copy the `./backend/.env.example` to `./backend/.env` and fill with correct values.

3. Start server
   ```bash
   make up
   ```

## Usage
- Visit https://localhost:8443 to access the app.
- Create an account.
- Challenge other users to game or chat with friends.

## Development
### Prerequisites
- Node.js (v22 or higher)
- OpenSSL CLI

### Setup
To run the project locally without Docker, follow these steps:

1. Install dependencies
   ```bash
   cd backend
   npm ci
   cd ../frontend
   npm ci
   ```

2. Create SSL certificate
   ```bash
   openssl req -x509 -nodes \
       -out ./frontend/fullchain.crt \
       -keyout ./frontend/privkey.key \
       -subj "/C=FR/ST=Occitanie/L=Perpignan/O=42/OU=42 Perpignan/CN=ft_transcendence/UID=ft_transcendence"
   ```

3. Launch the development servers\
   Start the backend:
   ```bash
   cd backend
   npm run dev
   ```
   > **Tip:**\
   > If the backend crash after launching it with docker, remove the `nodes_modules` directory and rerun `npm ci`.
   
   Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

4. Access the application\
Open your browser and navigate to:
http://localhost:8000

## Contributing
Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is for educational purposes as part of the 42 curriculum and is not licensed for commercial use.