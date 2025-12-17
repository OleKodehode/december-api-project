import { clearAllSessions } from "../src/services/sessionServices";

// Add in a function to clear all the backlog entries as well for testing

// Needs at least one test
test("Global cleanup", () => expect(true).toBe(true));

afterAll(() => {
  clearAllSessions();
  console.log("All tests are complete - Cleaning up the Active Sessions json");
});
