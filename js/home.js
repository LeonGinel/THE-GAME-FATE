window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has("logout") && urlParams.get("logout") === "exito") {
    if (urlParams.has("motivo") && urlParams.get("motivo") === "inactividad") {
      alert("Sesión caducada por inactividad");
    } else {
      alert("¡Su sesión ha sido cerrada, hasta pronto!");
    }

    // Remover solo los parámetros específicos
    urlParams.delete("logout");
    urlParams.delete("motivo");

    // Construir la nueva URL
    const newUrl = window.location.pathname + (urlParams.toString() ? "?" + urlParams.toString() : "");

    history.replaceState({}, document.title, newUrl);
  }
};
