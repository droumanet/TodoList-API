// controller.js
import * as db from './models/database.js';

export default {
  readTodos: async (req, res) => {
    try {
      const todos = await db.getAllTodos();
      res.json({ success: true, data: todos, count: todos.length });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erreur lors de la récupération des tâches', message: error.message });
    }
  },

  readTodoId: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'ID invalide' });
      const todo = await db.getTodoById(id);
      if (!todo) return res.status(404).json({ success: false, error: 'Tâche non trouvée' });
      res.json({ success: true, data: todo });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erreur lors de la récupération de la tâche', message: error.message });
    }
  },

  createTodo: async (req, res) => {
    try {
      const { name, priority, done } = req.body;
      if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ success: false, error: 'Nom requis' });
      }
      const newTodo = await db.createTodo({ name, priority, done });
      res.status(201).json({ success: true, data: newTodo, message: 'Tâche créée avec succès' });
    } catch (error) {
      res.status(400).json({ success: false, error: 'Erreur lors de la création de la tâche', message: error.message });
    }
  },

  replaceTodo: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'ID invalide' });
      const { name, priority, done } = req.body;
      const todo = await db.replaceTodo(id, { name, priority, done });
      if (!todo) return res.status(404).json({ success: false, error: 'Tâche non trouvée' });
      res.json({ success: true, data: todo, message: 'Tâche remplacée avec succès' });
    } catch (error) {
      res.status(400).json({ success: false, error: 'Erreur lors du remplacement de la tâche', message: error.message });
    }
  },

  partialReplaceTodo: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'ID invalide' });
      const todo = await db.updateTodo(id, req.body);
      if (!todo) return res.status(404).json({ success: false, error: 'Tâche non trouvée' });
      res.json({ success: true, data: todo, message: 'Tâche modifiée avec succès' });
    } catch (error) {
      res.status(400).json({ success: false, error: 'Erreur lors de la modification de la tâche', message: error.message });
    }
  },

  deleteTodo: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'ID invalide' });
      await db.deleteTodo(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erreur lors de la suppression de la tâche', message: error.message });
    }
  },

  getStats: async (req, res) => {
    try {
      const stats = await db.getStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erreur lors du calcul des statistiques', message: error.message });
    }
  },

  deleteAll: async (req, res) => {
    try {
      const deletedCount = await db.deleteAllTodos();
      res.json({ success: true, message: `${deletedCount} tâche(s) supprimée(s)`, data: { deletedCount } });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erreur lors de la suppression des tâches', message: error.message });
    }
  },

    getDoc : (req, res) => {
        res.json({
            message: 'API REST Todo - Documentation',
            version: '1.0.0',
            endpoints: {
                'GET /api/todos': 'Récupérer toutes les tâches',
                'GET /api/todos/:id': 'Récupérer une tâche par ID',
                'POST /api/todos': 'Créer une nouvelle tâche',
                'PUT /api/todos/:id': 'Remplacer complètement une tâche',
                'PATCH /api/todos/:id': 'Modifier partiellement une tâche',
                'DELETE /api/todos/:id': 'Supprimer une tâche',
                'GET /api/stats': 'Obtenir les statistiques des tâches',
                'DELETE /api/todos': 'Supprimer toutes les tâches'
            },
            exampleTodo: {
                id: 1,
                name: "Ma tâche",
                priority: 1,
                done: false
            }
        });
    },

    defaultRoute : (req, res) => {
        // nouvelle syntaxe Express v5 : permet console.log(req.params.splat) pour
        // connaître la route demandée (v4 avec * ==> impossible)
        res.status(404).json({
            success: false,
            error: 'Endpoint non trouvé',
            requestedPath: req.originalUrl,
            method: req.method,
            availableEndpoints: [
                'GET /',
                'GET /api/todos',
                'GET /api/todos/:id',
                'POST /api/todos',
                'PUT /api/todos/:id',
                'PATCH /api/todos/:id',
                'DELETE /api/todos/:id',
                'GET /api/stats',
                'DELETE /api/todos'
            ]
        })
    }

};
