/**
 * Created by StarkX on 12-Mar-19.
 */

const info = JSON.stringify({
	"composer" : {
		"wallet" : {
			"type" : "composer-wallet-mongodb",
			"desc" : "Use a local mongodb instance",
			"options" : {
				"uri" : "mongodb://localhost:27017/astria",
				"collectionName" : "AstriaWallet",
				"options" : {}
			}
		}
	}
});
console.log('Hello');
console.log(info);

process.env.NODE_CONFIG = info;