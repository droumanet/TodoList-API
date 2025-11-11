import { describe, it, expect, beforeEach } from 'vitest'
import Todo from '../Todo.js'

describe('Tests sur la classe Todo', () => {
    // Premier test : création d'une tâche vide impossible
    it('doit lever une erreur si le nom est vide', () => {
        // On vérifie que le constructeur lève une erreur si le nom est vide
        expect(() => new Todo(1, '')).toThrow('Le nom doit être une chaîne non vide')
    })

    // Deuxième test : création d'une tâche valide
    it('doit créer un Todo valide', () => {
        const todo = new Todo(1, 'Ma tâche', 2, true)
        expect(todo.id).toBe(1)
        expect(todo.name).toBe('Ma tâche')
        expect(todo.priority).toBe(2)
        expect(todo.done).toBe(true)
    })

    // Troisième test : modification de tâche
    it('doit modifier le nom d\'une tâche', () => {
        const todo = new Todo(1, 'Tester la modfiication de tâche', 2, true)
        todo.update({"name": "Tester la modification de tâche"})
        expect(todo.id).toBe(1)
        expect(todo.name).toBe('Tester la modification de tâche')
        expect(todo.priority).toBe(2)
        expect(todo.done).toBe(true)
    })

})

describe('Tests sur une collection Todo', () => {
    // Initialisation
    let todos
    beforeEach(() => {
        todos = []
    })

    it('Vérifier liste vide', () => {
        // On vérifie que le constructeur lève une erreur si le nom est vide
        expect(todos).toBeTypeOf('object')
    })

    // Deuxième test : création d'une tâche valide
    it('Vérifier liste deux éléments', () => {
        todos.push(new Todo(1, 'Première tâche', 2, true))
        todos.push(new Todo(1, 'Deuxième tâche', 2, true))
        expect(todos.length).toBe(2)
        expect(todos[0].name).toBe('Première tâche')
    })
})