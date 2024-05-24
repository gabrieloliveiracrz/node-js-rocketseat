import { randomUUID } from "node:crypto";
import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js";
import { title } from "node:process";

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const search = req.query

            const tasks = database.select('tasks', search)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            if (!title) {
                return res.writeHead(404).end(JSON.stringify({ message: 'Title not found' }))
            }

            if (!description) {
                return res.writeHead(404).end(JSON.stringify({ message: 'Description not found' }))
            }

            const date = new Date()
            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: date.toLocaleString(),
                updated_at: date.toLocaleString()
            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body


            if (database.select('tasks', id).length === 0) {
                return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }))
            }

            if (!title) {
                return res.writeHead(404).end(JSON.stringify({ message: 'Title not found' }))
            }

            if (!description) {
                return res.writeHead(404).end(JSON.stringify({ message: 'Description not found' }))
            }

            const date = new Date()

            database.update('tasks', id, {
                title,
                description,
                updated_at: date.toLocaleString(),
            })

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/:status'),
        handler: (req, res) => {
            const { id, status } = req.params
            const date = new Date()

            if (database.select('tasks', id).length === 0) {
                return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }))
            }

            database.update('tasks', id, {
                status,
                updated_at: date.toLocaleString(),
            })


            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            if (database.select('tasks', id).length === 0) {
                return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }))
            }

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },
]