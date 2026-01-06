import { clearAllSessions } from "../services/sessionServices.ts";
import { clearAllEntries } from "../services/backlogService.ts";

export default function globalTeardown() {
  clearAllSessions();
  clearAllEntries();
  console.log(
    "All tests are complete - Cleaning up the Active Sessions & Backlog jsons"
  );
}
