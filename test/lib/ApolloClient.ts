import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://api.github.com/graphql", 
});

const authLink = setContext((_, { headers }) => {
  
  // const token = process.env.GITHUB_TOKEN; 

  return {
    headers: {
      ...headers,
      Authorization: `Bearer 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`, 
    },
  };
});

// Create the Apollo Client with the auth and http links
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
