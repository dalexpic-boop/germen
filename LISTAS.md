# Germen Graphidis — Listas de contenido (v1)

Contenido inicial del generador. Claude Code lo convierte a `data/*.js` según el modelo de datos de SPEC.md. Después de esa conversión, `data/*.js` es la fuente de verdad del contenido y este archivo queda como referencia del diseño.

Convenciones:
- Los términos se escriben como entrarán en la frase: en minúscula salvo nombres propios.
- `peso` por defecto = 1.
- Cada término pertenece a una sola familia.
- "Frase" es el texto exacto que entra en la oración generada.

---

## 1. Estilos

Formato: estilo — probabilidad de que salgan elementos en modo Elementos = auto (alta / media / baja) — peso si no es 1.
Frase: "en {estilo}".

- tradicional — alta
- neotradicional — alta — peso 3
- nueva escuela — alta
- cartoon — alta
- pastel gore — alta
- realismo — alta
- blackwork — alta — peso 3
- ilustrativo — alta
- trash polka — alta
- criminal ruso — alta — frase: "en estilo criminal ruso"
- biomecánico — media
- oriental — media
- neo-oriental — media
- surrealismo — media
- ornamental — media
- diseño gráfico — media
- minimalista — media
- abstracto — baja
- geométrico — baja
- tribal — baja
- neotribal — baja
- polinesio — baja
- mehndi — baja

Términos de la lista original que se movieron:
- B&G y acuarela → Tratamiento / Color
- puntillismo y semitono → Tratamiento / Sombreado
- fine line y sketch → Tratamiento / Línea
- encaje, bordados y pixeles → Foco / Textura

---

## 2. Tratamiento

Tres componentes independientes. Formato: término → frase.

### Color
- vivos → colores muy vivos
- pastel → paleta pastel
- apagados → colores apagados
- tierra → tonos tierra
- solo negro → solo negro
- negro y gris → en negro y gris
- acuarela → con manchas de acuarela
- dos colores → limitado a dos colores
- complementarios → en colores complementarios
- acento único → negro con un solo color de acento

### Sombreado
- achurado → sombreado en achurado
- achurado cruzado → sombreado en achurado cruzado
- whip shading → sombreado en whip shading
- puntillismo → sombreado en puntillismo
- semitono → sombreado en semitono
- degradado suave → sombreado en degradado suave
- sólidos → rellenos sólidos sin degradado
- sin sombra → sin sombreado

### Línea
- gruesa → línea gruesa
- fina → en línea fina
- variable → línea de grosor variable
- punteada → línea punteada
- quebrada → línea quebrada
- de color → línea de color
- inexistente → sin contorno
- sketch → acabado de boceto

---

## 3. Foco

Variables con variantes. Las variables de **lucir** entran al pozo del modo lucir. Las de **reto** tienen nivel 1–3 y alimentan el modo reto. Composición tiene niveles 1 y 2 también disponibles en lucir.

### Variables de lucir

**Forma**
- silueta legible a tres metros
- construido solo con formas geométricas básicas
- formas orgánicas sin ángulos
- contraste extremo de tamaños
- silueta reconocible rellena en negro

**Luz**
- contraluz
- luz cenital
- luz desde abajo
- luz dura de un solo foco
- luz de borde
- dos fuentes de luz de distinto color
- la fuente de luz está dentro de la imagen

**Textura**
- escamas
- plumas
- pelaje
- metal pulido
- metal oxidado
- madera tallada
- piedra
- mármol
- tela con pliegues
- vidrio roto
- encaje
- bordado
- pixel

**Gestalt**
- cierre: figura incompleta que la mente completa
- figura y fondo intercambiables
- proximidad: la forma surge de elementos separados
- continuidad: una sola línea guía todo el diseño

**Efectos visuales**
- humo
- fuego
- agua
- chispas
- destellos
- desintegración en partículas
- glitch
- salpicaduras de tinta

**Múltiple sentido**
- dos lecturas según cómo se mire
- una silueta que contiene otra escena
- un objeto que también es un rostro
- doble exposición

**Ilusión óptica**
- objeto imposible
- patrón que vibra
- anamorfosis
- escala imposible: lo pequeño contiene lo grande

**Simetría**
- simetría bilateral estricta
- simetría radial
- simetría rota a propósito
- asimetría equilibrada

