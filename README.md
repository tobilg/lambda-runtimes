# lambda-runtimes
This project gathers information about AWS Lambda runtimes. This is the same information that can be found in the [AWS Lambda developer guide](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html), but in a machine readable form as JSON, or accessible via an API.

## Data
You can find the current information about the runtimes at [data/lambdaRuntimes.json](https://raw.githubusercontent.com/tobilg/lambda-runtimes/main/data/lambdaRuntimes.json).

## API
There's a simple API deployed to GitHub Pages. It has generally four different endpoints per runtime (equivalent to `$RUNTIME_NAME`):

* `/is/$RUNTIME_NAME/deprecated`
* `/will/$RUNTIME_NAME/be/deprecated`
* `/when/will/$RUNTIME_NAME/be/deprecated`
* `/runtimes`

The first two endpoints will either return `true` or `false` as `text/plain`. The base URL is `https://tobilg.github.io/lambda-runtimes`

So, if you'd like to see if the `nodejs14.x` runtime is already deprecated, you can issue the following request with `curl`:

```bash
curl -XGET https://tobilg.github.io/lambda-runtimes/is/nodejs14.x/deprecated
```

If you'd rather like to see if the `nodejs16.x` runtime has a deprecation date already set, you can issue the following request with `curl`:

```bash
curl -XGET https://tobilg.github.io/lambda-runtimes/will/nodejs16.x/be/deprecated
```

If you query a runtime that is already deprecated, the `/will` endpoint will return `false`.

If you want to check when a runtime will be deprecated, you can run 

```bash
curl -XGET https://tobilg.github.io/lambda-runtimes/when/will/nodejs16.x/be/deprecated
```

This will either return a date in `YYYY-MM-DD` format, or `unknown` if it's not yet known.

If you want to have an overview of all the current information about the Lambda runtimes, you can issue

```bash
curl -XGET https://tobilg.github.io/lambda-runtimes/runtimes
```

This will return a JSON array with the info for each runtime.
