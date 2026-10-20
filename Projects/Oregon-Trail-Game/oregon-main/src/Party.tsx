import { LeaveMonth, CharacterType } from "./InitForm";
import PartyMember from "./PartyMember"

enum Pace {
    STEADY,
    STRENUOUS,
    GRUELING
}

enum Rations {
    FILLING,
    MEAGER,
    BAREBONES
}

class Party {
    public members!: [PartyMember, PartyMember, PartyMember, PartyMember, PartyMember];
    private pace!: Pace;
    private rations!: Rations;
    private totalDistance = 0;
    private days: number;
    private characterType: CharacterType;
    private landmarkIndex: number;

    constructor(members: PartyMember[], characterType: CharacterType, pace: Pace = Pace.STEADY, rations: Rations = Rations.FILLING, leaveMonth: LeaveMonth) {

        switch(leaveMonth) {
            case LeaveMonth.MARCH:
                this.days = 0;
                break;
            case LeaveMonth.APRIL:
                this.days = 31;
                break;
            case LeaveMonth.MAY:
                this.days = 61;
                break;
            case LeaveMonth.JUNE:
                this.days = 92;
                break;
            case LeaveMonth.JULY:
                this.days = 122;
                break;
            default:
                this.days = 0;
                break;
        }

        this.members = members as [
            PartyMember,
            PartyMember,
            PartyMember,
            PartyMember,
            PartyMember
        ];
        this.characterType = characterType;
        this.pace = pace;
        this.rations = rations;
        this.landmarkIndex = 1;
    }
    
    getMember(i: number): PartyMember {
        return this.members[i];
    }

    getPace(): Pace {
        switch(this.pace) {
            case Pace.STEADY: {
                return Pace.STEADY;
            }
            case Pace.STRENUOUS: {
                return Pace.STRENUOUS;
            }
            case Pace.GRUELING: {
                return Pace.GRUELING;
            }
            default: {
                return Pace.STEADY; // no error checking for now
            }
        }
    }

    getRations(): Rations {
        switch(this.rations){
            case Rations.BAREBONES: {
                return Rations.BAREBONES;
            }
            case Rations.FILLING:{
                return Rations.FILLING;
            }
            case Rations.MEAGER: {
                return Rations.MEAGER;
            }
            default: {
                return Rations.FILLING;
            }
        }
        
    }

    setPace(pace: Pace): void {
        this.pace = pace;
    }

    setRations(rations: Rations): void {
        this.rations = rations;
    }

    setTotalDistance(distance: number): void{
        this.totalDistance = distance;
    }

    getTotalDistance(): number{
        return this.totalDistance;
    }

    setDays(days: number): void{
        this.days = days;
    }

    getDays(): number {
        return this.days;
    }
    
    getCharacterType(): CharacterType {
    return this.characterType;
    }

    getLandmarkIndex(): number {
        return this.landmarkIndex;
    }
    
    setLandmarkIndex(index: number): void {
        this.landmarkIndex = index;
    }
}

export {Party, Pace, Rations}

