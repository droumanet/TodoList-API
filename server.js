import express from 'express';
import cors from 'cors';
import fs from 'fs';
import CtrlTodo from './controller.js'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { checkCreateTodo } from './validatorRules.js';
import helmet from 'helmet';
import { helmetRules, rateLimitRules } from './securityRules.js';
import https from 'https'; 

const app = express();
const PORT = 3000;
const PORT_HTTPS = 3001;

// Configuration SSL
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'private.key')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'certificate.crt'))
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet(helmetRules));
app.use(rateLimitRules);

// ========================================
// SERVIR LES FICHIERS STATIQUES (CLIENT VUE.JS)
// ========================================
app.use(express.static(path.join(__dirname, 'client')));

// ========================================
// ROUTES REST API
// ========================================
app.get('/api/todos', CtrlTodo.readTodos);                              // Lire la liste Todo
app.get('/api/todos/:id', CtrlTodo.readTodoId);                         // Lire détail un Todo
app.post('/api/todos', CtrlTodo.verifyToken, CtrlTodo.createTodo);      // Créer un Todo
app.put('/api/todos/:id', CtrlTodo.verifyToken, CtrlTodo.replaceTodo);  // Modifier (entièrement) un Todo
app.patch('/api/todos/:id', CtrlTodo.verifyToken, CtrlTodo.partialReplaceTodo);         // Modifier un Todo
app.delete('/api/todos/:id', CtrlTodo.verifyToken, CtrlTodo.deleteTodo);// Supprimer un Todo
app.post('/api/login', CtrlTodo.login);                                 // Permettre l'authentification

// Utilitaires
app.get('/api/stats', CtrlTodo.getStats);
app.delete('/api/todos', CtrlTodo.deleteAll);
// Route pour servir l'application Vue.js
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});
app.get('/', CtrlTodo.getDoc);

// GESTION DES ERREURS 404
app.use('/*splat', CtrlTodo.defaultRoute);

const docAPI = () => {
  console.log(`✅ Serveur HTTP démarré sur http://localhost:${PORT}`);
  console.log(`🔒 Serveur HTTPS démarré sur https://localhost:${PORT_HTTPS}`);
  console.log(`📚 Documentation disponible sur :`);
  console.log(`   - HTTP:  http://localhost:${PORT}`);
  console.log(`   - HTTPS: https://localhost:${PORT_HTTPS}`);
  console.log(`🎨 Application Vue.js disponible sur :`);
  console.log(`   - HTTP:  http://localhost:${PORT}/app`);
  console.log(`   - HTTPS: https://localhost:${PORT_HTTPS}/app`);
  console.log(`\n📋 Endpoints API disponibles :`);
  console.log(`   GET    /api/todos          - Lister toutes les tâches`);
  console.log(`   GET    /api/todos/:id      - Récupérer une tâche`);
  console.log(`   POST   /api/todos          - Créer une nouvelle tâche`);
  console.log(`   PUT    /api/todos/:id      - Remplacer une tâche`);
  console.log(`   PATCH  /api/todos/:id      - Modifier une tâche`);
  console.log(`   DELETE /api/todos/:id      - Supprimer une tâche`);
  console.log(`   GET    /api/stats          - Statistiques`);
  console.log(`   DELETE /api/todos          - Supprimer toutes les tâches`);
}

// ========================================
// DÉMARRAGE DES SERVEURS HTTP ET HTTPS
// ========================================

// Serveur HTTP (port 3000)
const httpServer = app.listen(PORT, () => {
  console.log(`🌐 Serveur HTTP démarré sur le port ${PORT}`);
});

// Serveur HTTPS (port 3001)
const httpsServer = https.createServer(sslOptions, app).listen(PORT_HTTPS, () => {
  console.log(`🔒 Serveur HTTPS démarré sur le port ${PORT_HTTPS}`);
  docAPI();
});

export default app;
