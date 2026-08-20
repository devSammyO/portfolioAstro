document.querySelector(".btn-cv").addEventListener("click", function() {
    const link = document.createElement("a");
    link.href = "/Sammy_Odeh_CV_2026.pdf"; // Ruta accesible desde la carpeta /public
    link.download = "Sammy_Odeh_CV_2026.pdf"; // Nombre del archivo al descargar
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});