import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const { APP_SECRET, getUserId } = require('../utils')

async function signUp(parent, args, context) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.prisma.createUser({ ...args, password })

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

async function signIn(parent, args, context) {
  const user = await context.prisma.user({ email: args.email })
  if (!user) {
    throw new Error('No such user found')
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  return {
    token: jwt.sign({ userId: user.id }, APP_SECRET),
    user,
  }
}

function addCountry(parent, args, context) {
  return context.prisma.createCountry({
    iso_numeric: args.iso_number,
    iso_alpha_2: args.iso_alpha2,
    iso_alpha_3: args.iso_alpha3,
    name_en: args.name_en,
    name_kr: args.name_kr,
    dial_number: args.dial_number,
  })
}

export default {
  signUp,
  signIn,
  addCountry,
}
