import { clearAllSessions } from "../services/sessionServices";
import { clearAllEntries } from "../services/backlogService";

export default function globalTeardown() {
  clearAllSessions();
  clearAllEntries();
  console.log(
    "All tests are complete - Cleaning up the Active Sessions & Backlog jsons"
  );
}
