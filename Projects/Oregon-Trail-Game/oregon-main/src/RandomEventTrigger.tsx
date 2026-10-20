import { useEffect } from "react";
import { gameRNG } from "./Random";
import { setBackground, getCurrentBackground } from "./BackgroundFrame";

import Backgrounds from "./Backgrounds";
import { EVENT_MAP, EventType, triggerEvent } from "./EventType";
import { data } from "react-router";

// Union of all event values
type EventValue = (typeof EventType)[keyof typeof EventType];

// The 3 health hazards you selected
const HEALTH_HAZARD_EVENTS: EventValue[] = [
  EventType.OXEN_DEATH_OR_INJURY,
  EventType.DISEASE_EVENT,
  EventType.SEVERE_FOOD_SPOILAGE,
];

// The 3 non-health events you selected
const GENERAL_EVENTS: EventValue[] = [
  EventType.BANDIT_RUNNING_AWAY_ON_FOOT,
  EventType.BROKEN_WAGON_EVENT,
  EventType.BLIZZARD_HARSH_SNOWSTORM_EVENT,
];
// Travel hazards//Nazifa added
// We wants river hazards to trigger only at specific river crossings time not in any time like other events.
const RIVER_TRAVEL_EVENTS: EventValue[] = [
  EventType.FORD_CROSSING,
  EventType.FERRY_RAFT_RIVER_CROSSING,
  EventType.RIVER_CROSSING_PARTIAL_WAGON_LOSS,
];

// positive travel events 
const POSITIVE_TRAVEL_EVENTS: EventValue[] = [
  EventType.BOUNTIFUL_FORAGING_DISCOVERY,
  EventType.FRIENDLY_TRAPPERS_ASSISTANCE,
  EventType.ABANDONED_CACHE_OF_SUPPLIES,
];


// Here we choose the same three “health hazard” events so we don’t duplicate new event types and keep semantics consistent.
// negative travel events 
const NEGATIVE_TRAVEL_EVENTS: EventValue[] = [
  EventType.OXEN_DEATH_OR_INJURY,
  EventType.DISEASE_EVENT,
  EventType.SEVERE_FOOD_SPOILAGE,
];

// neutral travel events 
const NEUTRAL_TRAVEL_EVENTS: EventValue[] = [
  EventType.DAYTIME_CAMPING,
  EventType.NIGHTIME_CAMPING,
  EventType.WASHED_OUT_PATH,
];


// Only these 6 events can be picked 
const ACTIVE_EVENT_POOL: EventValue[] = [
  ...HEALTH_HAZARD_EVENTS,
  ...GENERAL_EVENTS,
  ...POSITIVE_TRAVEL_EVENTS,//
  ...NEUTRAL_TRAVEL_EVENTS,//
];

// What the caller gets back after one roll
type RandomEventResult = {
  triggered: boolean;
  event?: EventValue;
};

function escapeSpaces(path: string): string {
  return path.replace(/ /g, "%20");
}
/**
 * Pure random-event logic.
 * - 30% chance to trigger
 * - picks from the 6-event pool
 * - if the event has an `image`, sets that as the background
 *
 * NOTE: This does **not** restore the old background, this is handled in gameloop
 */
function eventChance(): RandomEventResult {
  const roll = gameRNG.next(); // 0.0 <= roll < 1.0

  // 30% chance: 0–0.3 → event, otherwise nothing
  if (roll >= 0.3) {
    return { triggered: false };
  }

  if (ACTIVE_EVENT_POOL.length === 0) {
    return { triggered: false };
  }

  const index = Math.floor(gameRNG.next() * ACTIVE_EVENT_POOL.length);
  const chosen = ACTIVE_EVENT_POOL[index];

  const data = EVENT_MAP[chosen];

  // If EVENT_MAP entry has an image, use it as the background
  if (data && typeof data.image === "string" && data.image.length > 0) {
    let path = escapeSpaces(data.image);
    setBackground(path);
    console.log(path);
  }

  return {
    triggered: true,
    event: chosen,
  };
}

// ---- React helper that behaves like HuntingGame (save/restore bg) ----

type RandomEventBackgroundOptions = {
  restoreOnExit?: boolean; // default: true
};

/**
 * useRandomEventBackground:
 * - On mount / when `triggerKey` changes:
 *   - remembers the current background with getCurrentBackground()
 *   - calls eventChance() (which may set an event background)
 * - On cleanup:
 *   - restores the previous background (like HuntingGame)
 *
 * Use this in a component that represents a "random event screen/overlay".
 */

export type { RandomEventResult, EventValue, RandomEventBackgroundOptions };
export { eventChance, RIVER_TRAVEL_EVENTS, POSITIVE_TRAVEL_EVENTS, NEGATIVE_TRAVEL_EVENTS,
  NEUTRAL_TRAVEL_EVENTS,};