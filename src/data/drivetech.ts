// DriveTech's defaults, copied from mod/lua/vehicle/driveTech/config.lua at
// v1.0.0 (jx-grxf/beamng-drivetech). The page draws its curves from these
// numbers with the same formulas the mod runs, so a change in the mod has to be
// mirrored here by hand.

export type ProfileKey = "eco" | "comfort" | "sport" | "sportPlus";
export type StabilityKey = "dsc" | "dtc" | "off";

export interface DriveProfile {
  key: ProfileKey;
  name: string;
  pedal: { exponent: number; gain: number; maxPartThrottle: number; riseRate: number };
  shift: { holdTime: number; decay: number; floor: number; brakeDownshift: boolean };
  startStop: boolean;
  coasting: boolean;
}

export const kickdownPedal = 0.97;

export const profiles: DriveProfile[] = [
  {
    key: "eco",
    name: "ECO PRO",
    pedal: { exponent: 1.6, gain: 0.9, maxPartThrottle: 0.8, riseRate: 1.5 },
    shift: { holdTime: 0.2, decay: 2.5, floor: 0, brakeDownshift: false },
    startStop: true,
    coasting: true,
  },
  {
    key: "comfort",
    name: "COMFORT",
    pedal: { exponent: 1.2, gain: 1.0, maxPartThrottle: 1.0, riseRate: 3 },
    shift: { holdTime: 0.5, decay: 1.5, floor: 0, brakeDownshift: false },
    startStop: true,
    coasting: false,
  },
  {
    key: "sport",
    name: "SPORT",
    pedal: { exponent: 0.9, gain: 1.05, maxPartThrottle: 1.0, riseRate: 8 },
    shift: { holdTime: 3.0, decay: 0.35, floor: 0.35, brakeDownshift: true },
    startStop: false,
    coasting: false,
  },
  {
    key: "sportPlus",
    name: "SPORT+",
    pedal: { exponent: 0.75, gain: 1.1, maxPartThrottle: 1.0, riseRate: 20 },
    shift: { holdTime: 6.0, decay: 0.15, floor: 0.55, brakeDownshift: true },
    startStop: false,
    coasting: false,
  },
];

export interface StabilityMode {
  key: StabilityKey;
  name: string;
  /** Minimum lock of the AWD clutch, 0..1. */
  xdriveLock: number;
  /** Front/rear wheel speed difference (rad/s) before the clutch closes further. */
  xdriveThreshold: number;
}

export const stabilityModes: StabilityMode[] = [
  { key: "dsc", name: "DSC ON", xdriveLock: 0.4, xdriveThreshold: 3 },
  { key: "dtc", name: "DTC", xdriveLock: 0.3, xdriveThreshold: 6 },
  { key: "off", name: "DSC OFF", xdriveLock: 0.2, xdriveThreshold: 10 },
];

// DTC raises the thresholds; DSC OFF switches traction and yaw control off
// (stability.lua). ABS is never touched.
export const dtc = { tcSlipThreshold: 0.3, tcMinimumThrottle: 0.35, yawSlipAngleThreshold: 0.2 };
export const xdriveLaunchLockBelowKmh = 20;
export const coastingRange = { minKmh: 50, maxKmh: 160 };
export const launchFallbackRpm = { diesel: 2500, petrol: 4000 };
export const defaultProfile: ProfileKey = "comfort";
export const defaultStability: StabilityKey = "dsc";

/** pedalMap.lua: kickdown is always full throttle, below it a curve per profile. */
export const mappedThrottle = (profile: DriveProfile, pedal: number) =>
  pedal >= kickdownPedal ? 1 : Math.min(pedal ** profile.pedal.exponent * profile.pedal.gain, profile.pedal.maxPartThrottle);

/** shiftLogic.lua after a full-throttle lift-off in D with no brake and no
 *  corner: the aggression holds, then falls at `decay` per second to the floor.
 *  Higher aggression keeps the lower gear. */
export const aggressionAfterLiftOff = (profile: DriveProfile, seconds: number) => {
  const { holdTime, decay, floor } = profile.shift;
  const value = seconds <= holdTime ? 1 : 1 - decay * (seconds - holdTime);
  return Math.min(Math.max(value, floor), 1);
};

export const settleTime = (profile: DriveProfile) => profile.shift.holdTime + (1 - profile.shift.floor) / profile.shift.decay;

/** launch.lua with requireSportPlusOrDtc = true, the BMW rule. */
export const launchAllowed = (profile: ProfileKey, stability: StabilityKey) => profile === "sportPlus" || stability !== "dsc";

