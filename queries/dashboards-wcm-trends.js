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
		var timespan=24;
		var startingDate=new Date(Date.now() - (timespan * 60 * 60 * 1000));
		var promise = col.aggregate([{
			$match: {
				"PublishedOn": {
					$gt: startingDate
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

			for (var i = 0; i <= timespan; i++) {
				var d = new Date(startingDate.getTime() + (i * 60 * 60 * 1000));
				var dh = d.getHours();
				var kv = [];

				if(res && res.length>0 &&
					res[0]._id.Year <= d.getUTCFullYear() &&
          res[0]._id.Month <= (d.getUTCMonth()+1) &&
          res[0]._id.Day <= d.getUTCDate() &&
          res[0]._id.Hour <= dh) {
					var e = res.shift();
					var resHour=e._id.Hour;
					kv.push(new Date(e._id.Year,e._id.Month,e._id.Day,resHour));
					kv.push(e.Total);
					output.push(kv);
				}
				else {
					kv.push(d);
					kv.push(0);
					output.push(kv);
				}
			}

			return output;

		});

	}

	_lastMonth(col) {
		var timespan=30;
		var startingDate=new Date(Date.now() - (timespan * 24 * 60 * 60 * 1000));

		var promise = col.aggregate([{
			$match: {
				"PublishedOn": {
					$gt: startingDate
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

			for (var i = 0; i <= timespan; i++) {
				let d = new Date(startingDate.getTime() + (i * 24 * 60 * 60 * 1000));
				let dd = d.getUTCDate();
				var kv = [];

				var objDate = new Date();
				objDate.setMonth(d.getUTCMonth());
				var locale = "en-us", month = objDate.toLocaleString(locale, { month: "short" });

				if(res && res.length>0 &&
					res[0]._id.Year <= d.getUTCFullYear() &&
          res[0]._id.Month <= (d.getUTCMonth()+1) &&
          res[0]._id.Day <= dd) {
					var e = res.shift();
					var resDay=e._id.Day;
					kv.push(resDay + ' ' + month);
					kv.push(e.Total);
					output.push(kv);
				}
				else {
					kv.push(dd + ' ' + month);
					kv.push(0);
					output.push(kv);
				}
			}

			return output;

		});

	}

	_lastSemester(col) {
		var timespan = 26;
		var extraDaysSpan = new Date().getDay()*(24 * 60 * 60 * 1000);
		var startingDate = new Date(Date.now() - (timespan * 7 * 24 * 60 * 60 * 1000) - extraDaysSpan);

		var promise = col.aggregate([
			{
				$match: {
					"PublishedOn": {
						$gt: startingDate
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
								}, 0, {
									"$multiply": [
										1000 * 60 * 60 * 24, {
											"$subtract": [{
												"$dayOfWeek": "$PublishedOn"
											}, 1]
										}
									]
								}]
							}]
						}, {
							"$mod": [{
								"$subtract": [{
									"$subtract": ["$PublishedOn", new Date("1970-01-01")]}, {
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
					"Week": {
						$week: "$PublishedOn"
					}
				}
			}, {
				$group: {
					_id: {
						"EntityId": "$EntityId",
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
						"Week": "$_id.Week",
						"weekStart": "$weekStart"
					},
					"Total": {
						$sum: 1
					}
				}
			}, {
				$sort: {
					"_id.Week": 1
				}
			}
		]).toArray();

		return promise.then(function(res) {

			var output = [
				["Week start", "published"]
			];

			for (var i = 0; i <= timespan; i++) {
				let d = new Date(startingDate.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
				let dd = d.getUTCDate();
				var kv = [];

				if(res && res.length>0 &&
					new Date(Date.parse(res[0]._id.weekStart)).getUTCFullYear() == d.getUTCFullYear() &&
					new Date(Date.parse(res[0]._id.weekStart)).getUTCMonth() == (d.getUTCMonth()) &&
					new Date(Date.parse(res[0]._id.weekStart)).getUTCDate() == dd) {

					var e = res.shift();
					var resWeek = e._id.weekStart;
					kv.push(resWeek.toLocaleDateString());
					kv.push(e.Total);
					output.push(kv);

				} else {

					kv.push(d.toLocaleDateString());
					kv.push(0);
					output.push(kv);

				}
			}

			return output;

		});

	}
}
