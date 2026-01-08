// controller.js
import * as db from './models/database.js';
import { body, validationResult } from 'express-validator';
import validator from 'validator';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

// usage de SECRET : process.env.SECRET

export default {
  readTodos: async (req, res) => {
    try {
      const todos = await db.getAllTodos();
      const todosEscaped = todos.map(todo => ({
        ...todo,
        name: todo.name ? validator.escape(todo.name) : null
      }));
      res.json({ success: true, data: todosEscaped, count: todosEscaped.length });
    } catch (error) {
      console.log("Erreur Lecture todos", error.message)
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
  },
  
  login: async (req, res) => {
    try {
      // 1. Récupération et validation des données
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Veuillez fournir un nom d\'utilisateur et un mot de passe.' 
        });
      }
      
      // Note : Dans un cas réel, l'appel serait plutôt de la forme `await db.getUser(...)`
      if (username === 'admin' && password === 'azerty123') {
        
        // Création du token
        const token = jwt.sign(
          { id: 0, username: username },
          process.env.SECRET,
          { expiresIn: '1 hour' }
        );
        
        // 4. Réponse succès (format harmonisé avec votre API)
        return res.json({ 
          success: true, 
          data: { token } // On encapsule le token dans "data" pour rester cohérent
        });
        
      } else {
        return res.status(401).json({ 
          success: false, 
          error: 'Identifiants incorrects.' 
        });
      }
      
    } catch (error) {     // Gestion des erreurs imprévues
      res.status(500).json({ 
        success: false, 
        error: 'Erreur lors de l\'authentification', 
        message: error.message 
      });
    }
  },
  
  verifyToken : (req, res, next) => {
    // Récupérer le token dans le header (forme 'Authorization: Bearer <token>')
    const authHeader = req.headers['authorization'];
    let token;
    if (authHeader) {
      token = authHeader.split(' ')[1];
    } else {
      token = undefined;
    }
    
    if (!token) {
      return res.status(401).json({ message: "Accès refusé. Token manquant." });
    }
    
    // Vérification de la validité du token
    jwt.verify(token, process.env.SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token invalide ou expiré." });
      }
      req.user = user; // On attache l'utilisateur à la requête pour la suite
      next(); // On passe au contrôleur suivant (ex: afficher les todos)
    });
  }
  
};
