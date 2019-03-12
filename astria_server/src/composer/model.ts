export class Candidate {
    public candidateId: string;
    public candidateName: string;
    public logoURI: string;
    public electionId: string;
    
    public constructor(candidateId: string, candidateName: string, logoURI: string, electionId: string) {
        this.candidateId = candidateId;
        this.candidateName = candidateName;
        this.logoURI = logoURI;
        this.electionId = electionId;
    }
}


export class Election {
    public electionId: string;
    public electionName: string;
    public startDate: Date;
    public endDate: Date;
    public adminId: string;
    
    constructor(electionId: string, electionName: string, startDate: Date, endDate: Date, adminId: string) {
        this.electionId = electionId;
        this.electionName = electionName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.adminId = adminId;
    }
}