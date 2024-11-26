/**
 * Validates that the environment variables are set and of correct type
 * @throws Error if environment variables are invalid or missing
 */
export function validateEnv(): void {
  // Validate DATABASE_URL
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  // Validate NODE_ENV
  const validEnvironments = ["development", "test", "preview", "production"] as const;
  if (!process.env.NODE_ENV || !validEnvironments.includes(process.env.NODE_ENV as any)) {
    throw new Error(
      `NODE_ENV must be one of: ${validEnvironments.join(", ")}`
    );
  }

  // Validate PORT if provided
  if (process.env.PORT && isNaN(parseInt(process.env.PORT, 10))) {
    throw new Error("PORT must be a number if provided");
  }
}
