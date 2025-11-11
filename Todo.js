export default class Todo {
  // Déclaration des champs privés
  #id;
  #name;
  #priority;
  #done;
  
  constructor(id, name, priority = 1, done = false) {
    // Validation essentielle
    if (id === undefined || id === null) {
      throw new Error('L\'ID est requis');
    }
    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new Error('Le nom doit être une chaîne non vide');
    }
    
    // Utilisation des setters pour initialisation
    this.#id = id;              // Utilise l'accès à une variable privée (symbole #)
    this.name = name;           // Utilise le setter public (set name(value))
    this.priority = priority;   // Utilise le setter public (set priority(value))
    this.done = done;           // Utilise le setter public (set done(value))
    console.log("Objet créé", this.#id, this.name)
  }
  
  // Getter/Setter pour id (lecture seule après construction)
  get id() {
    return this.#id;
  }
  
  // Getter/Setter pour name
  get name() {
    return this.#name;
  }
  
  set name(value) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error('Le nom doit être une chaîne non vide');
    }
    this.#name = value.trim();
  }
  
  // Getter/Setter pour priority
  get priority() {
    return this.#priority;
  }
  
  set priority(value) {
    if (!Number.isInteger(value) || value < 1 || value > 3) {
      throw new Error('La priorité doit être un entier entre 1 et 3');
    }
    this.#priority = value;
  }
  
  // Getter/Setter pour done
  get done() {
    return this.#done;
  }
  
  set done(value) {
    if (typeof value !== 'boolean') {
      throw new Error('L\'état done doit être un booléen');
    }
    this.#done = value;
  }
  
  // Sérialisation pour les réponses JSON de l'API
  toJSON() {
    return {
      id: this.#id,
      name: this.#name,
      priority: this.#priority,
      done: this.#done
    };
  }
  
  // Mise à jour pour les opérations PATCH
  update(data) {
    if (data.name !== undefined) {
      this.name = data.name;            // Utilise le setter (gère les vérifications)
    }
    if (data.priority !== undefined) {
      this.priority = data.priority;    // Utilise le setter (gère les vérifications)
    }
    if (data.done !== undefined) {
      this.done = data.done;            // Utilise le setter (gère les vérifications)
    }
    return this;
  }
}
