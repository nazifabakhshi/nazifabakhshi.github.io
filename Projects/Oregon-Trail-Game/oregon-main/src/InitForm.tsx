import React, { JSX, useMemo, useState } from "react";
import PartyMember from "./PartyMember";

// Public types for the form
type CharacterType = "banker" | "carpenter" | "farmer" | "scientist";
enum LeaveMonth {MARCH = "March", APRIL = "April", MAY = "May", JUNE = "June", JULY = "July"}

// What the parent receives when the form is successfully submitted
type InitResult = {
    characterType: CharacterType;
    members: [PartyMember, PartyMember, PartyMember, PartyMember, PartyMember];
    leaveMonth: LeaveMonth;
    startingMoney: number;
};

type InitFormProps = {
  onComplete: (result: InitResult) => void;
};

const STARTING_MONEY: Record<CharacterType, number> = {
    banker: 1600,
    carpenter: 800,
    farmer: 400,
    scientist: 25565,
};

function InitForm({ onComplete }: InitFormProps): JSX.Element {
    // Controlled fields
    const [characterType, setCharacterType] = useState<CharacterType>("banker");
    const [member1, setMember1] = useState<string>("");
    const [member2, setMember2] = useState<string>("");
    const [member3, setMember3] = useState<string>("");
    const [member4, setMember4] = useState<string>("");
    const [member5, setMember5] = useState<string>("");
    const [leaveMonth, setLeaveMonth] = useState<LeaveMonth>(LeaveMonth.MARCH);

    // UI state
    const [touched, setTouched] = useState<Record<number, boolean>>({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
    });

    const allFilled = useMemo(
        () => [member1, member2, member3, member4, member5].every((s) => s.trim().length > 0),
        [member1, member2, member3, member4, member5]
    );

    const startingMoney = STARTING_MONEY[characterType];

    function handleSubmit(): void {
        // mark everything as touched for instant feedback
        setTouched({ 1: true, 2: true, 3: true, 4: true, 5: true });

        // do nothing if name(s) are missing
        if (!allFilled) return;

        const members = [
        new PartyMember(member1.trim(), 100, 0, true),
        new PartyMember(member2.trim(), 100, 0, true),
        new PartyMember(member3.trim(), 100, 0, true),
        new PartyMember(member4.trim(), 100, 0, true),
        new PartyMember(member5.trim(), 100, 0, true)
        ] as [
        PartyMember,
        PartyMember,
        PartyMember,
        PartyMember,
        PartyMember
        ];

        onComplete({
        characterType,
        members,
        leaveMonth,
        startingMoney,
        });
    }

    // Helper to choose Bootstrap class for each member field
    function memberClass(value: string, i: 1 | 2 | 3 | 4 | 5): string {
        const isEmpty = value.trim().length === 0;
        if (!touched[i]) return "text-black";
        return isEmpty ? "border-danger border-2" : "text-black";
    }

    return (
        <form
            // contained in BackgroundFrame
            className="container text-start"
            style={{
                maxWidth: "40rem",
                marginLeft: "auto",
                marginRight: "auto",
            }}
            onSubmit={handleSubmit}
        >
            <h1 className="text-start" style={{ fontSize: "clamp(1rem, 3vw, 2rem)" }}>
                Set starting conditions
            </h1>

            {/* Character selector */}
            <div className="row g-0 m-0 mt-2">
                <div className="col-12">
                    <label htmlFor="characterTypeField" className="me-2">
                        Character backstory:
                    </label>
                    <select
                        id="characterTypeField"
                        className="text-black"
                        value={characterType}
                        onChange={(e) => setCharacterType(e.target.value as CharacterType)}
                        style={{
                            maxWidth: "30rem"
                        }}
                    >
                        <option value="banker">[$1600] Banker from Boston</option>
                        <option value="carpenter">[$800] Carpenter from Ohio</option>
                        <option value="farmer">[$400] Farmer from Illinois</option>
                        <option value="scientist">[$25565] Time traveling mad scientist from Hill Valley</option>
                    </select>
                </div>
            </div>

            {/* Party names */}
            <div className="row g-0 m-0 mt-2">
                <div className="col-12">
                    <label htmlFor="member1Field" className="me-2">First name of wagon leader:</label>
                    <input
                        id="member1Field"
                        type="text"
                        value={member1}
                        className={memberClass(member1, 1)}
                        onBlur={() => setTouched((t) => ({ ...t, 1: true }))}
                        onChange={(e) => setMember1(e.target.value)}
                        style={{
                            width: "30rem"
                        }}
                    />
                </div>

                <div className="col-12 mt-1">
                    <label htmlFor="member2Field" className="me-2">First name of second member:</label>
                    <input
                        id="member2Field"
                        type="text"
                        value={member2}
                        className={memberClass(member2, 2)}
                        onBlur={() => setTouched((t) => ({ ...t, 2: true }))}
                        onChange={(e) => setMember2(e.target.value)}
                        style={{
                            width: "30rem"
                        }}
                    />
                </div>

                <div className="col-12 mt-1">
                    <label htmlFor="member3Field" className="me-2">First name of third member:</label>
                    <input
                        id="member3Field"
                        type="text"
                        value={member3}
                        className={memberClass(member3, 3)}
                        onBlur={() => setTouched((t) => ({ ...t, 3: true }))}
                        onChange={(e) => setMember3(e.target.value)}
                        style={{
                            width: "30rem"
                        }}
                    />
                </div>

                <div className="col-12 mt-1">
                    <label htmlFor="member4Field" className="me-2">First name of fourth member:</label>
                    <input
                        id="member4Field"
                        type="text"
                        value={member4}
                        className={memberClass(member4, 4)}
                        onBlur={() => setTouched((t) => ({ ...t, 4: true }))}
                        onChange={(e) => setMember4(e.target.value)}
                        style={{
                            width: "30rem"
                        }}
                    />
                </div>

                <div className="col-12 mt-1">
                    <label htmlFor="member5Field" className="me-2">First name of fifth member:</label>
                    <input
                        id="member5Field"
                        type="text"
                        value={member5}
                        className={memberClass(member5, 5)}
                        onBlur={() => setTouched((t) => ({ ...t, 5: true }))}
                        onChange={(e) => setMember5(e.target.value)}
                        style={{
                            width: "30rem"
                        }}
                    />
                </div>
            </div>

            {/* Departure month */}
            <div className="row g-0 m-0 mt-2">
                <div className="col-12">
                    <label htmlFor="leaveMonthField" className="me-2">Which month to leave:</label>
                    <select
                        id="leaveMonthField"
                        className="text-black"
                        value={leaveMonth}
                        onChange={(e) => setLeaveMonth(e.target.value as LeaveMonth)}
                    >
                        <option value="March">March</option>
                        <option value="April">April</option>
                        <option value="May">May</option>
                        <option value="June">June</option>
                        <option value="July">July</option>
                    </select>
                </div>
            </div>

            {/* Submit */}
            <div className="row g-0 m-0 mt-3">
                <div className="col-12">
                    <button
                        type="button"
                        className="btn bg-white text-dark"
                        id="submitStartFields"
                        style={{
                        fontSize: "clamp(.8rem, 2.2vw, 1.25rem)",
                        padding: ".5rem",
                        borderWidth: "2px",
                        fontFamily: "OregonBound",
                        }}
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </form>
    );
}

export type { InitFormProps, InitResult, CharacterType};
export { LeaveMonth, InitForm };