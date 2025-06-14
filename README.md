# Smart Visitor Management System

A modern visitor management system that streamlines the process of managing visitors in organizations, buildings, or facilities.

## Project Structure

The project is organized into two main components:

- `frontend/`: Contains the frontend application
- `Backend/`: Contains the Spring Boot backend application

## Backend

The backend is built using:

- Java Spring Boot
- Maven for dependency management
- Docker support for containerization

### Prerequisites

- Java JDK 17 or higher
- Maven
- Docker (optional)

### Running the Backend

1. Navigate to the Backend directory:

```bash
cd Backend
```

2. Build the project:

```bash
./mvnw clean install
```

3. Run the application:

```bash
./mvnw spring-boot:run
```

Alternatively, you can use Docker:

```bash
docker build -t smart-visitor-backend .
docker run -p 8080:8080 smart-visitor-backend
```

## Frontend

The frontend application is located in the `frontend/smartvisitor` directory.

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Running the Frontend

1. Navigate to the frontend directory:

```bash
cd frontend/smartvisitor
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm start
# or
yarn start
```

## Features

- Visitor registration and check-in
- Host notification system
- Visitor tracking and management
- Digital visitor badges
- Visit history and reporting
- Real-time visitor monitoring

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
