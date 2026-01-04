import rateLimit from 'express-rate-limit'; 

export const helmetRules = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'",
        "https://code.jquery.com",   // autorise jQuery CDN
        "https://cdn.jsdelivr.net",  // autorise jQuery semanticUI
        "'unsafe-inline'"],          // balise <script> dans index.html
      styleSrc: ["'self'", 
        "https://cdn.jsdelivr.net",  // autorise SemanticUI
        "'unsafe-inline'"],          // balise <style> dans index.html
      scriptSrcAttr: ["'unsafe-inline'"], // usage onClick() dans index.html
      connectSrc: ["'self'", "http://localhost:3000"]   // API locale
    }
  },
  referrerPolicy: { policy: "no-referrer" },
  frameguard: { action: "deny" },                       // protège du clickjacking (iframe)
  xssFilter: true,
  hidePoweredBy: true
};

export const rateLimitRules = rateLimit({
  windowMs: 1 * 60 * 1000,      // fenêtre de 1 minute
  limit: 20,                    // Limite chaque IP à 20 requêtes par fenêtre
  standardHeaders: 'draft-8',   // Headers standardisés
  legacyHeaders: false,         // Désactive les anciens headers
  message: { error: 'Trop de requêtes, réessayez plus tard.' }
});