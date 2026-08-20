function bombillaFundida() {
		  const img = document.querySelector(".foto");

		  if (!img) {
			console.error("La imagen con clase 'foto' no se encontró.");
			return;
		  }
		
		  const tiempos = [100, 300, 700, 200, 500, 1000, 50, 800];
		
		  function parpadeo() {
			img.style.filter = "brightness(0.3)";
			setTimeout(() => {
			  img.style.filter = "brightness(1)";
			  let tiempoRandom = tiempos[Math.floor(Math.random() * tiempos.length)];
			  setTimeout(parpadeo, tiempoRandom);
			}, 100);
		  }
		
		  parpadeo();
		}
		
		window.onload = function () {
		  bombillaFundida();
		};