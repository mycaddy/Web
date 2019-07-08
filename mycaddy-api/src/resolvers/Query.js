async function countries(parent, args, context) {
  const count = await context.prisma.countriesConnection({
      where: {
        OR: [
          { name_en_contains: args.filter },
          { name_kr_contains: args.filter }
        ]
      }
    }).aggeregate().count()

  const data = await context.prisma.countries({
      where: {
        OR: [
          { name_en_contains: args.filter },
          { name_kr_contains: args.filter }
        ]
      },
      skip: args.skip,
      first: args.first,
      orderBy: args.orderBy      
    })
  
  return {
    count,
    data
  }
}

export default {
  countries
}