# Demo: Cloudflare Workers + Pinecone (a vector database)

**Note**: 🧪 This is a example application and is not officially supported by Cloudflare.

Query (and create!) vectors in [Pinecone](https://www.pinecone.io/) from [Cloudflare Workers](https://workers.dev/).

## Requirements

1. Clone this repository: `git clone ...`
2. Install the dependencies: `npm install`
3. Get a Pinecone [API key](https://docs.pinecone.io/docs/security#api-keys)
4. Set that key as a wrangler secret: `wrangler secret put PINECONE_API_KEY` (follow the prompts)
5. Deploy the demo app to your Cloudflare account: `wrangler deploy` and note the URL returned - e.g. `https://pinecone-demo.YOUR_SUBDOMAIN.workers.dev`

The demo app exposes a few endpoints:

```sh
# Create the initial index (this can take a few minutes to be ready on Pinecone's side)
curl -X POST "https://pinecone-demo.YOUR_SUBDOMAIN.workers.dev/indexes/example-index"

# Check on its status
curl "https://pinecone-demo.YOUR_SUBDOMAIN.workers.dev/indexes/example-index"

# Insert a couple of example vectors
curl -X POST "https://pinecone-demo.YOUR_SUBDOMAIN.workers.dev/indexes/example-index/upsert"

# Query them!
curl "https://pinecone-demo.YOUR_SUBDOMAIN.workers.dev/indexes/example-index/query"
```

If you want to learn more, visit Pinecone's [documentation](https://docs.pinecone.io/docs/node-client#getting-started).

## Where to from here?

This is only a basic example of how to wire up Pinecone + Workers, but you could:

* Use the [Cache API]() to cache common queries and return them from cache (vs. querying your Pinecone index each time)
* Tie in authentication using Hono's middleware: https://hono.dev/middleware/builtin/bearer-auth
* Handle errors more politely when an index is still being created (!)

## Built with

Built with [Cloudflare Workers](https://workers.dev), the [Hono](https://hono.dev/) API framework, and deployed to Cloudflare's global network.

## License

Copyright Cloudflare, Inc (2023). BSD-3-Clause licensed. See the LICENSE file for details.
