# Periodic Tables

## Live Application

[Link to live application](https://restaurant-reservation-frontend-v5ci.onrender.com/)

## Summary

Periodic Tables is a restaurant reservation system designed to manage reservations and table assignments for fine dining restaurants. Users can create, update, and cancel reservations, as well as assign reservations to tables. The application ensures that reservation times and dates are validated for availability and correctness.

## Features

- Create, update, and cancel reservations
- Assign reservations to tables
- Validate reservation times and dates
- Search for reservations by phone number

## API Documentation

For detailed API documentation, please refer to the respective backend and frontend README files:

- [Backend README](/back-end/README.md)
- [Frontend README](/front-end/README.md)

## Screenshots

### Desktop

- **Home Page**
  ![Home Page - Desktop](/images/desktop-home.jpg)
- **Dashboard Page**
  ![Dashboard Page - Desktop](/images/desktop-dashboard.jpg)
- **Search Page**
  ![Search Page - Desktop](/images/desktop-search.jpg)
- **New Reservation Page**
  ![New Reservation Page - Desktop](/images/desktop-new-reservation.jpg)
- **New Table Page**
  ![New Table Page - Desktop](/images/desktop-new-table.jpg)

### Mobile

- **Home Page**
  ![Home Page - Mobile](/images/mobile-home.jpg)
- **Dashboard Page**
  ![Dashboard Page - Mobile](/images/mobile-dashboard.jpg)
- **Search Page**
  ![Search Page - Mobile](/images/mobile-search.jpg)
- **New Reservation Page**
  ![New Reservation Page - Mobile](/images/mobile-new-reservation.jpg)
- **New Table Page**
  ![New Table Page - Mobile](/images/mobile-new-table.jpg)

## Technology Stack

- **Frontend**: React, CSS
- **Backend**: Node.js, Express.js, Knex.js
- **Database**: PostgreSQL
- **Deployment**: Vercel (for frontend), Heroku (for backend)

## Installation Instructions

### Backend

1. Clone the repository: `git clone https://github.com/loganprit/periodic-tables/tree/main`
2. Navigate to the backend directory: `cd back-end`
3. Install dependencies: `npm install`
4. Set up environment variables in a `.env` file (use `.env.sample` as a reference)
5. Run the migrations: `knex migrate:latest`
6. Seed the database: `knex seed:run`

### Frontend

1. Navigate to the frontend directory: `cd front-end`
2. Install dependencies: `npm install`

### Start the Application

1. Start the application from the home directory: `npm start`

## Additional Notes

- Future improvements include implementing smooth transition animations between pages and the ability to search by last name.
- Credits to the Thinkful team for guidance and support.
