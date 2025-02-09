import Obstacle from "./Obstacle.js";

export default class ObstacleMobile extends Obstacle {
    constructor(x, y, w, h, color, speed) {
        super(x, y, w, h, color);  // Appel au constructeur de la classe parente (Obstacle)
        this.speed = speed || 2;  // La vitesse par défaut est 2, mais elle peut être définie lors de l'instanciation
        this.direction = 1;  // 1 pour descendre, -1 pour monter
    }

    // Méthode de mise à jour de la position
    update() {
        this.y += this.speed * this.direction;
    
        // On inverse la direction si l'obstacle atteint les bords de l'écran (ou de l'aire définie)
        if (this.y + this.h / 2 >= window.innerHeight - 20 || this.y - this.h / 2 <= -20) {
            this.direction *= -1;  // Inverse la direction
        }
    }
    

    // Méthode de dessin spécifique (si tu veux des fonctionnalités supplémentaires, tu peux l'adapter)
    draw(ctx) {
        super.draw(ctx);
    }
}
