function Particle(x, y, r) {
	var options = { // nastavení
		restitution: 0.5, // skákavost
		friction: 0.5 // tření
	}
	this.body = Bodies.circle(x, y, r, options); // těleso
	this.r = r; // poloměr
	World.add(world, this.body); // přidání do světa
}

Particle.prototype.isOffScreen = function() {
	var x = this.body.position.x; // x-ová souřadnice
	return (x< -50 || x > width + 50);  // je mimo obrazovku?
}

Particle.prototype.show = function(face) {
	fill(153, 5, 5, 255); // červená
	stroke(153, 5, 5); // červená
	var pos = this.body.position; // pozice
	var angle = this.body.angle; // úhel
	push(); // uložení aktuálního stavu
	translate(pos.x, pos.y); // přesunutí do pozice
	rotate(angle); // rotace
	ellipse(0, 0, this.r * 2); // vykreslení kruhu
	textSize(24); // velikost písma
	textAlign(CENTER,CENTER); // zarovnání textu
	fill(0); // černá
	pop(); // obnovení stavu
}