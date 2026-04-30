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
		//////////////////////////
		//// GET GRAPHQL SCHEMA///
		//////////////////////////
			this.server.tool(
						'Tanium-GraphQLIntrospection',
						'This allows you to introspect the GraphQL schema',
						{
							input: z.string().describe('the input provided by the user for the test case')
						},
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
							        query: `query {
								IntrospectionQuery {
                        __schema {
                            queryType { name }
                            mutationType { name }
                            subscriptionType { name }
                            types {
                                ...FullType
                            }
                            directives {
                                name
                                description
                                locations
                                args {
                                    ...InputValue
                                }
                            }
                        }
                    }
                    
                    fragment FullType on __Type {
                        kind
                        name
                        description
                        fields(includeDeprecated: true) {
                            name
                            description
                            args {
                                ...InputValue
                            }
                            type {
                                ...TypeRef
                            }
                            isDeprecated
                            deprecationReason
                        }
                        inputFields {
                            ...InputValue
                        }
                        interfaces {
                            ...TypeRef
                        }
                        enumValues(includeDeprecated: true) {
                            name
                            description
                            isDeprecated
                            deprecationReason
                        }
                        possibleTypes {
                            ...TypeRef
                        }
                    }
                    
                    fragment InputValue on __InputValue {
                        name
                        description
                        type { ...TypeRef }
                        defaultValue
                    }
                    
                    fragment TypeRef on __Type {
                        kind
                        name
                        ofType {
                            kind
                            name
                            ofType {
                                kind
                                name
                                ofType {
                                    kind
                                    name
                                    ofType {
                                        kind
                                        name
                                        ofType {
                                            kind
                                            name
                                            ofType {
                                                kind
                                                name
                                                ofType {
                                                    kind
                                                    name
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }		  
								  }`,
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
///////////////////////////////////////

		//////////////////////////
		//// Run Tanium Sensor ///
		//////////////////////////
			this.server.tool(
						'Tanium-Sensor',
						'This allows you to request a specific Tanium sensor, use this sensor if there is no other more specialized tool available',
						{
							input: z.string().describe('the sensor to be requested, must be in Camel Case')
						},
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
							        query: `
									query EndpointCounts {
									    endpoints {
									        edges {
									            node {
									                sensorReading(sensor: { name: "${input}" }) {
									                    values
									                }
									            }
									        }
									    }
									}`,
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
///////////////////////////////////////

		
////freestyle tool test//////
this.server.tool(
			'Tanium-GraphQLCall',
			'This allows you to make any Tanium GraphQL call you would like',
			{
				input: z.string().describe('the GraphQL query to be Posted to Tanium GraphQL')
			},
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
				        query: `query {${input} }`,
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





		////
		this.server.tool(
			'dummy-test',
			'This tool does nothing but is here as a test to see if you can find it',
			{
				input: z.string().describe('the input provided by the user for the test case')
			},
			async ({input}) => {
				const response = `Your test input was marked as: "${input}"`

					return {
					//return output 
				content: [
				  {
					type: 'text',
					text: response,
				  }
				]
			}
			}
			
			//return output 
		
			);
			
		//get weather from city from api call
		this.server.tool(
			'get-weather',
			'Tool to get the weather for a city',
			{
			  city: z.string().describe('The name of the city to get the weather for'),
			},
			async ({ city }) => {
			  // get coordinates for the city
			  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`);
			  const data = await response.json();
		  
			  // handle city not found
			  if (data.results.length === 0) {
				return {
				  content: [
					{
					  type: 'text',
					  text: `City ${city} not found.`,
					}
				  ]
				}
			  }
		  
			  // get the weather data using the coordinates
			  const { latitude, longitude } = data.results[0];
		  
			  const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,rain,relative_humidity_2m`)

			  const weatherData = await weatherResponse.json();
		  
			  return {
				content: [
				  {
					type: 'text',
					text: JSON.stringify(weatherData, null, 2),
				  }
				]
			  }
			}
		  );	
	}
}

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
