import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isDiet: z.boolean(),
        date: z.coerce.date(),
      })

      const { name, description, isDiet, date } = createMealBodySchema.parse(
        request.body,
      )

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        is_diet: isDiet,
        date: date.getTime(),
        user_id: request.user?.id,
      })

      return reply.status(201).send()
    },
  )

  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const meals = await knex('meals')
        .where({ user_id: request.user?.id })
        .orderBy('date', 'desc')

      return reply.status(200).send(meals)
    },
  )

  app.get(
    '/:idMeal',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({ idMeal: z.string().uuid() })
      const { idMeal } = paramsSchema.parse(request.params)

      const meal = await knex('meals').where({ id: idMeal }).first()

      return reply.status(200).send(meal)
    },
  )

  app.put(
    '/:idMeal',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({ idMeal: z.string().uuid() })

      const { idMeal } = paramsSchema.parse(request.params)

      const mealExist = await knex('meals').where({ id: idMeal }).first()

      if (!mealExist) {
        return reply.status(404).send({ message: 'Meal not found!' })
      }

      const updateMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isDiet: z.boolean(),
        date: z.coerce.date(),
      })

      const { name, description, isDiet, date } = updateMealBodySchema.parse(
        request.body,
      )

      await knex('meals').where({ id: idMeal }).update({
        name,
        description,
        is_diet: isDiet,
        date: date.getTime(),
      })

      return reply.status(204).send()
    },
  )

  app.delete(
    '/:idMeal',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({ idMeal: z.string().uuid() })

      const { idMeal } = paramsSchema.parse(request.params)

      const mealExist = await knex('meals').where({ id: idMeal }).first()

      if (!mealExist) {
        return reply.status(404).send({ message: 'Meal not found!' })
      }

      await knex('meals').where({ id: idMeal }).delete()

      return reply.status(204).send()
    },
  )

  app.get(
    '/metrics',
    { preHandler: checkSessionIdExists },
    async (request, reply) => {
      const totalMealsRecord = await knex('meals').where({
        user_id: request.user?.id,
      })

      const totalMealsIsDiet = await knex('meals').where({
        user_id: request.user?.id,
        is_diet: true,
      })

      const totalMealsNotDiet = await knex('meals').where({
        user_id: request.user?.id,
        is_diet: false,
      })

      const { bestOnDietSequence } = totalMealsRecord.reduce(
        (acc, meal) => {
          if (meal.is_diet) {
            acc.currentSequence += 1
          } else {
            acc.currentSequence = 0
          }

          if (acc.currentSequence > acc.bestOnDietSequence) {
            acc.bestOnDietSequence = acc.currentSequence
          }

          return acc
        },
        { bestOnDietSequence: 0, currentSequence: 0 },
      )

      return reply.send({
        totalMealsRecord: totalMealsRecord.length,
        totalMealsIsDiet: totalMealsIsDiet.length,
        totalMealsNotDiet: totalMealsNotDiet.length,
        bestOnDietSequence,
      })
    },
  )
}
