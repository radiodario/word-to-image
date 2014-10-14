word-to-image
=============

proxy for http://servername/:person_name

it will create a service that uses bing images to find the face of
a person on the internet given a name and pipes it back to you. It stores the results on an elasticsearch index so that you don't run out of ES. 

You could use it on `<img>` tags as the src!

add a `secrets.json` file that looks like:

```javascript
module.exports = {
    api_key : <YOUR BING API KEY>,
    elasticsearch : {
        host: '<ELASTICSEARCH_HOST>:9200'
    }
};
```

run with 

```
node index.js
```

then you can just go to http://localhost:3000/oprah%20winfrey


* To Do

- [ ] Uses a custom version of `node-bing-api`, on `lib/bing.js` so that we can do imageFilters - would be good to do a PR on that place .
- [ ] Add custom entry route for people with imageFilters
- [ ] Add custom entry point for places with good imageFilters.

