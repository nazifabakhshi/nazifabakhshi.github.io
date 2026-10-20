import { JSX, useEffect, useMemo, useState } from "react";
import { setBackground } from "./BackgroundFrame";
import { Pace, Party, Rations } from "./Party";
import { gameRNG } from "./Random";
import Backgrounds from "./Backgrounds";
import { eventChance } from "./RandomEventTrigger";
import { Link, Navigate, useNavigate } from "react-router";
import { Inventory } from "./GameInventory";
import { EventType, triggerEvent } from "./EventType";
import { LANDMARKS, LandmarkID } from "./Landmarks";

type GameLoopProps = {
    party: Party;
};

const GameLoop = ({ party }: GameLoopProps): JSX.Element => {

    const navigate = useNavigate();

    let [pace, setPace] = useState<Pace>(party.getPace());
    let [rations, setRations] = useState<Rations>(party.getRations());
    let [oxen, setOxen] = useState<number>(Inventory.oxen * 2);
    let [distanceTravelled, setDistanceTravelled] = useState<number>(0);
    const [eventData, setEventData] = useState<any>(null);
    const [nextLandmarkIndex, setNextLandmarkIndex] = useState<number>(party.getLandmarkIndex());

    function handleLandmarkChoice(choiceMile: number) {
        LANDMARKS[nextLandmarkIndex].mile = choiceMile;
        setEventData(null);
        setNextLandmarkIndex(nextLandmarkIndex + 1);
        party.setLandmarkIndex(nextLandmarkIndex + 1);
    }

    function cyclePace(): void {
        let next: Pace;

        switch (pace) {
            case Pace.STEADY: next = Pace.STRENUOUS; break;
            case Pace.STRENUOUS: next = Pace.GRUELING; break;
            case Pace.GRUELING:
            default: next = Pace.STEADY; break;
        }

        setPace(next);
        party.setPace(next);
    }

    function cycleRations(): void {
        let next: Rations;

        switch (rations) {
            case Rations.BAREBONES: next = Rations.FILLING; break;
            case Rations.MEAGER: next = Rations.BAREBONES; break;
            case Rations.FILLING:
            default: next = Rations.MEAGER; break;
        }

        setRations(next);
        party.setRations(next);
    }

    const StepDay = () => {

        // -----------------------------------------------------------
        // PREVENT DAY ADVANCE WHILE POPUP IS OPEN (fork or river)
        // -----------------------------------------------------------
        if (eventData && (eventData.type === "fork" || eventData.type === "river")) {
            return;
        }

        party.setDays(party.getDays() + 1);

        // ---- TRAVEL ----
        let paceMultiplier: number;
        let foodPerDay: number;

        switch (pace) {
            case Pace.STEADY: paceMultiplier = .7; break;
            case Pace.STRENUOUS: paceMultiplier = .85; break;
            case Pace.GRUELING: paceMultiplier = 1; break;
            default: paceMultiplier = .7; break;
        }

        switch (rations) {
            case Rations.BAREBONES: foodPerDay = 1; break;
            case Rations.MEAGER: foodPerDay = 2; break;
            case Rations.FILLING: foodPerDay = 3; break;
            default: foodPerDay = 2; break;
        }

        const maxDistance = 35;
        const fuzz = gameRNG.next();

        let livingCount = 0;
        let totalHealth = 0;

        for (let m of party.members) {
            if (m.isLiving()) {
                livingCount++;
                totalHealth += m.getHealth() / 100;
            }
        }

        const avgHealth = livingCount > 0 ? (totalHealth / livingCount) : -5;

        // -----------------------------------------------------------
        // FIXED: DO NOT MUTATE REACT STATE (oxen)
        // -----------------------------------------------------------
        const ox = Math.min(oxen, 10);

        let dayDistance = 0;

        if (avgHealth > 0) {
            dayDistance =
                maxDistance *
                ((ox / 20) + (avgHealth * .2) + (paceMultiplier * .2) + (fuzz * .1));
        } else {
            dayDistance = 0;
        }

        setDistanceTravelled(dayDistance);
        party.setTotalDistance(party.getTotalDistance() + dayDistance);

        const totalMiles = party.getTotalDistance();

        // ---- FOOD, MALNUTRITION, DAMAGE ----
        for (let m of party.members) {
            if (m.isLiving()) {
                Inventory.foodPounds -= foodPerDay;
                if (Inventory.foodPounds < 0) Inventory.foodPounds = 0;
            }
        }

        const rMult = rations === Rations.BAREBONES ? .7 :
            rations === Rations.MEAGER ? .85 : 1;

        let malMult = (paceMultiplier - rMult) * 100;
        if (Inventory.foodPounds === 0) malMult = 40;
        if (malMult === 0) malMult = -5;

        for (let m of party.members) {
            if (!m.isLiving()) continue;

            m.setMalnutrition(m.getMalnutrition() + malMult);

            if (m.getMalnutrition() > 100) m.setMalnutrition(100);
            if (m.getMalnutrition() < 0) m.setMalnutrition(0);
        }

        for (let m of party.members) {
            if (m.isLiving() && m.getMalnutrition() > 30 && malMult > 0) {
                m.takeDamage((malMult * .5) * gameRNG.next());
            }
        }

        if (avgHealth === -5) {
            navigate("/failure");
            return;
        }

        // ---- LANDMARKS ----
        const nextLm = LANDMARKS[nextLandmarkIndex];

        if (nextLm && typeof nextLm.mile === "number" && totalMiles >= nextLm.mile) {

            // END GAME — OREGON CITY
            if (nextLm.id === LandmarkID.OREGON_CITY) {

                const deadMembers = party.members.filter(m => !m.isLiving());

                setEventData({
                    title: "Oregon City",
                    text: "You have completed the Oregon Trail!",
                    image: nextLm.image || "",
                    type: "oregon",
                    stats: {
                        days: party.getDays(),
                        miles: totalMiles.toFixed(1),
                        deadCount: deadMembers.length,
                        deadNames: deadMembers.map(m => m.getName()),
                        food: Inventory.foodPounds,
                        ammo: Inventory.ammoRounds,
                        money: Number(Inventory.money.toFixed(2)), // FIXED
                        clothes: Inventory.clothingSets,
                        oxen: Inventory.oxen,
                        wheels: Inventory.spareWheels,
                        axles: Inventory.spareAxles,
                        tongues: Inventory.spareTongues,
                    }
                });

                setNextLandmarkIndex(nextLandmarkIndex + 1);
                party.setLandmarkIndex(nextLandmarkIndex + 1);
                return;
            }

            // RIVER LANDMARK — SHOW CHOICES
            if (nextLm.type === "river") {

                const ferryCost = 5;

                const choices = [
                    { text: "Attempt to Ford", action: "ford" },
                    { text: "Caulk the Wagon and Float", action: "caulk" }
                ];

                if (Inventory.money >= ferryCost) {
                    choices.push({ text: `Hire a Ferry ($${ferryCost})`, action: "ferry" });
                }

                setEventData({
                    title: nextLm.name,
                    text: `You have reached ${nextLm.name}. How will you cross the river?`,
                    image: nextLm.image || "",
                    type: "river",
                    id: nextLm.id,
                    choices
                });

                setNextLandmarkIndex(nextLandmarkIndex + 1);
                party.setLandmarkIndex(nextLandmarkIndex + 1);
                return;
            }

            // FORK LANDMARK
            if (nextLm.type === "fork") {
                setEventData({
                    title: nextLm.name,
                    text: "The trail divides ahead...",
                    image: nextLm.image || "",
                    type: "fork",
                    id: nextLm.id,
                    choices: nextLm.choices
                });
                return;
            }

            if (nextLm.type === "fort") {
                setEventData({
                    title: nextLm.name,
                    text: `You have reached ${nextLm.name}.`,
                    image: nextLm.image || "",
                    type: "fort",
                    id: nextLm.id
                });
                return;
            }

            // NORMAL LANDMARK
            setEventData({
                title: nextLm.name,
                text: `You have reached ${nextLm.name}.`,
                image: nextLm.image || "",
                type: nextLm.type,
                id: nextLm.id
            });

            setNextLandmarkIndex(nextLandmarkIndex + 1);
            party.setLandmarkIndex(nextLandmarkIndex + 1);
            return;
        }

        // RANDOM EVENT
        // RANDOM EVENT
        const result = eventChance();
        if (result.triggered) {
            const data = triggerEvent(result.event!);
            if (typeof data.effect === "function") data.effect(party, Inventory);

            setEventData({
                title: data.title,
                text: data.text,
                image: data.image,
                type: "random"
            });

            return;
        }

        setBackground(Backgrounds.PLAINS);
    };

    // ============================
    // POPUP HANDLER (EVENT UI)
    // ============================
    if (eventData) {

        const handleContinue = () => {

            if (eventData.type === "fort") {
                setNextLandmarkIndex(nextLandmarkIndex + 1);
                party.setLandmarkIndex(nextLandmarkIndex + 1);
                navigate("/shop", { state: { startingMoney: Inventory.money } });
                return;
            }

            // OREGON → MAIN MENU
            if (eventData.type === "oregon") {
                navigate("/");
                return;
            }

            setEventData(null);
        };

        return (
            <div style={{
                position: "fixed",
                top: 0, left: 0,
                width: "100vw", height: "100vh",
                background: "rgba(0,0,0,0.75)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 99999,
            }}>
                <div style={{
                    background: "#e0c89c",
                    border: "8px solid #3b2f1a",
                    borderRadius: "4px",
                    padding: "20px",
                    width: "600px",
                    maxWidth: "90%",
                    textAlign: "center",
                    fontFamily: "'Press Start 2P', monospace",
                }}>

                    {/* TITLE BAR */}
                    <div style={{
                        background: "#1a3b1a",
                        padding: "10px",
                        marginBottom: "15px",
                        border: "4px solid #3b2f1a",
                        color: "#e0e6d8",
                        fontSize: "18px",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                    }}>
                        {eventData.title}
                    </div>

                    {/* IMAGE */}
                    {eventData.image && (
                        <div style={{
                            border: "4px solid #3b2f1a",
                            marginBottom: "15px",
                        }}>
                            <img src={eventData.image} style={{
                                width: "100%",
                                height: "auto",
                                imageRendering: "pixelated"
                            }} />
                        </div>
                    )}

                    {/* TEXT */}
                    <div style={{
                        fontSize: "16px",
                        lineHeight: "1.4",
                        marginBottom: "25px",
                        padding: "0 10px"
                    }}>

                        {/* NORMAL EVENT TEXT */}
                        {eventData.type !== "oregon" && (
                            <p>{eventData.text}</p>
                        )}

                        {/* OREGON SUMMARY */}
                        {eventData.type === "oregon" && (
                            <div style={{ textAlign: "left", marginLeft: "20px" }}>
                                <p>{eventData.text}</p>

                                <p><b>Travel Summary:</b></p>
                                <p>Days Traveled: {eventData.stats.days}</p>
                                <p>Total Miles: {eventData.stats.miles}</p>

                                <p>Party Members Dead: {eventData.stats.deadCount}</p>
                                {eventData.stats.deadNames.map((n: string, i: number) => (
                                    <p key={i}>- {n}</p>
                                ))}

                                <p><b>Supplies Remaining:</b></p>
                                <p>Food: {eventData.stats.food} lbs</p>
                                <p>Ammo: {eventData.stats.ammo} rounds</p>
                                <p>Money: ${eventData.stats.money}</p>
                                <p>Clothing: {eventData.stats.clothes} sets</p>
                                <p>Oxen: {eventData.stats.oxen}</p>
                                <p>Wheels: {eventData.stats.wheels}</p>
                                <p>Axles: {eventData.stats.axles}</p>
                                <p>Tongues: {eventData.stats.tongues}</p>
                            </div>
                        )}

                    </div>

                    {/* ============================
                        CHOICES (river or fork)
                    ============================ */}
                    {eventData.choices && (
                        <div>
                            {eventData.choices.map((c: any, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => {

                                        // ============================
                                        // RIVER CHOICE HANDLING (patched)
                                        // ============================
                                        if (eventData.type === "river") {

                                            let selectedEvent: EventType | null = null;

                                            if (c.action === "ford") {
                                                selectedEvent = EventType.FORD_CROSSING;
                                            }
                                            else if (c.action === "caulk") {
                                                selectedEvent = EventType.RIVER_CROSSING_PARTIAL_WAGON_LOSS;
                                            }
                                            else if (c.action === "ferry") {
                                                selectedEvent = EventType.FERRY_RAFT_RIVER_CROSSING;
                                                Inventory.money -= 5;
                                            }

                                            // Safety: ensure selectedEvent is valid
                                            if (!selectedEvent) return;

                                            const data = triggerEvent(selectedEvent);
                                            if (typeof data.effect === "function") {
                                                data.effect(party, Inventory);
                                            }

                                            setEventData({
                                                title: data.title,
                                                text: data.text,
                                                image: data.image
                                            });

                                            return;
                                        }

                                        // ============================
                                        // FORK CHOICE HANDLING (patched)
                                        // ============================
                                        if (eventData.type === "fork") {
                                            if (typeof c.mile === "number") {
                                                handleLandmarkChoice(c.mile);
                                                return;
                                            }
                                        }

                                        // fallback: close popup if nothing valid
                                        setEventData(null);

                                    }}
                                    style={{
                                        background: "#1a3b1a",
                                        color: "#e0e6d8",
                                        border: "4px solid #3b2f1a",
                                        padding: "10px 20px",
                                        fontSize: "18px",
                                        cursor: "pointer",
                                        width: "80%",
                                        marginBottom: "10px",
                                        textTransform: "uppercase"
                                    }}
                                >
                                    {c.text}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* CONTINUE BUTTON */}
                    {!eventData.choices && (
                        <button
                            onClick={handleContinue}
                            style={{
                                background: "#1a3b1a",
                                color: "#e0e6d8",
                                border: "4px solid #3b2f1a",
                                padding: "10px 20px",
                                cursor: "pointer",
                                width: "60%",
                                textTransform: "uppercase"
                            }}>
                            Continue
                        </button>
                    )}

                </div>
            </div>
        );
    }

    // ============================
    // MAIN GAME UI
    // ============================
    return (
        <>
            <div className="d-flex flex-column justify-content-end w-100 h-100">
                <div className="container-fluid bg-secondary bg-opacity-50 pb-3">

                    {/* DAY DISPLAY */}
                    <div className="row mt-1">
                        <div className="col-1"></div>

                        <div className="col-10">
                            <div className="row pb-2">
                                <div className="col-12 text-center">Day {party.getDays()}</div>
                            </div>

                            <div className="row">

                                {/* INVENTORY PANEL */}
                                <div className="col-3">
                                    <div className="bg-dark rounded-3 pt-2 pb-2">
                                        Inventory
                                        <hr className="mt-1 mb-1" />
                                        <div className="text-start ps-1">
                                            Oxen: {Inventory.oxen}<br />
                                            Food: {Inventory.foodPounds} lbs<br />
                                            Ammo: {Inventory.ammoRounds} rounds<br />
                                            Money: ${Inventory.money.toFixed(2)}<br />
                                            Clothes: {Inventory.clothingSets} sets<br />
                                            Wagon Axles: {Inventory.spareAxles}<br />
                                            Wagon Wheels: {Inventory.spareWheels}<br />
                                            Wagon Tongues: {Inventory.spareTongues}<br />
                                        </div>
                                    </div>
                                </div>

                                {/* BUTTONS + DISTANCE */}
                                <div className="col-9">
                                    <div className="container-fluid">
                                        <div className="row">
                                            {/* NEXT LANDMARK DISPLAY */}
                                                {LANDMARKS[nextLandmarkIndex] && (
                                                    <div className="bg-dark rounded-3 pt-2 pb-2 mb-2">
                                                        Next Landmark:<br />
                                                        {LANDMARKS[nextLandmarkIndex].name}<br />
                                                        {(() => {
                                                            const lm = LANDMARKS[nextLandmarkIndex];

                                                            // FIXED:
                                                            // Must check for number, NOT falsy (0 allowed)
                                                            if (typeof lm.mile !== "number") return "";

                                                            const remain = lm.mile - party.getTotalDistance();
                                                            return `(${remain.toFixed(1)} miles away)`;
                                                        })()}
                                                    </div>
                                                )}
                                        </div>

                                        <div className="row">

                                            {/* CONTROL BUTTONS */}
                                            <div className="col-6">
                                                <div className="container-fluid">
                                                    <div className="row">
                                                        <div className="col-6">

                                                            <button
                                                                className="btn bg-white text-dark rounded-3 pt-2 pb-2 mb-2"
                                                                style={{ width: "100%" }}
                                                                onClick={cyclePace}>
                                                                Pace:<br />{Pace[pace]}
                                                            </button>

                                                            <button
                                                                className="btn bg-white text-dark rounded-3 pt-2 pb-2"
                                                                style={{ width: "100%" }}
                                                                onClick={cycleRations}>
                                                                Rations:<br />{Rations[rations]}
                                                            </button>

                                                        </div>
                                                        <div className="col-6">

                                                            <button
                                                                className="btn bg-white text-dark rounded-3 pt-2 pb-2 mb-2"
                                                                style={{ width: "100%" }}
                                                                onClick={StepDay}>
                                                                Next day<br />&nbsp;
                                                            </button>

                                                            <Link
                                                                className="btn bg-white text-dark rounded-3 pt-2 pb-2 mb-2"
                                                                style={{ width: "100%" }}
                                                                to={"/hunt"}>
                                                                Go hunting<br />&nbsp;
                                                            </Link>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* DISTANCE INFO */}
                                            <div className="col-6">

                                                <div className="bg-dark rounded-3 pt-2 pb-2 mb-2">
                                                    Distance yesterday:<br />
                                                    {distanceTravelled.toFixed(1)} miles
                                                </div>

                                                <div className="bg-dark rounded-3 pt-2 pb-2 mb-2">
                                                    Total distance:<br />
                                                    {party.getTotalDistance().toFixed(1)} miles
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="col-1"></div>
                    </div>

                    {/* PARTY HEALTH DISPLAY */}
                    <div className="row mt-1">
                        <div className="col-1"/>
                        {[0, 1, 2, 3, 4].map(i => (
                            <div className="col-2" key={i}>
                                <div className="bg-dark rounded-3 pt-2 pb-2">
                                    {party.getMember(i).getName()}<br />
                                    Health: {Math.ceil(party.getMember(i).getHealth())}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </>
    );
};

export default GameLoop;