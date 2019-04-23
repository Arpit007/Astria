/**
 * Created by StarkX on 23-Apr-19.
 */

export function Election(state, action) {
	return {
		"electionId" : "b85b1c63f4378c5864f1145283040d8e41b28d398d2c541ff866fed7fc6a01c5",
		"electionName" : "My Election",
		"startDate" : new Date("2019-04-19T18:07:05.719Z"),
		"endDate" : new Date("2019-04-30T10:19:27.663Z"),
		"freeze" : true,
		"adminId" : "5cb99fdf1f82183a1c3cdd89",
		"managers" : [
			"5cb9a624d470b02114e7ac93"
		],
		"admin" : {
			"profile" : {
				"name" : "Some Name",
				"phone" : "9123456789"
			},
			"_id" : "5cb99fdf1f82183a1c3cdd89",
			"email" : "admin@admin.com",
			"createdAt" : "2019-04-19T10:15:59.126Z",
			"updatedAt" : "2019-04-19T10:16:01.035Z",
			"__v" : 0,
			"userId" : "5cb99fdf1f82183a1c3cdd89"
		}
	};
}

export function AllElections(state, action) {
	return [
		{
			"electionId" : "1",
			"electionName" : "My Election",
			"startDate" : new Date("2019-04-19T18:07:05.719Z"),
			"endDate" : new Date("2019-04-30T10:19:27.663Z"),
			"freeze" : true,
			"adminId" : "5cb99fdf1f82183a1c3cdd89",
			"managers" : [
				"5cb9a624d470b02114e7ac93"
			]
		},
		{
			"electionId" : "2",
			"electionName" : "Other Election",
			"startDate" : new Date("2019-04-29T18:07:05.719Z"),
			"endDate" : new Date("2019-04-31T10:19:27.663Z"),
			"freeze" : true,
			"adminId" : "5cb99fdf1f82183a1c3cdd8912",
			"managers" : [
			]
		},
		{
			"electionId" : "3",
			"electionName" : "My Managed Election",
			"startDate" : new Date("2019-04-29T18:07:05.719Z"),
			"endDate" : new Date("2019-04-31T10:19:27.663Z"),
			"freeze" : true,
			"adminId" : "5cb99fdf1f82183a1c3cdd8912",
			"managers" : [
				"5cb99fdf1f82183a1c3cdd89"
			]
		}
	];
}

export function GetManagers(state, action) {
	return [
		{
			"profile": {
				"name": "Admin 2",
				"phone": "9123456789"
			},
			"userId": "5cb9a624d470b02114e7ac93",
			"email": "admin2@admin.com"
		},
		{
			"profile": {
				"name": "Admin 3",
				"phone": "9123456732"
			},
			"userId": "5cb9a624d470b02114e78c93",
			"email": "admin3@admin.com"
		}
	]
}

export function GetCandidates(state, action) {
	return [
		{
			"candidateId": "382256be2cf6b590c70be52a42579ce4e1fb8a60e2870c97b7326ee73438176c",
			"candidateName": "Some Name 2",
			"logoURI": "Some URI",
			"electionId": "fa1e8cab9921354664e919a5311a1a5d50e36a5cf8fa563ede9f77da272f3224"
		},
		{
			"candidateId": "c05cb32f365586c71da144d9b5897493e49fc21b2f12fc13b2c71ac1f69f7659",
			"candidateName": "Some Name 1",
			"logoURI": "Some URI",
			"electionId": "fa1e8cab9921354664e919a5311a1a5d50e36a5cf8fa563ede9f77da272f3224"
		}
	];
}