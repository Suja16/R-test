import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Define the HTTP link for connecting to GitHub's GraphQL endpoint
const httpLink = createHttpLink({
  uri: "https://api.github.com/graphql", // GitHub's GraphQL endpoint
});

// Create a context link that adds your GitHub access token to the headers
const authLink = setContext((_, { headers }) => {
  // Get the access token securely from environment variables
  const token = process.env.GITHUB_TOKEN; // You should configure this in your .env.local file

  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`, // Format for GitHub authentication header
    },
  };
});

// Create the Apollo Client with the auth and http links
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
