import React, { JSX, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import MainMenu from "./MainMenu";
import Shop from "./Shop";
import { type InitResult, LeaveMonth, InitForm } from "./InitForm";
import HuntingGame from "./HuntingGame";
import Backgrounds from "./Backgrounds";
import GameLoop from "./GameLoop";
import { Inventory } from "./GameInventory";
import { Pace, Party, Rations } from "./Party";
import PartyMember from "./PartyMember";
import Failure from "./Failure";


const PageController = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const [party, setParty] = useState<Party>(() =>
  new Party(
    [
      new PartyMember("Jebidiah", 100, 0, true),
      new PartyMember("Bob", 1, 0, true),
      new PartyMember("Bill", 50, 0, true),
      new PartyMember("Valentina", 100, 0, true),
      new PartyMember("TEST", 70, 0, true),
    ],
    "banker",          // default character type
    Pace.GRUELING,
    Rations.FILLING,
    LeaveMonth.MARCH
  )
);
// NEW: dummy flag just to trigger rerender so that inventory shows correct info on reload of gameloop
const [devSeeded, setDevSeeded] = useState(false);
React.useEffect(() => {
  // Only care about the game loop route
  if (location.pathname !== "/game-loop") return;

  // If Shop has already set inventory, don't overwrite it
  const looksEmpty =
    Inventory.money === 0 &&
    Inventory.oxen === 0 &&
    Inventory.foodPounds === 0 &&
    Inventory.clothingSets === 0 &&
    Inventory.ammoRounds === 0 &&
    Inventory.spareWheels === 0 &&
    Inventory.spareAxles === 0 &&
    Inventory.spareTongues === 0;

  if (!looksEmpty) return;

  // 🔧 Dev-only seed for reload / direct load on /game-loop
  Inventory.money = 500;
  Inventory.oxen = 8;
  Inventory.foodPounds = 800;
  Inventory.clothingSets = 5;
  Inventory.ammoRounds = 200;
  Inventory.spareWheels = 1;
  Inventory.spareAxles = 1;
  Inventory.spareTongues = 1;
  setDevSeeded(true);
}, [location.pathname]);
  // const [party, setParty] = useState<Party | null>(null);
  
  // //if no party exists, use the default party
  // if (party == null) {
  //   setParty(new Party(
  //           [new PartyMember("Jebidiah", 100, 0, true), new PartyMember("Bob", 1, 0, true), new PartyMember("Bill", 50, 0, true), new PartyMember("Valentina", 100, 0, true), new PartyMember("TEST", 70, 0, true)],
  //           "scientist", Pace.GRUELING, Rations.FILLING, LeaveMonth.MARCH
  //   ));
  // }

  function handleInitComplete(result: InitResult): void {
    const newParty = new Party(result.members,result.characterType , Pace.STEADY, Rations.FILLING, result.leaveMonth);

      setParty(newParty);
    // Navigate to the shop screen
    navigate("/shop", { state: { startingMoney: result.startingMoney } });
  }

  function chooseHuntBackground(party:Party | null): string {
    let distance = party?.getTotalDistance() ?? 0;
    if (distance < 50) {
      return Backgrounds.MENU;
    } else if (distance < 600){
      return Backgrounds.PLAINS;
    } else if (distance < 800){
      return Backgrounds.DESERT;
    } else if (distance < 1650){
      return Backgrounds.FOREST;
    } else {
      return Backgrounds.MOUNTAIN;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/init-form" element={<InitForm onComplete={handleInitComplete} />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/hunt" element={<HuntingGame bg={chooseHuntBackground(party)} initialAmmo={Inventory.ammoRounds} party={party}/>} />
      <Route path="/game-loop" element={<GameLoop party={party!}/>} />
      <Route path="/failure" element={<Failure />} />
      <Route path="*" element={<h1 className="display-1 text-warning">404 - No such page</h1>} />
    </Routes>
  );
};

export default PageController;