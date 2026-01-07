export default async function globalTeardown() {
  try {
    console.log(
      "All tests are complete - Cleaning up the Active Sessions & Backlog jsons"
    );

    const sessionServices = await import("../services/sessionServices.ts");
    const backlogServices = await import("../services/backlogService.ts");

    sessionServices.clearAllSessions();
    backlogServices.clearAllEntries();
  } catch (err) {
    console.error("Issue when trying to clean up:\n", err);
  }
}
