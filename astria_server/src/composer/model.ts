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

export class AstriaAdmin {
    public userId: string;
    public electionId: string;
    public voteKey: string;
    public voteDecKey: string;
    public idKey: string;
    public email: string;
    
    
    constructor(userId: string, electionId: string, voteKey: string, voteDecKey: string, idKey: string, email: string) {
        this.userId = userId;
        this.electionId = electionId;
        this.voteKey = voteKey;
        this.voteDecKey = voteDecKey;
        this.idKey = idKey;
        this.email = email;
    }
}

export class Manager {
    public userId: string;
    public email: string;
    public loginId: string;
    public secret: string;
    
    
    constructor(userId: string, email: string, loginId: string, secret: string) {
        this.userId = userId;
        this.email = email;
        this.loginId = loginId;
        this.secret = secret;
    }
}