# Revisión de la conversión de LISTAS.md

Casos en los que no quise adivinar. Cada uno ya tiene un valor provisional en `data/*.js` para que la app funcione; dime en el chat cuáles cambiar (por ejemplo: "2: radio femenino; 3: león rampante y cerdo y gallo sí animados").

Cuando un caso quede resuelto lo borro de aquí.

---

## 1. Plurales de por sí que no estaban en la lista

Los marqué en plural ("unas tijeras", "unos labios oxidados"):

- raíces
- labios
- tijeras
- boleadoras

## 2. Género dudoso

| Elemento | Provisional | Duda |
|---|---|---|
| pin-up | femenino | Sirve para los dos. |
| trapecista | masculino | Sirve para los dos ("un trapecista" / "una trapecista"). |
| alquimista | masculino | Sirve para los dos. |
| radio de válvulas | masculino | "El radio" en Colombia, "la radio" en España. |
| tragamonedas | femenino | Se usan las dos formas. |
| ankh | masculino | Palabra egipcia sin género claro en español. |
| hamsa | femenino | Se usa más "la hamsa". |
| torii | masculino | Palabra japonesa. |
| athame | masculino | Palabra inglesa. |

## 3. ¿Animado o no?

SPEC.md define los animados por familia más una lista suelta. Estos son seres o figuras que quedaron **no animados** por estar en otras familias. Si son animados pueden **sostener, devorar y enfrentar**, y sirven en los retos que exigen figura (pose, escorzo con figura).

- cerdo y gallo
- caballo con gualdrapa
- león rampante
- águila bicéfala
- homúnculo en frasco
- mandrágora
- muñeco vudú
- marioneta
- muñeca de porcelana
- soldadito de plomo
- ángel funerario
- luna con rostro
- sol con rostro

(pin-up sí es animado, por estar en Personajes y oficios.)

## 4. Plurales dudosos

Solo se usan en la relación "formado por" ("un cráneo formado por polillas"). Las palabras extranjeras y las aposiciones (la segunda palabra que no cambia) son las dudosas:

- Extranjeras: trebuchets, wyverns, krakens, gólems, kirines, ankhs, pin-ups, toriis, tengus, bakus, kitsunes, kappas, athames, narguiles
- Aposiciones: kabutos samurái, máscaras hannya, tableros ouija, muñecos vudú, banderas pirata, bodegones vanitas, hombres lobo, polillas calavera, polillas luna, escarabajos rinoceronte, tiburones martillo, peces koi, rayas manta, peces globo, hongos amanita, cajas sorpresa, cohetes retro

## 5. Conceptos que son adjetivos

En "Que transmita…" un adjetivo suelto no funciona ("Que transmita infantil"), así que les puse una frase:

- infantil → lo infantil
- tétrico → lo tétrico
- lúgubre → lo lúgubre
- onírico → lo onírico
- etéreo → lo etéreo
- político → lo político
- artificial → lo artificial
- espiritual → lo espiritual
- infinito → lo infinito

El chip sigue mostrando la palabra sola.

## 6. Conceptos que quizá suenen raros

Los dejé como están. Dime si quieres otra frase para alguno:

- "Que transmita máscara". ¿Quizá "lo oculto tras la máscara"?
- "Que transmita performance"
- "Que transmita derrotero". ¿Quizá "un derrotero" o "rumbo"?
- "Que transmita memento mori"
- "Que transmita tiempo", "vida", "futuro". Suenan bien, pero un poco abiertos.

## 7. Frases compuestas y concordancia

- **cerdo y gallo:** "un cerdo y un gallo". Para el estado lo traté como masculino plural: "un cerdo y un gallo dorados".
- **pluma y tintero:** "una pluma y un tintero", también masculino plural: "una pluma y un tintero oxidados".
- **máscaras de comedia y tragedia:** femenino plural: "unas máscaras de comedia y tragedia doradas".

## 8. Reglas nuevas

Las agregué para que un elemento no coincida con un formato casi igual. Salen en todos los modos:

- elemento "carta de tarot" × formato "carta de tarot"
- elemento "vitral" × formato "vitral"
- elemento "moneda antigua" × formato "moneda"

## 9. Detalles de presentación

- En los movimientos artísticos, el chip muestra el nombre sin artículo ("art nouveau") y la frase lo conserva ("Inspirado en el art nouveau").
- Las variantes de composición de nivel 1 y 2 llevan `tambienLucir: true`, así salen también en lucir.
