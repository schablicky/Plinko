var Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies;
var engine;
var world;
var particles = [];
var particle;
var pegs = [];
var bounds = [];
var cols = 13;
var rows = 10;
var font;
var inslot;
var slot = 0;
var blink = 0;
var scoreit = 0;
var maxturns = 69;
var turn = maxturns;
var score = 0;
var last = 0;
var best = 0;
var face = ":)";

// funkce pro prvotní nastavení, vytvoření herní plochy, zdi, kuliček, tlačítka
function setup() {
  var canvas = createCanvas(600, 800); // velikost herní plochy
  canvas.parent('sketch-holder'); // umístění na stránku

  button = createButton('Play Again'); // tlačítko
  button.parent('sketch-holder'); // umístění na stránku
  button.position(515, 120); // pozice
  button.mousePressed(reset); // funkce, která se zavolá po kliknutí
  button.hide(); // tlačítko se skryje

  engine = Engine.create();
  world = engine.world; // svět, ve kterém se hraje
  world.gravity.y = 2; // gravitace

  var spacing = width / cols; // vzdálenost mezi kuličkami

  for (var j = -1; j < rows; j++) { // cyklus pro vytvoření řádků
    for (var i = 2; i < cols - 2; i++) { // cyklus pro vytvoření sloupců
      var x = i * spacing; // vzdálenost mezi kuličkami
      if (j % 2 == 0) { // každý druhý řádek se posune o polovinu vzdálenosti
        x += spacing / 2;
        if(i == 2) x -= 3;
        if(i == cols - 3) x += 3;
      }
      var y = 2 * spacing + j * spacing // vzdálenost mezi kuličkami
      var p = new Peg(x, y, 4); // vytvoření kuličky
      pegs.push(p); // přidání kuličky do pole
    }
  }
  // zdi
  var b = new Boundary(width/2, height - 115, width-4*spacing+10, 10);
  bounds.push(b);
  for (var i = 2; i < cols-1; i++) {
    var x;
    var h;
    var w;

    if(i==2 || i == cols-2) {
    	h = height;
    	w = 10;
    	if(i == 2) x = i * spacing;
    	if(i == cols - 2) x = (i * spacing);
    }
    else {
    	x = i * spacing;
    	h = 32;
    	w = 10;
    }
    
    var y = height - 120 - h / 2;

    var b = new Boundary(x, y, w, h);
    bounds.push(b);
  }

}
  // zvuky
  var zeroAudio = new Audio('audio/Crowd-Insult-B1.mp3'); // zvuky, které se přehrají, když se získá určitý počet bodů, vy tomto případě 0
  var hundredAudio = new Audio('audio/onehundred.mp3'); // zvuky, které se přehrají, když se získá určitý počet bodů, vy tomto případě 100
  var fivehundredAudio = new Audio('audio/suppahotfire.mp3'); // zvuky, které se přehrají, když se získá určitý počet bodů, vy tomto případě 500
  var thousandAudio = new Audio('audio/goofy-ahhh.mp3'); // zvuky, které se přehrají, když se získá určitý počet bodů, vy tomto případě 1000
  var tenAudio = new Audio('audio/over9k.mp3'); // zvuky, které se přehrají, když se získá určitý počet bodů, vy tomto případě 10 000
  var ballDrop = new Audio('audio/ballDrop.mp3'); // zvuky, které se přehrají když se vytvoří nová koule

// funkce pro vykreslení
function newParticle(x, y) {
  particle = new Particle(x, y, 16); // vytvoříme novou částici
}

// funkce pro stisknutí myši, která zajišťuje vytvoření nové částice, ale jen pokud máme dostatem koulí
function mousePressed() {
  if(inslot && turn > 0 || turn == maxturns) {
	if(mouseX > 113 && mouseY > 0 && mouseX < width-113 && mouseY < 50) { // pokud klikneme na tlačítko, tak resetujeme hru, jinak vytvoříme novou částici
    ballDrop.play(); // přehrajeme zvuk
		blink = 0; // vynulujeme blink
		slot = 0; // vynulujeme slot
		inslot = false; // nastavíme inslot na false
		scoreit = 0; // vynulujeme scoreit
		if(particle) World.remove(world, particle.body); // odstraníme částici
    	newParticle(mouseX + random(-3, 3), 20); // vytvoříme novou částici
    	turn -= 1; // odečteme jeden tah
	}
  }
}

