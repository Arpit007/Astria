const a = require("./defaultInfo");

const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const IdCard = require('composer-common').IdCard;
const AdminConnection = require('composer-admin').AdminConnection;
const connectionProfile = require("./profile");

async function identityIssue() {
	try {
		let businessNetworkConnection = new BusinessNetworkConnection();
		await businessNetworkConnection.connect('admin@test-bna');
		
		console.log('trying to issue identity ');
		
		let result = await businessNetworkConnection
			.issueIdentity('org.astria.SampleParticipant#' + process.argv[ 2 ], process.argv[ 2 ]);
		console.log(result);
		
		const metadata = {
			userName : result.userID,
			version : 1,
			enrollmentSecret : result.userSecret,
			businessNetwork : 'test-bna'
		};
		
		const idCardData = new IdCard(metadata, connectionProfile);
		
		const adminConnection = new AdminConnection('admin@test-bna');
		//const idCardName = BusinessNetworkCardStore.getDefaultCardName(idCardData);
		
		try {
			const imported = await adminConnection.importCard('p3@test-bna', idCardData);
			adminConnection.disconnect();
		} catch (error) {
			throw error;
		}
	} catch (error) {
		console.log(error);
	}
}

identityIssue();
