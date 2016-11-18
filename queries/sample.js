const EventStore = require("nestore-js-mongodb").EventStore;
const Projection = require("nestore-js-mongodb").Projection;
//const MongoHelpers = require("nestore-js-mongodb").MongoHelpers;

class Query extends QueryBase {
	constructor(config) {
		super(config);
	}

	init(){
		this._commits = 0;

		this._eventStore = new EventStore({
			url: this._config.eventStoreConfiguration.ConnectionString
		});

		return this._eventStore.connect()
		.then(() => {
			let bucket = this._eventStore.bucket("wcm");
			this._projection = new Projection(bucket);

			this._projection.on("commit", (c) => this._onCommit(c));

			let filters = {
				eventFilters : {
					EventDateTime : { $gt : new Date(2016, 10, 18) }
					//_t : /^(Entity)?Published\<.+\>/
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

	query(options) {
		return Promise.resolve(this._commits);
	}

	_onCommit(commit) {
		this._commits++;
	}
}
