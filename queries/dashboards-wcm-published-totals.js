var MongoClient = require('mongodb').MongoClient;

class Query extends QueryBase {
	constructor(config){
		super(config);
	}

	query(options){
		return MongoClient.connect(this._config.backEndStoreConfiguration.ConnectionString)
		.then((db) => {
				var col = db.collection('wcm.EntitiesPublished');

				var grandTotal = col.aggregate([{$group:{_id:"$EntityId"}},{$group:{_id:"grandTotal",count:{$sum:1}}}])
							.toArray();
				var totalByEntityType = col.aggregate([
					    {
					      $group:{_id:{"EntityId":"$EntityId","EntityType":"$EntityType"}}
					    },{
					      $group:{_id:"$_id.EntityType",count:{$sum:1}}
					    }])
				.toArray();

		    return Promise.all([grandTotal, totalByEntityType])
				.then((results) => {
					db.close();
					return results;
				});
		})
		.then((results) => {
		    var result = {};
	    	result.TotalByEntities = [];

	    	result.Total = results[0][0].count;
				results[1].forEach(function (r){
		        var obj=new Object;
		        obj.EntityType = r._id;
		        obj.Total = r.count;
		        result.TotalByEntities.push(obj);
					});

				if(options && options.outputType =='charts'){
					return this.totalsForCharts(result.TotalByEntities);
				}

				return result;
      }
		);
	}

	totalsForCharts(totals) {
    if (!totals) return null;
    var chartotals = [];
    var header = ["EntityType", "Total"];
    chartotals.push(header);

    totals.forEach(function(t){
      var byEntity=[];
      byEntity.push(t.EntityType);
      byEntity.push(t.Total);
      chartotals.push(byEntity);
    });

    return chartotals;
  }
}