**3D y relieve**
- tallado en piedra
- piel rasgada que revela algo debajo
- sombra proyectada sobre el soporte
- metal repujado
- pegatina despegándose

### Variables de reto (con nivel)

Marcadas con [figura] las variantes que exigen una figura humana o animal (ver reglas en SPEC.md).

**Perspectiva**
- N1: un punto de fuga a la altura de los ojos
- N1: picado suave, vista ligeramente desde arriba
- N2: dos puntos de fuga
- N2: contrapicado marcado
- N2: vista cenital
- N3: tres puntos de fuga
- N3: ojo de gusano extremo
- N3: perspectiva curvilínea de ojo de pez

**Escorzo**
- N1: objeto alargado apuntando al espectador (espada, catalejo, cañón)
- N1: objeto circular visto en ángulo, convertido en elipse (escudo, reloj, rueda)
- N2: brazo o pata extendida hacia el espectador [figura]
- N2: cabeza vista desde abajo, mentón arriba [figura]
- N2: animal avanzando de frente [figura]
- N3: figura acostada vista desde los pies [figura]
- N3: mano abierta en primer plano con el cuerpo detrás [figura]
- N3: criatura alada cayendo hacia el espectador [figura]

**Pose** (todas [figura])
- N1: figura en reposo con contrapposto
- N1: animal sentado en vista de tres cuartos
- N2: torsión del torso
- N2: figura agachada
- N2: animal en pleno salto
- N3: figura en caída libre
- N3: dos figuras entrelazadas
- N3: pose de tensión extrema (combate, salto mortal)

**Composición**
- N1: composición centrada
- N1: regla de tercios
- N1: diagonal dominante
- N2: espiral áurea
- N2: marco dentro de marco
- N2: espacio negativo protagonista
- N3: tres planos de profundidad: primer plano, medio y fondo
- N3: elemento cortado por el borde con intención
- N3: flujo en curva S que sigue la anatomía (solo soporte piel)

---

## 4. Elementos

Elemento principal y, a veces, uno secundario. Familias para la regla de contraste/afinidad (ver SPEC.md).

**Familias animadas** (sus elementos pueden sostener, devorar y enfrentar): Personajes y oficios, Bestiario y mitología, Fauna terrestre, Aves, Insectos y arácnidos, Criaturas marinas. Excepciones no animadas dentro de esas familias: telaraña, coral.
**Elementos animados sueltos** de otras familias: esqueleto, fantasma, ánima en pena, catrina, ángel guardián, querubín, cordero, autómata, robot de hojalata.

