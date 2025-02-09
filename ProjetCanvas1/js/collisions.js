// Collisions between two circles
function circleCollide(x1, y1, r1, x2, y2, r2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return ((dx * dx + dy * dy) < (r1 + r2) * (r1 + r2));
}

// Collisions between two rectangles aligned with the axes
function rectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {

    if ((x1 > (x2 + w2)) || ((x1 + w1) < x2))
        return false; // No horizontal axis projection overlap
    if ((y1 > (y2 + h2)) || ((y1 + h1) < y2))
        return false; // No vertical axis projection overlap
    return true;    // If previous tests failed, then both axis projections
    // overlap and the rectangles intersect
}

// Collisions between rectangle and circle
function circRectsOverlap(rectX, rectY, rectW, rectH, circleX, circleY, circleRadius) {
    let testX = circleX;
    let testY = circleY;

    if (testX < rectX) testX = rectX; // Bord gauche du rectangle
    if (testX > rectX + rectW) testX = rectX + rectW; // Bord droit du rectangle
    if (testY < rectY) testY = rectY; // Bord supérieur du rectangle
    if (testY > rectY + rectH) testY = rectY + rectH; // Bord inférieur du rectangle

    // Distance entre le centre du cercle et le point le plus proche sur le rectangle
    const distX = circleX - testX;
    const distY = circleY - testY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    // Collision si la distance est inférieure au rayon
    return distance <= circleRadius;
}
export { circleCollide, rectsOverlap, circRectsOverlap };