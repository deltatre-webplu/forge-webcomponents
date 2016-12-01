const MongoHelpers = require("nestore-js-mongodb").MongoHelpers;

const EventPublishedRegEx = /^(Entity)?Published\<.+\>$/;
const creationEvents = ['AlbumCreated',
	'CustomEntityCreated',
	'DocumentCreated',
	'PhotoCreated',
	'SelectionCreated',
	'StoryCreated',
	'TagCreated'];
const ListOfValidEvents = creationEvents.concat([EventPublishedRegEx]);

class Query extends QueryProjectionBase {
	constructor(config) {
		super(config);
		this._alreadyPublished = {};
		this._rawValues = new Map();
		this._rearrange = new Map();

		// let fromDate = new Date();
		// fromDate.setUTCDate(fromDate.getUTCDate() - 7);

		let filters = {
			// EventDateTime : { $gt : fromDate },
			_t: { $in: ListOfValidEvents }
		};

		this._projectionFilters = { eventFilters : filters };
		this._bucketName = "wcm";
	}

	query(options) {
		let output = [];
		output.push(["Entity", "Average time to publish"]);

		this._rawValues.forEach((v) => {
			let timeToPublish = v.publishedDate.getTime() - v.creationDate.getTime();
			let entityType = v.entityType;
			if(this._rearrange.has(entityType)){
				var properties = this._rearrange.get(entityType);
				properties.count += 1;
				properties.time += timeToPublish.getTime();
			} else {
				this._rearrange.set(entityType,{count: 1, time: timeToPublish.getTime()});
			}
		});

		this._rearrange.forEach((v,k) => output.push([ k, (v.time/v.count) ]));

		return output;
	}

	_onProjectionData(commit) {
		let events = commit.Events.filter((e) => EventPublishedRegEx.test(e._t) || creationEvents.indexOf(e._t) > -1);
		let creationDate;
		let entityType;
		let fromDate = new Date();
		fromDate.setUTCDate(fromDate.getUTCDate() - 7);
		for (let e of events) {
			if (EventPublishedRegEx.test(e._t) && this._checkPublished(e)) continue;

			let id = this._getId(e);
			let eventDateTime=new Date(e.EventDateTime);

			if (creationEvents.indexOf(e._t) > -1) {
				creationDate = eventDateTime;
				entityType = creationEvents[e._t].toLowerCase().replace('created','');
				this._rawValues.set(id,{creationDate, entityType});
			}

			if (EventPublishedRegEx.test(e._t) && this._rawValues.has(id) && fromDate < eventDateTime) {
				var obj = this._rawValues.get(id);
				obj.publishDate = eventDateTime;
			}
		}
	}

	_checkPublished(e) {
		let id = this._getId(e);

		if (this._alreadyPublished[id]) return true;

		this._alreadyPublished[id] = true;
		return false;
	}

	_getId(e) {
		return e._t == 'Published<Story>' ? MongoHelpers.binaryUUIDToString(e.TranslationId) : MongoHelpers.binaryUUIDToString(e.AggregateId);
	}
}
