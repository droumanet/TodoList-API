import { describe, it, expect, vi } from 'vitest'
import CtrlTodo from '../controller.js'

describe('Vérifier le Contrôleur Todo', () => {
    it('readTodos doit retourner la liste des todos', () => {
        // On simule les objets req et res d’Express
        const req = {}
        const res = {
            json: vi.fn()
        }

        CtrlTodo.readTodos(req, res)

        // On vérifie que res.json a été appelé avec un objet contenant les bonnes propriétés
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
            success: true,
            data: expect.any(Array),
            count: expect.any(Number)
            })
        )
    })

    it('createTodo doit ajouter une nouvelle tâche et répondre avec 201', () => {
        // 1. On prépare une requête simulée avec un corps valide
        const req = {
            body: {
            name: 'Nouvelle tâche',
            priority: 2,
            done: false
            }
        }

        // 2. On crée un objet res avec des fonctions mockées
        //    - res.status doit pouvoir être chaîné (retourne res)
        //    - res.json doit enregistrer les appels
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }

        // 3. On appelle la fonction à tester
        CtrlTodo.createTodo(req, res)

        // 4. On vérifie que res.status a été appelé avec 201
        expect(res.status).toHaveBeenCalledWith(201)

        // 5. On vérifie que res.json a été appelé avec un objet contenant la nouvelle tâche
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
            success: true,
            data: expect.objectContaining({
                name: 'Nouvelle tâche',
                priority: 2,
                done: false
            }),
            message: 'Tâche créée avec succès'
            })
        )
    })

    it('deleteTodo supprime une tâche existante et répond 204', () => {
        // 1. il doit exister une tâche avec l'id 1 (voir initialisation dans controller.js)
        const req = {
            params: { id: '1' } // Dans Express on lit req.params depuis l'URL
        }

        // 2. On mock les méthodes de res attendues
        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn()
        }

        CtrlTodo.deleteTodo(req, res)

        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.send).toHaveBeenCalled()
    })

})