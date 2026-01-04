// models/database.js
import prisma from './prisma.js';

// Récupérer tous les todos
export async function getAllTodos() {
    return prisma.todo.findMany({ orderBy: { id: 'asc' } });
}

// Récupérer un todo par ID
export async function getTodoById(id) {
    return prisma.todo.findUnique({ where: { id: Number(id) } });
}

// Créer un todo
export async function createTodo({ name, priority = 1, done = false }) {
    return prisma.todo.create({
        data: { name, priority, done }
    });
}

// Remplacer un todo (PUT)
export async function replaceTodo(id, { name, priority, done }) {
    return prisma.todo.update({
        where: { id: Number(id) },
        data: { name, priority, done }
    });
}

// Mise à jour partielle (PATCH)
export async function updateTodo(id, data) {
    return prisma.todo.update({
        where: { id: Number(id) },
        data
    });
}

// Supprimer un todo
export async function deleteTodo(id) {
    return prisma.todo.delete({ where: { id: Number(id) } });
}

// Supprimer tous les todos
export async function deleteAllTodos() {
    const result = await prisma.todo.deleteMany({});
    return result.count;
}

// Statistiques
export async function getStats() {
    const total = await prisma.todo.count();
    const completed = await prisma.todo.count({ where: { done: true } });
    const pending = total - completed;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;
    const byPriority = await prisma.todo.groupBy({
        by: ['priority'],
        _count: { priority: true }
    });
    return {
        total,
        completed,
        pending,
        completionRate,
        byPriority: byPriority.map(p => ({ priority: p.priority, count: p._count.priority }))
    };
}
