/**
 * Welcome to Cloudflare Workers!
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Hono } from "hono";
import { PineconeClient } from "@pinecone-database/pinecone";

export interface Env {
	PINECONE_API_KEY: string;
	PINECONE_ENVIRONMENT: string;
}

const DEFAULT_INDEX = "example-index";

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const app = new Hono();
		const pinecone = new PineconeClient();
		await pinecone.init({
			apiKey: env.PINECONE_API_KEY,
			environment: env.PINECONE_ENVIRONMENT,
		});

		app.onError((err, c) => {
			console.log(`caught error: ${err}`);
			return c.json({ err: err }, 500);
		});

		// Create an index
		app.post("/indexes/:name", async (c) => {
			let resp = await pinecone.createIndex({
				createRequest: {
					name: c.req.param("name") || DEFAULT_INDEX,
					dimension: 4,
				},
			});

			return c.json(resp);
		});

		// List indexes
		app.get("/indexes", async (c) => {
			const indexList = await pinecone.listIndexes();
			return c.json(indexList);
		});

		// Describe an index
		app.get("/indexes/:name", async (c) => {
			const indexDescription = await pinecone.describeIndex({
				indexName: c.req.param("name") || DEFAULT_INDEX,
			});

			return c.json(indexDescription);
		});

		// Upsert a new vector into an index
		app.post("/indexes/:name/upsert", async (c) => {
			const index = pinecone.Index(c.req.param("name") || DEFAULT_INDEX);
			const upsertRequest = {
				vectors: [
					{
						id: "vec1",
						values: [0.1, 0.2, 0.3, 0.4],
						metadata: {
							genre: "drama",
						},
					},
					{
						id: "vec2",
						values: [0.2, 0.3, 0.4, 0.5],
						metadata: {
							genre: "action",
						},
					},
				],
				namespace: "example-namespace",
			};

			const upsertResponse = await index.upsert({ upsertRequest });
			return c.json(upsertResponse);
		});

		// Query an index
		app.get("/indexes/:name/query", async (c) => {
			const index = pinecone.Index(c.req.param("name") || DEFAULT_INDEX);
			const queryRequest = {
				vector: [0.1, 0.2, 0.3, 0.4],
				topK: 10,
				includeValues: true,
				includeMetadata: true,
				filter: {
					genre: { $in: ["comedy", "documentary", "drama"] },
				},
				namespace: "example-namespace",
			};

			const queryResponse = await index.query({ queryRequest });
			return c.json(queryResponse);
		});

		// Show available routes
		app.get("/", async (c) => {
			return c.json(app.routes)
		})

		return app.fetch(request, env, ctx);
	},
};
