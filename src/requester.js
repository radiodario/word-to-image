var secrets = require('../secrets');

var Bing = require('./bing')({ accKey: secrets.api_key });

var request = require('request');

var elasticsearch = require('elasticsearch');

var esClient = elasticsearch.Client({
    host: secrets.elasticsearch.host
});

// DRY THE FUCK OUT OF THIS

var Requester = {

    people: function(req, res, next) {

        var word = req.params.image;

        var that = this;

        esClient.get({
            index : 'store',
            type : 'people',
            id : word
        }).then(function (body) {
            // we got it back

            try {

                var url = body._source.url;
                console.log('found', url)

                request.get(url).pipe(res);

            } catch (err) {
                console.error('oops, not found');
                Requester.loadFromBing(req, res, next, {
                    top : 1,
                    skip: 1,
                    imageFilters : "Size:Medium%2BFace:Face"
                }, 'people');
            }

            // we don't have it
        }, function (error) {
            Requester.loadFromBing(req, res, next, {
                top : 1,
                skip: 1,
                imageFilters : "Size:Medium%2BFace:Face"
            }, 'people');
        });

    },

    things : function (req, res, next) {

        var word = req.params.image;

        var that = this;

        esClient.get({
            index : 'store',
            type : 'things',
            id : word
        }).then(function (body) {
            // we got it back

            try {

                var url = body._source.url;
                console.log('found', url)

                request.get(url).pipe(res);

            } catch (err) {
                console.error('oops, not found');
                Requester.loadFromBing(req, res, next, {
                    top : 1,
                    skip: 0,
                    imageFilters : "Size:Medium"
                }, "things");
            }

            // we don't have it
        }, function (error) {
            Requester.loadFromBing(req, res, next, {
                top : 1,
                skip: 0,
                imageFilters : "Size:Medium"
            }, "things");
        });


    },

    loadFromBing: function(req, res, next, options, type) {

        var word = req.params.image;

        Bing.images(word, function(err, resp, body) {
            if (err) {
                return next(err);
            }

            var results = body.d.results;

            var url = "https://assets.digital.cabinet-office.gov.uk/government/assets/blank-person-07d1653f840307220b203ecb834f5904.png"

            if (results.length) {
                url = body.d.results[0].MediaUrl;
            }

            console.log("saving", url);

            esClient.create({
                index: 'store',
                type: type,
                id: word,
                body: {
                    word: word,
                    url: url
                }
            }, function (error, response) {
              if (error) {
                console.log('could not save!', error, response)
              }
            });

            request.get(url)
                .pipe(res);

        }, options);
    }

};

module.exports = Requester;