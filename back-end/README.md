# Periodic Tables Backend

This is the backend for the Restaurant Reservation System, a capstone project for the Thinkful curriculum. The backend is built using Node.js, Express, and Knex.js, and it connects to a PostgreSQL database.

## Technologies Used

- Node.js
- Express.js
- Knex.js
- PostgreSQL

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/loganprit/periodic-tables.git
   ```
2. Navigate to the backend directory:
   ```bash
   cd back-end
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the backend directory and set up the following environment variables (use `.env.sample` as a reference):

```env
DATABASE_URL=your_database_url
NODE_ENV=development
```

## Database Setup

### Migrations

Run the database migrations to create the necessary tables:

```bash
knex migrate:latest
```

### Seeding

Seed the database with initial data:

```bash
knex seed:run
```

## Running the Application

Start the application:

```bash
npm start
```

The server will start on port 5000 by default.

## Validation Logic

The backend includes validation logic for reservation dates and times. The validation ensures that reservations are made for future dates and within the restaurant's operating hours.

### Date Validation

The `dateValidation.js` file includes functions to validate reservation dates:

- `isValidDate(dateString)`: Checks if the date string is in the correct format.
- `isValidTime(timeString)`: Checks if the time string is in the correct format.
- `validateReservationDate(date)`: Ensures the reservation date is in the future and not on a Tuesday.

### Time Validation

The `timeValidation.js` file includes functions to validate reservation times:

- `validateReservationTime(date, time)`: Ensures the reservation time is within the restaurant's operating hours and in the future.
