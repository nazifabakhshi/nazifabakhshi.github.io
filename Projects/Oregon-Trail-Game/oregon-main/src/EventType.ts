import { Party } from "./Party";
import { Inventory } from "./GameInventory";
import { gameRNG } from "./Random";
export enum EventType {
  AFTER_SUPPLIES_STOLEN_BY_BANDITS = "AFTER_SUPPLIES_STOLEN_BY_BANDITS",
  ARROW_ATTACK_ACTIVE_ATTACK = "ARROW_ATTACK_ACTIVE_ATTACK",
  ARROW_ATTACK_AFTERMATH = "ARROW_ATTACK_AFTERMATH",
  BAD_WATER_FAMILY_DRANK_IT = "BAD_WATER_FAMILY_DRANK_IT",
  BAD_WATER_OXENS_REFUSING_TO_DRINK = "BAD_WATER_OXENS_REFUSING_TO_DRINK",
  BANDIT_RUNNING_AWAY_ON_FOOT = "BANDIT_RUNNING_AWAY_ON_FOOT",
  BANDIT_RUNNING_AWAY_ON_HORSEBACK = "BANDIT_RUNNING_AWAY_ON_HORSEBACK",
  BEAR_ATTACK = "BEAR_ATTACK",
  BLIZZARD_HARSH_SNOWSTORM_EVENT = "BLIZZARD_HARSH_SNOWSTORM_EVENT",
  BRIDGE_COLLAPSE = "BRIDGE_COLLAPSE",
  BROKEN_LEG = "BROKEN_LEG",
  BROKEN_TRAIL_TREESROCKS_BLOCKAGE = "BROKEN_TRAIL_TREESROCKS_BLOCKAGE",
  BROKEN_WAGON_EVENT = "BROKEN_WAGON_EVENT",
  COYOTES_STEALING_SUPPLIES = "COYOTES_STEALING_SUPPLIES",
  CROSSING_THE_DESERT = "CROSSING_THE_DESERT",
  DAUGHTER_COLAPSING_FROM_EXHAUSTION = "DAUGHTER_COLAPSING_FROM_EXHAUSTION",
  DAYTIME_CAMPING = "DAYTIME_CAMPING",
  DESPERATE_TRADE = "DESPERATE_TRADE",
  DISEASE_EVENT = "DISEASE_EVENT",
  FAIR_TRADE = "FAIR_TRADE",
  FAMILY_MEMBER_DROWNING = "FAMILY_MEMBER_DROWNING",
  FAMILY_POSSIBLITY = "FAMILY_POSSIBLITY",
  FAMILY_POSSIBLITYPXL = "FAMILY_POSSIBLITYPXL",
  FERRY_RAFT_RIVER_CROSSING = "FERRY_RAFT_RIVER_CROSSING",
  FIRE_APPROACHING_ON_PLAINS = "FIRE_APPROACHING_ON_PLAINS",
  FLOODED_RIVER_PARTIAL_SUPPLIES_LOSS = "FLOODED_RIVER_PARTIAL_SUPPLIES_LOSS",
  FLOODED_RIVER_SEVERE_SUPPLIES_LOSS = "FLOODED_RIVER_SEVERE_SUPPLIES_LOSS",
  FORD_CROSSING = "FORD_CROSSING",
  FORT_ENCOUNTER_ARRIVAL_AT_FORT = "FORT_ENCOUNTER_ARRIVAL_AT_FORT",
  GRAVE_SCENE = "GRAVE_SCENE",
  GUN_ACCIDENT_FATHER_VERSION = "GUN_ACCIDENT_FATHER_VERSION",
  GUN_ACCIDENT_SON_VERSION = "GUN_ACCIDENT_SON_VERSION",
  HUNTING_FAILURE = "HUNTING_FAILURE",
  HUNTING_SUCCESS = "HUNTING_SUCCESS",
  LOST_ON_TRAIL = "LOST_ON_TRAIL",
  MILD_CROSSING_THE_DESERT = "MILD_CROSSING_THE_DESERT",
  MILD_FOOD_SHORTAGE = "MILD_FOOD_SHORTAGE",
  MILD_FOOD_SPOILAGE = "MILD_FOOD_SPOILAGE",
  MILD_MUD_TRAP = "MILD_MUD_TRAP",
  MILD_THIRST_GOING_ACROSS_PLAINS = "MILD_THIRST_GOING_ACROSS_PLAINS",
  MOUNTAIN_CROSSING_ = "MOUNTAIN_CROSSING_",
  NEAR_MISS_BRIDGE_COLLAPSE = "NEAR_MISS_BRIDGE_COLLAPSE",
  NIGHTIME_CAMPING = "NIGHTIME_CAMPING",
  NIGHT_THEFT_ACTIVE_THIEF = "NIGHT_THEFT_ACTIVE_THIEF",
  OXEN_DEATH_OR_INJURY = "OXEN_DEATH_OR_INJURY",
  OXEN_INJURY_MILD_VERSION = "OXEN_INJURY_MILD_VERSION",
  OXEN_SEVERE_COLLAPSE = "OXEN_SEVERE_COLLAPSE",
  OX_DROWNING = "OX_DROWNING",
  RACCOONS_STEALING_SUPPLIES = "RACCOONS_STEALING_SUPPLIES",
  RIVER_CROSSING_PARTIAL_WAGON_LOSS = "RIVER_CROSSING_PARTIAL_WAGON_LOSS",
  RIVER_CROSSING_TOTAL_WAGON_LOSS = "RIVER_CROSSING_TOTAL_WAGON_LOSS",
  ROCK_HILL_CROSSING_WITH_WAGON_TIPPING_OVER = "ROCK_HILL_CROSSING_WITH_WAGON_TIPPING_OVER",
  RUNAWAY_OXEN_FULL_OUT_OF_CONTROL_STAMPEDE = "RUNAWAY_OXEN_FULL_OUT_OF_CONTROL_STAMPEDE",
  SETTLEMENT_SUCCESS = "SETTLEMENT_SUCCESS",
  SEVERE_DESERT_CROSSING = "SEVERE_DESERT_CROSSING",
  SEVERE_FOOD_SHORTAGE = "SEVERE_FOOD_SHORTAGE",
  SEVERE_FOOD_SPOILAGE = "SEVERE_FOOD_SPOILAGE",
  SEVERE_MUD_TRAP = "SEVERE_MUD_TRAP",
  SEVERE_THIRST_ACROOS_PLAINS = "SEVERE_THIRST_ACROOS_PLAINS",
  SMALL_WAGON_FIRE = "SMALL_WAGON_FIRE",
  SNAKE_BITE = "SNAKE_BITE",
  SNOWSTORM = "SNOWSTORM",
  STAMPEDE_RUNAWAY_OXEN_NEAR_MISS = "STAMPEDE_RUNAWAY_OXEN_NEAR_MISS",
  STEEP_RIVERBANK_CROSSING_WAGON_TIPPING_OVER = "STEEP_RIVERBANK_CROSSING_WAGON_TIPPING_OVER",
  SUCCESFUL_MAKING_IT_TO_DESTINATION = "SUCCESFUL_MAKING_IT_TO_DESTINATION",
  THUNDERSTORM = "THUNDERSTORM",
  TRADING_AT_THE_FORT = "TRADING_AT_THE_FORT",
  WAGON_BREAKDOWN_320X200 = "WAGON_BREAKDOWN_320X200",
  WAGON_FILE_WHILE_TRAVELING = "WAGON_FILE_WHILE_TRAVELING",
  WAGON_REPAIR_INJURY_MINOR_INJURY = "WAGON_REPAIR_INJURY_MINOR_INJURY",
  WAGON_REPAIR_INJURY_SERIOUS_INJURY = "WAGON_REPAIR_INJURY_SERIOUS_INJURY",
  WASHED_OUT_PATH = "WASHED_OUT_PATH",
  WHEEL_BROKEN_REPAIRABLE_BREAK = "WHEEL_BROKEN_REPAIRABLE_BREAK",
  WOLF_ATTACK = "WOLF_ATTACK",
  BOUNTIFUL_FORAGING_DISCOVERY = "BOUNTIFUL_FORAGING_DISCOVERY",
  FRIENDLY_TRAPPERS_ASSISTANCE = "FRIENDLY_TRAPPERS_ASSISTANCE",
  ABANDONED_CACHE_OF_SUPPLIES = "ABANDONED_CACHE_OF_SUPPLIES",
}

