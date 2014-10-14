word-to-image
=============

proxy for http://servername/:person_name

it will create a service that uses bing images to find the face of
a person on the internet given a name and pipes it back to you.

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