- **Armas blancas y de asta:** espada bastarda, mandoble, espada ropera, cimitarra, katana, daga de misericordia, kris, estilete, navaja barbera, cuchillo de caza, machete, hacha de guerra, hacha doble, alabarda, lanza, tridente, maza, mangual, lucero del alba, martillo de guerra, kusarigama
- **Armas a distancia, de fuego y asedio:** ballesta, arco largo, flecha, carcaj, honda, cerbatana, bumerán, boleadoras, revólver, pistola de chispa, trabuco, mosquete, cañón, bala de cañón, granada antigua, cartucho de dinamita, bala, catapulta, trebuchet, ariete
- **Cascos y máscaras:** yelmo de cimera, casco corintio, kabuto samurái, casco vikingo, morrión, celada, escafandra de buzo, casco de astronauta, máscara de gas, máscara de médico de la peste, máscara veneciana, máscara hannya, máscara de oni, máscara de luchador, máscaras de comedia y tragedia, careta de esgrima, máscara de oro precolombina, máscara ritual africana
- **Caballería y heráldica:** guantelete, cota de malla, peto, escudo heráldico, rodela, estandarte, gonfalón, flor de lis, león rampante, águila bicéfala, espuela, caballo con gualdrapa, clarín con banderola
- **Poder y tesoro:** corona, tiara, cetro, orbe, trono, anillo de sello, sello de lacre, diamante, rubí tallado, collar de perlas, camafeo, huevo enjoyado, cofre del tesoro, moneda antigua, lingote de oro
- **Encierro y cerraduras:** cerradura, ojo de cerradura, llave maestra, manojo de llaves, candado, grilletes, cadena, jaula de pájaro, jaula colgante, cepo, brida de la vergüenza, doncella de hierro, reja, trampa para osos, ratonera, caja fuerte, camisa de fuerza
- **Mecanismos, tiempo y ciencia:** reloj de bolsillo, reloj de arena, reloj de sol, engranajes, astrolabio, autómata, metrónomo, péndulo, balanza, máquina de escribir, bombilla de filamento, bobina de Tesla, microscopio, cráneo frenológico, corazón mecánico, prótesis mecánica, robot de hojalata, radio de válvulas, telégrafo, televisor de tubo, casete
- **Náutico:** ancla, timón, galeón, velero, faro, brújula, rosa de los vientos, sextante, catalejo, barco en botella, mensaje en botella, arpón, salvavidas, nudo marinero, red de pesca, ojo de buey, mascarón de proa, bandera pirata, submarino antiguo, cerdo y gallo
- **Azar y vicio:** dados, cartas de póker, as de espadas, ficha de casino, ruleta, tragamonedas, bola 8, trébol de cuatro hojas, herradura, carta de lotería, copa de martini, botella de absenta, cigarro, pipa de opio, narguile
- **Esotérico y alquimia:** carta de tarot, bola de cristal, tablero ouija, péndulo radiestésico, grimorio, athame, caldero, pentáculo, sigilo, runas, ouroboros, alambique, matraz, piedra filosofal, mandrágora, homúnculo en frasco, mano de la gloria, ojo de la providencia, hamsa, ankh, ojo de Horus, escarabajo egipcio, atrapasueños, muñeco vudú
- **Sagrado y devocional:** corazón sagrado, corona de espinas, rosario, relicario, exvoto, milagrito, cáliz, incensario, campana, aureola, ángel guardián, querubín, cordero, mitra, cruz celta, crucifijo, rueda del dharma, mano en mudra
- **Muerte y memento mori:** cráneo, calavera de azúcar, catrina, esqueleto, mano esquelética, guadaña, ataúd, lápida, urna funeraria, máscara mortuoria, sudario, fantasma, ánima en pena, soga de horca, bodegón vanitas, ángel funerario
- **Cuerpo y anatomía:** manos rezando, mano con ojo en la palma, puño, ojo, ojo llorando, labios, lengua, dentadura, corazón clásico, corazón anatómico, cerebro, columna vertebral, costillas, pulmones, trenza, oreja
- **Personajes y oficios:** pin-up, marinero, caballero, bufón, arlequín, verdugo, monja, peregrino, juglar, samurái, geisha, charro, adivina, alquimista, bruja, payaso triste, forzudo de circo, domador, faquir, trapecista, boxeador antiguo, pirata, cazador de ballenas, bailarina
- **Bestiario y mitología:** dragón, wyvern, grifo, basilisco, mantícora, quimera, fénix, unicornio, kraken, hidra, gárgola, sirena, minotauro, centauro, cerbero, esfinge, harpía, pegaso, salamandra de fuego, golem, hombre lobo, kitsune, tengu, kappa, baku, kirin, serpiente emplumada, mohán, patasola, madremonte
- **Fauna terrestre:** puma, jaguar, pantera, tigre, león, lobo, oso, zorro, ciervo, jabalí, toro, macho cabrío, caballo, liebre, gato negro, murciélago, serpiente, cobra, cocodrilo, tortuga, rana, camaleón, armadillo, elefante, mono
- **Aves:** águila, golondrina, búho, lechuza, cuervo, urraca, colibrí, pavo real, garza, grulla, cóndor, buitre, gallo, cisne, halcón con capirote, quetzal, tucán, paloma, gorrión
- **Insectos y arácnidos:** mariposa, polilla, polilla calavera, polilla luna, tarántula, viuda negra, telaraña, escarabajo, escarabajo rinoceronte, abeja, avispa, mantis religiosa, libélula, ciempiés, cigarra, luciérnaga, escorpión, saltamontes
- **Criaturas marinas:** pulpo, medusa, tiburón, tiburón martillo, pez koi, caballito de mar, ballena, cachalote, raya manta, langosta, cangrejo, nautilus, rape abisal, pez globo, estrella de mar, coral, morena, ajolote
- **Botánica:** rosa, amapola, peonía, crisantemo, flor de loto, flor de cerezo, girasol, lirio, dalia, orquídea, pasiflora, nenúfar, cardo, hiedra, rama de espinas, rama de olivo, corona de laurel, hongo amanita, belladona, cactus, helecho, monstera, granada abierta, manzana mordida, calabaza, raíces, árbol seco
- **Arquitectura y lugares:** castillo, torre, puerta gótica, vitral, rosetón, catedral, campanario, mausoleo, molino, pozo, puente de piedra, laberinto, escalera de caracol, ventana con reja, columna en ruinas, pagoda, torii, pirámide, templo maya, invernadero victoriano, casa embrujada, cabaña en el bosque
- **Objetos de época:** lámpara de aceite, farol, quinqué, candelabro, vela, espejo de mano, tijeras, dedal, carrete de hilo, máquina de coser, plancha antigua, tetera, frasco de veneno, frasco de botica, pluma y tintero, libro antiguo, mapa antiguo, globo terráqueo, lupa, monóculo, sombrero de copa, bastón, paraguas, abanico, perfumero, brocha de afeitar, cámara de fuelle, teléfono de disco
- **Feria, juguetes y música:** carpa de circo, carrusel, noria, marioneta, muñeca de porcelana, caja sorpresa, soldadito de plomo, caballito de madera, trompo, canicas, caja de música, gramófono, violín, laúd, arpa, acordeón, trompeta, tambor, órgano de tubos
- **Cielo y cosmos:** luna creciente, luna con rostro, sol con rostro, estrella náutica, estrella fugaz, eclipse, constelación, planeta con anillos, galaxia espiral, telescopio, globo celeste, nube, rayo, meteorito, cohete retro, platillo volador, satélite
- **Vehículos:** carruaje, locomotora de vapor, globo aerostático, dirigible, motocicleta clásica, auto de los 50, bicicleta de rueda alta, biplano, carreta, góndola, trineo, tranvía, chiva

