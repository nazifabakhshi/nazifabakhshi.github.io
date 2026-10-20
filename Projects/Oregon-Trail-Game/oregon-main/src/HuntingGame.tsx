import React, {JSX, useEffect, useMemo, useRef, useState } from "react";
import { setBackground, getCurrentBackground } from "./BackgroundFrame";
import { useNavigate } from "react-router";
import { Inventory } from "./GameInventory";
import { gameRNG } from "./Random";
import { Party } from "./Party";


type HuntResult = {meat: number; ammoUsed: number};

type MobType = {
    name: string;
    img: string;
    meat: number;
    spawnChance: number;
    sizeMin?: number;
    sizeMax?: number;
};

type Mob = {id: number; x: number; y: number; size: number; type: MobType };

type HuntingGameProps = {
    bg: string;
    initialAmmo: number;
    spawnMs?: number;
    onFinish?: (result: HuntResult) => void;
    party: Party;
};

const MOB_TYPES: MobType[] = [
  { name: "deer",   img: "/images/animals/deer.png",   meat: 25,  sizeMin: 0.089, sizeMax: 0.125, spawnChance: 25 },
  { name: "rabbit", img: "/images/animals/rabbit.png", meat: 5,  sizeMin: 0.040, sizeMax: 0.060, spawnChance: 40 },
  { name: "bison",  img: "/images/animals/bison.png",  meat: 400, sizeMin: 0.121, sizeMax: 0.145, spawnChance: 5 },
];

const MOB_LIFETIME_MS = 800;
const HUNT_DURATION_MS = 15000;
const MEAT_CARRY_CAP = 100;
const NO_SPAWN = 30;

