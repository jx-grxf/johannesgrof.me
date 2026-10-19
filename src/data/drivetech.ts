// DriveTech's defaults, copied from mod/lua/vehicle/driveTech/config.lua at
// v1.2.0 (jx-grxf/beamng-drivetech). The page draws its curves from these
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

// Each sheet covers one engine; DriveTech ships it as rear-wheel drive and as
// xDrive (README "ETK 800 as a BMW 3 Series", v1.2.0).
export const specSheets = [
  {
    title: { en: "DriveTech 320d Touring", de: "DriveTech 320d Touring" },
    reference: "BMW 320d Touring",
    rows: [
      { label: { en: "Power / torque", de: "Leistung / Drehmoment" }, mod: { en: "approx. 192 PS / 405 Nm", de: "ca. 192 PS / 405 Nm" }, car: { en: "190 PS / 400 Nm (1750–2500 rpm)", de: "190 PS / 400 Nm (1750–2500 U/min)" } },
      { label: { en: "Gearbox", de: "Getriebe" }, mod: { en: "ZF 8HP50", de: "ZF 8HP50" }, car: { en: "ZF 8HP50", de: "ZF 8HP50" } },
      { label: { en: "Final drive", de: "Achsübersetzung" }, mod: { en: "2.813, adjustable", de: "2,813, einstellbar" }, car: { en: "2.813", de: "2,813" } },
      { label: { en: "0–100 km/h", de: "0–100 km/h" }, mod: { en: "–", de: "–" }, car: { en: "7.5 s, xDrive 7.7 s", de: "7,5 s, xDrive 7,7 s" } },
      { label: { en: "Top speed", de: "Höchstgeschwindigkeit" }, mod: { en: "230 km/h, limited", de: "230 km/h, abgeregelt" }, car: { en: "approx. 230 km/h", de: "ca. 230 km/h" } },
    ],
  },
  {
    title: { en: "DriveTech 330d Touring", de: "DriveTech 330d Touring" },
    reference: "BMW 330d Touring",
    rows: [
      { label: { en: "Power / torque", de: "Leistung / Drehmoment" }, mod: { en: "approx. 265 PS / 570 Nm", de: "ca. 265 PS / 570 Nm" }, car: { en: "258 PS / 560 Nm (1500–3000 rpm)", de: "258 PS / 560 Nm (1500–3000 U/min)" } },
      { label: { en: "Gearbox", de: "Getriebe" }, mod: { en: "ZF 8HP70", de: "ZF 8HP70" }, car: { en: "ZF 8HP70", de: "ZF 8HP70" } },
      { label: { en: "Final drive", de: "Achsübersetzung" }, mod: { en: "2.563, adjustable", de: "2,563, einstellbar" }, car: { en: "2.563", de: "2,563" } },
      { label: { en: "0–100 km/h", de: "0–100 km/h" }, mod: { en: "xDrive approx. 5.5 s", de: "xDrive ca. 5,5 s" }, car: { en: "5.6 s, xDrive 5.4 s", de: "5,6 s, xDrive 5,4 s" } },
      { label: { en: "Top speed", de: "Höchstgeschwindigkeit" }, mod: { en: "250 km/h, limited", de: "250 km/h, abgeregelt" }, car: { en: "250 km/h, limited", de: "250 km/h, abgeregelt" } },
    ],
  },
  {
    title: { en: "DriveTech 340d Touring", de: "DriveTech 340d Touring" },
    reference: "BMW 335d xDrive Touring",
    note: {
      en: "The F31 never had a 340d. It uses the data of the 335d xDrive (N57 twin turbo); the rear-wheel drive version did not exist and is a what-if car.",
      de: "Den 340d gab es beim F31 nie. Er nutzt die Daten des 335d xDrive (N57 mit zwei Turbos); die Version mit Hinterradantrieb gab es nicht, sie ist ein Gedankenspiel.",
    },
    rows: [
      { label: { en: "Power / torque", de: "Leistung / Drehmoment" }, mod: { en: "approx. 315 PS / 636 Nm", de: "ca. 315 PS / 636 Nm" }, car: { en: "313 PS / 630 Nm (1500–2500 rpm)", de: "313 PS / 630 Nm (1500–2500 U/min)" } },
      { label: { en: "Gearbox", de: "Getriebe" }, mod: { en: "ZF 8HP70", de: "ZF 8HP70" }, car: { en: "ZF 8HP70", de: "ZF 8HP70" } },
      { label: { en: "Final drive", de: "Achsübersetzung" }, mod: { en: "2.563, adjustable", de: "2,563, einstellbar" }, car: { en: "2.563", de: "2,563" } },
      { label: { en: "0–100 km/h", de: "0–100 km/h" }, mod: { en: "–", de: "–" }, car: { en: "xDrive 4.9 s", de: "xDrive 4,9 s" } },
      { label: { en: "Top speed", de: "Höchstgeschwindigkeit" }, mod: { en: "250 km/h, limited", de: "250 km/h, abgeregelt" }, car: { en: "250 km/h, limited", de: "250 km/h, abgeregelt" } },
    ],
  },
  {
    title: { en: "DriveTech 340i Touring", de: "DriveTech 340i Touring" },
    reference: "BMW 340i Touring",
    note: {
      en: "B58 petrol six on staggered 19-inch wheels, 245/35 front and 265/35 rear.",
      de: "B58-Sechszylinder-Benziner auf 19-Zoll-Mischbereifung, 245/35 vorn und 265/35 hinten.",
    },
    rows: [
      { label: { en: "Power / torque", de: "Leistung / Drehmoment" }, mod: { en: "approx. 328 PS / 452 Nm", de: "ca. 328 PS / 452 Nm" }, car: { en: "326 PS / 450 Nm (1380–5000 rpm)", de: "326 PS / 450 Nm (1380–5000 U/min)" } },
      { label: { en: "Gearbox", de: "Getriebe" }, mod: { en: "ZF 8HP50", de: "ZF 8HP50" }, car: { en: "ZF 8HP50", de: "ZF 8HP50" } },
      { label: { en: "Final drive", de: "Achsübersetzung" }, mod: { en: "2.813, adjustable", de: "2,813, einstellbar" }, car: { en: "2.813", de: "2,813" } },
      { label: { en: "0–100 km/h", de: "0–100 km/h" }, mod: { en: "–", de: "–" }, car: { en: "5.1 s, xDrive approx. 5.0 s", de: "5,1 s, xDrive ca. 5,0 s" } },
      { label: { en: "Top speed", de: "Höchstgeschwindigkeit" }, mod: { en: "250 km/h, limited", de: "250 km/h, abgeregelt" }, car: { en: "250 km/h, limited", de: "250 km/h, abgeregelt" } },
    ],
  },
];

