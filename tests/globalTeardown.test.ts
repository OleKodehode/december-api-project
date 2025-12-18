import { clearAllSessions } from "../src/services/sessionServices";
import { clearAllEntries } from "../src/services/backlogService";

// Needs at least one test
test("Global cleanup", () => expect(true).toBe(true));

afterAll(() => {
  clearAllSessions();
  clearAllEntries();
  console.log("All tests are complete - Cleaning up the Active Sessions json");
});