// 2) Tiny types & constants
export interface EventUI {
  titleEl?: HTMLElement;
  textEl?: HTMLElement;
  imgEl?: HTMLImageElement;
}
export interface EventData {
  title: string;
  text: string;
  image: string;
  effect?: (party: Party, inv: typeof Inventory) => void;

}
const BASE = "/images/event";
const DISEASE_IMAGE = `${BASE}/Disease event.png`;

// 3) Simple object literal with every event filled out
export const EVENT_MAP: { [key: string]: EventData } = {
  [EventType.AFTER_SUPPLIES_STOLEN_BY_BANDITS]: {
    title: "After Supplies Stolen By Bandits",
    text: "A thief makes off with supplies.",
    image: `${BASE}/after supplies stolen by bandits.png`,
    effect: (_party, inv) => {
      inv.foodPounds = Math.max(0, inv.foodPounds - gameRNG.nextIntRange(20, 50));
      inv.ammoRounds = Math.max(0, inv.ammoRounds - gameRNG.nextIntRange(5, 20));
      inv.money = Math.max(0, inv.money - gameRNG.nextIntRange(10, 40));
    }
  },
  [EventType.ARROW_ATTACK_ACTIVE_ATTACK]: {
    title: "Arrow Attack Active Attack",
    text: "An arrow attack startles the party.",
    image: `${BASE}/Arrow Attack - Active Attack.png`,
    effect: (party, inv) => {
      const idx = gameRNG.nextIntRange(0, party.members.length - 1);
      const target = party.getMember(idx);
      target.takeDamage(gameRNG.nextIntRange(10, 30));
    }
  },
  [EventType.ARROW_ATTACK_AFTERMATH]: {
    title: "Arrow Attack Aftermath",
    text: "An arrow attack startles the party.",
    image: `${BASE}/Arrow Attack - Aftermath.png`,
    effect: (party, inv) => {
      const idx = gameRNG.nextIntRange(0, party.members.length - 1);
      const target = party.getMember(idx);
      target.takeDamage(gameRNG.nextIntRange(5, 15)); // mild–moderate
      inv.clothingSets = Math.max(0, inv.clothingSets - 1);
    }
  },
  [EventType.BAD_WATER_FAMILY_DRANK_IT]: {
    title: "Bad Water Family Drank It",
    text: "The water source looks suspect.",
    image: `${BASE}/bad water family drank it.png`,
    effect: (party, inv) => {
      for (let i = 0; i < party.members.length; i++) {
        party.getMember(i).takeDamage(gameRNG.nextIntRange(5, 20));
      }
      inv.foodPounds = Math.max(0, inv.foodPounds - 15);
    }
  },
  [EventType.BAD_WATER_OXENS_REFUSING_TO_DRINK]: {
    title: "Bad Water Oxen Refusing To Drink",
    text: "Your oxen struggle on the trail.",
    image: `${BASE}/Bad water oxens refusing to drink.png`,
    effect: (party, inv) => {
      inv.foodPounds = Math.max(0, inv.foodPounds - 10);
    }
  },
  [EventType.BANDIT_RUNNING_AWAY_ON_FOOT]: {
    title: "Bandit Escapes on Foot",
    text: "A bandit grabs some of your supplies and runs off.",
    image: `${BASE}/Bandit running away on foot.png`,
    effect: (_party, inv) => {
      inv.money = Math.max(0, inv.money - gameRNG.nextIntRange(5, 20));
      inv.foodPounds = Math.max(0, inv.foodPounds - gameRNG.nextIntRange(5, 15));
    }
  },
  [EventType.BANDIT_RUNNING_AWAY_ON_HORSEBACK]: {
    title: "Bandit Running Away On Horseback",
    text: "A thief makes off with supplies.",
    image: `${BASE}/Bandit running away on horseback.png`,
    effect: (_party, inv) => {
      inv.money = Math.max(0, inv.money - gameRNG.nextIntRange(20, 60));
      inv.ammoRounds = Math.max(0, inv.ammoRounds - gameRNG.nextIntRange(10, 20));
    }
  },
  [EventType.BEAR_ATTACK]: {
    title: "Bear Attack",
    text: "A bear appears on the trail.",
    image: `${BASE}/bear attack.png`,
    effect: (party, inv) => {
      const idx = gameRNG.nextIntRange(0, party.members.length - 1);
      party.getMember(idx).takeDamage(gameRNG.nextIntRange(15, 35));
      inv.foodPounds = Math.max(0, inv.foodPounds - 25);
    }
  },
  [EventType.BLIZZARD_HARSH_SNOWSTORM_EVENT]: {
    title: "Heavy Blizzard",
    text: "A heavy snowstorm hits and you are forced to slow down.",
    image: `${BASE}/Blizzard  Harsh Snowstorm event.png`,
    effect: (party, inv) => {
      for (let i = 0; i < party.members.length; i++) {
        party.getMember(i).takeDamage(gameRNG.nextIntRange(10, 30));
      }
      inv.clothingSets = Math.max(0, inv.clothingSets - 2);
      inv.foodPounds = Math.max(0, inv.foodPounds - 40);
    }
  },
  [EventType.BRIDGE_COLLAPSE]: {
    title: "Bridge Collapse",
    text: "You encounter bridge collapse.",
    image: `${BASE}/Bridge Collapse.png`,
    effect: (party, inv) => {
      const idx = gameRNG.nextIntRange(0, party.members.length - 1);
      party.getMember(idx).takeDamage(gameRNG.nextIntRange(5, 20));

      if (inv.spareWheels > 0) inv.spareWheels -= 1;
      else if (inv.spareAxles > 0) inv.spareAxles -= 1;
      else if (inv.spareTongues > 0) inv.spareTongues -= 1;

      inv.foodPounds = Math.max(0, inv.foodPounds - 20);
    }
  },
  [EventType.BROKEN_LEG]: {
    title: "Broken Leg",
    text: "You encounter broken leg.",
    image: `${BASE}/Broken leg.png`,
    effect: (party, inv) => {
      const idx = gameRNG.nextIntRange(0, party.members.length - 1);
      party.getMember(idx).takeDamage(gameRNG.nextIntRange(20, 40));
      inv.clothingSets = Math.max(0, inv.clothingSets - 1);
    }
  },
  [EventType.BROKEN_TRAIL_TREESROCKS_BLOCKAGE]: {
    title: "Broken Trail Treesrocks Blockage",
    text: "You encounter broken trail treesrocks blockage.",
    image: `${BASE}/Broken Trail - TreesRocks Blockage.png`,
    effect: (_party, inv) => {
      if (inv.spareAxles > 0 && gameRNG.nextIntRange(1, 3) === 2) inv.spareAxles -= 1;
      inv.foodPounds = Math.max(0, inv.foodPounds - 20);
    }
  },
  [EventType.BROKEN_WAGON_EVENT]: {
    title: "Broken Wagon",
    text: "Your wagon breaks down and you have to stop to fix it.",
    image: `${BASE}/broken wagon event.png`,
    effect: (_party, inv) => {
      if (inv.spareWheels > 0) inv.spareWheels -= 1;
      else if (inv.spareAxles > 0) inv.spareAxles -= 1;
      else if (inv.spareTongues > 0) inv.spareTongues -= 1;

      inv.foodPounds = Math.max(0, inv.foodPounds - 15);
    }
  },
  [EventType.COYOTES_STEALING_SUPPLIES]: {
    title: "Coyotes Stealing Supplies",
    text: "You encounter coyotes stealing supplies.",
    image: `${BASE}/Coyotes stealing supplies.png`,
    effect: (_party, inv) => {
      inv.foodPounds = Math.max(0, inv.foodPounds - gameRNG.nextIntRange(10, 30));
    }
  },
  [EventType.CROSSING_THE_DESERT]: {
    title: "Crossing The Desert",
    text: "You encounter crossing the desert.",
    image: `${BASE}/crossing the desert.png`,
    effect: (party, inv) => {
      for (let i = 0; i < party.members.length; i++) {
        party.getMember(i).takeDamage(gameRNG.nextIntRange(10, 25));
      }
      inv.foodPounds = Math.max(0, inv.foodPounds - 35);
    }
  },
  [EventType.DAUGHTER_COLAPSING_FROM_EXHAUSTION]: {
    title: "Daughter Colapsing From Exhaustion",
    text: "You encounter daughter colapsing from exhaustion.",
    image: `${BASE}/daughter colapsing from exhaustion.png`,
    effect: (party, _inv) => {
      // Single severe injury to a random member
      const idx = gameRNG.nextIntRange(0, party.members.length - 1);
      party.getMember(idx).takeDamage(gameRNG.nextIntRange(15, 30));
    }
  },
  [EventType.DAYTIME_CAMPING]: {
    title: "Daytime Camping",
    text: "You stop early to set up camp and let the party rest.",
    image: `${BASE}/daytime camping.png`,
  },
  [EventType.DESPERATE_TRADE]: {
    title: "Desperate Trade",
    text: "A traveler offers a trade.",
    image: `${BASE}/desperate trade.png`,
    effect: (_party, inv) => {
      inv.money = Math.max(0, inv.money - gameRNG.nextIntRange(5, 20));
      inv.foodPounds += gameRNG.nextIntRange(10, 30);
    }
  },
  [EventType.DISEASE_EVENT]: {
    title: "Illness in the Party",
    text: "Someone in your group becomes sick.",
    image: DISEASE_IMAGE,
    effect: (party) => {
      const idx = gameRNG.nextIntRange(0, party.members.length - 1);
      party.getMember(idx).takeDamage(gameRNG.nextIntRange(20, 40));
    }
  },
  [EventType.FAIR_TRADE]: {
    title: "Fair Trade",
    text: "A traveler offers a trade.",
    image: `${BASE}/fair trade.png`,
    effect: (_party, inv) => {
      inv.foodPounds += gameRNG.nextIntRange(10, 40);
      inv.clothingSets += 1;
    }
  },
  [EventType.FAMILY_MEMBER_DROWNING]: {
    title: "Family Member Drowning",
    text: "You encounter family member drowning.",
    image: `${BASE}/Family Member Drowning.png`,
    effect: (party, _inv) => {
      const idx = gameRNG.nextIntRange(0, party.members.length - 1);
      // Severe, nearly fatal damage
      party.getMember(idx).takeDamage(gameRNG.nextIntRange(25, 45));
    }
  },
  [EventType.FERRY_RAFT_RIVER_CROSSING]: {
    title: "Raft Ferry Crossing",
    text: "Your party and wagon are ferried safely across the river.",
    image: `${BASE}/ferry raft river crossing.png`,
    effect: (_party, inv) => {
      inv.money = Math.max(0, inv.money - gameRNG.nextIntRange(5, 15));
      inv.foodPounds = Math.max(0, inv.foodPounds - 10);
    }
  },
  [EventType.FIRE_APPROACHING_ON_PLAINS]: {
    title: "Fire Approaching On Plains",
    text: "A fire breaks out at camp.",
    image: `${BASE}/Fire Approaching on plains.png`,
    effect: (party, inv) => {
      // Whole party suffers mild–moderate heat damage
      for (let i = 0; i < party.members.length; i++) {
        party.getMember(i).takeDamage(gameRNG.nextIntRange(5, 20));
      }
      inv.foodPounds = Math.max(0, inv.foodPounds - 20);
      inv.clothingSets = Math.max(0, inv.clothingSets - 1);
    }
  },
  [EventType.FLOODED_RIVER_PARTIAL_SUPPLIES_LOSS]: {
    title: "Flooded River Partial Supplies Loss",
    text: "You encounter flooded river partial supplies loss.",
    image: `${BASE}/Flooded River - Partial Supplies Loss.png`,
    effect: (_party, inv) => {
      inv.foodPounds = Math.max(0, inv.foodPounds - gameRNG.nextIntRange(20, 40));
      inv.ammoRounds = Math.max(0, inv.ammoRounds - gameRNG.nextIntRange(5, 15));
    }
  },
  [EventType.FLOODED_RIVER_SEVERE_SUPPLIES_LOSS]: {
    title: "Flooded River Severe Supplies Loss",
    text: "You encounter flooded river severe supplies loss.",
    image: `${BASE}/Flooded River - Severe Supplies Loss.png`,
    effect: (_party, inv) => {
      inv.foodPounds = Math.max(0, inv.foodPounds - gameRNG.nextIntRange(40, 80));
      inv.ammoRounds = Math.max(0, inv.ammoRounds - gameRNG.nextIntRange(10, 25));
      inv.clothingSets = Math.max(0, inv.clothingSets - 1);
    }
  },
  [EventType.FORD_CROSSING]: {
    title: "River Ford Crossing",
    text: "You reach a shallow part of the river and prepare to cross.",
    image: `${BASE}/ford crossing.png`,

  },
  [EventType.FORT_ENCOUNTER_ARRIVAL_AT_FORT]: {
    title: "Fort Encounter Arrival At Fort",
    text: "You encounter fort encounter arrival at fort.",
    image: `${BASE}/Fort Encounter - Arrival at Fort.png`
  },
  [EventType.GRAVE_SCENE]: {
    title: "Grave Scene",
    text: "You encounter grave scene.",
    image: `${BASE}/grave scene.png`
  },
  [EventType.GUN_ACCIDENT_FATHER_VERSION]: {
    title: "Gun Accident Father Version",
    text: "You encounter gun accident father version.",
    image: `${BASE}/gun accident father version.png`,
    effect: (party, inv) => {
      const idx = gameRNG.nextIntRange(0, party.members.length - 1);
      party.getMember(idx).takeDamage(gameRNG.nextIntRange(15, 30));
      inv.ammoRounds = Math.max(0, inv.ammoRounds - 5);
    }
  },
  [EventType.GUN_ACCIDENT_SON_VERSION]: {
    title: "Gun Accident Son Version",
    text: "You encounter gun accident son version.",
    image: `${BASE}/gun accident son version.png`,
    effect: (party, inv) => {
      const idx = gameRNG.nextIntRange(0, party.members.length - 1);
      party.getMember(idx).takeDamage(gameRNG.nextIntRange(10, 25));
      inv.ammoRounds = Math.max(0, inv.ammoRounds - 5);
    }
  },
  [EventType.HUNTING_FAILURE]: {
    title: "Hunting Failure",
    text: "You encounter hunting failure.",
    image: `${BASE}/hunting failure.png`
  },
  [EventType.HUNTING_SUCCESS]: {
    title: "Hunting Success",
    text: "You encounter hunting success.",
    image: `${BASE}/hunting success.png`
  },
  [EventType.LOST_ON_TRAIL]: {
    title: "Lost On Trail",
    text: "You lose the trail briefly.",
    image: `${BASE}/Lost on trail.png`,
    effect: (_party, inv) => {
      inv.foodPounds = Math.max(0, inv.foodPounds - 20);
    }
  },
  [EventType.MILD_CROSSING_THE_DESERT]: {
    title: "Mild Crossing The Desert",
    text: "You encounter mild crossing the desert.",
    image: `${BASE}/Mild crossing the desert.png`,
    effect: (party, inv) => {
      for (let i = 0; i < party.members.length; i++) {
        party.getMember(i).takeDamage(gameRNG.nextIntRange(5, 12));
      }
      inv.foodPounds = Math.max(0, inv.foodPounds - 20);
    }
  },
  [EventType.MILD_FOOD_SHORTAGE]: {
    title: "Mild Food Shortage",
    text: "You encounter mild food shortage.",
    image: `${BASE}/mild food shortage.png`,
    effect: (_party, inv) => {
      inv.foodPounds = Math.max(0, inv.foodPounds - 10);
    }
  },
  [EventType.MILD_FOOD_SPOILAGE]: {
    title: "Mild Food Spoilage",
    text: "Spoiled provisions are discarded.",
    image: `${BASE}/Mild food spoilage.png`,
    effect: (_party, inv) => {
      inv.foodPounds = Math.max(0, inv.foodPounds - gameRNG.nextIntRange(30, 80));
    }
  },
  [EventType.MILD_MUD_TRAP]: {
    title: "Mild Mud Trap",
    text: "You encounter mild mud trap.",
    image: `${BASE}/Mild Mud Trap.png`,
    effect: (_party, inv) => {
      inv.foodPounds = Math.max(0, inv.foodPounds - 10);
    }
  },
  [EventType.MILD_THIRST_GOING_ACROSS_PLAINS]: {
    title: "Mild Thirst Going Across Plains",
    text: "You encounter mild thirst going across plains.",
    image: `${BASE}/mild thirst going across plains.png`,
    effect: (party, _inv) => {
      for (let i = 0; i < party.members.length; i++) {
        party.getMember(i).takeDamage(gameRNG.nextIntRange(3, 8));
      }
    }
  },
  [EventType.MOUNTAIN_CROSSING_]: {
    title: "Mountain Crossing",
    text: "A steep pass slows your party.",
    image: `${BASE}/Mountain crossing .png`,
    effect: (party, inv) => {
      for (let i = 0; i < party.members.length; i++) {
        party.getMember(i).takeDamage(gameRNG.nextIntRange(5, 15));
      }
      inv.foodPounds = Math.max(0, inv.foodPounds - 25);
    }
  },
  [EventType.NEAR_MISS_BRIDGE_COLLAPSE]: {
    title: "Near Miss Bridge Collapse",
    text: "You encounter near miss bridge collapse.",
    image: `${BASE}/near miss bridge collapse.png`,
    effect: (party, inv) => {
      // One minor injury
      const idx = gameRNG.nextIntRange(0, party.members.length - 1);
      party.getMember(idx).takeDamage(gameRNG.nextIntRange(3, 10));
      inv.foodPounds = Math.max(0, inv.foodPounds - 10);
    }
  },
  [EventType.NIGHTIME_CAMPING]: {
    title: "Nightime Camping",
    text: "As darkness falls, you set up camp, cook a simple meal, and let everyone rest before continuing in the morning.",
    image: `${BASE}/nightime camping.png`
  },
  [EventType.NIGHT_THEFT_ACTIVE_THIEF]: {
    title: "Night Theft Active Thief",
    text: "A thief makes off with supplies.",
    image: `${BASE}/Night Theft active thief.png`,
    effect: (_party, inv) => {
      inv.foodPounds = Math.max(0, inv.foodPounds - gameRNG.nextIntRange(10, 25));
      inv.money = Math.max(0, inv.money - gameRNG.nextIntRange(5, 20));
    }
  },
  [EventType.OXEN_DEATH_OR_INJURY]: {
    title: "Oxen Trouble",
    text: "One of your oxen is hurt and can’t pull as well." ,
    image: `${BASE}/oxen death or injury.png`
  },
  [EventType.OXEN_INJURY_MILD_VERSION]: {
    title: "Oxen Injury Mild Version",
    text: "Your oxen struggle on the trail.",
    image: `${BASE}/Oxen Injury - Mild Version.png`
  },
  [EventType.OXEN_SEVERE_COLLAPSE]: {
    title: "Oxen Severe Collapse",
    text: "Your oxen struggle on the trail.",
    image: `${BASE}/Oxen Severe Collapse.png`
  },
  [EventType.OX_DROWNING]: {
    title: "Ox Drowning",
    text: "Your oxen struggle on the trail.",
    image: `${BASE}/Ox Drowning.png`,
    effect: (_party, inv) => {
      inv.foodPounds = Math.max(0, inv.foodPounds - 25);
    }
  },
  [EventType.RACCOONS_STEALING_SUPPLIES]: {
    title: "Raccoons Stealing Supplies",
    text: "You encounter raccoons stealing supplies.",
    image: `${BASE}/Raccoons stealing supplies.png`,
    effect: (_party, inv) => {
      inv.foodPounds = Math.max(0, inv.foodPounds - gameRNG.nextIntRange(5, 20));
    }
  },
  [EventType.RIVER_CROSSING_PARTIAL_WAGON_LOSS]: {
    title: "River Crossing Loss",
    text: "The wagon tips in the river and you lose some supplies.",
    image: `${BASE}/river crossing partial wagon loss.png`,
    effect: (_party, inv) => {
      inv.foodPounds = Math.max(0, inv.foodPounds - gameRNG.nextIntRange(20, 40));
      if (inv.spareWheels > 0) inv.spareWheels -= 1;
    }
  },
  [EventType.RIVER_CROSSING_TOTAL_WAGON_LOSS]: {
    title: "River Crossing Total Wagon Loss",
    text: "You encounter river crossing total wagon loss.",
    image: `${BASE}/river crossing total wagon loss.png`,
    effect: (_party, inv) => {
      inv.foodPounds = 0;
      inv.ammoRounds = 0;
      inv.clothingSets = 0;
      inv.spareWheels = 0;
      inv.spareAxles = 0;
      inv.spareTongues = 0;
      inv.money = Math.floor(inv.money * 0.3); // Some gold survives in pockets
    }
  },
  [EventType.ROCK_HILL_CROSSING_WITH_WAGON_TIPPING_OVER]: {
    title: "Rock Hill Crossing With Wagon Tipping Over",
    text: "You encounter rock hill crossing with wagon tipping over.",
    image: `${BASE}/rock hill crossing with wagon tipping over.png`,
    effect: (party, inv) => {
      // One significant injury
      const idx = gameRNG.nextIntRange(0, party.members.length - 1);
      party.getMember(idx).takeDamage(gameRNG.nextIntRange(15, 35));

      inv.foodPounds = Math.max(0, inv.foodPounds - gameRNG.nextIntRange(15, 30));
      if (inv.spareAxles > 0) inv.spareAxles -= 1;
    }
  },
  [EventType.RUNAWAY_OXEN_FULL_OUT_OF_CONTROL_STAMPEDE]: {
    title: "Runaway Oxen Full Out Of Control Stampede",
    text: "Your oxen struggle on the trail.",
    image: `${BASE}/Runaway Oxen - Full Out-of-Control Stampede.png`,
    effect: (party, inv) => {
      // Entire party risks damage
      for (let i = 0; i < party.members.length; i++) {
        if (gameRNG.nextIntRange(1, 3) === 1) {
          party.getMember(i).takeDamage(gameRNG.nextIntRange(5, 20));
        }
      }
      inv.foodPounds = Math.max(0, inv.foodPounds - 20);
    }
  },
  [EventType.SETTLEMENT_SUCCESS]: {
    title: "Settlement Success",
    text: "You encounter settlement success.",
    image: `${BASE}/settlement success.png`
  },
  [EventType.SEVERE_DESERT_CROSSING]: {
    title: "Severe Desert Crossing",
    text: "You encounter severe desert crossing.",
    image: `${BASE}/severe desert crossing.png`,
    effect: (party, inv) => {
      for (let i = 0; i < party.members.length; i++) {
        party.getMember(i).takeDamage(gameRNG.nextIntRange(15, 35));
      }
      inv.foodPounds = Math.max(0, inv.foodPounds - 50);
    }
  },
  [EventType.SEVERE_FOOD_SHORTAGE]: {
    title: "Severe Food Shortage",
    text: "You encounter severe food shortage.",
    image: `${BASE}/severe food shortage.png`,
    effect: (party, inv) => {
      inv.foodPounds = Math.max(0, inv.foodPounds - gameRNG.nextIntRange(40, 80));

      for (let i = 0; i < party.members.length; i++) {
        party.getMember(i).takeDamage(gameRNG.nextIntRange(5, 15));
      }
    }
  },
  [EventType.SEVERE_FOOD_SPOILAGE]: {
    title: "Food Spoiled",
    text: "A large part of your food has spoiled and must be thrown away.",
    image: `${BASE}/severe food spoilage.png`,
    effect: (_party, inv) => {
      inv.foodPounds = Math.max(0, inv.foodPounds - gameRNG.nextIntRange(60, 130));
    }
  },
  [EventType.SEVERE_MUD_TRAP]: {
    title: "Severe Mud Trap",
    text: "You encounter severe mud trap.",
    image: `${BASE}/Severe Mud Trap.png`,
    effect: (party, inv) => {
      const idx = gameRNG.nextIntRange(0, party.members.length - 1);
      party.getMember(idx).takeDamage(gameRNG.nextIntRange(5, 15));

      inv.foodPounds = Math.max(0, inv.foodPounds - 25);
    }
  },
  [EventType.SEVERE_THIRST_ACROOS_PLAINS]: {
    title: "Severe Thirst Acroos Plains",
    text: "You encounter severe thirst acroos plains.",
    image: `${BASE}/severe thirst acroos plains.png`,
    effect: (party, inv) => {
      for (let i = 0; i < party.members.length; i++) {
        party.getMember(i).takeDamage(gameRNG.nextIntRange(10, 25));
      }
      inv.foodPounds = Math.max(0, inv.foodPounds - 20);
    }

  },
  [EventType.SMALL_WAGON_FIRE]: {
    title: "Small Wagon Fire",
    text: "A fire breaks out at camp.",
    image: `${BASE}/small wagon fire.png`,
    effect: (_party, inv) => {
      inv.foodPounds = Math.max(0, inv.foodPounds - gameRNG.nextIntRange(10, 25));
      if (inv.spareWheels > 0 && gameRNG.nextIntRange(1, 3) === 1) {
        inv.spareWheels -= 1;
      }
    }
  },
  [EventType.SNAKE_BITE]: {
    title: "Snake Bite",
    text: "A rattlesnake lurks nearby.",
    image: `${BASE}/snake bite.png`,
    effect: (party, inv) => {
      const idx = gameRNG.nextIntRange(0, party.members.length - 1);
      party.getMember(idx).takeDamage(gameRNG.nextIntRange(15, 30));

      if (inv.clothingSets > 0) {
        inv.clothingSets -= 1;
      }
    }
  },
  [EventType.SNOWSTORM]: {
    title: "Snowstorm",
    text: "A blizzard slows your progress.",
    image: `${BASE}/Snowstorm.png`,
    effect: (party, inv) => {
      for (let i = 0; i < party.members.length; i++) {
        party.getMember(i).takeDamage(gameRNG.nextIntRange(5, 15));
      }
      inv.clothingSets = Math.max(0, inv.clothingSets - 1);
      inv.foodPounds = Math.max(0, inv.foodPounds - 20);
    }
  },
  [EventType.STAMPEDE_RUNAWAY_OXEN_NEAR_MISS]: {
    title: "Stampede Runaway Oxen Near Miss",
    text: "Your oxen struggle on the trail.",
    image: `${BASE}/Stampede  Runaway Oxen - Near Miss.png`,
    effect: (party, inv) => {
      const idx = gameRNG.nextIntRange(0, party.members.length - 1);
      party.getMember(idx).takeDamage(gameRNG.nextIntRange(3, 10));
      inv.foodPounds = Math.max(0, inv.foodPounds - 10);
    }
  },
  [EventType.STEEP_RIVERBANK_CROSSING_WAGON_TIPPING_OVER]: {
    title: "Steep Riverbank Crossing Wagon Tipping Over",
    text: "You encounter steep riverbank crossing wagon tipping over.",
    image: `${BASE}/Steep riverbank crossing wagon tipping over.png`,
    effect: (party, inv) => {
      const idx = gameRNG.nextIntRange(0, party.members.length - 1);
      party.getMember(idx).takeDamage(gameRNG.nextIntRange(10, 25));

      if (inv.spareTongues > 0) inv.spareTongues -= 1;
      inv.foodPounds = Math.max(0, inv.foodPounds - 20);
    }
  },
  [EventType.SUCCESFUL_MAKING_IT_TO_DESTINATION]: {
    title: "Succesful Making It To Destination",
    text: "You encounter succesful making it to destination.",
    image: `${BASE}/succesful making it to destination.png`
  },
  [EventType.THUNDERSTORM]: {
    title: "Thunderstorm",
    text: "A storm delays the journey.",
    image: `${BASE}/thunderstorm.png`
  },
  [EventType.TRADING_AT_THE_FORT]: {
    title: "Trading At The Fort",
    text: "You encounter trading at the fort.",
    image: `${BASE}/Trading at the Fort.png`
  },
  [EventType.WAGON_BREAKDOWN_320X200]: {
    title: "Wagon Breakdown",
    text: "You encounter wagon breakdown.",
    image: `${BASE}/wagon_breakdown_320x200.png`,
    effect: (_party, inv) => {
      // Lose one part if available
      if (inv.spareWheels > 0) inv.spareWheels -= 1;
      else if (inv.spareAxles > 0) inv.spareAxles -= 1;
      else if (inv.spareTongues > 0) inv.spareTongues -= 1;

      inv.foodPounds = Math.max(0, inv.foodPounds - 10);
    }
  },
  [EventType.WAGON_FILE_WHILE_TRAVELING]: {
    title: "Wagon File While Traveling",
    text: "You encounter wagon file while traveling.",
    image: `${BASE}/wagon file while traveling.png`,
    effect: (party, inv) => {
      // One mild injury
      const idx = gameRNG.nextIntRange(0, party.members.length - 1);
      party.getMember(idx).takeDamage(gameRNG.nextIntRange(3, 12));

      // Possible part loss
      if (inv.spareAxles > 0 && gameRNG.nextIntRange(1, 3) === 1) {
        inv.spareAxles -= 1;
      }

      inv.foodPounds = Math.max(0, inv.foodPounds - 10);
    }
  },
  [EventType.WAGON_REPAIR_INJURY_MINOR_INJURY]: {
    title: "Wagon Repair Injury Minor Injury",
    text: "You encounter wagon repair injury minor injury.",
    image: `${BASE}/Wagon Repair Injury - Minor Injury.png`,
    effect: (party, _inv) => {
      const idx = gameRNG.nextIntRange(0, party.members.length - 1);
      party.getMember(idx).takeDamage(gameRNG.nextIntRange(5, 15));
    }
  },
  [EventType.WAGON_REPAIR_INJURY_SERIOUS_INJURY]: {
    title: "Wagon Repair Injury Serious Injury",
    text: "You encounter wagon repair injury serious injury.",
    image: `${BASE}/Wagon Repair Injury - Serious Injury.png`,
    effect: (party, _inv) => {
      const idx = gameRNG.nextIntRange(0, party.members.length - 1);
      party.getMember(idx).takeDamage(gameRNG.nextIntRange(15, 35));
    }
  },
  [EventType.WASHED_OUT_PATH]: {
    title: "Washed Out Path",
    text: "Heavy rain has washed out part of the trail, and you have to slow down and carefully pick your way around the damaged ground.",
    image: `${BASE}/Washed-Out-Path.png`,
    effect: (_party, inv) => {
      inv.foodPounds = Math.max(0, inv.foodPounds - 15);
    }
  },
  [EventType.WHEEL_BROKEN_REPAIRABLE_BREAK]: {
    title: "Wheel Broken Repairable Break",
    text: "A wagon wheel gives you trouble.",
    image: `${BASE}/wheel broken repairable break.png`,
    effect: (_party, inv) => {
      if (inv.spareWheels > 0) inv.spareWheels -= 1;
      else if (inv.spareAxles > 0) inv.spareAxles -= 1;
      inv.foodPounds = Math.max(0, inv.foodPounds - 10);
    }
  },
  [EventType.WOLF_ATTACK]: {
    title: "Wolf Attack",
    text: "You encounter wolf attack.",
    image: `${BASE}/wolf attack.png`,
    effect: (party, inv) => {
    // One major injury to a random party member
    const idx = gameRNG.nextIntRange(0, party.members.length - 1);
    party.getMember(idx).takeDamage(gameRNG.nextIntRange(15, 35));

    inv.ammoRounds = Math.max(0, inv.ammoRounds - gameRNG.nextIntRange(5, 15));
    inv.foodPounds = Math.max(0, inv.foodPounds - 15);
  }
  },
  [EventType.BOUNTIFUL_FORAGING_DISCOVERY]: {
    title: "Bountiful Foraging",
    text: "Your party finds plenty of wild berries and plants to gather.",
    image: `${BASE}/BOUNTIFUL_FORAGING_DISCOVERY.png`,
    effect: (_party, inv) => {
      inv.foodPounds += gameRNG.nextIntRange(25, 60); // A1: moderate reward
    }
  },
  [EventType.FRIENDLY_TRAPPERS_ASSISTANCE]: {
    title: "Friendly Trappers Assistance",
    text: "A small group of trappers welcomes your party, sharing a few supplies and offering practical advice about the trail ahead.",
    image: `${BASE}/FRIENDLY_TRAPPERS_ASSISTANCE.png`,
    effect: (_party, inv) => {
      inv.foodPounds += gameRNG.nextIntRange(20, 50);
      inv.ammoRounds += gameRNG.nextIntRange(10, 25);
      inv.clothingSets += 1; // modest clothing bonus
    }
  },
  [EventType.ABANDONED_CACHE_OF_SUPPLIES]: {
    title: "Abandoned Cache of Supplies",
    text: "Just off the trail, you find a small stash of old crates and barrels. Most are ruined, but a few supplies are still worth taking.",
    image: `${BASE}/ABANDONED_CACHE_OF_SUPPLIES.png`,
    effect: (_party, inv) => {
      // Random outcome — sometimes a little, sometimes a lot
      const foodGain = gameRNG.nextIntRange(10, 60);
      const ammoGain = gameRNG.nextIntRange(0, 15);
      const clothingGain = gameRNG.nextIntRange(0, 2);

      inv.foodPounds += foodGain;
      inv.ammoRounds += ammoGain;
      inv.clothingSets += clothingGain;
    }
  },
}

// 4) Helper to trigger + render an event in UI
export function triggerEvent(eventType: EventType) {
  const data = EVENT_MAP[eventType] || {
    title: "Unknown Event",
    text: "Something unexpected happens on the trail.",
    image: "",
    effect: null
  };

  // Do NOT apply effect here — GameLoop must apply it
  return {
    title: data.title,
    text: data.text,
    image: data.image,
    effect: data.effect // return the effect function
  };
}

