const EventStore = require("nestore-js-mongodb").EventStore;
const Projection = require("nestore-js-mongodb").Projection;
const MongoHelpers = require("nestore-js-mongodb").MongoHelpers;

const EventPublishedRegEx = /^(Entity)?Published\<.+\>$/;

function compareQueryOutput(a, b){
	if (a[0] > b[0]) {
		return 1;
	}
	if (a[0] < b[0]) {
		return -1;
	}

	return 0;
}

class Query extends QueryBase {
	constructor(config) {
		super(config);

		this._groupedByHours = new Map();
		this._groupedByDays = new Map();
		this._groupedByWeeks = new Map();
		this._alreadyPublished = {};
	}

	init(){
		this._eventStore = new EventStore({
			url: this._config.eventStoreConfiguration.ConnectionString
		});

		return this._eventStore.connect()
		.then(() => {
			let bucket = this._eventStore.bucket("wcm");
			this._projection = new Projection(bucket);

			this._projection.on("commit", (c) => this._onCommit(c));

			let fromDate = new Date();
			fromDate.setUTCMonth(fromDate.getUTCMonth() - 6);

			let filters = {
				EventDateTime : { $gt : fromDate },
				_t : EventPublishedRegEx
			};
			this._projection.start({ eventFilters : filters });
		});
	}

	close(){
		return this._projection.stop()
		.then(
			() => this._eventStore.close(),
			() => this._eventStore.close());
	}

	query(options) {
		switch (options.span) {
		case "day":
			return this._queryLastDay();
		case "month":
			return this._queryLastMonth();
		case "semester":
			return this._queryLastSemester();
		default:
			return null;
		}
	}

	_onCommit(commit) {
		let publishedEvents = commit.Events.filter((e) => EventPublishedRegEx.test(e._t));

		for (let e of publishedEvents) {
			if (this._checkPublished(e))
				continue;

			this._groupByHour(e);
			this._groupByDays(e);
			this._groupByWeeks(e);
		}
	}

	_groupByHour(e){
		let eventHour = (new Date(e.EventDateTime)).setUTCMinutes(0,0,0);

		let fromDate = new Date();
		fromDate = fromDate.setUTCHours(fromDate.getUTCHours() - 24);

		if (eventHour >= fromDate) {
			let count = this._groupedByHours.get(eventHour)
				? this._groupedByHours.get(eventHour) + 1
				: 1;
			this._groupedByHours.set(eventHour, count);
		}
	}

	_groupByDays(e){
		let eventDate = (new Date(e.EventDateTime)).setUTCHours(0,0,0,0);

		let fromDate = new Date();
		fromDate = fromDate.setUTCDate(fromDate.getUTCDate() - 30);

		if (eventDate >= fromDate) {
			let count = this._groupedByDays.get(eventDate)
				? this._groupedByDays.get(eventDate) + 1
				: 1;
			this._groupedByDays.set(eventDate, count);
		}
	}

	_groupByWeeks(e){

	}

	_checkPublished(e){
		let aggregateId = MongoHelpers.binaryUUIDToString(e.AggregateId);
		if (this._alreadyPublished[aggregateId])
			return true;

		this._alreadyPublished[aggregateId] = true;
		return false;
	}

	_queryLastDay(){
		let fromDate = new Date();
		fromDate.setUTCHours(fromDate.getUTCHours() - 24);
		let fromDateMs = fromDate.setUTCMinutes(0,0,0);

		// fill holes
		for (var i = 0; i <= 24; i++) {
			let dateToFill = new Date(fromDateMs);
			let dtSpan = dateToFill.setUTCHours(dateToFill.getUTCHours() + i);
			if (!this._groupedByHours.has(dtSpan))
				this._groupedByHours.set(dtSpan, 0);
		}

		let output = [];
		output.push(["Hour", "published"]);

		for (var entry of this._groupedByHours) {
			if (entry[0] < fromDateMs)
				continue;

			output.push(entry);
		}

		return output.sort(compareQueryOutput);
	}

	_queryLastMonth(){
		let fromDate = new Date();
		fromDate.setUTCDate(fromDate.getUTCDate() - 30);
		let fromDateMs = fromDate.setUTCHours(0,0,0,0);

		// fill holes
		for (var i = 0; i <= 30; i++) {
			let dateToFill = new Date(fromDateMs);
			let dtSpan = dateToFill.setUTCDate(dateToFill.getUTCDate() + i);
			if (!this._groupedByDays.has(dtSpan))
				this._groupedByDays.set(dtSpan, 0);
		}

		let output = [];
		output.push(["Day", "published"]);

		for (var entry of this._groupedByDays) {
			if (entry[0] < fromDateMs)
				continue;

			output.push(entry);
		}

		return output.sort(compareQueryOutput);
	}

	_queryLastSemester(){
		return null;
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
