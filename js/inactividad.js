if (usuarioLogueado) {
  let tiempo_inactivo = 300000; // 5 minutos en ms
  let temporizador;

  function reiniciarTemporizador() {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
      window.location.href = "../app/cerrar_sesion.php?motivo=inactividad";
    }, tiempo_inactivo);
  }

  // Detectar actividad del usuario
  window.addEventListener("load", reiniciarTemporizador);
  document.addEventListener("mousemove", reiniciarTemporizador);
  document.addEventListener("keydown", reiniciarTemporizador);
  document.addEventListener("touchstart", reiniciarTemporizador); // para plataformas táctiles
}
