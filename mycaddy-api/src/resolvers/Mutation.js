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

function createCountry(parent, args, context) {
  return context.prisma.createCountry(args.data)
}

function updateCountry(parent, args, context) {
  return context.prisma.updateCountry({
    where: { id: args.id },
    data: args.data,
  })
}

function deleteCountry(parent, args, context) {
  return context.prisma.deleteCountry({
    id: args.id
  })
}

export default {
  signUp,
  signIn,
  createCountry,
  updateCountry,
  deleteCountry
}