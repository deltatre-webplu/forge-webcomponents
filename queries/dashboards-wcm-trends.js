var MongoClient = require('mongodb').MongoClient;

class Query extends QueryBase {
	constructor(config) {
		super(config);
	}

	query(options) {
		return MongoClient.connect(this._config.backEndStoreConfiguration.ConnectionString)
			.then((db) => {
				var col = db.collection('wcm.EntitiesPublished');
				var results;
				switch (options.span) {
				case "day":
					results = this._lastDay(col);
					break;
				case "month":
					results = this._lastMonth(col);
					break;
				case "semester":
					results = this._lastSemester(col);
					break;
				default:
					return null;
				}
				return results.then(function(res) {
					db.close();
					return res;
				});
			});
	}

	_lastDay(col) {

		var promise = col.aggregate([{
			$match: {
				"PublishedOn": {
					$gt: new Date(Date.now() - 24 * 60 * 60 * 1000)
				}
			}
		}, {
			"$project": {
				"EntityId": "$EntityId",
				"EntityType": "$EntityType",
				"Year": {
					$year: "$PublishedOn"
				},
				"Day": {
					$dayOfMonth: "$PublishedOn"
				},
				"Month": {
					$month: "$PublishedOn"
				},
				"Hour": {
					$hour: "$PublishedOn"
				}
			}
		}, {
			$group: {
				_id: {
					"EntityId": "$EntityId",
					"Year": "$Year",
					"Month": "$Month",
					"Day": "$Day",
					"Hour": "$Hour"
				}
			}
		}, {
			$group: {
				_id: {
					"Year": "$_id.Year",
					"Month": "$_id.Month",
					"Day": "$_id.Day",
					"Hour": "$_id.Hour"
				},
				"Total": {
					$sum: 1
				}
			}
		}, {
			$sort: {
				"_id.Year": 1,
				"_id.Month": 1,
				"_id.Day": 1,
				"_id.Hour": 1
			}
		}]).toArray();

		return promise.then(function(res) {

			var output = [
				["Hour", "published"]
			];

			res.forEach(function(e) {
				var kv = [];
				kv.push(e._id.Year + '/' + e._id.Month + '/' + e._id.Day + ' ' + e._id.Hour);
				kv.push(e.Total);
				output.push(kv);
			});

			return output;

		});

	}

	_lastMonth(col) {

		var promise = col.aggregate([{
			$match: {
				"PublishedOn": {
					$gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
				}
			}
		}, {
			"$project": {
				"EntityId": "$EntityId",
				"EntityType": "$EntityType",
				"Year": {
					$year: "$PublishedOn"
				},
				"Month": {
					$month: "$PublishedOn"
				},
				"Day": {
					$dayOfMonth: "$PublishedOn"
				}
			}
		}, {
			$group: {
				_id: {
					"EntityId": "$EntityId",
					"Year": "$Year",
					"Month": "$Month",
					"Day": "$Day"
				}
			}
		}, {
			$group: {
				_id: {
					"Year": "$_id.Year",
					"Month": "$_id.Month",
					"Day": "$_id.Day"
				},
				"Total": {
					$sum: 1
				}
			}
		}, {
			$sort: {
				"_id.Year": 1,
				"_id.Month": 1,
				"_id.Day": 1
			}
		}]).toArray();

		return promise.then(function(res) {

			var output = [
				["Day", "published"]
			];

			res.forEach(function(e) {
				var kv = [];
				kv.push(e._id.Year + '/' + e._id.Month + '/' + e._id.Day);
				kv.push(e.Total);
				output.push(kv);
			});

			return output;

		});

	}

	_lastSemester(col) {

		var promise = col.aggregate([{
			$match: {
				"PublishedOn": {
					$gt: new Date(Date.now() - 182 * 24 * 60 * 60 * 1000)
				}
			}
		}, {
			"$project": {
				"EntityId": "$EntityId",
				"EntityType": "$EntityType",
				"weekStart": {
					"$subtract": [{
						"$subtract": [{
							"$subtract": ["$PublishedOn", new Date("1970-01-01")]
						}, {
							"$cond": [{
								"$eq": [{
									"$dayOfWeek": "$PublishedOn"
								}, 1]
							},
								0, {
									"$multiply": [1000 * 60 * 60 * 24, {
										"$subtract": [{
											"$dayOfWeek": "$PublishedOn"
										}, 1]
									}]
								}
							]
						}]
					}, {
						"$mod": [{
							"$subtract": [{
								"$subtract": ["$PublishedOn", new Date("1970-01-01")]
							}, {
								"$cond": [{
									"$eq": [{
										"$dayOfWeek": "$PublishedOn"
									}, 1]
								},
									0, {
										"$multiply": [
											1000 * 60 * 60 * 24, {
												"$subtract": [{
													"$dayOfWeek": "$PublishedOn"
												}, 1]
											}
										]
									}
								]
							}]
						},
							1000 * 60 * 60 * 24
						]
					}]
				},
				"Year": {
					$year: "$PublishedOn"
				},
				"Month": {
					$month: "$PublishedOn"
				},
				"Week": {
					$week: "$PublishedOn"
				}
			}
		}, {
			$group: {
				_id: {
					"EntityId": "$EntityId",
					"Year": "$Year",
					"Month": "$Month",
					"Week": "$Week",
					"weekStart": "$weekStart"
				}
			}
		}, {
			$project: {
				_id: "$_id",
				weekStart: {
					$add: [new Date(0), "$_id.weekStart"]
				}
			}
		}, {
			$group: {
				_id: {
					"Year": "$_id.Year",
					"Month": "$_id.Month",
					"Week": "$_id.Week",
					"weekStart": "$weekStart"
				},
				"Total": {
					$sum: 1
				}
			}
		}, {
			$sort: {
				"_id.Year": 1,
				"_id.Month": 1,
				"_id.Week": 1
			}
		}]).toArray();

		return promise.then(function(res) {

			var output = [
				["Week start", "published"]
			];

			res.forEach(function(e) {
				var kv = [];
				kv.push(e._id.weekStart);
				kv.push(e.Total);
				output.push(kv);
			});

			return output;

		});

	}
}
