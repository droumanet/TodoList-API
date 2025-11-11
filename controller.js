// Importer la classe Todo pour l'utiliser dans le contrôleur
import Todo from './Todo.js';

// PATTERN SINGLETON : Une seule collection de todos partagée
let todos = [
  new Todo(1, "Exemple de tâche", 1, false),
  new Todo(2, "Autre tâche", 2, true)
];
let nextId = 3;

export default {
    readTodos : (req, res) => {
        console.log("Get /api/todos : readTodos")
        try {
        // Utilise toJSON() automatiquement via JSON.stringify()
        res.json({
            success: true,
            data: todos,
            count: todos.length
        });
        } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des tâches',
            message: error.message
        });
        }
    },

    readTodoId : (req, res) => {
        console.log("Get /api/todos/{id} : readTodoId")
        try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'ID invalide',
                message: 'L\'ID doit être un nombre entier'
            });
        }
        
        // Utilise le getter id de la classe Todo
        const todo = todos.find(t => t.id === id);
        
        if (!todo) {
            return res.status(404).json({
                success: false,
                error: 'Tâche non trouvée'
            });
        }
        
        res.json({
            success: true,
            data: todo
        });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération de la tâche',
                message: error.message
            });
        }
    },

    createTodo : (req, res) => {
        console.log("Post /api/todos : createTodo")
        try {
            const { name, priority, done } = req.body;
            // Validation déléguée au constructeur de Todo
            const newTodo = new Todo(nextId++, name, priority, done);
            todos.push(newTodo);
            
            res.status(201).json({
            success: true,
            data: newTodo,
            message: 'Tâche créée avec succès'
            });
        } catch (error) {
            res.status(400).json({
            success: false,
            error: 'Erreur lors de la création de la tâche',
            message: error.message
            });
        }
    },

    replaceTodo : (req, res) => {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'ID invalide',
                message: 'L\'ID doit être un nombre entier'
            });
            }
            
            const index = todos.findIndex(t => t.id === id);
            
            if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Tâche non trouvée'
            });
            }
            
            const { name, priority, done } = req.body;
            
            // Crée une nouvelle instance Todo (remplacement complet)
            todos[index] = new Todo(id, name, priority, done);
            
            res.json({
            success: true,
            data: todos[index],
            message: 'Tâche remplacée avec succès'
            });
        } catch (error) {
            res.status(400).json({
            success: false,
            error: 'Erreur lors du remplacement de la tâche',
            message: error.message
            });
        }
    },

    partialReplaceTodo : (req, res) => {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'ID invalide',
                message: 'L\'ID doit être un nombre entier'
            });
            }
            
            const todo = todos.find(t => t.id === id);
            
            if (!todo) {
            return res.status(404).json({
                success: false,
                error: 'Tâche non trouvée'
            });
            }
            
            // Utilise la méthode update() de la classe Todo
            todo.update(req.body);
            
            res.json({
            success: true,
            data: todo,
            message: 'Tâche modifiée avec succès'
            });
        } catch (error) {
            res.status(400).json({
            success: false,
            error: 'Erreur lors de la modification de la tâche',
            message: error.message
            });
        }
    },

    deleteTodo : (req, res) => {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'ID invalide',
                message: 'L\'ID doit être un nombre entier'
            });
            }
            
            const index = todos.findIndex(t => t.id === id);
            
            if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Tâche non trouvée'
            });
            }
            
            todos.splice(index, 1);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({
            success: false,
            error: 'Erreur lors de la suppression de la tâche',
            message: error.message
            });
        }
    },

    // Utilitaires
    getStats : (req, res) => {
        try {
            const total = todos.length;
            const completed = todos.filter(t => t.done).length;
            const pending = total - completed;
            const byPriority = {
                high: todos.filter(t => t.priority === 1).length,
                medium: todos.filter(t => t.priority === 2).length,
                low: todos.filter(t => t.priority === 3).length
            };
            
            res.json({
                success: true,
                data: {
                    total,
                    completed,
                    pending,
                    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
                    byPriority
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Erreur lors du calcul des statistiques',
                message: error.message
            });
        }
    },

    deleteAll : (req, res) => {
        try {
            const deletedCount = todos.length;
            todos = [];
            nextId = 1;
            
            res.json({
            success: true,
            message: `${deletedCount} tâche(s) supprimée(s)`,
            data: { deletedCount }
            });
        } catch (error) {
            res.status(500).json({
            success: false,
            error: 'Erreur lors de la suppression des tâches',
            message: error.message
            });
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
}