### Casos gramaticales que hay que revisar a mano
- **Plurales de por sí:** dados, grilletes, engranajes, canicas, cartas de póker, manos rezando, costillas, pulmones, runas, máscaras de comedia y tragedia.
- **Frase compuesta:** cerdo y gallo → "un cerdo y un gallo"; pluma y tintero → "una pluma y un tintero".
- **Femeninos con a tónica** (llevan "un" pero el adjetivo va en femenino: "un hacha oxidada", "un águila dorada"): hacha de guerra, hacha doble, águila, águila bicéfala, ancla, arpa, ánima en pena.
- **Género no evidente:** bola 8 (f), cota de malla (f), rosa de los vientos (f), ojo de buey (m), as de espadas (m), mascarón de proa (m), kris (m), ouroboros (m), wyvern (m), kitsune (m), kappa (m), baku (m), kirin (m), golem (m).

---

## 5. Estado (modificador del elemento)

Se escribe en masculino singular. Claude Code genera las formas femenina, masculina plural y femenina plural. Las invariables van marcadas (inv).

oxidado, roto, agrietado, en llamas (inv), derretido, congelado, petrificado, dorado, cubierto de musgo, florecido, envuelto en espinas, encadenado, vendado, cosido, sangrante, marchito, hueco, en ruinas (inv), fragmentado, deshaciéndose en humo (inv), iluminado desde dentro, con ojos (inv), alado, mecánico, translúcido

Exclusiones:
- alado → no aplica a Aves ni a Insectos y arácnidos
- con ojos → no aplica a ojo, ojo llorando, ojo de la providencia, ojo de Horus, mano con ojo en la palma
- mecánico → no aplica a Mecanismos, tiempo y ciencia
- florecido → no aplica a Botánica

---

## 6. Relación (entre el elemento principal A y el secundario B)

Sintaxis de las plantillas (detalle en SPEC.md): `{A}` y `{B}` = sintagma completo con artículo y estado; `{o:A}` = terminación o/a/os/as que concuerda con A; `{pron:A}` = él/ella/ellos/ellas; `{B:plural}` = plural de B sin artículo.

