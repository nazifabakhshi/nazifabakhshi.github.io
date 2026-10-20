import react, { useMemo , useState, useEffect, JSX} from "react"
import { setBackground } from "./BackgroundFrame";
import Backgrounds from "./Backgrounds";
import { Link, useLocation } from "react-router-dom"
import { Inventory } from "./GameInventory";

type ShopFormProps = {
    startingMoney?: number;
    onCheckout?: (purchase: PurchaseSummary) => void;
    bg?: string;                // background to set on mount
    exitBg?: string | null;     // background to set on unmount (null => leave as-is)
    restoreOnExit?: boolean;
};

type PurchaseSummary = {
    oxen: number;
    foodPounds: number;
    clothingSets: number;
    ammoBoxes: number;
    spareWheels: number;
    spareAxles: number;
    spareTongues: number;
    totalCost: number;
    remainingMoney: number;
};

const COSTS = {
    oxen: 20,
    foodPerLb: 0.2,
    clothingSet: 10,
    ammoBox: 20,
    wheel: 10,
    axle: 10,
    tongue: 10,
} as const;

const LIMITS = {
    oxenMax: 20,
    foodMax: 2000,
    clothingMax: 99,
    ammoMax: 99,
    wheelsMax: 3,
    axlesMax: 3,
    tonguesMax: 3,
} as const;

function clampInt(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.max(min, Math.min(max, Math.trunc(value)));
}

function formatMoney(amount: number): string {
  // Keep it simple and deterministic for your project (no locale dependencies)
  return `$${amount.toFixed(2)}`;
}


