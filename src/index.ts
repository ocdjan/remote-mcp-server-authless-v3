import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";

//Get Cloudflare workers ENV
import { env } from "cloudflare:workers";

this.server.tool(
  'Tanium-GetEndpoints',
  'This gets the amount of known endpoints, both online and offline',

async ({input}) => {
  try {
    //placehodler comment
    const response = await fetch(`${env.API_Endpoint}`, {
      method: 'POST',
      headers: {
        'session': `${env.API_Key}`, // Your API token
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: "query {endpoints{totalRecords}}",
        variables: { "a": "placeholder" },
      }),
    });

    // Parse the JSON response
    const data = await response.json();

// Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2), // Pretty print the JSON
        }
      ]
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        }
      ]
    };
  }
}
);

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Authless Calculator",
		version: "1.0.0",
	});

	async init() {
		// Simple addition tool
		this.server.registerTool(
			"add",
			{ inputSchema: { a: z.number(), b: z.number() } },
			async ({ a, b }) => ({
				content: [{ type: "text", text: String(a + b) }],
			}),
		);

		// Calculator tool with multiple operations
		this.server.registerTool(
			"calculate",
			{
				inputSchema: {
					operation: z.enum(["add", "subtract", "multiply", "divide"]),
					a: z.number(),
					b: z.number(),
				},
			},
			async ({ operation, a, b }) => {
				let result: number;
				switch (operation) {
					case "add":
						result = a + b;
						break;
					case "subtract":
						result = a - b;
						break;
					case "multiply":
						result = a * b;
						break;
					case "divide":
						if (b === 0)
							return {
								content: [
									{
										type: "text",
										text: "Error: Cannot divide by zero",
									},
								],
							};
						result = a / b;
						break;
				}
				return { content: [{ type: "text", text: String(result) }] };
			},
		);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