- con → `{A} con {B}`
- atravesado por → `{A} atravesad{o:A} por {B}`
- enroscado en → `{B} enroscad{o:B} en {A}`
- dentro de → `{B} dentro de {A}`
- sosteniendo → `{A} sosteniendo {B}` — requiere A animado
- brotando de → `{A} con {B} brotando de {pron:A}`
- saliendo de → `{A} con {B} saliendo de {pron:A}`
- coronado por → `{A} coronad{o:A} por {B}`
- encadenado a → `{A} encadenad{o:A} a {B}`
- protegido por → `{A} protegid{o:A} por {B}`
- devorando → `{A} devorando {B}` — requiere A animado
- enfrentado a → `{A} enfrentad{o:A} a {B}` — requiere A animado
- cuyo reflejo es → `{A} cuyo reflejo es {B}`
- partido por → `{A} partid{o:A} por {B}` — requiere B de Armas blancas y de asta o de Armas a distancia, de fuego y asedio
- oculto tras → `{A} ocult{o:A} tras {B}`
- formado por → `{A} formad{o:A} por {B:plural}`

"con" lleva peso 3 (es la relación más neutra y la que más se usa en flash).

---

## 7. Formato (opcional)

Formato: término → frase.

- carta de tarot → dentro de una carta de tarot
- medallón → dentro de un medallón
- estampita → como estampita religiosa
- banner → con banner y cartela para texto
- vitral → en formato de vitral
- sello postal → como sello postal
- etiqueta antigua → como etiqueta de botella antigua
- viñeta circular → en viñeta circular
- marco ornamental → con marco ornamental
- pergamino → sobre un pergamino desplegado
- ventana gótica → dentro de una ventana gótica
- manuscrito iluminado → como página de manuscrito iluminado
- naipe → como naipe de baraja
- moneda → en formato de moneda
- parche → como parche bordado

---

## 8. Conceptos

Agrupados en familias. Dos conceptos de una misma semilla nunca salen de la misma familia.

- **Fuerza y voluntad:** fortaleza, fuerza, valentía, voluntad, perseverancia, estoicismo, diligencia, paciencia
- **Fragilidad:** vulnerabilidad, fragilidad, debilidad, sensibilidad
- **Inocencia:** inocencia, infantil, juventud
- **Juego y humor:** humor, picardía, performance
- **Calma y luz:** alegría, esperanza, tranquilidad, paz, comodidad
- **Melancolía:** melancolía, nostalgia, desencanto, hastío, desesperación
- **Lo tétrico:** tétrico, lúgubre, terror, miedo
- **Lo onírico:** onírico, locura, extrañeza, etéreo, fascinación
- **Deseo:** amor, sensualidad, deseo, lujuria, placer
- **Ira y maldad:** odio, ira, agresividad, violencia, maldad
- **Poder y ambición:** poder, dominio, opulencia, avaricia, orgullo, envidia
- **Sometimiento:** dependencia, sumisión, pereza, gula
- **Virtud:** bondad, compasión, caridad, generosidad, humildad, templanza, prudencia, castidad, decoro
- **Engaño:** mentira, engaño, máscara, astucia, misterio
- **Verdad y orden:** verdad, justicia, orden
- **Vínculos:** unidad, separación, lealtad
- **Libertad y causa:** libertad, rebeldía, patriotismo, político
- **Saber y fe:** sabiduría, conocimiento, curiosidad, fe, espiritual
- **Tiempo y destino:** tiempo, vida, vejez, antigüedad, modernidad, artificial, futuro, infinito, renacimiento, memento mori, derrotero
- **Identidad:** feminidad, masculinidad

Etiquetas adicionales, para usos futuros:
- `pecado`: ira, orgullo, lujuria, avaricia, envidia, pereza, gula
- `virtud`: humildad, generosidad, castidad, paciencia, templanza, caridad, diligencia

Ajustes respecto a la lista original: "Deseo/Sexo" queda como "deseo"; "Terror/Gore" queda como "terror"; "Fé" se escribe "fe"; se agregaron etéreo, espiritual, astucia y memento mori.

---

## 9. Pares en tensión

En densidad completa, a veces los dos conceptos se reemplazan por un par. Frase: "En tensión: {a} y {b}."

- noche / día
- luz / oscuridad
- belleza / fealdad
- amor / odio
- bondad / maldad
- juventud / vejez
- verdad / mentira
- unidad / separación
- fortaleza / vulnerabilidad
- naturaleza / artificial
- feminidad / masculinidad
- orden / locura

---

## 10. Universos

Frase por defecto: "Universo: {universo}." Los que tienen segundo nivel usan la frase del subnivel.

