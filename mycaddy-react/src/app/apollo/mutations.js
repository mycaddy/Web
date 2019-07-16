import gql from 'graphql-tag'
import {
  GraphQLInt,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLNonNull,
} from 'graphql';

const CREATE_COUNTRY = gql`
  mutation CreateCountry($data: CountryInput!) {
    createCountry(data: $data) {
      id
      id_number
      iso_numeric
      iso_alpha_2
      iso_alpha_3
      name_en
      name_kr
      dial_number
    }
  } 
`

const DELETE_COUNTRY = gql`
  mutation DeleteCountry($id: String!) {
    deleteCountry(id: $id) {
      id_number
      name_en
    }
  }
`

const UPDATE_COUNTRY = gql`
  mutation UpdateCountry($id: String!, $data: CountryInput!) {
    updateCountry(id: $id, data: $data) {
      id
      id_number
      iso_numeric
      iso_alpha_2
      iso_alpha_3
      name_en
      name_kr
      dial_number
    }
  }
`
const CountryInput = new GraphQLInputObjectType({
  name: 'CountryInput',
  description: 'Input country payload',
  fields: () => ({
    name_en: {
      type: new GraphQLNonNull(GraphQLString)
    },
    id_number: {
      type: GraphQLInt
    },
    iso_numeric: {
      type: GraphQLString
    },
    iso_alpha_2: {
      type: GraphQLString
    },
    iso_alpha_3: {
      type: GraphQLString
    },
    name_kr: {
      type: GraphQLString
    },
    dial_number: {
      type: GraphQLString
    },
  })
})

export {
  CREATE_COUNTRY,
  DELETE_COUNTRY,
  UPDATE_COUNTRY,
  CountryInput,
} 