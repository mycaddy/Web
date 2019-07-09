import { prisma } from '../generated/prisma-client'

import countries from './countries.json'




function country_data_dump(data) {
  for (const country of data) {
    const newContry = prisma.createCountry({
      iso_numeric: country.ISO3166_1_numeric,
      iso_alpha_2: country.ISO3166_1_Alpha_2,
      iso_alpha_3: country.ISO3166_1_Alpha_3,
      name_en: country.display_name,
      dial_number: country.Dial 
    })
    console.log(newContry)
  }
}

country_data_dump(countries)

