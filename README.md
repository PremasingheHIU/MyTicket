# MyTicket — Movie Ticket Booking Application

## 1. Project Overview

MyTicket is a web-based movie ticket booking application developed as an individual mini project for the Web Application Development module (EE4207).

The application allows users to browse available movies, search for movies, book tickets for selected screening dates and times, and view their booking details. Administrators can manage the movie collection through an administrative dashboard.

The application uses the MERN stack, consisting of MongoDB, Express.js, React.js and Node.js.

## 2. Main Features

### User Features
- User registration and login.
- Browse available movies.
- Search movies by title.
- View movie information and ticket prices.
- Book tickets by selecting a movie, screening date, screening time and ticket quantity.
- View personal booking history.
- Log out securely from the application.

### Administrator Features
- Access the administrator dashboard.
- Add new movies.
- View the movie collection.
- Edit existing movie details.
- Delete movies.

### Validation and Security
- JWT-based authentication.
- Role-based access control for administrator operations.
- Server-side validation of booking details.
- Validation of screening dates and ticket quantities.
- Restriction of booking access to authenticated users.
- Filtering of booking records so users can access their own bookings.

## 3. Technologies Used

| Technology | Purpose |
| MongoDB | Persistent database storage |
| Express.js | Backend API development |
| React.js | Frontend user interface |
| Node.js | Backend JavaScript runtime |
| Mongoose | MongoDB data modelling |
| JSON Web Token (JWT) | User authentication |
| CSS | Application styling |
| Vite | Frontend development server |
| Git and GitHub | Version control and source code hosting |

## 4. Project Structure


MyTicket/
├── BackEnd/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── FrontEnd/
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── package.json
├── .gitignore
└── README.md


The backend handles API requests, authentication, authorization, data validation and database operations. The frontend provides the user interface for movie browsing, booking and administrator movie management.

## 5. Database Design

The application uses MongoDB to store user, movie and booking information.

- **User:** Stores user account information, including authentication details and role.
- **Movie:** Stores movie information, including title, genre, duration, description, poster and ticket price.
- **Booking:** Stores booking information, including customer details, selected movie, screening date, screening time, ticket quantity, total price and associated user.

Bookings reference the selected movie and, for newly created bookings, the user who made the booking.

## 6. Installation and Setup

### Prerequisites

Install the following software before running the application:

- Node.js and npm.
- Git.
- A MongoDB database, such as MongoDB Atlas.
- A code editor such as Visual Studio Code.

### Step 1: Clone the Repository


git clone https://github.com/PremasingheHIU/MyTicket.git
cd MyTicket



### Step 2: Configure the Backend

Open a terminal and navigate to the backend directory:


cd BackEnd
npm install


Create a `.env` file in the backend directory and configure the environment variables required by the application, including the MongoDB connection string and JWT secret.

Use the exact environment variable names expected by the backend source code. Do not publish database credentials or authentication secrets.

### Step 3: Start the Backend

Run the backend using the start command defined in `BackEnd/package.json`.

For example, if the project defines a development script:


npm run dev


The backend API is configured to run on:

`http://localhost:5000`

### Step 4: Start the Frontend

Open a second terminal:


cd FrontEnd
npm install
npm run dev


Open the local address displayed by Vite. The current development configuration uses:

`http://localhost:5173`

## 7. API Overview

The application provides API endpoints for user authentication, movie management and ticket bookings.

| Endpoint | Purpose |
|---|---|
| `/api/movies` | Retrieve available movies |
| `/api/movies` | Create a movie using the administrator-protected POST operation |
| `/api/movies/:id` | Update or delete a movie using administrator-protected operations |
| `/api/bookings` | Create a booking or retrieve the authenticated user's bookings |
| `/api/bookings/:id` | Retrieve a booking belonging to the authenticated user |

Authentication endpoints are also provided for user registration and login.

## 8. Security Considerations

The application uses JWT authentication to identify logged-in users. Administrator-only movie management operations are protected by role-based authorization.

Booking records are filtered by the authenticated user's identity. Passwords and authentication secrets should not be committed to the public repository.

## 9. Conclusion

MyTicket demonstrates the development of a full-stack web application using the MERN stack. It combines persistent database storage, REST API development, authentication, authorization, data validation and user interface design to support movie browsing, ticket booking and movie administration.