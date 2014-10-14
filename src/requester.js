var secrets = require('../secrets');

var Bing = require('./bing')({ accKey: secrets.api_key });

var request = require('request');

var elasticsearch = require('elasticsearch');

var esClient = elasticsearch.Client({
    host: secrets.elasticsearch.host
});

var Requester = {

    wordToImage : function (req, res, next) {

        var word = req.params.image;

        var that = this;

        esClient.get({
            index : 'store',
            type : 'images',
            id : word
        }).then(function (body) {
            // we got it back

            try {

                var url = body._source.url;
                console.log('found', url)

                request.get(url).pipe(res);

            } catch (err) {
                console.error('oops, not found');
                Requester.loadFromBing(req, res, next);
            }

            // we don't have it
        }, function (error) {
            Requester.loadFromBing(req, res, next);
        });


    },

    loadFromBing: function(req, res, next) {

        var word = req.params.image;

        Bing.images(word, function(err, resp, body) {
            if (err) {
                return next(err);
            }

            // console.log(body, resp)

            var url = body.d.results[0].MediaUrl;

            console.log("saving", url);

            esClient.create({
                index: 'store',
                type: 'images',
                id: word,
                body: {
                    word: word,
                    url: url
                }
            }, function (error, response) {
              if (error) {
                console.log('could not save!')
              }
            });

            request.get(url)
                .pipe(res);

        }, {
            top : 1, 
            skip: 0, 
            imageFilters : "Size:Medium%2BFace:Face"

        })
    }

};

module.exports = Requester;