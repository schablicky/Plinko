function Peg(x, y, r) {
	var options = { // nastavení
		restitution: 1, // skákavost
		friction: 0, // tření
		isStatic: true // statické těleso
	}
	this.body = Bodies.circle(x, y, r, options);
	this.r = r; // poloměr
	World.add(world, this.body); // přidání do světa
}

Peg.prototype.show = function() {
	fill(255,255,255); // barva, kterou se vykreslí, v tomto případě bílá
	stroke(255,255,255); // barva, kterou se vykreslí, v tomto případě bílá
	var pos = this.body.position // pozice
	push(); // uložení aktuálního stavu
	translate(pos.x, pos.y); // přesunutí do pozice
	ellipse(0, 0, this.r * 2); // vykreslení kruhu
	pop(); // obnovení stavu
}