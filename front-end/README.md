# Periodic Tables - Frontend

This is the frontend application for the Periodic Tables project, a restaurant reservation management system. This project was developed using React and communicates with a backend API to manage reservations and tables for a fine dining restaurant.

## Technologies Used

- JSX
- React.js
- Axios

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/periodic-tables-frontend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd periodic-tables-frontend
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file and set the `REACT_APP_API_BASE_URL` to point to your backend API.

5. Start the development server:
   ```bash
   npm start
   ```

## Usage

The application provides an interface for managing restaurant reservations and tables. Users can create, view, update, and cancel reservations, as well as manage table statuses.

## API

### listReservations

Fetches a list of reservations based on the provided query parameters.

**Parameters:**

- `params` (Object): Query parameters for listing reservations.
- `signal` (AbortSignal): Optional abort signal to cancel the request.

**Returns:**

- `Promise<any[]>`: The list of reservations.

### listTables

Fetches a list of all tables.

**Parameters:**

- `signal` (AbortSignal): Optional abort signal to cancel the request.

**Returns:**

- `Promise<any[]>`: The list of tables.

### finishTable

Marks a table as finished.

**Parameters:**

- `table_id` (number): The ID of the table to mark as finished.
- `signal` (AbortSignal): Optional abort signal to cancel the request.

**Returns:**

- `Promise<any>`: The response data.

### updateReservationStatus

Updates the status of a reservation.

**Parameters:**

- `reservation_id` (number): The ID of the reservation to update.
- `status` (string): The new status of the reservation.
- `signal` (AbortSignal): Optional abort signal to cancel the request.

**Returns:**

- `Promise<any>`: The response data.

### getReservation

Retrieves a reservation by its ID.

**Parameters:**

- `reservation_id` (number): The ID of the reservation to retrieve.
- `signal` (AbortSignal): Optional abort signal to cancel the request.

**Returns:**

- `Promise<any>`: The reservation data.

### updateReservation

Updates a reservation.

**Parameters:**

- `reservation_id` (number): The ID of the reservation to update.
- `data` (Object): The updated reservation data.
- `signal` (AbortSignal): Optional abort signal to cancel the request.

**Returns:**

- `Promise<any>`: The response data.

### cancelReservation

Cancels a reservation.

**Parameters:**

- `reservation_id` (number): The ID of the reservation to cancel.
- `signal` (AbortSignal): Optional abort signal to cancel the request.

**Returns:**

- `Promise<any>`: The response data.

## Custom Hooks

### useQuery

A custom hook to parse URL query parameters.

**Usage Example:**

```javascript
const query = useQuery();
const date = query.get("date");
```

**Returns:**

- `URLSearchParams`: The URLSearchParams instance.

## Utilities

### formatReservationDate

Formats the `reservation_date` property of a reservation.

**Parameters:**

- `reservations` (Object|Object[]): A reservation or an array of reservations.

**Returns:**

- `Object|Object[]`: The formatted reservation(s).

### formatReservationTime

Formats the `reservation_time` property of a reservation.

**Parameters:**

- `reservations` (Object|Object[]): A reservation or an array of reservations.

**Returns:**

- `Object|Object[]`: The formatted reservation(s).

### validateReservationDate

Validates the reservation date.

**Parameters:**

- `date` (string): The date to validate.

**Returns:**

- `string|null`: The validation error message, or null if valid.

### validateReservationTime

Validates the reservation time.

**Parameters:**

- `date` (string): The date of the reservation.
- `time` (string): The time of the reservation.

**Returns:**

- `string|null`: The validation error message, or null if valid.
