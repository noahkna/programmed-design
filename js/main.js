/* Code erstellt von Noah Knauss */

'use  strict'

// Available: Entity = Landname; Code = Abk Land; Year = Jahr(1990-2016)
$(document).ready(function start() {
	var sWidth = 1680;
	var sHeight = 1050;

	var year = 1990;
	var art = 0;
	var scale = 4;
	var count = 0;

	var laenderKreise = [];
	var artKreise = [];
	var keys = ["Brain","Lip","Nasopharynx","Esophageal","Larynx","Thyroid","Lung","Breast","Liver","Gall","Pancreas","Kidney","Stomach","Colon","Bladder","Prostate","Uterine","Ovarian","Cervical","Testicular","Skin","Other"];

//Alle Länder | Durchschnitt aller Krebsarten
	for (i=0; i < data.length; i++){
		var sum = 0;
		for (var k = 0; k < keys.length; k++){
			sum += data[i][keys[k]];
		}
		data[i].sum = sum;

		if (data[i].Year == year){

			var land = data[i].Code;
			var x = map(data2[land].Long, -180, 180, 40, sWidth-40);
			var y = map(data2[land].Lat, -90, 90, sHeight, 0);
			var radius = Math.sqrt(sum/Math.PI)*scale;
			var g = Math.floor(map(radius, 16, 43, 200, 0));
			var color = rgb(255, 255, 255);
			var c = createNode('circle', {cx: x, cy: y, r: radius, index: data[i].Code, fill: color, opacity: 1});
			laenderKreise.push(c);
		}
   	}

//Mit MouseX ändert man die Jahreszahl zwischen 1990 und 2016
	$(window).mousemove(function(event) {
        var MouseX = event.pageX;
        var MouseYear = Math.floor(map(MouseX, 0, sWidth, 1990, 2017));
		var kreisNr = 0;
		for (var i=0; i < data.length; i++){
			if (data[i].Year == MouseYear){
				var radius = Math.sqrt(data[i].sum/Math.PI)*scale;
				var g = Math.floor(map(radius, 15, 43, 255, 0));
				var color = rgb(255, g, 0);
				var c = laenderKreise[kreisNr];
				c.setAttribute('fill', color);
				c.setAttribute('r',radius);
				kreisNr++;
			}
		}		
	});
//Durch click sucht man sich ein spezielles Jahr aus | Unterteilt in verschiedene Krebsarten nach Position im Körper
	$(laenderKreise).click(function(evt){
		$(laenderKreise).off();
		
		var xWert = evt.target.getAttribute('cx');
		var yWert = evt.target.getAttribute('cy');
		var radius = evt.target.getAttribute('r');
		var index = evt.target.getAttribute('index');
		var artRadius = [];
		

		for (var i=0; i < keys.length; i++) {
			var g = Math.floor(map(radius, 0, 11, 255, 0));
			var color = rgb(255, g, 0);
            var c = createNode('circle', {cx: sWidth/2, cy: yWert, r: radius, key: i, opacity: 0, fill: color});
            artKreise.push(c);
        }

		for (var j=0; j<data.length;j++){
			for(var k=0; k<keys.length;k++){
				if (data[j].Code == index && data[j].Year == year){
					radius = Math.sqrt(data[j][keys[k]]/Math.PI)*scale;	
					artRadius.push(radius);
				}
			}	
		}
		
		$(laenderKreise).velocity(
			{	cx: sWidth/2,
				cy: yWert,
				opacity: 0
			},{
				duration: 500
			}
		);

		$(artKreise).velocity(
			{	opacity: 1
			},
			{
				duration: 500
			}
		);

		for (var l=0; l<keys.length;l++){
			var g = Math.floor(map(artRadius[l], 0, 11, 255, 0));
			var color = rgb(255, g, 0);
			$(artKreise[l]).velocity(
				{	r: artRadius[l],
					cy: 40+l*(sHeight-40)/artKreise.length,
					fill: color
				}
			);
			
		}

		$(window).mousemove(function(evt) {
	        var MouseX = evt.pageX;
	        var MouseYear = Math.floor(map(MouseX, 0, sWidth, 1990, 2017));
	        //var neuMouse = map(MouseYear, )

			for (var m=0; m<data.length;m++){
				for(var n=0; n<keys.length;n++){
					if (data[m].Code == index && data[m].Year == MouseYear){
						radius = Math.sqrt(data[m][keys[n]]/Math.PI)*scale;
						var g = Math.floor(map(radius, 0, 11, 255, 0));
						var color = rgb(255, g, 0);
						var c = artKreise[n];
						c.setAttribute('fill', color);
						c.setAttribute('r', radius);
						c.setAttribute('cx', MouseX);
						c.setAttribute('year', MouseYear);
					}
				}	
			}
		});
		// Hier würde das drag and drop kommen,  hab ich leider nicht mehr hinbekommen, wusste nicht wie ich am besten zwischen klick und drag unterscheiden kann. Leider.
		// $('body').on('mousedown', function (evt) {
		//   $('body').on('mousemove', function handler(evt) {
		//     //$('body').off('mouseup mousemove', handler);
		//   });
		// });

// Durch klicken auf einen Kreis öffnet sich das momentane Jahr und die momentane Krebsart auf die Weltkarte gemappt	
		$(artKreise).click(function(evt){
			$(laenderKreise).on();
			$(artKreise).off();
			$(window).off();
			var key = evt.target.getAttribute('key');
			year = evt.target.getAttribute('year');

			$(artKreise).velocity(
				{	cx: sWidth/2,
					cy: sHeight/2,
					opacity: 0
				}
			);
			var count2 = 0;
			for (o=0; o < data.length; o++){
				if (data[o].Year == year){
					var land = data[o].Code;
					var x = map(data2[land].Long, -180, 180, 40, sWidth-40);
					var y = map(data2[land].Lat, -90, 90, sHeight, 0);
					var rad = Math.sqrt(data[o][keys[key]]/Math.PI)*scale;

					$(laenderKreise[count2]).velocity(
						{	cx: x,
							cy: y,
							opacity: 1,
							r: rad
						}
					);
					count2++;
				}	
			}	
// Durch bewegen der Maus in Y-Richtung ändert sich die Art des Krebses
			$(window).mousemove(function(evt){
				var MouseY = evt.pageY;
				var MouseArt = Math.floor(map(MouseY, 0 , sHeight, 0, 22));

				if (MouseArt != art) {
					art = MouseArt;

					var count3 = 0;
					for (p=0; p < data.length; p++){
						if (data[p].Year == year){

							var radius = Math.sqrt(data[p][keys[MouseArt]]/Math.PI)*scale;
							var c = laenderKreise[count3];
							$(c).velocity({
								r: radius
							},{
								queue: false,
								duration: 100,
								delay: 50
							})
							count3++;
						}
		   			}
	   			}

	   			$(window).click (function(){
	   				location.reload();
	   			});

	   		});
		});
	});	
});