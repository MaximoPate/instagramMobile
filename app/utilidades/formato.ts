/**
 * Helpers de presentación de texto. Están fuera de los componentes para
 * poder reutilizarlos en el feed, el perfil, el detalle y los reels.
 */

/** 4312 → "4.312" (separador de miles en español). */
export function formatearNumero(valor: number): string {
  return valor.toLocaleString('es-AR');
}

/** 18420 → "18,4 mil". Se usa donde el espacio es chico (reels, métricas). */
export function formatearCompacto(valor: number): string {
  if (valor < 1000) return String(valor);

  if (valor < 1_000_000) {
    const miles = valor / 1000;
    return `${miles.toFixed(miles < 10 ? 1 : 0).replace('.', ',')} mil`;
  }

  return `${(valor / 1_000_000).toFixed(1).replace('.', ',')} M`;
}

/** Antepone "#" a cada etiqueta y las une con espacios. */
export function formatearEtiquetas(etiquetas: string[]): string {
  return etiquetas.map((etiqueta) => `#${etiqueta}`).join(' ');
}
