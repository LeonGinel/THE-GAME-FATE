window.onload = function() {
    // Verifica si hay un parámetro de sesión cerrada en la URL
    if (window.location.search.includes("logout=exito")) {
        alert("¡Su sesión ha sido cerrada, hasta pronto!");
    }
};