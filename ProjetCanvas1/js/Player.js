import ObjectGraphique from "./ObjectGraphique.js";
import { drawCircleImmediat } from "./utils.js";

export default class Player extends ObjectGraphique {
    constructor(x, y) {
        super(x, y, 100, 100);
        this.vitesseX = 0;
        this.vitesseY = 0;
        this.couleur = "pink";
        this.angle = 0;
        this.radius = 50;
    }

    draw(ctx) {
        // Triangle affecté par la rotation
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.translate(-this.w / 2, -this.h / 2);

        // Triangle pour le corps
        ctx.beginPath();
        ctx.moveTo(74, 6);
        ctx.lineTo(60, 99);
        ctx.lineTo(180, 50);
        ctx.closePath();
        ctx.fillStyle = "darkgreen";
        ctx.fill();

        ctx.beginPath();
        ctx.lineTo(175, 50);
        ctx.lineTo(0, 50);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.restore(); // Fin de la rotation

        // Dessin de la tête, langue et yeux pas affectés par la rotation
        ctx.save();
        ctx.translate(this.x, this.y);

        // Tête
        ctx.fillStyle = "darkgreen";
        ctx.beginPath();
        ctx.ellipse(0, 0, 50, 50, 0, 0, 2 * Math.PI);
        ctx.fill();

        // Langue de serpent
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 20);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "red";
        ctx.stroke();

        // Fourche de la langue
        ctx.beginPath();
        ctx.moveTo(0, 20);
        ctx.lineTo(-5, 25);
        ctx.moveTo(0, 20);
        ctx.lineTo(5, 25);
        ctx.lineWidth = 2;
        ctx.stroke();

        // Bouche
        ctx.beginPath();
        ctx.moveTo(-40, 5);
        ctx.lineTo(-35, 0);
        ctx.lineTo(35, 0);
        ctx.lineTo(40, 7);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.stroke();

        // Yeux
        drawCircleImmediat(ctx, -30, -20, 10, "black"); // Œil gauche
        drawCircleImmediat(ctx, 30, -20, 10, "black");  // Œil droit

        // Pupilles
        ctx.beginPath();
        ctx.ellipse(30, -20, 6, 10, 0, 0, 2 * Math.PI); // Pupille droite
        ctx.ellipse(-30, -20, 6, 10, 0, 0, 2 * Math.PI); // Pupille gauche
        ctx.fillStyle = "white";
        ctx.fill();

        ctx.restore();

        // Dessine la croix de debug
        super.draw(ctx);
    }
    checkCollisionWith(obj) {
        if (obj instanceof Obstacle) {
            return circRectsOverlap(obj.x, obj.y, obj.w, obj.h, this.x, this.y, this.radius);
        }
    }
    move() {
        // Mise à jour de la position
        this.x += this.vitesseX;
        this.y += this.vitesseY;

        // Mise à jour de l'angle en fonction de la direction
        if (this.vitesseX !== 0 || this.vitesseY !== 0) {
            this.angle = Math.atan2(-this.vitesseY, -this.vitesseX);
        }
    }

}
