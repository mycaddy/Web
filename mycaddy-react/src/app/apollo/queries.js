import gql from 'graphql-tag'

const GET_COUNTRIES = gql`
  query GetCountries($filter: String, $skip: Int, $first: Int, $orderBy: CountryOrderByInput) {
    countries(filter: $filter, skip: $skip ,first: $first, orderBy: $orderBy) {
      count,
      data {
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
  } 
`
const GET_COUNTRY_NUMBER_IDS = gql`
  query GetCountryNumberIds($orderBy: CountryOrderByInput) {
    countries(orderBy: $orderBy) {
      count,
      data {
        id_number
      }
    }
  }
`

export {
  GET_COUNTRIES,
  GET_COUNTRY_NUMBER_IDS
}