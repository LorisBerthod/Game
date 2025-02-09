import Player from "./Player.js";
import Obstacle from "./Obstacle.js";
import ObjetSouris from "./ObjetSouris.js"; // Import nécessaire
import { rectsOverlap } from "./collisions.js";
import { circRectsOverlap } from "./collisions.js";
import { initListeners } from "./ecouteurs.js";
import ObstacleMobile from "./ObstacleMobile.js";

export default class Game {
    objetsGraphiques = [];
    niveaux = [];
    niveauActuel = 0;
    animationFrameId = null;

    constructor(canvas) {
        this.canvas = canvas;
        this.inputStates = {
            mouseX: 0,
            mouseY: 0,
        };
    }

    async init(canvas) {
        this.ctx = this.canvas.getContext("2d");

        // Créer le joueur
        this.player = new Player(100, 100);
        this.objetsGraphiques.push(this.player);

        // Créer ObjetSouris et l'ajouter
        this.objetSouris = new ObjetSouris(200, 200, 25, 25, "orange");
        this.objetsGraphiques.push(this.objetSouris);

        this.niveaux = [
            this.createLevel1(),
            this.createLevel2(),
            this.createLevel3()
        ];

        // Charger le premier niveau
        this.loadLevel(this.niveauActuel);

        initListeners(this.inputStates, this.canvas);

        console.log("Game initialisé");
    }

    createLevel1() {
        return [
            new Obstacle(300, 0, 40, 400, "red"),
            new Obstacle(500, 240, 40, 500, "red"),
            new Obstacle(700, 0, 40, 400, "red"),
            new Obstacle(700, 400, 400, 40, "red"),

            new Obstacle(1100, 500, 100, 100, "blue")

        ];
    }

    createLevel2() {
        return [
            new Obstacle(300, 0, 40, 400, "red"),
            new Obstacle(500, 240, 40, 500, "red"),
            new Obstacle(700, 0, 40, 400, "red"),
            new Obstacle(700, 400, 400, 40, "red"),
            new ObstacleMobile(350, 300, 140 , 40, "green", 2),

            new Obstacle(1100, 500, 100, 100, "blue")
        ];
    }

    createLevel3() {
        return [
            new Obstacle(300, 0, 40, 400, "red"),
            new Obstacle(500, 240, 40, 500, "red"),
            new Obstacle(700, 0, 40, 400, "red"),
            new Obstacle(700, 400, 400, 40, "red"),
            new ObstacleMobile(350, 300, 140 , 40, "green", 2),
            new ObstacleMobile(1120, 300, 140 , 40, "green", 2),
            new ObstacleMobile(1120, 500, 140 , 40, "green", 2),
            new ObstacleMobile(1120, 100, 140 , 40, "green", 2),

            new Obstacle(900, 200, 100, 100, "blue")
        ];
    }
    createLevel4() {
        return [

        ];
    }

    loadLevel(niveau) {
        // Charger les objets graphiques du niveau
        this.objetsGraphiques = [this.player, this.objetSouris, ...this.niveaux[niveau]];
        console.log(`Niveau ${niveau + 1} chargé`);
    }
    

    start() {
        if (this.animationFrameId === null) { // Démarrer uniquement si aucune animation active
            console.log("Game démarré");
            this.animationFrameId = requestAnimationFrame(this.mainAnimationLoop.bind(this));
        }
    }
    
    mainAnimationLoop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawAllObjects();
        this.update();
    
        // Continuer la boucle uniquement si une animation est active
        this.animationFrameId = requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    drawAllObjects() {
        this.objetsGraphiques.forEach(obj => {
            obj.draw(this.ctx);
            if (obj.drawHitbox) {
                obj.drawHitbox(this.ctx);
            }
        });
    }

    update() {
        this.movePlayer();

        // Met à jour la position de l'objet souris avec la position de la souris
        this.objetSouris.x = this.inputStates.mouseX;
        this.objetSouris.y = this.inputStates.mouseY;

        // Met à jour les objets mobiles
        this.objetsGraphiques.forEach(obj => {
            if (obj instanceof ObstacleMobile) {
                obj.update();
            }
        });

        // Teste les collisions
        this.testCollisionsPlayer();
    }

    movePlayer() {
        this.player.vitesseX = 0;
        this.player.vitesseY = 0;

        if (this.inputStates.ArrowRight) {
            this.player.vitesseX = 3;
        }
        if (this.inputStates.ArrowLeft) {
            this.player.vitesseX = -3;
        }
        if (this.inputStates.ArrowUp) {
            this.player.vitesseY = -3;
        }
        if (this.inputStates.ArrowDown) {
            this.player.vitesseY = 3;
        }

        this.player.move();
        this.testCollisionsPlayer();
    }

    testCollisionsPlayer() {
        this.testCollisionPlayerBordsEcran();
        this.testCollisionPlayerObstacles();
    }

    testCollisionPlayerBordsEcran() {
        if (this.player.x - this.player.w / 2 < 0) {
            this.player.vitesseX = 0;
            this.player.x = this.player.w / 2;
        }
        if (this.player.x + this.player.w / 2 > this.canvas.width) {
            this.player.vitesseX = 0;
            this.player.x = this.canvas.width - this.player.w / 2;
        }
        if (this.player.y - this.player.h / 2 < 0) {
            this.player.y = this.player.h / 2;
            this.player.vitesseY = 0;
        }
        if (this.player.y + this.player.h / 2 > this.canvas.height) {
            this.player.vitesseY = 0;
            this.player.y = this.canvas.height - this.player.h / 2;
        }
    }
    testCollisionPlayerObstacles() {
        this.objetsGraphiques.forEach(obj => {
            if (obj instanceof Obstacle) {
                if (obj.couleur === "blue") { //Passage au niveau suivant
                    // Collision entre le cercle du joueur et le rectangle de l'obstacle
                    if (circRectsOverlap(
                            obj.x, obj.y, obj.w, obj.h, // Rectangle de l'obstacle
                            this.player.x, this.player.y, this.player.radius)) { // Cercle du joueur
                        
                        console.log("Collision avec l'obstacle bleu, passage au niveau suivant");
                        
                        this.niveauActuel++;
                        if (this.niveauActuel < this.niveaux.length) {
                            this.loadLevel(this.niveauActuel);
                            // Réinitialise la position du joueur
                            this.player.x = 10;
                            this.player.y = 10;
                        } else {
                            console.log("Félicitations, vous avez terminé tous les niveaux !");
                            // Réinitialise ou affiche un message de fin de jeu
                            this.niveauActuel = 0; // Retour au premier niveau
                            this.loadLevel(this.niveauActuel);
                            this.player.x = 10;
                            this.player.y = 10;
                        }
                    }
                } else { // Collision avec des obstacles rouges ou autres
                    // Collision entre le cercle du joueur et le rectangle de l'obstacle
                    if (circRectsOverlap(
                            obj.x, obj.y, obj.w, obj.h, // Rectangle de l'obstacle
                            this.player.x, this.player.y, this.player.radius)) { // Cercle du joueur
                        
                        console.log("Collision avec obstacle");
                        // Réinitialise la position du joueur en cas de collision avec un obstacle rouge
                        this.player.x = 10;
                        this.player.y = 10;
                        this.player.vitesseX = 0;
                        this.player.vitesseY = 0;
                    }
                }
            }
        });
    }
    
    
}