fantasía, magia, ocultismo, esotérico, drogas, psiconauta, rumba y fiesta, amuletos y talismanes, naturaleza, historia natural, cultura pop, subculturas, puzzles, fábula, madre, padre, familia, juego, hobbies, profesiones, ciencia, deportes, música, artes, casino, libros, comics, películas, manga y kawaii, mitología, celebridades, personalidades, lugares, tarot*, zodiaco*, movimientos artísticos*, estéticas culturales*

(* con segundo nivel)

Ajustes respecto a la lista original: "Históricos" se eliminó; "Culturas" y "Étnicos" se fusionaron en "estéticas culturales"; "Objetos" se eliminó porque lo cubre Elementos; "Diseño gráfico" quedó solo en Estilos; "ProfesionesCiencia" se separó.

### Movimientos artísticos — frase: "Inspirado en {sub}."
el arte bizantino, el gótico, el manuscrito iluminado medieval, el grabado medieval, el Renacimiento italiano, el grabado renacentista, el barroco, el barroco colonial americano, el bodegón flamenco, el romanticismo, el prerrafaelismo, el simbolismo, el impresionismo, el art nouveau, el art déco, el expresionismo, el cubismo, el futurismo, el dadaísmo, el surrealismo, el constructivismo ruso, la Bauhaus, el muralismo mexicano, el pop art, el op art, la psicodelia, el ukiyo-e, el arte rupestre, el art brut

### Estéticas culturales — frase: "Con estética {sub}."
japonesa, china, coreana, tibetana, india, persa, islámica, egipcia antigua, griega clásica, romana, celta, nórdica, eslava, bizantina, maya, mexica, inca, muisca, quimbaya, tairona, polinesia, maorí, aborigen australiana, africana occidental, etíope, wayuu, guna, mongola, tailandesa, balinesa

### Tarot (arcanos mayores, numeración Rider-Waite) — frase: "A partir del arcano {sub}."
El Loco, El Mago, La Sacerdotisa, La Emperatriz, El Emperador, El Hierofante, Los Enamorados, El Carro, La Fuerza, El Ermitaño, La Rueda de la Fortuna, La Justicia, El Colgado, La Muerte, La Templanza, El Diablo, La Torre, La Estrella, La Luna, El Sol, El Juicio, El Mundo

### Zodiaco — frase: "A partir del signo de {sub}."
Aries, Tauro, Géminis, Cáncer, Leo, Virgo, Libra, Escorpio, Sagitario, Capricornio, Acuario, Piscis

---

## 11. Zonas del cuerpo (solo soporte piel)

Formato: zona — forma del lienzo. Frase: "Zona: {zona} ({forma})."

- antebrazo interno — vertical alargado
- antebrazo externo — vertical alargado
- brazo superior — vertical
- hombro — cúpula
- codo — circular, zona difícil
- dorso de la mano — pequeño y compacto
- dedos — mínimo
- muñeca — pequeño horizontal
- cuello lateral — vertical estrecho
- nuca — pequeño simétrico
- garganta — simétrico horizontal
- detrás de la oreja — mínimo
- pecho de un lado — horizontal amplio
- pecho completo — simétrico horizontal
- esternón — simétrico vertical
- costado — vertical amplio y curvo
- abdomen — amplio
- omóplato — mediano redondeado
- espalda completa — gran formato simétrico
- espalda baja — simétrico horizontal
- cadera — curvo
- muslo frontal — vertical amplio
- muslo lateral — vertical amplio
- rodilla — circular, zona difícil
- pantorrilla — vertical alargado
- espinilla — vertical estrecho
- tobillo — pequeño envolvente
- empeine — pequeño
- media manga — envolvente
- manga completa — envolvente continuo

---

## 12. Reglas de incompatibilidad (iniciales)

**Siempre** (en todos los modos):
- realismo × textura pixel
- estilo polinesio × estética polinesia o maorí
- estilo oriental o neo-oriental × estética japonesa, china o coreana
- estilo mehndi × estética india
- estilo surrealismo × movimiento surrealismo
- las exclusiones de Estado (sección 5) y los requisitos de Relación (sección 6)

**Solo en modo lucir** (en reto se permiten como desafío):
- blackwork × cualquier color salvo "solo negro" y "acento único"
- criminal ruso × cualquier color salvo "solo negro" y "negro y gris"
- tradicional × línea fina, línea punteada o sin contorno
- realismo × línea gruesa, sin sombreado o rellenos sólidos
- minimalista × achurado cruzado, semitono o degradado suave
