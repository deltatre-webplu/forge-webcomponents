const EventStore = require("nestore-js-mongodb").EventStore;
const Projection = require("nestore-js-mongodb").Projection;
const MongoHelpers = require("nestore-js-mongodb").MongoHelpers;

const eventToMatch = /^(Entity)?Published\<.+\>/;

class Query extends QueryBase {
	constructor(config) {
		super(config);
	}

	init(){
		this._groupedEvents = {};
		this._eventsToExclude = {};

		this._eventStore = new EventStore({
			url: this._config.eventStoreConfiguration.ConnectionString
		});

		return this._eventStore.connect()
		.then(() => {
			let bucket = this._eventStore.bucket("wcm");
			this._projection = new Projection(bucket);

			this._projection.on("commit", (c) => this._onCommit(c));

			var timespan = 26;
			var extraDaysSpan = new Date().getDay()*(24 * 60 * 60 * 1000);
			var startingDate = new Date(Date.now() - (timespan * 7 * 24 * 60 * 60 * 1000) - extraDaysSpan);

			let filters = {
				eventFilters : {
					EventDateTime : { $gt : startingDate },
					_t : eventToMatch
				}
			};
			this._projection.start(filters);
		});
	}

	close(){
		return this._projection.stop()
		.then(
			() => this._eventStore.close(),
			() => this._eventStore.close());
	}

	_onCommit(commit) {
		var events = commit.Events;
		if(events){
			events.forEach(function(e) {
				if(eventToMatch.test(e._t) && !this._eventsToExclude[MongoHelpers.binaryUUIDToString(e.AggregateId)]){
					this._eventsToExclude[MongoHelpers.binaryUUIDToString(e.AggregateId)] = true;

					var ticks = e.EventDateTime.setMinutes(0,0,0);
					this._groupedEvents[ticks] = this._groupedEvents[ticks] ? this._groupedEvents[ticks] + 1 : 1;
				}
			});
		}
	}

	query(options) {
		return Promise.resolve(this._groupedEvents);
		// var results = [];
		// switch (options.span) {
		// case "day":
		// 	results = this._lastDay();
		// 	break;
		// case "month":
		// 	results = this._lastMonth();
		// 	break;
		// case "semester":
		// 	results = this._lastSemester();
		// 	break;
		// default:
		// 	return null;
		// }
	}

	// _lastDay(col) {
	// 	var timespan=24;
	// 	var startingDate=new Date(Date.now() - (timespan * 60 * 60 * 1000));
	//
	//
	// 	return promise.then(function(res) {
	//
	// 		var output = [
	// 			["Hour", "published"]
	// 		];
	//
	// 		for (var i = 0; i <= timespan; i++) {
	// 			var d = new Date(startingDate.getTime() + (i * 60 * 60 * 1000));
	// 			var dh = d.getUTCHours();
	// 			var kv = [];
	// 			var date;
	// 			var t = 0;
	//
	// 			if(res && res.length>0 &&
	// 				res[0]._id.Year <= d.getUTCFullYear() &&
  //         res[0]._id.Month <= (d.getUTCMonth()+1) &&
  //         res[0]._id.Day <= d.getUTCDate() &&
  //         res[0]._id.Hour <= dh) {
	// 				var e = res.shift();
	// 				date = new Date(e._id.Year, e._id.Month-1, e._id.Day, e._id.Hour);
	// 				t = e.Total;
	// 			}
	// 			else {
	// 				date = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), dh);
	// 			}
	//
	// 			kv.push(date.getTime());
	// 			kv.push(t);
	// 			output.push(kv);
	// 		}
	//
	// 		return output;
	//
	// 	});
	//
	// }
	//
	// _lastMonth(col) {
	// 	var timespan=30;
	// 	var startingDate=new Date(Date.now() - (timespan * 24 * 60 * 60 * 1000));
	//
	//
	//
	// 	return promise.then(function(res) {
	//
	// 		var output = [
	// 			["Day", "published"]
	// 		];
	//
	// 		for (var i = 0; i <= timespan; i++) {
	// 			let d = new Date(startingDate.getTime() + (i * 24 * 60 * 60 * 1000));
	// 			let dd = d.getUTCDate();
	// 			var kv = [];
	// 			var date;
	// 			var t = 0;
	//
	// 			if(res && res.length>0 &&
	// 				res[0]._id.Year <= d.getUTCFullYear() &&
  //         res[0]._id.Month <= (d.getUTCMonth()+1) &&
  //         res[0]._id.Day <= dd) {
	// 				var e = res.shift();
	// 				date = new Date(e._id.Year, e._id.Month - 1, e._id.Day);
	// 				t = e.Total;
	// 			}
	// 			else {
	// 				date=new Date(d.getUTCFullYear(), d.getUTCMonth(),d.getUTCDate());
	// 			}
	//
	// 			kv.push(date.getTime());
	// 			kv.push(t);
	// 			output.push(kv);
	// 		}
	//
	// 		return output;
	//
	// 	});
	//
	// }
	//
	// _lastSemester(col) {
	// 	var timespan = 26;
	// 	var extraDaysSpan = new Date().getDay()*(24 * 60 * 60 * 1000);
	// 	var startingDate = new Date(Date.now() - (timespan * 7 * 24 * 60 * 60 * 1000) - extraDaysSpan);
	//
	//
	//
	// 	return promise.then(function(res) {
	//
	// 		var output = [
	// 			["Week start", "published"]
	// 		];
	//
	// 		for (var i = 0; i <= timespan; i++) {
	// 			let d = new Date(startingDate.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
	// 			let dd = d.getUTCDate();
	// 			var kv = [];
	// 			var date;
	// 			var t = 0;
	//
	// 			if(res && res.length>0 &&
	// 				new Date(Date.parse(res[0]._id.weekStart)).getUTCFullYear() == d.getUTCFullYear() &&
	// 				new Date(Date.parse(res[0]._id.weekStart)).getUTCMonth() == d.getUTCMonth() &&
	// 				new Date(Date.parse(res[0]._id.weekStart)).getUTCDate() == dd) {
	//
	// 				var e = res.shift();
	// 				t = e.Total;
	// 			}
	//
	// 			date=new Date(d.getUTCFullYear(), d.getUTCMonth(),dd);
	// 			kv.push(date.getTime());
	// 			kv.push(t);
	// 			output.push(kv);
	// 		}
	// 		return output;
	// 	});
	// }
}
