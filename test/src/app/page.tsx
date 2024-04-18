"use client"
import { useState } from 'react';
import { ApolloProvider, gql, useLazyQuery } from "@apollo/client";
import client from "../../lib/ApolloClient";
import { Box, CircularProgress, Paper, TextField, Typography } from "@mui/material";
import debounce from 'lodash/debounce';

const GET_USER_DETAILS = gql`
  query GetUser($username: String!) {
    user(login: $username) {
      name
      login
      bio
      location
      company
      email
      avatarUrl
      url
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(first: 10, orderBy: {field: UPDATED_AT, direction: DESC}) {
        totalCount
        edges {
          node {
            name
            description
            url
            stargazerCount
            forkCount
            updatedAt
          }
        }
      }
    }
  }
`;

const UserDetails = () => {
  const [username, setUsername] = useState("");
  const [getUserDetails, { data, loading, error }] = useLazyQuery(GET_USER_DETAILS);

  // Debounce the search function
  const debouncedSearch = debounce((value) => {
    getUserDetails({ variables: { username: value } });
  }, 500); 

  const handleSearch = (value) => {
    setUsername(value);
    debouncedSearch(value);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <TextField
          label="Search Username"
          variant="outlined"
          value={username}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </Paper>
      {loading && <CircularProgress sx={{ mt: 4 }} />}
      {error && (
        <Typography color="error" variant="body1" sx={{ mt: 2 }}>
          Error: {error.message}
        </Typography>
      )}
      {data && data.user && (
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <img src={data.user.avatarUrl} alt="avatar" style={{ borderRadius: '50%', marginBottom: '1rem' }} />
            <Typography variant="h6">User Details:</Typography>
            <Typography>Name: {data.user.name}</Typography>
            <Typography>Login: {data.user.login}</Typography>
            <Typography>Bio: {data.user.bio}</Typography>
            <Typography>Location: {data.user.location}</Typography>
            <Typography>Company: {data.user.company}</Typography>
            <Typography>Email: {data.user.email}</Typography>
            <Typography>URL: {data.user.url}</Typography>
            <Typography>Followers: {data.user.followers.totalCount}</Typography>
            <Typography>Following: {data.user.following.totalCount}</Typography>
            <Typography>Repositories: {data.user.repositories.totalCount}</Typography>
            {/* {data.user.repositories.edges.map((repo, index) => (
              <Box key={index} border={1} p={1} my={1}>
                <Typography>Name: {repo.node.name}</Typography>
                <Typography>Description: {repo.node.description}</Typography>
                <Typography>URL: {repo.node.url}</Typography>
                <Typography>Stargazers: {repo.node.stargazerCount}</Typography>
                <Typography>Forks: {repo.node.forkCount}</Typography>
                <Typography>Last Updated: {repo.node.updatedAt}</Typography>
              </Box>
            ))} */}
          </Box>
        </Paper>
      )}
      {data && !data.user && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No user found with the username "{username}".
        </Typography>
      )}
    </Box>
  );
};

const UserDetailsPage = () => {
  return (
    <ApolloProvider client={client}>
      <UserDetails />
    </ApolloProvider>
  );
};

export default UserDetailsPage;