function ShopForm({
  startingMoney,
  onCheckout,
  bg = Backgrounds.TOWN,
  exitBg = Backgrounds.MENU,
  restoreOnExit = true,
}: ShopFormProps): JSX.Element {
  const location = useLocation();
  startingMoney =
    (location.state as { startingMoney?: number } | null)?.startingMoney ??
    startingMoney ??
    0;

  // existing code continues…
  useEffect(() => {
    setBackground(bg);
    return () => {
      if (restoreOnExit && exitBg) setBackground(exitBg);
    };
  }, [bg, exitBg, restoreOnExit]);
// function ShopForm({ startingMoney,
//                     onCheckout,
//                     bg = Backgrounds.TOWN,
//                     exitBg = Backgrounds.MENU,
//                     restoreOnExit = true, 
//                  }: ShopFormProps): JSX.Element {
//   useEffect(() => {
//     SetBackground(bg);               // Set background when Shop loads

//     return () => {
//         if (restoreOnExit && exitBg) SetBackground(exitBg);
//     };
//   }, [bg, exitBg, restoreOnExit]);

    // --- Controlled quantities ---
    const [oxen, setOxen] = useState<number>(0);
    const [foodPounds, setFoodPounds] = useState<number>(0);
    const [clothingSets, setClothingSets] = useState<number>(0);
    const [ammoBoxes, setAmmoBoxes] = useState<number>(0);
    const [spareWheels, setSpareWheels] = useState<number>(0);
    const [spareAxles, setSpareAxles] = useState<number>(0);
    const [spareTongues, setSpareTongues] = useState<number>(0);

    // --- Subtotals & totals (memoized for clarity) ---
    const oxenSubtotal   = useMemo(() => oxen   * COSTS.oxen,   [oxen]);
    const foodSubtotal   = useMemo(() => foodPounds  * COSTS.foodPerLb,  [foodPounds]);
    const clothSubtotal  = useMemo(() => clothingSets* COSTS.clothingSet,[clothingSets]);
    const ammoSubtotal   = useMemo(() => ammoBoxes   * COSTS.ammoBox,    [ammoBoxes]);
    const wheelsSubtotal = useMemo(() => spareWheels * COSTS.wheel,      [spareWheels]);
    const axlesSubtotal  = useMemo(() => spareAxles  * COSTS.axle,       [spareAxles]);
    const tonguesSubtotal= useMemo(() => spareTongues* COSTS.tongue,     [spareTongues]);

    const totalCost = useMemo(
        () =>
            oxenSubtotal +
            foodSubtotal +
            clothSubtotal +
            ammoSubtotal +
            wheelsSubtotal +
            axlesSubtotal +
            tonguesSubtotal,
            [oxenSubtotal, foodSubtotal, clothSubtotal, ammoSubtotal, wheelsSubtotal, axlesSubtotal, tonguesSubtotal]
    );

    const remainingMoney = useMemo(
        () => startingMoney! - totalCost,
        [startingMoney, totalCost]
    );

    function handleCheckout(): void {
    const summary: PurchaseSummary = {
        oxen,
        foodPounds,
        clothingSets,
        ammoBoxes,
        spareWheels,
        spareAxles,
        spareTongues,
        totalCost,
        remainingMoney,
    };

          if (remainingMoney < 0) {
        return;
      }

      // Update the global Inventory object
      Inventory.oxen    += oxen;
      Inventory.foodPounds   += foodPounds;
      Inventory.clothingSets += clothingSets;
      Inventory.ammoRounds   += ammoBoxes * 10;
      Inventory.spareWheels  += spareWheels;
      Inventory.spareAxles   += spareAxles;
      Inventory.spareTongues += spareTongues;
      Inventory.money         = remainingMoney;

      if (onCheckout) onCheckout(summary);
    }
    return (
      <div className="container-fluid bg-dark bg-opacity-50 w-75 p-3">
        <form className="ms-3">
          {/* Row: Oxen */}
          <div className="row">
            <div className="col-6 border border-bottom-0 border-top-0 border-start-0">
              Oxen
            </div>
            <div className="col border border-bottom-0 border-top-0">
              {formatMoney(COSTS.oxen)}
            </div>
            <div className="col border border-bottom-0 border-top-0 text-end">
              <label htmlFor="oxen" className="me-2">Oxen (max {LIMITS.oxenMax}):</label>
              <input
                id="oxen"
                name="oxen"
                className="shopItem"
                type="number"
                min={0}
                max={LIMITS.oxenMax}
                value={oxen}
                style={{ width: "6em" }}
                onChange={(e) => setOxen(clampInt(Number(e.target.value), 0, LIMITS.oxenMax))}
              />
            </div>
            <div className="col border border-bottom-0 border-top-0 border-end-0" aria-live="polite">
              {oxen > 0 ? formatMoney(oxenSubtotal) : ""}
            </div>
          </div>

          {/* Row: Food */}
          <div className="row">
            <div className="col-6 border border-bottom-0 border-top-0 border-start-0">Pounds of food</div>
            <div className="col border border-bottom-0 border-top-0">
              {formatMoney(COSTS.foodPerLb)}
            </div>
            <div className="col border border-bottom-0 border-top-0 text-end">
              <label htmlFor="food" className="me-2">Pounds of Food (max {LIMITS.foodMax}):</label>
              <input
                id="food"
                name="food"
                className="shopItem"
                type="number"
                min={0}
                max={LIMITS.foodMax}
                step={1}
                value={foodPounds}
                style={{ width: "6em" }}
                onChange={(e) => setFoodPounds(clampInt(Number(e.target.value), 0, LIMITS.foodMax))}
              />
            </div>
            <div className="col border border-bottom-0 border-top-0 border-end-0">
              {foodPounds > 0 ? formatMoney(foodSubtotal) : ""}
            </div>
          </div>

          {/* Row: Clothing */}
          <div className="row">
            <div className="col-6 border border-bottom-0 border-top-0 border-start-0">Sets of clothing</div>
            <div className="col border border-bottom-0 border-top-0">
              {formatMoney(COSTS.clothingSet)}
            </div>
            <div className="col border border-bottom-0 border-top-0 text-end">
              <label htmlFor="clothes" className="me-2">Sets of Clothes (max {LIMITS.clothingMax}):</label>
              <input
                id="clothes"
                name="clothes"
                className="shopItem"
                type="number"
                min={0}
                max={LIMITS.clothingMax}
                value={clothingSets}
                style={{ width: "6em" }}
                onChange={(e) => setClothingSets(clampInt(Number(e.target.value), 0, LIMITS.clothingMax))}
              />
            </div>
            <div className="col border border-bottom-0 border-top-0 border-end-0">
              {clothingSets > 0 ? formatMoney(clothSubtotal) : ""}
            </div>
          </div>

          {/* Row: Ammunition */}
          <div className="row">
            <div className="col-6 border border-bottom-0 border-top-0 border-start-0">
              Boxes of ammunition <span className="text-black">– 20 rounds each</span>
            </div>
            <div className="col border border-bottom-0 border-top-0">
              {formatMoney(COSTS.ammoBox)}
            </div>
            <div className="col border border-bottom-0 border-top-0 text-end">
              <label htmlFor="ammo" className="me-2">Boxes of Ammo (max {LIMITS.ammoMax}):</label>
              <input
                id="ammo"
                name="ammo"
                className="shopItem"
                type="number"
                min={0}
                max={LIMITS.ammoMax}
                value={ammoBoxes}
                style={{ width: "6em" }}
                onChange={(e) => setAmmoBoxes(clampInt(Number(e.target.value), 0, LIMITS.ammoMax))}
              />
            </div>
            <div className="col border border-bottom-0 border-top-0 border-end-0">
              {ammoBoxes > 0 ? formatMoney(ammoSubtotal) : ""}
            </div>
          </div>

          {/* Row: Wheels */}
          <div className="row">
            <div className="col-6 border border-bottom-0 border-top-0 border-start-0">Spare wagon wheels</div>
            <div className="col border border-bottom-0 border-top-0">
              {formatMoney(COSTS.wheel)}
            </div>
            <div className="col border border-bottom-0 border-top-0 text-end">
              <label htmlFor="wheels" className="me-2">Spare Wheels (max {LIMITS.wheelsMax}):</label>
              <input
                id="wheels"
                name="wheels"
                className="shopItem"
                type="number"
                min={0}
                max={LIMITS.wheelsMax}
                value={spareWheels}
                style={{ width: "6em" }}
                onChange={(e) => setSpareWheels(clampInt(Number(e.target.value), 0, LIMITS.wheelsMax))}
              />
            </div>
            <div className="col border border-bottom-0 border-top-0 border-end-0">
              {spareWheels > 0 ? formatMoney(wheelsSubtotal) : ""}
            </div>
          </div>

          {/* Row: Axles */}
          <div className="row">
            <div className="col-6 border border-bottom-0 border-top-0 border-start-0">Spare wagon axles</div>
            <div className="col border border-bottom-0 border-top-0">
              {formatMoney(COSTS.axle)}
            </div>
            <div className="col border border-bottom-0 border-top-0 text-end">
              <label htmlFor="axles" className="me-2">Spare Axles (max {LIMITS.axlesMax}):</label>
              <input
                id="axles"
                name="axles"
                className="shopItem"
                type="number"
                min={0}
                max={LIMITS.axlesMax}
                value={spareAxles}
                style={{ width: "6em" }}
                onChange={(e) => setSpareAxles(clampInt(Number(e.target.value), 0, LIMITS.axlesMax))}
              />
            </div>
            <div className="col border border-bottom-0 border-top-0 border-end-0">
              {spareAxles > 0 ? formatMoney(axlesSubtotal) : ""}
            </div>
          </div>

          {/* Row: Tongues */}
          <div className="row">
            <div className="col-6 border border-top-0 border-bottom-0 border-start-0">Spare wagon tongues</div>
            <div className="col border border-top-0 border-bottom-0">
              {formatMoney(COSTS.tongue)}
            </div>
            <div className="col border border-top-0 border-bottom-0 text-end">
              <label htmlFor="tongues" className="me-2">Spare Tongues (max {LIMITS.tonguesMax}):</label>
              <input
                id="tongues"
                name="tongues"
                className="shopItem"
                type="number"
                min={0}
                max={LIMITS.tonguesMax}
                value={spareTongues}
                style={{ width: "6em" }}
                onChange={(e) => setSpareTongues(clampInt(Number(e.target.value), 0, LIMITS.tonguesMax))}
              />
            </div>
            <div className="col border border-top-0 border-bottom-0 border-end-0" id="tongues-subtotal">
              {spareTongues > 0 ? formatMoney(tonguesSubtotal) : ""}
            </div>
          </div>

          {/* Totals */}
          <h4 id="shopCost" className="mt-3">Total bill: {formatMoney(totalCost)}</h4>
          <h4 id="yourMoney">You have: {formatMoney(startingMoney!)} &nbsp;
            <span className={remainingMoney < 0 ? "text-danger" : "text-success"}>
              (Remaining: {formatMoney(remainingMoney)})
            </span>
          </h4>

          <Link id="startButton" className="btn btn-outline-dark btn-light mt-3"
          style={{
            fontSize: '1.25vw',
            padding: '.5rem',
            borderWidth: '2px',
            fontFamily: 'OregonBound'
          }} to={"/game-loop"}
            onClick={(event) => {
            if (remainingMoney < 0) {
              event.preventDefault();    
              return;
            }
            handleCheckout();        
          }}>
            Checkout
          </Link>
        </form>
      </div>
    );
}

export default ShopForm;
export type { PurchaseSummary, ShopFormProps};