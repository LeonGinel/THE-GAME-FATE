window.onload = function () {
  if (window.location.search.includes("logout=exito")) {
    if (window.location.search.includes("motivo=inactividad")) {
      alert("Sesión caducada por inactividad");
    } else {
      alert("¡Su sesión ha sido cerrada, hasta pronto!");
    }
  }
};
