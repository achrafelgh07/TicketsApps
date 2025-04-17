// src/services/mockApi.js
export const mockApi = {
  getMatches: () => {
    return Promise.resolve([
      {
        id: 1,
        date: "2023-12-15T20:00:00",
        teams: "PSG vs Marseille",
        location: "Parc des Princes",
      },
      {
        id: 2,
        date: "2023-12-20T18:30:00",
        teams: "Lyon vs Monaco",
        location: "Groupama Stadium",
      },
    ]);
  },

  login: async (email, password) => {
    // Simule un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email === "test@example.com" && password === "123456") {
      return { 
        user: { 
          id: 1, 
          email,
          name: "Utilisateur Test" 
        } 
      };
    }
    throw new Error("Email ou mot de passe incorrect"); // Modifié ici
  },
};