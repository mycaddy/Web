import ApolloClient from 'apollo-boost'
const graphql_server_addr = process.env.REACT_APP_SERVER_ADDR
console.log('graphql_server_addr', graphql_server_addr)
const client = new ApolloClient({
  uri: graphql_server_addr
})

export {
  client
}