export const specSheets = [
  {
    title: { en: "DriveTech 330d xDrive Touring", de: "DriveTech 330d xDrive Touring" },
    reference: "BMW 330d xDrive Touring (F31)",
    rows: [
      { label: { en: "Power / torque", de: "Leistung / Drehmoment" }, mod: { en: "approx. 265 hp / 570 Nm", de: "ca. 265 PS / 570 Nm" }, car: { en: "258 PS / 560 Nm (1500–3000 rpm)", de: "258 PS / 560 Nm (1500–3000 U/min)" } },
      { label: { en: "0–100 km/h", de: "0–100 km/h" }, mod: { en: "approx. 5.5 s", de: "ca. 5,5 s" }, car: { en: "5.4 s", de: "5,4 s" } },
      { label: { en: "Gear ratios", de: "Übersetzungen" }, mod: { en: "4.714 · 3.143 · 2.106 · 1.667 · 1.285 · 1.000 · 0.839 · 0.667", de: "4,714 · 3,143 · 2,106 · 1,667 · 1,285 · 1,000 · 0,839 · 0,667" }, car: { en: "identical", de: "identisch" } },
      { label: { en: "Final drive", de: "Achsübersetzung" }, mod: { en: "2.563, adjustable", de: "2,563, einstellbar" }, car: { en: "2.563", de: "2,563" } },
      { label: { en: "Top speed", de: "Höchstgeschwindigkeit" }, mod: { en: "250 km/h, limited", de: "250 km/h, abgeregelt" }, car: { en: "250 km/h, limited", de: "250 km/h, abgeregelt" } },
    ],
  },
  {
    title: { en: "DriveTech 320d Touring", de: "DriveTech 320d Touring" },
    reference: "BMW 320d Touring (F31 LCI)",
    rows: [
      { label: { en: "Power / torque", de: "Leistung / Drehmoment" }, mod: { en: "approx. 192 hp / 405 Nm", de: "ca. 192 PS / 405 Nm" }, car: { en: "190 PS / 400 Nm (1750–2500 rpm)", de: "190 PS / 400 Nm (1750–2500 U/min)" } },
      { label: { en: "0–100 km/h", de: "0–100 km/h" }, mod: { en: "approx. 7.1 s", de: "ca. 7,1 s" }, car: { en: "approx. 7.4 s", de: "ca. 7,4 s" } },
      { label: { en: "Gearbox", de: "Getriebe" }, mod: { en: "8-speed automatic", de: "8-Gang-Automatik" }, car: { en: "8-speed Steptronic", de: "8-Gang-Steptronic" } },
      { label: { en: "Top speed", de: "Höchstgeschwindigkeit" }, mod: { en: "230 km/h, limited", de: "230 km/h, abgeregelt" }, car: { en: "approx. 230 km/h", de: "ca. 230 km/h" } },
    ],
  },
];

export const specSources = {
  en: "Sources: BMW press kit 330d xDrive Touring (03/2013), ADAC car catalogue 320d Touring Steptronic (07/15–02/18). The ETK figures come from BeamNG's own measurements of the stock calibrations the DriveTech ECUs are based on.",
  de: "Quellen: BMW-Pressemappe 330d xDrive Touring (03/2013), ADAC-Autokatalog 320d Touring Steptronic (07/15–02/18). Die ETK-Werte stammen aus BeamNGs eigenen Messungen der Serienabstimmungen, auf denen die DriveTech-Steuergeräte aufbauen.",
};

/** README "Which cars?": what the car brings decides what DriveTech switches on. */
export const hardwareMatrix = [
  { hardware: { en: "Torque converter automatic", de: "Wandlerautomatik" }, features: { en: "shift logic, throttle map, launch control with converter unloading, start-stop, auto hold, coasting", de: "Schaltlogik, Gaspedal-Kennlinie, Launch Control mit Wandlerentlastung, Start-Stopp, Auto Hold, Segeln" } },
  { hardware: { en: "Dual clutch (DCT)", de: "Doppelkupplung (DKG)" }, features: { en: "shift logic, throttle map, launch control, start-stop, auto hold", de: "Schaltlogik, Gaspedal-Kennlinie, Launch Control, Start-Stopp, Auto Hold" } },
  { hardware: { en: "Manual", de: "Handschalter" }, features: { en: "throttle map, launch control with the clutch, auto hold", de: "Gaspedal-Kennlinie, Launch Control über die Kupplung, Auto Hold" } },
  { hardware: { en: "Modern driving electronics", de: "Moderne Fahrelektronik" }, features: { en: "DSC / DTC / DSC OFF, linked vehicle drive modes", de: "DSC / DTC / DSC OFF, gekoppelte Fahrmodi des Autos" } },
  { hardware: { en: "Electronically clutched AWD", de: "Elektronisch gekuppelter Allrad" }, features: { en: "xDrive", de: "xDrive" } },
];

export const installSteps = {
  en: [
    "Download DriveTech.zip from the latest release.",
    "Put the zip as it is, without extracting it, into Documents\\BeamNG.drive\\current\\mods.",
    "Start BeamNG and spawn a car. DriveTech is in the radial menu under Vehicle features.",
  ],
  de: [
    "DriveTech.zip vom neuesten Release laden.",
    "Die ZIP-Datei so, wie sie ist, ohne Entpacken nach Documents\\BeamNG.drive\\current\\mods legen.",
    "BeamNG starten und ein Auto spawnen. DriveTech steht im Radialmenü unter „Vehicle features“.",
  ],
};

/** Plot frame of both charts in viewBox units, shared by the server render and
 *  the script that moves the pedal marker. */
export const chartFrame = { width: 400, height: 250, left: 40, right: 12, top: 14, bottom: 34 };
