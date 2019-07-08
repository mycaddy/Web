module.exports = {
        typeDefs: // Code generated by Prisma (prisma@1.34.1). DO NOT EDIT.
  // Please don't change this file manually but run `prisma generate` to update it.
  // For more information, please read the docs: https://www.prisma.io/docs/prisma-client/

/* GraphQL */ `type AggregateClub {
  count: Int!
}

type AggregateCountry {
  count: Int!
}

type AggregateCourse {
  count: Int!
}

type AggregateGeodata {
  count: Int!
}

type AggregateHole {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type BatchPayload {
  count: Long!
}

type Club {
  id: ID!
  id_number: Int
  name: String
  name_origin: String
  sw_lat: String
  sw_lng: String
  ne_lat: String
  ne_lng: String
  address1: String
  address2: String
  contry: Country
  course(where: CourseWhereInput, orderBy: CourseOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Course!]
  createdAt: DateTime!
  updatedAt: DateTime!
}

type ClubConnection {
  pageInfo: PageInfo!
  edges: [ClubEdge]!
  aggregate: AggregateClub!
}

input ClubCreateInput {
  id: ID
  id_number: Int
  name: String
  name_origin: String
  sw_lat: String
  sw_lng: String
  ne_lat: String
  ne_lng: String
  address1: String
  address2: String
  contry: CountryCreateOneInput
  course: CourseCreateManyWithoutClubInput
}

input ClubCreateOneWithoutCourseInput {
  create: ClubCreateWithoutCourseInput
  connect: ClubWhereUniqueInput
}

input ClubCreateWithoutCourseInput {
  id: ID
  id_number: Int
  name: String
  name_origin: String
  sw_lat: String
  sw_lng: String
  ne_lat: String
  ne_lng: String
  address1: String
  address2: String
  contry: CountryCreateOneInput
}

type ClubEdge {
  node: Club!
  cursor: String!
}

enum ClubOrderByInput {
  id_ASC
  id_DESC
  id_number_ASC
  id_number_DESC
  name_ASC
  name_DESC
  name_origin_ASC
  name_origin_DESC
  sw_lat_ASC
  sw_lat_DESC
  sw_lng_ASC
  sw_lng_DESC
  ne_lat_ASC
  ne_lat_DESC
  ne_lng_ASC
  ne_lng_DESC
  address1_ASC
  address1_DESC
  address2_ASC
  address2_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type ClubPreviousValues {
  id: ID!
  id_number: Int
  name: String
  name_origin: String
  sw_lat: String
  sw_lng: String
  ne_lat: String
  ne_lng: String
  address1: String
  address2: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

type ClubSubscriptionPayload {
  mutation: MutationType!
  node: Club
  updatedFields: [String!]
  previousValues: ClubPreviousValues
}

input ClubSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: ClubWhereInput
  AND: [ClubSubscriptionWhereInput!]
  OR: [ClubSubscriptionWhereInput!]
  NOT: [ClubSubscriptionWhereInput!]
}

input ClubUpdateInput {
  id_number: Int
  name: String
  name_origin: String
  sw_lat: String
  sw_lng: String
  ne_lat: String
  ne_lng: String
  address1: String
  address2: String
  contry: CountryUpdateOneInput
  course: CourseUpdateManyWithoutClubInput
}

input ClubUpdateManyMutationInput {
  id_number: Int
  name: String
  name_origin: String
  sw_lat: String
  sw_lng: String
  ne_lat: String
  ne_lng: String
  address1: String
  address2: String
}

input ClubUpdateOneRequiredWithoutCourseInput {
  create: ClubCreateWithoutCourseInput
  update: ClubUpdateWithoutCourseDataInput
  upsert: ClubUpsertWithoutCourseInput
  connect: ClubWhereUniqueInput
}

input ClubUpdateWithoutCourseDataInput {
  id_number: Int
  name: String
  name_origin: String
  sw_lat: String
  sw_lng: String
  ne_lat: String
  ne_lng: String
  address1: String
  address2: String
  contry: CountryUpdateOneInput
}

input ClubUpsertWithoutCourseInput {
  update: ClubUpdateWithoutCourseDataInput!
  create: ClubCreateWithoutCourseInput!
}

input ClubWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  id_number: Int
  id_number_not: Int
  id_number_in: [Int!]
  id_number_not_in: [Int!]
  id_number_lt: Int
  id_number_lte: Int
  id_number_gt: Int
  id_number_gte: Int
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  name_origin: String
  name_origin_not: String
  name_origin_in: [String!]
  name_origin_not_in: [String!]
  name_origin_lt: String
  name_origin_lte: String
  name_origin_gt: String
  name_origin_gte: String
  name_origin_contains: String
  name_origin_not_contains: String
  name_origin_starts_with: String
  name_origin_not_starts_with: String
  name_origin_ends_with: String
  name_origin_not_ends_with: String
  sw_lat: String
  sw_lat_not: String
  sw_lat_in: [String!]
  sw_lat_not_in: [String!]
  sw_lat_lt: String
  sw_lat_lte: String
  sw_lat_gt: String
  sw_lat_gte: String
  sw_lat_contains: String
  sw_lat_not_contains: String
  sw_lat_starts_with: String
  sw_lat_not_starts_with: String
  sw_lat_ends_with: String
  sw_lat_not_ends_with: String
  sw_lng: String
  sw_lng_not: String
  sw_lng_in: [String!]
  sw_lng_not_in: [String!]
  sw_lng_lt: String
  sw_lng_lte: String
  sw_lng_gt: String
  sw_lng_gte: String
  sw_lng_contains: String
  sw_lng_not_contains: String
  sw_lng_starts_with: String
  sw_lng_not_starts_with: String
  sw_lng_ends_with: String
  sw_lng_not_ends_with: String
  ne_lat: String
  ne_lat_not: String
  ne_lat_in: [String!]
  ne_lat_not_in: [String!]
  ne_lat_lt: String
  ne_lat_lte: String
  ne_lat_gt: String
  ne_lat_gte: String
  ne_lat_contains: String
  ne_lat_not_contains: String
  ne_lat_starts_with: String
  ne_lat_not_starts_with: String
  ne_lat_ends_with: String
  ne_lat_not_ends_with: String
  ne_lng: String
  ne_lng_not: String
  ne_lng_in: [String!]
  ne_lng_not_in: [String!]
  ne_lng_lt: String
  ne_lng_lte: String
  ne_lng_gt: String
  ne_lng_gte: String
  ne_lng_contains: String
  ne_lng_not_contains: String
  ne_lng_starts_with: String
  ne_lng_not_starts_with: String
  ne_lng_ends_with: String
  ne_lng_not_ends_with: String
  address1: String
  address1_not: String
  address1_in: [String!]
  address1_not_in: [String!]
  address1_lt: String
  address1_lte: String
  address1_gt: String
  address1_gte: String
  address1_contains: String
  address1_not_contains: String
  address1_starts_with: String
  address1_not_starts_with: String
  address1_ends_with: String
  address1_not_ends_with: String
  address2: String
  address2_not: String
  address2_in: [String!]
  address2_not_in: [String!]
  address2_lt: String
  address2_lte: String
  address2_gt: String
  address2_gte: String
  address2_contains: String
  address2_not_contains: String
  address2_starts_with: String
  address2_not_starts_with: String
  address2_ends_with: String
  address2_not_ends_with: String
  contry: CountryWhereInput
  course_every: CourseWhereInput
  course_some: CourseWhereInput
  course_none: CourseWhereInput
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  AND: [ClubWhereInput!]
  OR: [ClubWhereInput!]
  NOT: [ClubWhereInput!]
}

input ClubWhereUniqueInput {
  id: ID
  id_number: Int
}

type Country {
  id: ID!
  id_number: Int
  iso_numeric: Int
  iso_alpha_2: String
  iso_alpha_3: String
  name_en: String!
  name_kr: String
  dial_number: String
}

type CountryConnection {
  pageInfo: PageInfo!
  edges: [CountryEdge]!
  aggregate: AggregateCountry!
}

input CountryCreateInput {
  id: ID
  id_number: Int
  iso_numeric: Int
  iso_alpha_2: String
  iso_alpha_3: String
  name_en: String!
  name_kr: String
  dial_number: String
}

input CountryCreateOneInput {
  create: CountryCreateInput
  connect: CountryWhereUniqueInput
}

type CountryEdge {
  node: Country!
  cursor: String!
}

enum CountryOrderByInput {
  id_ASC
  id_DESC
  id_number_ASC
  id_number_DESC
  iso_numeric_ASC
  iso_numeric_DESC
  iso_alpha_2_ASC
  iso_alpha_2_DESC
  iso_alpha_3_ASC
  iso_alpha_3_DESC
  name_en_ASC
  name_en_DESC
  name_kr_ASC
  name_kr_DESC
  dial_number_ASC
  dial_number_DESC
}

type CountryPreviousValues {
  id: ID!
  id_number: Int
  iso_numeric: Int
  iso_alpha_2: String
  iso_alpha_3: String
  name_en: String!
  name_kr: String
  dial_number: String
}

type CountrySubscriptionPayload {
  mutation: MutationType!
  node: Country
  updatedFields: [String!]
  previousValues: CountryPreviousValues
}

input CountrySubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: CountryWhereInput
  AND: [CountrySubscriptionWhereInput!]
  OR: [CountrySubscriptionWhereInput!]
  NOT: [CountrySubscriptionWhereInput!]
}

input CountryUpdateDataInput {
  id_number: Int
  iso_numeric: Int
  iso_alpha_2: String
  iso_alpha_3: String
  name_en: String
  name_kr: String
  dial_number: String
}

input CountryUpdateInput {
  id_number: Int
  iso_numeric: Int
  iso_alpha_2: String
  iso_alpha_3: String
  name_en: String
  name_kr: String
  dial_number: String
}

input CountryUpdateManyMutationInput {
  id_number: Int
  iso_numeric: Int
  iso_alpha_2: String
  iso_alpha_3: String
  name_en: String
  name_kr: String
  dial_number: String
}

input CountryUpdateOneInput {
  create: CountryCreateInput
  update: CountryUpdateDataInput
  upsert: CountryUpsertNestedInput
  delete: Boolean
  disconnect: Boolean
  connect: CountryWhereUniqueInput
}

input CountryUpsertNestedInput {
  update: CountryUpdateDataInput!
  create: CountryCreateInput!
}

input CountryWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  id_number: Int
  id_number_not: Int
  id_number_in: [Int!]
  id_number_not_in: [Int!]
  id_number_lt: Int
  id_number_lte: Int
  id_number_gt: Int
  id_number_gte: Int
  iso_numeric: Int
  iso_numeric_not: Int
  iso_numeric_in: [Int!]
  iso_numeric_not_in: [Int!]
  iso_numeric_lt: Int
  iso_numeric_lte: Int
  iso_numeric_gt: Int
  iso_numeric_gte: Int
  iso_alpha_2: String
  iso_alpha_2_not: String
  iso_alpha_2_in: [String!]
  iso_alpha_2_not_in: [String!]
  iso_alpha_2_lt: String
  iso_alpha_2_lte: String
  iso_alpha_2_gt: String
  iso_alpha_2_gte: String
  iso_alpha_2_contains: String
  iso_alpha_2_not_contains: String
  iso_alpha_2_starts_with: String
  iso_alpha_2_not_starts_with: String
  iso_alpha_2_ends_with: String
  iso_alpha_2_not_ends_with: String
  iso_alpha_3: String
  iso_alpha_3_not: String
  iso_alpha_3_in: [String!]
  iso_alpha_3_not_in: [String!]
  iso_alpha_3_lt: String
  iso_alpha_3_lte: String
  iso_alpha_3_gt: String
  iso_alpha_3_gte: String
  iso_alpha_3_contains: String
  iso_alpha_3_not_contains: String
  iso_alpha_3_starts_with: String
  iso_alpha_3_not_starts_with: String
  iso_alpha_3_ends_with: String
  iso_alpha_3_not_ends_with: String
  name_en: String
  name_en_not: String
  name_en_in: [String!]
  name_en_not_in: [String!]
  name_en_lt: String
  name_en_lte: String
  name_en_gt: String
  name_en_gte: String
  name_en_contains: String
  name_en_not_contains: String
  name_en_starts_with: String
  name_en_not_starts_with: String
  name_en_ends_with: String
  name_en_not_ends_with: String
  name_kr: String
  name_kr_not: String
  name_kr_in: [String!]
  name_kr_not_in: [String!]
  name_kr_lt: String
  name_kr_lte: String
  name_kr_gt: String
  name_kr_gte: String
  name_kr_contains: String
  name_kr_not_contains: String
  name_kr_starts_with: String
  name_kr_not_starts_with: String
  name_kr_ends_with: String
  name_kr_not_ends_with: String
  dial_number: String
  dial_number_not: String
  dial_number_in: [String!]
  dial_number_not_in: [String!]
  dial_number_lt: String
  dial_number_lte: String
  dial_number_gt: String
  dial_number_gte: String
  dial_number_contains: String
  dial_number_not_contains: String
  dial_number_starts_with: String
  dial_number_not_starts_with: String
  dial_number_ends_with: String
  dial_number_not_ends_with: String
  AND: [CountryWhereInput!]
  OR: [CountryWhereInput!]
  NOT: [CountryWhereInput!]
}

input CountryWhereUniqueInput {
  id: ID
  id_number: Int
  iso_numeric: Int
}

type Course {
  id: ID!
  club: Club!
  seq_no: Int
  name: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type CourseConnection {
  pageInfo: PageInfo!
  edges: [CourseEdge]!
  aggregate: AggregateCourse!
}

input CourseCreateInput {
  id: ID
  club: ClubCreateOneWithoutCourseInput!
  seq_no: Int
  name: String!
}

input CourseCreateManyWithoutClubInput {
  create: [CourseCreateWithoutClubInput!]
  connect: [CourseWhereUniqueInput!]
}

input CourseCreateOneInput {
  create: CourseCreateInput
  connect: CourseWhereUniqueInput
}

input CourseCreateWithoutClubInput {
  id: ID
  seq_no: Int
  name: String!
}

type CourseEdge {
  node: Course!
  cursor: String!
}

enum CourseOrderByInput {
  id_ASC
  id_DESC
  seq_no_ASC
  seq_no_DESC
  name_ASC
  name_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type CoursePreviousValues {
  id: ID!
  seq_no: Int
  name: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

input CourseScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  seq_no: Int
  seq_no_not: Int
  seq_no_in: [Int!]
  seq_no_not_in: [Int!]
  seq_no_lt: Int
  seq_no_lte: Int
  seq_no_gt: Int
  seq_no_gte: Int
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  AND: [CourseScalarWhereInput!]
  OR: [CourseScalarWhereInput!]
  NOT: [CourseScalarWhereInput!]
}

type CourseSubscriptionPayload {
  mutation: MutationType!
  node: Course
  updatedFields: [String!]
  previousValues: CoursePreviousValues
}

input CourseSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: CourseWhereInput
  AND: [CourseSubscriptionWhereInput!]
  OR: [CourseSubscriptionWhereInput!]
  NOT: [CourseSubscriptionWhereInput!]
}

input CourseUpdateDataInput {
  club: ClubUpdateOneRequiredWithoutCourseInput
  seq_no: Int
  name: String
}

input CourseUpdateInput {
  club: ClubUpdateOneRequiredWithoutCourseInput
  seq_no: Int
  name: String
}

input CourseUpdateManyDataInput {
  seq_no: Int
  name: String
}

input CourseUpdateManyMutationInput {
  seq_no: Int
  name: String
}

input CourseUpdateManyWithoutClubInput {
  create: [CourseCreateWithoutClubInput!]
  delete: [CourseWhereUniqueInput!]
  connect: [CourseWhereUniqueInput!]
  set: [CourseWhereUniqueInput!]
  disconnect: [CourseWhereUniqueInput!]
  update: [CourseUpdateWithWhereUniqueWithoutClubInput!]
  upsert: [CourseUpsertWithWhereUniqueWithoutClubInput!]
  deleteMany: [CourseScalarWhereInput!]
  updateMany: [CourseUpdateManyWithWhereNestedInput!]
}

input CourseUpdateManyWithWhereNestedInput {
  where: CourseScalarWhereInput!
  data: CourseUpdateManyDataInput!
}

input CourseUpdateOneInput {
  create: CourseCreateInput
  update: CourseUpdateDataInput
  upsert: CourseUpsertNestedInput
  delete: Boolean
  disconnect: Boolean
  connect: CourseWhereUniqueInput
}

input CourseUpdateWithoutClubDataInput {
  seq_no: Int
  name: String
}

input CourseUpdateWithWhereUniqueWithoutClubInput {
  where: CourseWhereUniqueInput!
  data: CourseUpdateWithoutClubDataInput!
}

input CourseUpsertNestedInput {
  update: CourseUpdateDataInput!
  create: CourseCreateInput!
}

input CourseUpsertWithWhereUniqueWithoutClubInput {
  where: CourseWhereUniqueInput!
  update: CourseUpdateWithoutClubDataInput!
  create: CourseCreateWithoutClubInput!
}

input CourseWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  club: ClubWhereInput
  seq_no: Int
  seq_no_not: Int
  seq_no_in: [Int!]
  seq_no_not_in: [Int!]
  seq_no_lt: Int
  seq_no_lte: Int
  seq_no_gt: Int
  seq_no_gte: Int
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  AND: [CourseWhereInput!]
  OR: [CourseWhereInput!]
  NOT: [CourseWhereInput!]
}

input CourseWhereUniqueInput {
  id: ID
}

scalar DateTime

type Geodata {
  id: ID!
  course: Course
  lat: String
  lng: String
  alt: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

type GeodataConnection {
  pageInfo: PageInfo!
  edges: [GeodataEdge]!
  aggregate: AggregateGeodata!
}

input GeodataCreateInput {
  id: ID
  course: CourseCreateOneInput
  lat: String
  lng: String
  alt: String
}

type GeodataEdge {
  node: Geodata!
  cursor: String!
}

enum GeodataOrderByInput {
  id_ASC
  id_DESC
  lat_ASC
  lat_DESC
  lng_ASC
  lng_DESC
  alt_ASC
  alt_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type GeodataPreviousValues {
  id: ID!
  lat: String
  lng: String
  alt: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

type GeodataSubscriptionPayload {
  mutation: MutationType!
  node: Geodata
  updatedFields: [String!]
  previousValues: GeodataPreviousValues
}

input GeodataSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: GeodataWhereInput
  AND: [GeodataSubscriptionWhereInput!]
  OR: [GeodataSubscriptionWhereInput!]
  NOT: [GeodataSubscriptionWhereInput!]
}

input GeodataUpdateInput {
  course: CourseUpdateOneInput
  lat: String
  lng: String
  alt: String
}

input GeodataUpdateManyMutationInput {
  lat: String
  lng: String
  alt: String
}

input GeodataWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  course: CourseWhereInput
  lat: String
  lat_not: String
  lat_in: [String!]
  lat_not_in: [String!]
  lat_lt: String
  lat_lte: String
  lat_gt: String
  lat_gte: String
  lat_contains: String
  lat_not_contains: String
  lat_starts_with: String
  lat_not_starts_with: String
  lat_ends_with: String
  lat_not_ends_with: String
  lng: String
  lng_not: String
  lng_in: [String!]
  lng_not_in: [String!]
  lng_lt: String
  lng_lte: String
  lng_gt: String
  lng_gte: String
  lng_contains: String
  lng_not_contains: String
  lng_starts_with: String
  lng_not_starts_with: String
  lng_ends_with: String
  lng_not_ends_with: String
  alt: String
  alt_not: String
  alt_in: [String!]
  alt_not_in: [String!]
  alt_lt: String
  alt_lte: String
  alt_gt: String
  alt_gte: String
  alt_contains: String
  alt_not_contains: String
  alt_starts_with: String
  alt_not_starts_with: String
  alt_ends_with: String
  alt_not_ends_with: String
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  AND: [GeodataWhereInput!]
  OR: [GeodataWhereInput!]
  NOT: [GeodataWhereInput!]
}

input GeodataWhereUniqueInput {
  id: ID
}

type Hole {
  id: ID!
  seq_no: Int
  course: Course
  createdAt: DateTime!
  updatedAt: DateTime!
}

type HoleConnection {
  pageInfo: PageInfo!
  edges: [HoleEdge]!
  aggregate: AggregateHole!
}

input HoleCreateInput {
  id: ID
  seq_no: Int
  course: CourseCreateOneInput
}

type HoleEdge {
  node: Hole!
  cursor: String!
}

enum HoleOrderByInput {
  id_ASC
  id_DESC
  seq_no_ASC
  seq_no_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type HolePreviousValues {
  id: ID!
  seq_no: Int
  createdAt: DateTime!
  updatedAt: DateTime!
}

type HoleSubscriptionPayload {
  mutation: MutationType!
  node: Hole
  updatedFields: [String!]
  previousValues: HolePreviousValues
}

input HoleSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: HoleWhereInput
  AND: [HoleSubscriptionWhereInput!]
  OR: [HoleSubscriptionWhereInput!]
  NOT: [HoleSubscriptionWhereInput!]
}

input HoleUpdateInput {
  seq_no: Int
  course: CourseUpdateOneInput
}

input HoleUpdateManyMutationInput {
  seq_no: Int
}

input HoleWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  seq_no: Int
  seq_no_not: Int
  seq_no_in: [Int!]
  seq_no_not_in: [Int!]
  seq_no_lt: Int
  seq_no_lte: Int
  seq_no_gt: Int
  seq_no_gte: Int
  course: CourseWhereInput
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  AND: [HoleWhereInput!]
  OR: [HoleWhereInput!]
  NOT: [HoleWhereInput!]
}

input HoleWhereUniqueInput {
  id: ID
}

scalar Long

type Mutation {
  createClub(data: ClubCreateInput!): Club!
  updateClub(data: ClubUpdateInput!, where: ClubWhereUniqueInput!): Club
  updateManyClubs(data: ClubUpdateManyMutationInput!, where: ClubWhereInput): BatchPayload!
  upsertClub(where: ClubWhereUniqueInput!, create: ClubCreateInput!, update: ClubUpdateInput!): Club!
  deleteClub(where: ClubWhereUniqueInput!): Club
  deleteManyClubs(where: ClubWhereInput): BatchPayload!
  createCountry(data: CountryCreateInput!): Country!
  updateCountry(data: CountryUpdateInput!, where: CountryWhereUniqueInput!): Country
  updateManyCountries(data: CountryUpdateManyMutationInput!, where: CountryWhereInput): BatchPayload!
  upsertCountry(where: CountryWhereUniqueInput!, create: CountryCreateInput!, update: CountryUpdateInput!): Country!
  deleteCountry(where: CountryWhereUniqueInput!): Country
  deleteManyCountries(where: CountryWhereInput): BatchPayload!
  createCourse(data: CourseCreateInput!): Course!
  updateCourse(data: CourseUpdateInput!, where: CourseWhereUniqueInput!): Course
  updateManyCourses(data: CourseUpdateManyMutationInput!, where: CourseWhereInput): BatchPayload!
  upsertCourse(where: CourseWhereUniqueInput!, create: CourseCreateInput!, update: CourseUpdateInput!): Course!
  deleteCourse(where: CourseWhereUniqueInput!): Course
  deleteManyCourses(where: CourseWhereInput): BatchPayload!
  createGeodata(data: GeodataCreateInput!): Geodata!
  updateGeodata(data: GeodataUpdateInput!, where: GeodataWhereUniqueInput!): Geodata
  updateManyGeodatas(data: GeodataUpdateManyMutationInput!, where: GeodataWhereInput): BatchPayload!
  upsertGeodata(where: GeodataWhereUniqueInput!, create: GeodataCreateInput!, update: GeodataUpdateInput!): Geodata!
  deleteGeodata(where: GeodataWhereUniqueInput!): Geodata
  deleteManyGeodatas(where: GeodataWhereInput): BatchPayload!
  createHole(data: HoleCreateInput!): Hole!
  updateHole(data: HoleUpdateInput!, where: HoleWhereUniqueInput!): Hole
  updateManyHoles(data: HoleUpdateManyMutationInput!, where: HoleWhereInput): BatchPayload!
  upsertHole(where: HoleWhereUniqueInput!, create: HoleCreateInput!, update: HoleUpdateInput!): Hole!
  deleteHole(where: HoleWhereUniqueInput!): Hole
  deleteManyHoles(where: HoleWhereInput): BatchPayload!
  createUser(data: UserCreateInput!): User!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateManyUsers(data: UserUpdateManyMutationInput!, where: UserWhereInput): BatchPayload!
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  deleteUser(where: UserWhereUniqueInput!): User
  deleteManyUsers(where: UserWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  club(where: ClubWhereUniqueInput!): Club
  clubs(where: ClubWhereInput, orderBy: ClubOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Club]!
  clubsConnection(where: ClubWhereInput, orderBy: ClubOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ClubConnection!
  country(where: CountryWhereUniqueInput!): Country
  countries(where: CountryWhereInput, orderBy: CountryOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Country]!
  countriesConnection(where: CountryWhereInput, orderBy: CountryOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): CountryConnection!
  course(where: CourseWhereUniqueInput!): Course
  courses(where: CourseWhereInput, orderBy: CourseOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Course]!
  coursesConnection(where: CourseWhereInput, orderBy: CourseOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): CourseConnection!
  geodata(where: GeodataWhereUniqueInput!): Geodata
  geodatas(where: GeodataWhereInput, orderBy: GeodataOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Geodata]!
  geodatasConnection(where: GeodataWhereInput, orderBy: GeodataOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): GeodataConnection!
  hole(where: HoleWhereUniqueInput!): Hole
  holes(where: HoleWhereInput, orderBy: HoleOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Hole]!
  holesConnection(where: HoleWhereInput, orderBy: HoleOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): HoleConnection!
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  node(id: ID!): Node
}

type Subscription {
  club(where: ClubSubscriptionWhereInput): ClubSubscriptionPayload
  country(where: CountrySubscriptionWhereInput): CountrySubscriptionPayload
  course(where: CourseSubscriptionWhereInput): CourseSubscriptionPayload
  geodata(where: GeodataSubscriptionWhereInput): GeodataSubscriptionPayload
  hole(where: HoleSubscriptionWhereInput): HoleSubscriptionPayload
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
}

type User {
  id: ID!
  email: String
  name: String!
  password: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  id: ID
  email: String
  name: String!
  password: String!
}

type UserEdge {
  node: User!
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  email_ASC
  email_DESC
  name_ASC
  name_DESC
  password_ASC
  password_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type UserPreviousValues {
  id: ID!
  email: String
  name: String!
  password: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: UserWhereInput
  AND: [UserSubscriptionWhereInput!]
  OR: [UserSubscriptionWhereInput!]
  NOT: [UserSubscriptionWhereInput!]
}

input UserUpdateInput {
  email: String
  name: String
  password: String
}

input UserUpdateManyMutationInput {
  email: String
  name: String
  password: String
}

input UserWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  password: String
  password_not: String
  password_in: [String!]
  password_not_in: [String!]
  password_lt: String
  password_lte: String
  password_gt: String
  password_gte: String
  password_contains: String
  password_not_contains: String
  password_starts_with: String
  password_not_starts_with: String
  password_ends_with: String
  password_not_ends_with: String
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  AND: [UserWhereInput!]
  OR: [UserWhereInput!]
  NOT: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  email: String
}
`
      }
    