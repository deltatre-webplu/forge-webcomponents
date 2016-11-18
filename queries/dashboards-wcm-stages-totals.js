var MongoClient = require('mongodb').MongoClient;

class Query extends QueryBase {
	constructor(config) {
		super(config);
	}

	query(options) {
		return MongoClient.connect(this._config.backEndStoreConfiguration.ConnectionString)
		.then((db) => {
			var col = db.collection('wcm.Entities');

			var totalByStage = col.aggregate([{
				$project: {
					_id:{"EntityId":"$EntityId"},
					"Stage": {$cond: { if: { $eq: [ "$Status",1]}, then: "archived", else: {$ifNull: ["$WorkflowFields.Workflow", "$Stage"] } } }}
			},{
				$group: {
					_id:{"EntityId":"$_id.EntityId","Stage":"$Stage"}}
			},{
				$group: {
					_id:{"Stage":"$_id.Stage"},
					"Total":{$sum:1}
				}
			}]).toArray();

			return Promise.resolve(totalByStage)
			.then((results) => {
				db.close();
				return results;
			});
		})
		.then((results) => {
			var result = [];

			results.forEach(function(r) {
				var obj = new Object;
				obj.Stage = r._id;
				obj.Total = r.Total;
				result.push(obj);
			});

			console.log(result);
			return result;
		});
	}
}
