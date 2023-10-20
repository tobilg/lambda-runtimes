# lambda-runtimes
This project gathers information about AWS Lambda runtimes. This is the same information that can be found in the [AWS Lambda developer guide](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html), but in a machine readable form as JSON, or accessible via an API.

## Data
You can find the current information about the runtimes at [data/lambdaRuntimes.json](https://raw.githubusercontent.com/tobilg/lambda-runtimes/main/data/lambdaRuntimes.json).

## API
There's a simple API deployed to CloudFront. It has generally two different endpoints per runtime (equivalent to `$RUNTIME_NAME`):

* `/is/$RUNTIME_NAME/deprecated`
* `/will/$RUNTIME_NAME/be/deprecated`

Those endpoints will either return `true` or `false` as `text/plain`. The base URL is `https://d1jqgmmv0nngm7.cloudfront.net`

So, if you'd like to see if the `nodejs14.x` runtime is already deprecated, you can issue the following request with `curl`:

```bash
curl -XGET https://d1jqgmmv0nngm7.cloudfront.net/is/nodejs14.x/deprecated
```

If you'd rather like to see if the `nodejs16.x` runtime has a deprecation date already set, you can issue the following request with `curl`:

```bash
curl -XGET https://d1jqgmmv0nngm7.cloudfront.net/will/nodejs16.x/be/deprecated
```

If you query a runtime that is already deprecated, the `/is` endpoint will return `false`.
