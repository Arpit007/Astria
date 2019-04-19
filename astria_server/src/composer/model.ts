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
    public idKey: string;
    public voteEncKey: string;
    public voteDecKey: string;
    public freeze: boolean;
    public adminId: string;
    public admin: AstriaAdmin;
    public managers: string[];
    
    constructor(electionId: string, electionName: string, startDate: Date, endDate: Date, idKey: string, voteEncKey: string, voteDecKey: string, freeze: boolean, adminId: string, managers: string[]) {
        this.electionId = electionId;
        this.electionName = electionName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.idKey = idKey;
        this.voteEncKey = voteEncKey;
        this.voteDecKey = voteDecKey;
        this.freeze = freeze;
        this.adminId = adminId;
        this.managers = managers;
    }
}


export class AstriaAdmin {
    public userId: string;
    public email: string;
    public password: string;
    profile: {
        name: string;
        phone: string;
    };
    
    constructor(userId: string, email?: string, password?: string, name?: string, phone?: string) {
        this.userId = userId;
        this.email = email;
        this.password = password;
        this.profile.name = name;
        this.profile.phone = phone;
    }
}


export class Vote {
    public voteId: string;
    public electionId: string;
    public candidateId: string;
    public hasVoted: boolean;
    
    constructor(voteId: string, electionId: string, candidateId: string, hasVoted: boolean) {
        this.voteId = voteId;
        this.electionId = electionId;
        this.candidateId = candidateId;
        this.hasVoted = hasVoted;
    }
}


export class CandidateResult {
    public candidateId: string;
    public voteCount: number;
    
    constructor(candidateId: string, voteCount: number) {
        this.candidateId = candidateId;
        this.voteCount = voteCount;
    }
}


export class Result {
    public resultId: string;
    public electionId: string;
    public results: CandidateResult[];
    
    constructor(resultId: string, electionId: string, results: CandidateResult[]) {
        this.resultId = resultId;
        this.electionId = electionId;
        this.results = results;
    }
}


export class ResultVote {
    public voteId: string;
    public electionId: string;
    public candidateId: string;
    
    constructor(voteId: string, electionId: string, candidateId: string) {
        this.voteId = voteId;
        this.electionId = electionId;
        this.candidateId = candidateId;
    }
}