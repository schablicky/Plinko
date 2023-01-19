function Boundary(x, y, w, h) { // konstruktor
	var options = { // nastavení
		isStatic: true, // statické těleso
		friction: 1 // tření
	}
	this.body = Bodies.rectangle(x, y, w, h, options); // vytvoření tělesa
	this.w = w; // délka strany
	this.h = h; // výška strany
	World.add(world, this.body); // přidání do světa
}

Boundary.prototype.show = function() {
	fill(238); // barva, kterou se vykreslí, v tomto případě bílá
	stroke(238); // barva, kterou se vykreslí, v tomto případě bílá
	var pos = this.body.position // pozice
	push(); // uložení aktuálního stavu
	translate(pos.x, pos.y); // přesunutí do pozice
	rectMode(CENTER); // zarovnání obdélníku
	rect(0, 0, this.w, this.h); // vykreslení obdélníku
	pop(); // obnovení stavu
}