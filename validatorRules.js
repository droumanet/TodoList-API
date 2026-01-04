import { body, validationResult } from 'express-validator';

export const checkCreateTodo = [
  // Validation du champ 'name' (string, obligatoire)
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom de la tâche est requis')
    .isString().withMessage('Le nom doit être une chaîne de caractères')
    .escape(),

  // Validation du champ 'priority' (number entre 1 et 3, optionnel)
  body('priority')
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 3 }).withMessage('La priorité doit être un nombre entre 1 et 3'),

  // Validation du champ 'done' (boolean, optionnel)
  body('done')
    .optional({ checkFalsy: true })
    .isBoolean().withMessage('Le champ "done" doit être un booléen'),

  // Gestion des erreurs de validation
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Erreur dans le traitement de validation", errors.array());
      return res.status(400).json({ error: errors.array() });
    }
    next();
  }
];