export const gearboxes = [
  { name: "ZF 8HP50", cars: "320d, 340i", ratios: [5.0, 3.2, 2.143, 1.72, 1.314, 1.0, 0.822, 0.64] },
  { name: "ZF 8HP70", cars: "330d, 340d", ratios: [4.714, 3.143, 2.106, 1.667, 1.285, 1.0, 0.839, 0.667] },
];

export const specSources = {
  en: "Sources: BMW Group technical data BMW 3 Series Touring LCI (F31), edition 11/2018; BMW press kit 330d xDrive Touring (03/2013); ADAC car catalogue 340i Touring xDrive Steptronic (07/15–06/18); auto-data.net for the 340i xDrive's 0–100 time. The DriveTech column is the in-game torque curve of the DriveTech ECUs; for the 320d and 330d it comes from BeamNG's own measurements of the stock calibrations they are based on. A dash means not measured.",
  de: "Quellen: BMW Group, Technische Daten BMW 3er Touring LCI (F31), Ausgabe 11/2018; BMW-Pressemappe 330d xDrive Touring (03/2013); ADAC-Autokatalog 340i Touring xDrive Steptronic (07/15–06/18); auto-data.net für die 0–100-Zeit des 340i xDrive. Die DriveTech-Spalte ist die Drehmomentkurve der DriveTech-Steuergeräte im Spiel; beim 320d und 330d stammt sie aus BeamNGs eigenen Messungen der Serienabstimmungen, auf denen sie aufbauen. Ein Strich heißt: nicht gemessen.",
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

// Rain and aquaplaning, from mod/lua/ge/extensions/driveTechRain.lua and
// mod/lua/vehicle/driveTech/aquaplaning.lua at v1.2.0. Same rule as above: a
// change in the mod has to be copied here.
export type RainKey = "light" | "medium" | "heavy";

export const rainLevels: { key: RainKey; name: { en: string; de: string }; waterMm: number }[] = [
  { key: "light", name: { en: "Light", de: "Leicht" }, waterMm: 0.8 },
  { key: "medium", name: { en: "Medium", de: "Mittel" }, waterMm: 2.5 },
  { key: "heavy", name: { en: "Heavy", de: "Stark" }, waterMm: 6 },
];
export const defaultRain: RainKey = "medium";
export const treadDepths = [8, 5, 3, 1.6];
export const defaultTread = 8;
export const wetGripLoss = { driveTech: 0.25, stock: 0.06 };

export const aquaplaning = {
  pressureKpa: 230,
  widthM: 0.205,
  refWaterMm: 4,
  minWaterMm: 0.3,
  calibration: 1.12,
  partialStart: 0.65,
  fullAt: 1.05,
  minGrip: 0.08,
};

const clamp = (x: number, lo: number, hi: number) => Math.min(Math.max(x, lo), hi);

/** aquaplaning.lua criticalSpeed: km/h at which a 205 tyre at 2.3 bar fully floats. */
export const criticalSpeed = (waterMm: number, treadMm: number) => {
  const a = aquaplaning;
  if (waterMm <= a.minWaterMm) return Infinity;
  const horne = 6.35 * Math.sqrt(a.pressureKpa);
  const depthFactor = (a.refWaterMm / waterMm) ** 0.3;
  const treadFactor = 0.65 + 0.044 * clamp(treadMm, 0, 9);
  return horne * a.calibration * depthFactor * treadFactor;
};

/** aquaplaning.lua lift + grip: friction left on the tread at a given speed. */
export const gripAt = (speedKmh: number, criticalKmh: number) => {
  const a = aquaplaning;
  if (!Number.isFinite(criticalKmh) || criticalKmh <= 0) return 1;
  const x = clamp((speedKmh / criticalKmh - a.partialStart) / (a.fullAt - a.partialStart), 0, 1);
  return 1 - x * x * (3 - 2 * x) * (1 - a.minGrip);
};

export const aquaplaningMaxKmh = 200;
// Past this speed the CRITICAL label goes left of its line so it stays clear of
// the flat curve ends at the right edge.
export const criticalLabelFlipKmh = 60;

/** Grip over speed for one tread depth, as an SVG path in the chart frame. */
export const gripPath = (waterMm: number, treadMm: number) => {
  const { width, height, left, right, top, bottom } = chartFrame;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const critical = criticalSpeed(waterMm, treadMm);
  const parts: string[] = [];
  for (let kmh = 0; kmh <= aquaplaningMaxKmh; kmh += 2) {
    const x = left + (kmh / aquaplaningMaxKmh) * plotW;
    const y = top + (1 - gripAt(kmh, critical)) * plotH;
    parts.push(`${kmh ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return parts.join(" ");
};
