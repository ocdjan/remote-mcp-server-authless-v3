import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";

//Get Cloudfare workers ENV 
import { env } from "cloudflare:workers";


// Define our MCP agent with tools
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "weather-mcp-server",
		version: "1.0.0",
	});
	async init() {
			
		this.server.tool(
			'Tanium-GetEndpoints',
			'This gets the amount of known endpoints, both online and offline',

			////
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


///////////////////////////////////////


export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
