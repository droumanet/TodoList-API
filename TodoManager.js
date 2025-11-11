/**
 * Gestionnaire de collection de tâches
 * Classe utilitaire pour gérer une collection de todos avec un ID auto-incrémenté
 */
export class TodoManager {
  constructor(initialTodos = []) {
    this.todos = initialTodos.map(todo => 
      todo instanceof Todo ? todo : Todo.fromJSON(todo)
    );
    this.nextId = this.todos.length > 0 ? Math.max(...this.todos.map(t => t.id)) + 1 : 1;
  }

  /**
   * Ajoute une nouvelle tâche
   * @param {Object} todoData - Données de la tâche (sans ID)
   * @returns {Todo} La tâche créée
   */
  create({ name, priority = 1, done = false }) {
    const todo = Todo.create({ id: this.nextId++, name, priority, done });
    this.todos.push(todo);
    return todo;
  }

  /**
   * Récupère toutes les tâches
   * @returns {Todo[]} Toutes les tâches
   */
  getAll() {
    return [...this.todos];
  }

  /**
   * Récupère une tâche par ID
   * @param {number} id - ID de la tâche
   * @returns {Todo|undefined} La tâche trouvée ou undefined
   */
  getById(id) {
    return Todo.findById(this.todos, id);
  }

  /**
   * Met à jour une tâche
   * @param {number} id - ID de la tâche à mettre à jour
   * @param {Object} updates - Propriétés à mettre à jour
   * @returns {Todo} La tâche mise à jour
   * @throws {Error} Si la tâche n'est pas trouvée
   */
  update(id, updates) {
    const todo = this.getById(id);
    if (!todo) {
      throw new Error(`Tâche avec l'ID ${id} non trouvée`);
    }
    return todo.update(updates);
  }

  /**
   * Supprime une tâche
   * @param {number} id - ID de la tâche à supprimer
   * @returns {boolean} True si la tâche a été supprimée
   */
  delete(id) {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) {
      return false;
    }
    this.todos.splice(index, 1);
    return true;
  }

  /**
   * Obtient les statistiques des tâches
   * @returns {Object} Statistiques des tâches
   */
  getStats() {
    return Todo.getStats(this.todos);
  }

  /**
   * Exporte les tâches vers JSON
   * @returns {Object[]} Tableau d'objets JSON représentant les tâches
   */
  toJSON() {
    return this.todos.map(todo => todo.toJSON());
  }
}