// funkce pro reset hry
function reset() {
	World.remove(world, particle.body); // odstraníme částici
	particle = 0;
	inslot = false;
	scoreit = 0;
	button.hide();
	blink = 0;
	slot = 0;
	score = 0;
	turn = maxturns;
}

// funkce pro vykreslení, volá se pořád dokola
function draw() { // vykreslíme pozadí
  background(238); // nastavíme barvu pozadí
  fill(0); // nastavíme barvu
  noStroke(); // bez obrysu
  rect(98,0,405,height-110); // zobrazíme pozadí
  if(inslot && turn > 0 || turn == maxturns) { // pokud máme dostatek koulí, zobrazíme herní plochu
  	fill(255,255,255,100); // zobrazíme pozadí
  	rect(98,0,405,40); // zobrazíme pozadí
  	textSize(24); // nastavíme velikost písma
  	textAlign(CENTER, CENTER); // nastavíme zarovnání písma
  	text("-> PRESS HERE <-", 300, 20); // zobrazíme text
  }

  if(inslot && turn == 0) { // když už nemáme žádné koule, zobrazíme skóre, a pokud je lepší než předchozí, tak ho uložíme
  	last = score; // uložíme si poslední skóre
  	button.show(); // zobrazíme tlačítko pro reset hry
  }

  Engine.update(engine); // aktualizujeme herní plochu

  if(particle) particle.show(face); // pokud máme částici, vykreslíme ji

  for (var i = 0; i < pegs.length; i++) { // vykreslíme všechny kuličky, které jsou na herní ploše
    pegs[i].show(); // vykreslíme kuličku
  }
  for (var i = 0; i < bounds.length; i++) { // vykreslíme všechny zdi, které jsou na herní ploše, aby se částice nedostala mimo, a aby se kuličky nedostaly mimo
    bounds[i].show(); // vykreslíme zdi
  }

  if(particle && particle.body.position.y > height-136) inslot = true;

  if(particle && inslot) { // když je částice u zdi, zjistíme, do kterého slotu se dostala, a podle toho přičteme body
  	slot = floor(particle.body.position.x/45-1.5);
  	blink ++;
  	if(slot==1 && scoreit == 0) { // když je částice v prvním slotu, přičteme 100 bodů
  		score += 100;
  		scoreit = 1;
  	}
  	if(slot==2 && scoreit == 0) { // když je částice v druhém slotu, přičteme 500 bodů
  		score += 500;
  		scoreit = 1;
  	}
  	if(slot==3 && scoreit == 0) { // když je částice v třetím slotu, přičteme 1000 bodů
  		score += 1000;
  		scoreit = 1;
  	}
  	if(slot==4 && scoreit == 0) { // když je částice v čtvrtém slotu, přičteme 0 bodů
  		score += 0;
  		scoreit = 1;
  		face = ":(";
  	}
  	if(slot==5 && scoreit == 0) { // když je částice v pátém slotu, přičteme 10000 bodů
  		score += 10000;
  		scoreit = 1;
  		face = ":D";
  	}
  	if(slot==6 && scoreit == 0) { // když je částice v šestém slotu, přičteme 0 bodů
  		score += 0;
  		scoreit = 1;
  		face = ":(";
  	}
  	if(slot==7 && scoreit == 0) { // když je částice v sedmém slotu, přičteme 1000 bodů
  		score += 1000;
  		scoreit = 1;
  	}
  	if(slot==8 && scoreit == 0) { // když je částice v osmém slotu, přičteme 500 bodů
  		score += 500;
  		scoreit = 1;
  	}
  	if(slot==9 && scoreit == 0) { // když je částice v devátém slotu, přičteme 100 bodů
  		score += 100;
  		scoreit = 1;
  	}
  	if(score > best) best = score; // pokud je score větší než best, tak best = score
  }


  stroke(225,205,100);
  strokeWeight(5);

  fill(212, 193, 30,255); // barva
  rect(96,height-107,41,100); // x, y, šířka, výška

  fill(7, 11, 138,255);
  rect(142,height-107,41,100);

  fill(74, 0, 0,255);
  rect(188,height-107,41,100);

  fill(212, 193, 30,255);
  rect(234,height-107,41,100);

  fill(7, 11, 138,255);
  rect(280,height-107,41,100);

  fill(212, 193, 30,255);
  rect(326,height-107,41,100);

  fill(74, 0, 0,255);
  rect(372,height-107,41,100);

  fill(7, 11, 138,255);
  rect(418,height-107,41,100);

  fill(212, 193, 30,255);
  rect(464,height-107,41,100);

  strokeWeight(1); // tloušťka obrysu
  stroke(0); // barva obrysu

  textAlign(CENTER, CENTER); // zarovnání textu

  textSize(28); // velikost textu

  // políčko za 0 bodů
  fill(160,130,90); // barva políčka
  if(slot==1 && blink % 20 > 10) fill(255), hundredAudio.play(); // pokud do políčka spadne míček, změní se barva políčka na bílou a přehraje se zvuk, perioda změny barvy je 20 snímků
  text('1', 118, height-77); // text na políčku
  text('0', 118, height-55);
  text('0', 118, height-33);

  // políčko za 500 bodů
  fill(160,130,90);
  if(slot==2 && blink % 20 > 10) fill(255), fivehundredAudio.play();
  text('5', 164, height-77);
  text('0', 164, height-55);
  text('0', 164, height-33);
  
  // políčko za 1000 bodů
  fill(160,130,90);
  if(slot==3 && blink % 20 > 10) fill(255), thousandAudio.play();
  text('1', 210, height-90);
  text('0', 210, height-66);
  text('0', 210, height-44);
  text('0', 210, height-22);
  
  // políčko za 0 bodů
  fill(160,130,90);
  if(slot==4 && blink % 20 > 10) fill(255), zeroAudio.play();
  text('0', 256, height-55);

  // políčko za 10000 bodů
  fill(160,130,90);
  if(slot==5 && blink % 20 > 10) fill(255), tenAudio.play();
  text('10', 300, height-90);
  text('0', 302, height-66);
  text('0', 302, height-44);
  text('0', 302, height-22);
  
  // políčko za 0 bodů
  fill(160,130,90);
  if(slot==6 && blink % 20 > 10) fill(255), zeroAudio.play();
  text('0', 348, height-55);
  
  // políčko za 1000 bodů
  fill(160,130,90);
  if(slot==7 && blink % 20 > 10) fill(255), thousandAudio.play();
  text('1', 394, height-90);
  text('0', 394, height-66);
  text('0', 394, height-44);
  text('0', 394, height-22);
  
  // políčko za 500 bodů
  fill(160,130,90);
  if(slot==8 && blink % 20 > 10) fill(255), fivehundredAudio.play();
  text('5', 440, height-77);
  text('0', 440, height-55);
  text('0', 440, height-33);

  // políčko za 100 bodů
  fill(160,130,90);
  if(slot==9 && blink % 20 > 10) fill(255), hundredAudio.play();
  text('1', 486, height-77);
  text('0', 486, height-55);
  text('0', 486, height-33);
  /*
  fill(0);
  noStroke();
  textSize(17);
  textAlign(LEFT, CENTER);
  text('Left: ' + turn, 0, 650);
  text('Score: ' + score, 0, 670);
  text('Last: ' + last, 0, 690);
  text('Best: ' + best, 0, 710);
  */ // Výpis statistik, nejde to pěkně zobrazit, takže to zatím nechávám zakomentované
}
