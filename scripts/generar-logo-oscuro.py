"""Genera `public/logo-sei-dark.png` a partir de `public/favicon.png`.

El logo de marca está pensado para papel blanco: la tipografía «Sistemas
Especializados de Información» es negra y el arte lleva dos sombras (una
difusa alrededor del texto y una elipse de apoyo bajo el isotipo). Sobre el
fondo oscuro del sitio el texto desaparece y las sombras se convierten en
manchas grises. Esta variante corrige las tres cosas sin tocar los colores
de marca.

Qué hace, y por qué cada regla es segura para este archivo en concreto:

  * El arte está partido de forma limpia en la columna 745: a la izquierda
    solo hay píxeles de color (el isotipo) y a la derecha solo negro (el
    logotipo). No se solapan, así que recolorear por zona no invade el
    isotipo.

  * La sombra difusa vive entre alfa 1 y 39, y el trazo entre 40 y 255. El
    histograma tiene un valle muy marcado justo ahí (~400 píxeles en la
    franja 40-47), de modo que cortar en 40 se lleva la sombra sin comerse
    el suavizado de los bordes.

  * La elipse de apoyo es gris claro y translúcida. Se localiza entera entre
    las filas 484 y 644, lejos de las letras, así que filtrar por «gris y
    claro» no toca ninguna otra parte del dibujo.

  * El filtro de saturación protege los bordes suavizados del isotipo: un
    borde de trazo azul o rojo mantiene su tono en el RGB aunque tenga alfa
    baja, así que nunca se confunde con sombra gris.

Si algún día cambia el logo original hay que volver a comprobar esas cuatro
suposiciones antes de confiar en el resultado.

Uso:  python scripts/generar-logo-oscuro.py
Requiere Pillow.
"""

from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / "public" / "favicon.png"
DESTINO = RAIZ / "public" / "logo-sei-dark.png"

SPLIT = 745             # izquierda: isotipo (solo color). derecha: logotipo (solo negro)
SHADOW_MAX_A = 40       # valle del histograma de alfa que separa sombra de trazo
GRIS_MAX_CROMA = 45     # por encima de esto el píxel es azul o rojo de marca
CLARO_MIN = 100         # umbral de la elipse de apoyo gris claro
FG = (250, 250, 250)    # --foreground del tema oscuro: oklch(0.985 0 0)


def es_gris(r: int, g: int, b: int) -> bool:
    return max(r, g, b) - min(r, g, b) <= GRIS_MAX_CROMA


def main() -> None:
    im = Image.open(ORIGEN).convert("RGBA")
    ancho, alto = im.size
    px = im.load()

    recoloreados = sombra_difusa = elipse = 0

    for x in range(ancho):
        for y in range(alto):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if es_gris(r, g, b) and a < SHADOW_MAX_A:
                px[x, y] = (0, 0, 0, 0)
                sombra_difusa += 1
            elif es_gris(r, g, b) and min(r, g, b) > CLARO_MIN:
                px[x, y] = (0, 0, 0, 0)
                elipse += 1
            elif x >= SPLIT:
                px[x, y] = (*FG, a)
                recoloreados += 1

    im.save(DESTINO, optimize=True)

    print(f"{DESTINO.name}: {DESTINO.stat().st_size} bytes")
    print(f"  glifos pasados a blanco : {recoloreados}")
    print(f"  sombra difusa eliminada : {sombra_difusa}")
    print(f"  elipse de apoyo quitada : {elipse}")


if __name__ == "__main__":
    main()
