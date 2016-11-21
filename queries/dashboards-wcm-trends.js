const EventStore = require("nestore-js-mongodb").EventStore;
const MongoHelpers = require("nestore-js-mongodb").MongoHelpers;

const EventPublishedRegEx = /^(Entity)?Published\<.+\>$/;

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

			let weeks = 26;
			let extraDaysSpan = new Date().getDay()*(24 * 60 * 60 * 1000);
			let fromDate = new Date(Date.now() - (weeks * 7 * 24 * 60 * 60 * 1000) - extraDaysSpan);

			let filters = {
				EventDateTime : { $gt : fromDate },
				_t : EventPublishedRegEx
			};

			this._projection = bucket.projectionStream({ eventFilters : filters });
			this._projection.on("data", (c) => this._onCommit(c));
		});
	}

	close(){
		return this._projection.close()
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
		let eventDate = (new Date(e.EventDateTime)).setUTCHours(0,0,0,0);

		let diffFromStartOfWeek = (new Date(eventDate)).getDay();
		let fromDate = new Date(eventDate);
		let startOfWeekDate = fromDate.setUTCDate(fromDate.getUTCDate() - diffFromStartOfWeek);

		let count = this._groupedByWeeks.get(startOfWeekDate)
			? this._groupedByWeeks.get(startOfWeekDate) + 1
			: 1;
		this._groupedByWeeks.set(startOfWeekDate, count);
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

		let output = [];
		output.push(["Hour", "published"]);

		// get output and fill holes
		for (var i = 0; i <= 24; i++) {
			let dateToFill = new Date(fromDateMs);
			let dtSpan = dateToFill.setUTCHours(dateToFill.getUTCHours() + i);

			if (this._groupedByHours.has(dtSpan))
				output.push([ dtSpan, this._groupedByHours.get(dtSpan) ]);
			else
				output.push([ dtSpan, 0 ]);
		}

		return output;
	}

	_queryLastMonth(){
		let fromDate = new Date();
		fromDate.setUTCDate(fromDate.getUTCDate() - 30);
		let fromDateMs = fromDate.setUTCHours(0,0,0,0);

		let output = [];
		output.push(["Day", "published"]);

		// get output and fill holes
		for (var i = 0; i <= 30; i++) {
			let dateToFill = new Date(fromDateMs);
			let dtSpan = dateToFill.setUTCDate(dateToFill.getUTCDate() + i);

			if (this._groupedByDays.has(dtSpan))
				output.push([ dtSpan, this._groupedByDays.get(dtSpan) ]);
			else
				output.push([ dtSpan, 0 ]);
		}

		return output;
	}

	_queryLastSemester(){
		let weeks = 26;
		let extraDaysSpan = new Date().getDay()*(24 * 60 * 60 * 1000);
		let fromDate = new Date(Date.now() - (weeks * 7 * 24 * 60 * 60 * 1000) - extraDaysSpan);
		let fromDateMs = fromDate.setUTCHours(0,0,0,0);


		let output = [];
		output.push(["Week", "published"]);

		// get output and fill holes
		for (var i = 0; i <= 26; i++) {
			let dateToFill = new Date(fromDateMs);
			let dtSpan = dateToFill.setUTCDate(dateToFill.getUTCDate() + (i * 7));

			if (this._groupedByWeeks.has(dtSpan))
				output.push([ dtSpan, this._groupedByWeeks.get(dtSpan) ]);
			else
				output.push([ dtSpan, 0 ]);
		}

		return output;
	}
}
