import ApolloClient from 'apollo-boost'
import dotenv from 'dotenv'
dotenv.config()

const graphql_server_addr = process.env.GRAPHQL_SERVER_ADDR
const client = new ApolloClient({
  uri: graphql_server_addr
})

export {
  client
}