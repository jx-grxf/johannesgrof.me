// The Halloween drop: a public TestFlight link for ÖffiGo with a tester limit
// set in App Store Connect, so the cap is real and enforced by Apple, not by
// this site. Nothing renders while `testflightUrl` is null. The number on the
// page must match the limit configured for the link.
export const halloweenDrop: { testflightUrl: string | null; places: number } = {
  testflightUrl: null,
  places: 71,
};
