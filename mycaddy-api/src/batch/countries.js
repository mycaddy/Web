import { prisma } from '../generated/prisma-client'

import countries_iso from './countries.iso.json'
import countries_bak from './countries.mycaddy.json' 

/*
async function country_data_dump(data) {
  for (const country of data) {
    const newContry = await prisma.createCountry({
      iso_numeric: country.ISO3166_1_numeric,
      iso_alpha_2: country.ISO3166_1_Alpha_2,
      iso_alpha_3: country.ISO3166_1_Alpha_3,
      name_en: country.display_name,
      dial_number: country.Dial 
    })
   console.log(newContry)
   
   console.log(country.display_name)
  }
}
*/

async function country_data_dump(data) {
  for (const country of data) {
    const newContry = await prisma.createCountry({
      // iso_numeric: country.ISO3166_1_numeric,
      // iso_alpha_2: country.ISO3166_1_Alpha_2,
      // iso_alpha_3: country.ISO3166_1_Alpha_3,
      id_number: country.code, 
      name_en: country.country,
    })
   console.log(newContry)
   // console.log(country.display_name)
  }
}

async function country_data_update_with(data) {
  for (const country of data) {
    /** 
    try {
      const result = await prisma.country(
        { name_en: country.display_name }
      )
      console.log(result)  
    }
    catch(e) {
      console.log(e)
    }
    */
    try {
      const result = await prisma.updateCountry({
        data: {
          iso_numeric: country.ISO3166_1_numeric,
          iso_alpha_2: country.ISO3166_1_Alpha_2,
          iso_alpha_3: country.ISO3166_1_Alpha_3,
          dial_number: country.Dial 
        },
        where: {
          name_en: country.display_name
        }
      })
      console.log(result)
    }
    catch(e) {
      console.log(e)
    }
  } 
  
}

country_data_update_with(countries_iso)// .catch(e => console.log(e))