function HuntingGame({
    bg,
    initialAmmo,
    spawnMs = 1200,
    onFinish,
    party,
}: HuntingGameProps): JSX.Element {
    const navigate = useNavigate();
    const [ammo, setAmmo] = useState<number>(initialAmmo);
    const [meat,setMeat] = useState<number>(0);
    const [mobs, setMobs] = useState<Mob[]>([]);
    const [msLeft, setMsLeft] = useState<number>(HUNT_DURATION_MS);
    const [resultOpen, setResultOpen] = useState (false);
    const [finalCarriedMeat, setFinalCarriedMeat] = useState(0);
    const [finalTotalMeat, setFinalTotalMeat] = useState(0);

    
    const prevBgRef = useRef<string | null>(null);
    const spawnTimerRef = useRef<number | null>(null);
    const idRef = useRef<number>(1);
    const mountedRef = useRef<boolean>(false);
    const finishedRef = useRef<boolean>(false);
    const endTimerRef = useRef<number | null>(null);
    const startTimeRef = useRef(0);
    const countdownRef = useRef<number | null>(null);
    const meatRef = useRef<number>(0);
    const ammoRef = useRef<number>(initialAmmo);
    useEffect(() => { meatRef.current = meat; }, [meat]);
    useEffect(() => { ammoRef.current = ammo; }, [ammo]);
    useEffect(() => { if (ammo <=0 && !finishedRef.current) endGame();}, [ammo]);
    
    function endGame(): void {
        if(finishedRef.current) return;
        finishedRef.current = true
        if (spawnTimerRef.current) {
            window.clearInterval(spawnTimerRef.current);
            spawnTimerRef.current = null;
        }
        if (endTimerRef.current) {
            window.clearTimeout(endTimerRef.current);
            endTimerRef.current = null;
        }

        // const characterTypeValue = 
        // (document.getElementById("characterTypeField") as HTMLSelectElement | null)?.value?.toLowerCase() || "";
        const isScientist = party.getCharacterType() ==="scientist";

        const carriedMeat = isScientist ? meatRef.current: Math.min(meatRef.current, MEAT_CARRY_CAP);

        setFinalCarriedMeat(carriedMeat);
        setFinalTotalMeat(meatRef.current);

        if (carriedMeat > 0) {
          // success background
          setBackground("/images/event/huntWin.png");
        } else {
          // failure / no meat background
          setBackground("/images/event/huntLose.png");
        }
        setResultOpen(true);
    }

    function handleResultClose(): void {
        setResultOpen(false);        
          const ammoUsed = initialAmmo - ammoRef.current;
          Inventory.foodPounds += finalCarriedMeat;
          Inventory.ammoRounds = Math.max(0, Inventory.ammoRounds - ammoUsed);
        onFinish?.({
            meat: finalCarriedMeat,
            ammoUsed,
        });
        navigate("/game-loop");
    } 

    const mobSpawn: () => (MobType | null) = useMemo(
        () => {
          return () => {
            const randomPercent = gameRNG.next() * 100;

            if (randomPercent < NO_SPAWN) return null;

            let creatureRoll = randomPercent - NO_SPAWN;

            for ( const creature of MOB_TYPES) {
              if (creatureRoll < creature.spawnChance) {
                return creature;
              }
              creatureRoll -= creature.spawnChance;
            }
            return MOB_TYPES[MOB_TYPES.length -1];
          };
        },[]);

    useEffect(() => {
        mountedRef.current = true;
        prevBgRef.current = getCurrentBackground();
        setBackground(bg);
        startTimeRef.current = Date.now();
        countdownRef.current = window.setInterval(() => {
          const elapsed = Date.now() - startTimeRef.current;
          const left = Math.max(0, HUNT_DURATION_MS - elapsed);
          setMsLeft(left);
          if (left === 0 && countdownRef.current) {
            window.clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
        }, 100);
        endTimerRef.current = window.setTimeout(() => {
            endGame();
        }, HUNT_DURATION_MS);
        return () => {
          mountedRef.current = false;

          if (endTimerRef.current) {
            window.clearTimeout(endTimerRef.current);
            endTimerRef.current = null;
          }
          if (spawnTimerRef.current) {
            window.clearInterval(spawnTimerRef.current);
            spawnTimerRef.current = null;
          }

          if (!finishedRef.current) {
            endGame();
          }

          if (prevBgRef.current !== null) {
            setBackground(prevBgRef.current);
          }
          if ( countdownRef.current) {
            window.clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
        };
    }, [bg]);

    useEffect(() => {
        const spawn = () => {
            if (finishedRef.current) return;
            if (!mountedRef.current) return;

            const selectedType = mobSpawn();
            if (!selectedType) return;

            const id = idRef.current++;
            const x = gameRNG.next() * .94 + 0.03;
            const y = gameRNG.next() * .94 + 0.01;
            const min = selectedType.sizeMin ?? 0.1;
            const max = selectedType.sizeMax ?? 0.14;
            const spawnSize = min + gameRNG.next() * (max - min);

            setMobs(previousMobs => [...previousMobs, { id, x, y, size: spawnSize, type: selectedType }]);

            window.setTimeout(() => {
                if (!mountedRef.current) return;
                setMobs(previousMobs => previousMobs.filter(existingMob => existingMob.id !== id)
                );
            }, MOB_LIFETIME_MS);
        };

        spawn();
        spawnTimerRef.current = window.setInterval(spawn, spawnMs) as unknown as number;

        return () => {
            if (spawnTimerRef.current) {
                window.clearInterval(spawnTimerRef.current);
                spawnTimerRef.current = null;
            }
        };
    }, [spawnMs, mobSpawn]);


    const handleMobClick = (mobId: number, type: MobType) => {
        if (ammo <= 0 || finishedRef.current) return;
        setAmmo(currentAmmo => currentAmmo -1);
        setMeat(currentMeat => currentMeat + type.meat);
        setMobs(previousMobs => previousMobs.filter(existingMob => existingMob.id !== mobId));
    };
    const handleStageClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (ammo <= 0 || finishedRef.current) return;

        const target = event.target as HTMLElement | null;
        if (target && target.tagName.toLowerCase() === "img") {
            // A mob was clicked — let handleMobClick handle ammo usage
            return;
        }

        // Missed shot: consume ammo
        setAmmo(currentAmmo => currentAmmo - 1);
    };
    useEffect(() => {
    if (ammo <= 0 && !finishedRef.current) {
        endGame();
    }
}, [ammo]);
    return (
    <div className="container-fluid p-0 h-100">
      <div className="row g-0 m-0 h-100">
        <div className="col-12 h-100">
          <div
            aria-label="Hunt stage"
            onClick={handleStageClick}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              userSelect: "none",
            }}
          >

            <div
              style={{
                position: "absolute",
                top: "8px",
                left: "8px",
                padding: "4px 8px",
                background: "rgba(0,0,0,0.5)",
                color: "white",
                fontFamily: "OregonBound, monospace",
                fontSize: "clamp(12px, 1.2vw, 18px)",
                borderRadius: "6px",
                pointerEvents: "none",
              }}
            >
              {Math.ceil(msLeft / 1000)}s
            </div>
            {resultOpen && (
              <div
                className="p-3"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "rgba(20,20,20,0.95)",
                  color: "white",
                  borderRadius: "8px",
                  width: "min(460px, 92%)",
                  textAlign: "center",
                  fontFamily: "OregonBound, monospace",
                  zIndex: 10,
                }}
              >
                <h5 className="mb-2">Hunt complete</h5>

                {finalCarriedMeat < finalTotalMeat ? (
                  <p className="mb-3">
                    You acquired <strong>{finalTotalMeat}</strong> lbs of meat but could only carry back{" "}
                    <strong>{MEAT_CARRY_CAP}</strong> lbs.
                  </p>
                ) : (
                  <p className="mb-3">
                    You carried back <strong>{finalCarriedMeat}</strong> lbs of meat.
                  </p>
                )}

                <button className="btn btn-light" onClick={handleResultClose}>OK</button>
              </div>
            )}
            <div
              style={{
                position: "absolute",
                left: "3%",
                right: "3%",
                top: "1%",
                bottom: "5%",
                pointerEvents: "none",
                zIndex: 3,
                cursor: ammo > 0 ? "crosshair" : "not-allowed"
              }}
            />        
            {mobs.map(existingMob => (
              <img
                key={existingMob.id}
                src={existingMob.type.img}
                alt={existingMob.type.name}
                onClick={() => handleMobClick(existingMob.id, existingMob.type)}
                draggable={false}
                style={{
                  position: "absolute",
                  left: `${existingMob.x * 100}%`,
                  top: `${existingMob.y * 100}%`,
                  height: `${existingMob.size * 100}%`,
                  transform: "translate(-50%, -50%)",
                  imageRendering: "pixelated",
                  cursor: ammo > 0 ? "crosshair" : "not-allowed",
                }}
              />
            ))}
                          <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(0,0,0,0.4)",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  color: "white",
                  fontFamily: "OregonBound, monospace",
                  fontSize: "clamp(12px, 1.4vw, 18px)",
                }}
              >
                <strong>Ammo:</strong> {ammo} &nbsp;|&nbsp; <strong>Meat:</strong> {meat} lbs
              </div>
          </div>
        </div>
      </div>
    </div>        
    );
}


export default HuntingGame;