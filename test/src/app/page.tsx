"use client"
import { ApolloProvider, gql, useQuery } from "@apollo/client";
import client from "../../lib/ApolloClient";

const GET_USER_DETAILS = gql`
  query GetUserDetails($login: String!) {
    user(login: $login) {
      name
      bio
      avatarUrl
    }
  }
`;

const UserDetails = ({ login }) => {
  const { data, loading, error } = useQuery(GET_USER_DETAILS, { variables: { login } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ApolloProvider client={client}>
    <div>
      <h3>{data.user.name}</h3>
      <p>{data.user.bio}</p>
      <img src={data.user.avatarUrl} alt={`${data.user.name}'s avatar`} />
    </div>
    </ApolloProvider>
  );
};

export default UserDetails;
