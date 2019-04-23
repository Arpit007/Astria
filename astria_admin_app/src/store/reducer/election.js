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