var secrets = require('../secrets');

var Bing = require('node-bing-api')({ accKey: secrets.api_key });

var request = require('request');

module.exports = {

    wordToImage : function (req, res, next) {

        // if image is in my db
        // return image

        // else
        Bing.images(req.params.image, function(err, _, body) {
            if (err) {
                return next(err);
            }

            var url = body.d.results[0].MediaUrl;

            console.log(url);

            request.get(url).pipe(res);

        }, {top : 1, skip: 1})
    }

}