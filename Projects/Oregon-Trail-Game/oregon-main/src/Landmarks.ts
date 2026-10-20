export enum LandmarkID {
  INDEPENDENCE,
  KANSAS_RIVER,
  BIG_BLUE_RIVER,
  FORT_KEARNEY,
  CHIMNEY_ROCK,
  FORT_LARAMIE,
  INDEPENDENCE_ROCK,
  SOUTH_PASS,
  FORT_BRIDGER,
  GREEN_RIVER,
  SODA_SPRINGS,
  FORT_HALL,
  SNAKE_RIVER,
  FORT_BOISE,
  BLUE_MOUNTAINS,
  THE_DALLES,
  OREGON_CITY
}

export type Landmark = {
  id: LandmarkID;
  name: string;
  mile?: number;
  type?: "fort" | "river" | "fork" | "mountain" | "end";
  image?: string;

  choices?: {
    text: string;
    mile: number;    // ✔ GameLoop requires mile, not nextLandmark
  }[];
};

const BASE = "/images/Landmarks/";

export const LANDMARKS: Landmark[] = [
  {
    id: LandmarkID.INDEPENDENCE,
    name: "Independence",
    mile: 0,
    type: "fort",
    image: `${BASE}fort.bmp`
  },

  {
    id: LandmarkID.KANSAS_RIVER,
    name: "Kansas River Crossing",
    mile: 102,
    type: "river",
    image: `${BASE}river.bmp`
  },

  {
    id: LandmarkID.BIG_BLUE_RIVER,
    name: "Big Blue River Crossing",
    mile: 185,
    type: "river",
    image: `${BASE}river.bmp`
  },

  {
    id: LandmarkID.FORT_KEARNEY,
    name: "Fort Kearney",
    mile: 304,
    type: "fort",
    image: `${BASE}fort.bmp`
  },

  {
    id: LandmarkID.CHIMNEY_ROCK,
    name: "Chimney Rock",
    mile: 554,
    type: "mountain",
    image: `${BASE}mountain.bmp`
  },

  {
    id: LandmarkID.FORT_LARAMIE,
    name: "Fort Laramie",
    mile: 640,
    type: "fort",
    image: `${BASE}fort.bmp`
  },

  {
    id: LandmarkID.INDEPENDENCE_ROCK,
    name: "Independence Rock",
    mile: 830,
    type: "mountain",
    image: `${BASE}mountain.bmp`
  },

  // ---------- FIXED SOUTH PASS FORK ----------
  {
    id: LandmarkID.SOUTH_PASS,
    name: "South Pass",
    mile: 932,
    type: "fork",
    choices: [
      // DOS distances replaced with GameLoop-compatible mile choices
      { text: "Take the Fort Bridger Trail", mile: 989 },   // Fort Bridger distance
      { text: "Continue to Green River", mile: 1130 }       // South Pass direct route
    ]
  },

  {
    id: LandmarkID.FORT_BRIDGER,
    name: "Fort Bridger",
    mile: 989,     // Reached if chosen above
    type: "fort",
    image: `${BASE}fort.bmp`
  },

  // ---------- FIXED GREEN RIVER HANDLING ----------
  // GameLoop will update .mile dynamically based on fork choice
  {
    id: LandmarkID.GREEN_RIVER,
    name: "Green River Crossing",
    mile: 1130,  // default; overridden if Fort Bridger path chosen
    type: "river",
    image: `${BASE}river.bmp`
  },

  {
    id: LandmarkID.SODA_SPRINGS,
    name: "Soda Springs",
    mile: 1200,
    type: "mountain",
    image: `${BASE}mountain.bmp`
  },

  {
    id: LandmarkID.FORT_HALL,
    name: "Fort Hall",
    mile: 1395,
    type: "fort",
    image: `${BASE}fort.bmp`
  },

  {
    id: LandmarkID.SNAKE_RIVER,
    name: "Snake River Crossing",
    mile: 1600,
    type: "river",
    image: `${BASE}river.bmp`
  },

  {
    id: LandmarkID.FORT_BOISE,
    name: "Fort Boise",
    mile: 1780,
    type: "fort",
    image: `${BASE}fort.bmp`
  },

  {
    id: LandmarkID.BLUE_MOUNTAINS,
    name: "Blue Mountains",
    mile: 1900,
    type: "mountain",
    image: `${BASE}mountain.bmp`
  },

  // ---------- FIXED THE DALLES FORK ----------
  {
    id: LandmarkID.THE_DALLES,
    name: "The Dalles",
    mile: 2000,
    type: "fork",
    choices: [
      { text: "Float down the Columbia River", mile: 2040 },
      { text: "Take the Barlow Toll Road", mile: 2040 }
    ]
  },

  {
    id: LandmarkID.OREGON_CITY,
    name: "Oregon City",
    mile: 2040,
    type: "end",
    image: `${BASE}fort.bmp`
  }
];
