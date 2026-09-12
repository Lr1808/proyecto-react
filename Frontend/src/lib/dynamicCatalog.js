const categoryMeta = {
  python: { subject: 'Python', programming_language: 'python', minutes: 30 },
  database: { subject: 'Base de datos', programming_language: 'sql', minutes: 35 },
  react: { subject: 'React', programming_language: 'react', minutes: 35 },
  git: { subject: 'Git', programming_language: 'git', minutes: 30 },
  terminal: { subject: 'Terminal', programming_language: 'terminal', minutes: 25 },
}

const rand = (seed) => () => {
  seed = (seed * 1103515245 + 12345) % 2147483648
  return seed / 2147483648
}

const shuffle = (list, next) => {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1))
    const swap = copy[i]
    copy[i] = copy[j]
    copy[j] = swap
  }
  return copy
}

const choice = (text, options, correct, next, points, explanation) => {
  const ordered = options.map(String)
  return {
    question_type: 'MULTIPLE_CHOICE',
    question_text: text,
    options: next ? shuffle(ordered, next) : [...ordered.slice(1), ordered[0]],
    correct_answer: String(correct),
    points: points || 10,
    explanation: explanation || '',
  }
}

const truth = (text, correct, points, explanation) => ({
  question_type: 'BOOLEAN',
  question_text: text,
  correct_answer: String(Boolean(correct)),
  points: points || 10,
  explanation: explanation || '',
})

const number = (text, correct, points, explanation) => ({
  question_type: 'NUMERICAL',
  question_text: text,
  correct_answer: String(correct),
  points: points || 10,
  explanation: explanation || '',
})

const pythonPool = [
  (next) => {
    const a = 2 + Math.floor(next() * 49)
    const b = 2 + Math.floor(next() * 9)
    const c = 2 + Math.floor(next() * 5)
    const correct = a + b * c
    return choice(`¿Cuál es el resultado de ${a} + ${b} * ${c}?`, [correct, correct + 1, correct - 1, a + b + c], correct, next, 10, 'En Python la multiplicación tiene prioridad antes que la suma.')
  },
  (next) => {
    const b = 2 + Math.floor(next() * 9)
    const a = b + 1 + Math.floor(next() * 20)
    return number(`¿Cuál es el resultado de ${a} % ${b}?`, a % b, 10, 'El operador % devuelve el resto de la división entera.')
  },
  (next) => {
    const words = ['Python', 'desarrollo', 'aprendizaje', 'estructuras', 'funciones', 'iteraciones']
    const word = words[Math.floor(next() * words.length)]
    return number(`¿Cuántos caracteres tiene "${word}"?`, word.length, 10, 'len() devuelve el número de caracteres de una cadena.')
  },
  (next) => {
    const a = 2 + Math.floor(next() * 50)
    const b = 2 + Math.floor(next() * 50)
    const fact = a >= b
    return truth(`En Python, la expresión ${a} >= ${b} evalúa a ${fact}.`, fact, 10, 'La comparación >= se resuelve con los valores numéricos reales.')
  },
  () => choice('¿Qué método agrega un elemento al final de una lista?', ['append()', 'insert()', 'add()', 'push()'], 'append()', null, 10, 'append() inserta al final; insert() lo hace en un índice dado.'),
  () => choice('¿Qué palabra clave define una función?', ['def', 'func', 'fun', 'define'], 'def', null, 10, 'La palabra reservada es def.'),
  () => truth('Una función puede devolver varios valores empaquetados en una tupla.', true, 10, 'return a, b equivale a devolver la tupla (a, b).'),
  () => choice('¿Qué tipo devuelve type(3.14)?', ['float', 'int', 'double', 'decimal'], 'float', null, 10, '3.14 es un literal float.'),
  () => choice('¿Cómo se crea un diccionario vacío?', ['{}', 'list()', 'set()', 'tuple()'], '{}', null, 10, '{} crea un dict; set() crea un conjunto vacío.'),
  () => ({ question_type: 'CODE_CHALLENGE', question_text: 'Escribe una función que sume dos números y devuelva el resultado.', points: 20, explanation: 'def suma(a, b): return a + b resuelve el reto; Judge0 validará los casos públicos y ocultos.' }),
  () => choice('¿Qué función convierte un texto en un entero?', ['int()', 'str()', 'float()', 'list()'], 'int()', null, 10, 'int("7") devuelve el entero 7.'),
  (next) => {
    const a = 3 + Math.floor(next() * 10)
    return number(`¿Qué devuelve ${a} ** 2?`, a * a, 10, 'El operador ** eleva la base al exponente indicado.')
  },
  () => truth('El slicing lista[1:5] devuelve los elementos desde el índice 1 hasta el 4.', true, 10, 'El extremo superior del slice es excluyente.'),
  () => choice('¿Qué sentencia inicia un bloque que atrapa errores?', ['try', 'catch', 'except', 'finally'], 'try', null, 10, 'La estructura es try / except.'),
  () => choice('¿Qué f-string imprime "Hola Ana"?', ['f"Hola {nombre}"', '"Hola {nombre}"', 'f"Hola nombre"', 'f"Hola {}"'], 'f"Hola {nombre}"', null, 10, 'Un f-string antepone f y usa llaves para interpolar.'),
  () => choice('¿Qué método elimina y devuelve el último elemento de una lista?', ['pop()', 'remove()', 'del()', 'pull()'], 'pop()', null, 10, 'pop() quita y devuelve el último; remove() borra por valor.'),
  () => choice('¿Qué método de un dict devuelve un valor sin lanzar KeyError?', ['get()', 'find()', 'obtain()', 'lookup()'], 'get()', null, 10, 'dict.get(clave, defecto) devuelve el valor o un defecto.'),
  () => choice('¿Qué función entrega índice y valor al recorrer una secuencia?', ['enumerate()', 'index()', 'zip()', 'range()'], 'enumerate()', null, 10, 'enumerate() produce tuplas (índice, valor).'),
  () => truth('str.upper() devuelve el texto en mayúsculas.', true, 10, 'upper() transforma a mayúsculas; lower() a minúsculas.'),
  () => choice('¿Qué función genera una secuencia de números para iterar?', ['range()', 'sequence()', 'count()', 'list()'], 'range()', null, 10, 'range(inicio, fin, paso) crea una secuencia.'),
  (next) => {
    const n = 3 + Math.floor(next() * 4)
    const items = Array.from({ length: n }, () => Math.floor(next() * 20))
    return number(`¿Cuántos elementos contiene la lista [${items.join(', ')}]?`, n, 10, 'len() cuenta los elementos de la lista.')
  },
  (next) => {
    const n = 2 + Math.floor(next() * 6)
    return number(`Un contador parte en 0 y sube de 1 en 1. ¿Cuántas iteraciones ejecuta while contador < ${n}?`, n, 10, 'Itera mientras la condición sea verdadera; aquí avanza n pasos.')
  },
]

const databasePool = [
  () => choice('¿Qué cláusula filtra filas antes de agrupar con GROUP BY?', ['WHERE', 'HAVING', 'ORDER BY', 'FILTER'], 'WHERE', null, 10, 'WHERE filtra filas; HAVING filtra grupos ya agregados.'),
  () => choice('¿Qué cláusula filtra grupos después de una agregación?', ['HAVING', 'WHERE', 'GROUP BY', 'SELECT'], 'HAVING', null, 10, 'HAVING se aplica sobre el resultado de funciones de agregación.'),
  () => choice('¿Qué operador une dos tablas por una columna en común?', ['JOIN', 'MERGE', 'LINK', 'APPEND'], 'JOIN', null, 10, 'JOIN combina filas a partir de una condición de igualdad.'),
  () => choice('¿Qué cláusula ordena los resultados de una consulta?', ['ORDER BY', 'SORT BY', 'GROUP BY', 'ORDER'], 'ORDER BY', null, 10, 'El orden se define con ORDER BY.'),
  () => choice('¿Qué función cuenta la cantidad de registros?', ['COUNT(*)', 'SUM(*)', 'NUMBER(*)', 'TOTAL(*)'], 'COUNT(*)', null, 10, 'COUNT(*) cuenta filas; SUM agrega valores numéricos.'),
  () => truth('Una llave primaria no admite valores repetidos ni NULL.', true, 10, 'Los valores de una PK son únicos y no nulos.'),
  () => choice('¿Qué operador une dos consultas eliminando duplicados?', ['UNION', 'UNION ALL', 'JOIN', 'INTERSECT'], 'UNION', null, 10, 'UNION combina y elimina duplicados; UNION ALL los conserva.'),
  () => choice('¿Qué función calcula el promedio de una columna numérica?', ['AVG()', 'MEAN()', 'AVERAGE()', 'MED()'], 'AVG()', null, 10, 'AVG() devuelve el promedio de una columna numérica.'),
  (next) => {
    const words = ['Hola', 'SQL', 'base', 'tabla', 'dato', 'índice']
    const word = words[Math.floor(next() * words.length)]
    return number(`¿Qué devuelve SELECT LENGTH('${word}');`, word.length, 10, 'LENGTH devuelve el número de caracteres del texto.')
  },
  () => truth('Una FOREIGN KEY puede apuntar a un valor que no existe en la tabla referenciada.', false, 10, 'La integridad referencial lo prohíbe.'),
  () => choice('¿Qué comando elimina los datos de una tabla conservando su estructura?', ['TRUNCATE TABLE', 'DROP TABLE', 'REMOVE TABLE', 'DELETE TABLE'], 'TRUNCATE TABLE', null, 10, 'TRUNCATE vacía la tabla; DROP la elimina por completo.'),
  () => choice('¿Qué sentencia agrega una fila a una tabla?', ['INSERT INTO', 'ADD ROW', 'PUSH', 'APPEND'], 'INSERT INTO', null, 10, 'Se inserta con INSERT INTO tabla (cols) VALUES (...).'),
  () => choice('¿Qué tipo de JOIN devuelve todas las filas de la tabla izquierda y solo los emparejados de la derecha?', ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN'], 'LEFT JOIN', null, 10, 'LEFT JOIN conserva toda la tabla izquierda.'),
  () => choice('¿Qué sentencia modifica datos existentes?', ['UPDATE', 'ALTER', 'MODIFY', 'CHANGE'], 'UPDATE', null, 10, 'UPDATE SET ... cambia datos; ALTER cambia la estructura.'),
  () => choice('¿Qué comando elimina una tabla completa?', ['DROP TABLE', 'DELETE', 'TRUNCATE', 'REMOVE'], 'DROP TABLE', null, 10, 'DROP elimina la tabla y su estructura.'),
  () => choice('¿Qué operador busca coincidencias parciales de texto?', ['LIKE', 'MATCH', 'SEARCH', 'FIND'], 'LIKE', null, 10, 'LIKE usa % y _ como comodines de texto.'),
  () => choice('¿Qué cláusula limita la cantidad de filas devueltas?', ['LIMIT', 'ROWNUM', 'OFFSET', 'MAX'], 'LIMIT', null, 10, 'LIMIT 10 devuelve solo diez filas.'),
  () => choice('¿Qué operador define un rango de valores?', ['BETWEEN', 'IN', 'LIKE', 'RANGE'], 'BETWEEN', null, 10, 'BETWEEN incluye ambos extremos del rango.'),
  () => choice('¿Qué comando añade una columna a una tabla?', ['ALTER TABLE ... ADD', 'UPDATE', 'MODIFY', 'INSERT'], 'ALTER TABLE ... ADD', null, 10, 'ALTER cambia el esquema; ADD agrega la columna.'),
  () => truth('Un DELETE sin WHERE puede borrar todas las filas de la tabla.', true, 10, 'Sin WHERE, DELETE elimina el contenido completo.'),
  () => choice('¿Qué cláusula agrupa filas con el mismo valor?', ['GROUP BY', 'ORDER BY', 'DISTINCT', 'PARTITION BY'], 'GROUP BY', null, 10, 'GROUP BY crea grupos para aplicar agregaciones.'),
  (next) => {
    const a = 2 + Math.floor(next() * 8)
    const b = 1 + Math.floor(next() * 5)
    return number(`¿Qué devuelve SELECT ${a} * 2 + ${b};`, a * 2 + b, 10, 'Las expresiones aritméticas se evalúan con prioridad de operadores.')
  },
]

const reactPool = [
  () => choice('¿Qué hook maneja el estado local de un componente?', ['useState', 'useEffect', 'useRef', 'useMemo'], 'useState', null, 10, 'useState devuelve el valor y su actualizador.'),
  () => choice('¿Qué hook ejecuta efectos secundarios tras el render?', ['useEffect', 'useState', 'useLayoutEffect', 'useRef'], 'useEffect', null, 10, 'useEffect corre tras pintar, con dependencias opcionales.'),
  () => choice('¿Qué hook memoriza un cálculo costoso?', ['useMemo', 'useCallback', 'useState', 'useRef'], 'useMemo', null, 10, 'useMemo guarda el resultado entre renders si las dependencias no cambian.'),
  () => choice('¿Qué prop diferencia los elementos de una lista?', ['key', 'id', 'index', 'ref'], 'key', null, 10, 'La prop key ayuda a React a reconciliar la lista.'),
  () => truth('Un componente hijo puede modificar directamente las props que recibe.', false, 10, 'Las props son de solo lectura; los cambios van por callbacks.'),
  () => truth('El estado creado con useState solo cambia a través de su actualizador.', true, 10, 'setState es la única vía para actualizar ese estado.'),
  () => choice('¿Cómo se pasan datos de un componente padre a un hijo?', ['props', 'variables locales', 'métodos estáticos', 'estilos'], 'props', null, 10, 'Los datos fluyen de padre a hijo mediante props.'),
  () => choice('¿Qué método de un componente de clase se ejecuta cuando se monta?', ['componentDidMount', 'componentWillUnmount', 'render', 'useEffect'], 'componentDidMount', null, 10, 'componentDidMount corre una vez tras el primer render.'),
  () => choice('¿Qué comando crea un proyecto de React con Vite?', ['npm create vite@latest', 'npx create-react-app --vite', 'npm install vite', 'npm init react'], 'npm create vite@latest', null, 10, 'Vite se scaffold con npm create vite@latest.'),
  () => truth('Un componente debe devolver siempre un único elemento raíz o un fragmento.', true, 10, 'Se admite un nodo raíz o <></>.'),
  () => choice('¿Qué hook lee el valor de un contexto?', ['useContext', 'useState', 'useRef', 'useMemo'], 'useContext', null, 10, 'useContext(Ctx) devuelve el valor provisto por el Provider.'),
  () => choice('¿Qué hook crea una referencia mutable que persiste entre renders?', ['useRef', 'useMemo', 'useState', 'useCallback'], 'useRef', null, 10, 'useRef no provoca renders al cambiar .current.'),
  () => choice('¿Qué técnica eleva el estado al componente padre para compartirlo entre hijos?', ['lifting state up', 'context drilling', 'prop drilling', 'derived state'], 'lifting state up', null, 10, 'Lifting state up centraliza el estado donde lo comparten los hijos.'),
  () => choice('¿Qué controla que un effect se re-ejecute?', ['El array de dependencias', 'El número de renders', 'La prop key', 'useMemo'], 'El array de dependencias', null, 10, 'El array de dependencias decide cuándo vuelve a corriendo el efecto.'),
  () => choice('¿Qué hace {...props} en un componente?', ['Pasa todas las props al hijo', 'Clona el estado', 'Crea un hook', 'Define estilos'], 'Pasa todas las props al hijo', null, 10, 'La propagación reparte las props en el elemento destino.'),
  () => choice('¿Qué atributo maneja el clic en un botón de React?', ['onClick', 'click', 'onButton', 'fire'], 'onClick', null, 10, 'Los eventos se escriben en camelCase: onClick.'),
  () => truth('Los hijos avisan al padre mediante callbacks pasados por props.', true, 10, 'El padre pasa una función; el hijo la invoca con datos.'),
  () => choice('¿Qué hook re-calcula un valor cuando cambian sus dependencias?', ['useMemo', 'useCallback', 'useReducer', 'useRef'], 'useMemo', null, 10, 'useMemo devuelve el valor memoizado hasta que cambien las deps.'),
  () => choice('¿Qué forma de setState se recomienda cuando el nuevo valor depende del anterior?', ['La forma funcional', 'Pasar el valor directo', 'Usar forceUpdate', 'Render manual'], 'La forma funcional', null, 10, 'setState(prev => ...) evita valores obsoletos.'),
  () => choice('¿Qué envoltorio agrupa hijos sin agregar nodos al DOM?', ['Fragment', 'Portal', 'Wrapper', 'Container'], 'Fragment', null, 10, '<>...</> o <Fragment> no crea elemento extra.'),
  () => truth('Un effect sin array de dependencias se ejecuta en cada render.', true, 10, 'La ausencia de dependencias re-ejecuta el effect siempre.'),
  () => choice('¿Qué biblioteca se usa para la navegación por rutas en React?', ['react-router-dom', 'react-nav', 'react-url', 'react-route'], 'react-router-dom', null, 10, 'react-router-dom ofrece Route, Link y Router.'),
]

const gitPool = [
  () => choice('¿Qué comando guarda los cambios que están en el área de staging?', ['git commit', 'git add', 'git push', 'git save'], 'git commit', null, 10, 'commit registra el snapshot; add mueve archivos a staging.'),
  () => choice('¿Qué comando envía los commits al repositorio remoto?', ['git push', 'git pull', 'git fetch', 'git merge'], 'git push', null, 10, 'push sube las referencias locales al remoto.'),
  () => choice('¿Qué comando descarga los cambios remotos y los integra en la rama actual?', ['git pull', 'git fetch', 'git clone', 'git checkout'], 'git pull', null, 10, 'pull = fetch + merge sobre la rama activa.'),
  () => choice('¿Qué comando crea una rama nueva?', ['git branch <nombre>', 'git fork <nombre>', 'git split <nombre>', 'git clone <nombre>'], 'git branch <nombre>', null, 10, 'branch crea el puntero; checkout -b crea y cambia.'),
  () => truth('Un conflicto aparece cuando dos ramas modifican la misma línea de un archivo.', true, 10, 'Git no decide por ti y deja los marcadores de conflicto.'),
  () => choice('¿Qué comando muestra el estado del working directory y del staging?', ['git status', 'git list', 'git state', 'git check'], 'git status', null, 10, 'status muestra archivos modificados, en staging y sin seguimiento.'),
  () => choice('¿Qué comando guarda temporalmente cambios sin crear commits?', ['git stash', 'git stage', 'git pause', 'git temp'], 'git stash', null, 10, 'stash aparta los cambios; stash pop los recupera.'),
  () => choice('¿Qué comando integra una rama en la actual?', ['git merge', 'git join', 'git combine', 'git attach'], 'git merge', null, 10, 'merge incorpora los commits de otra rama a la actual.'),
  () => truth('git fetch descarga cambios remotos sin integrarlos en tu rama.', true, 10, 'fetch solo actualiza las referencias remotas locales.'),
  () => choice('¿Qué comando mueve archivos al área de staging?', ['git add', 'git commit', 'git push', 'git init'], 'git add', null, 10, 'add marca qué cambios entrarán en el próximo commit.'),
  () => choice('¿Qué comando muestra el historial de commits?', ['git log', 'git history', 'git timeline', 'git show'], 'git log', null, 10, 'log lista commits; show detalla uno concreto.'),
  () => truth('git reset --soft HEAD~1 deshace el último commit conservando los cambios.', true, 10, 'soft conserva los cambios en staging; hard los descarta.'),
  () => choice('¿Qué archivo define los ficheros que Git no debe versionar?', ['.gitignore', '.gitkeep', '.gitconfig', '.gitmodule'], '.gitignore', null, 10, '.gitignore lista rutas y patrones excluidos.'),
  () => choice('¿Qué comando aplica un commit concreto de otra rama a la actual?', ['git cherry-pick', 'git apply', 'git pick', 'git merge --one'], 'git cherry-pick', null, 10, 'cherry-pick replica un commit en la rama activa.'),
  () => choice('¿Qué comando copia un repositorio remoto por primera vez?', ['git clone', 'git init', 'git fetch', 'git pull'], 'git clone', null, 10, 'clone descarga y configura el remoto como origin.'),
  () => choice('¿Qué comando muestra los cambios aún sin commitear?', ['git diff', 'git compare', 'git changes', 'git patch'], 'git diff', null, 10, 'diff muestra el contenido modificado línea a línea.'),
  () => truth('git stash pop aplica los cambios guardados y los elimina del stash.', true, 10, 'pop restaura y limpia; apply solo restaura.'),
  () => choice('¿Qué comando deshace un commit creando uno nuevo inverso?', ['git revert', 'git reset --hard', 'git checkout', 'git relog'], 'git revert', null, 10, 'revert añade un commit que deshace el anterior sin reescribir historia.'),
  () => choice('¿Qué comando elimina una rama que ya fue fusionada?', ['git branch -d <nombre>', 'git delete <nombre>', 'git rm --branch', 'git merge --delete'], 'git branch -d <nombre>', null, 10, '-d borra ramas fusionadas; -D fuerza el borrado.'),
  () => truth('HEAD apunta al último commit de la rama actual.', true, 10, 'HEAD es la referencia sobre el commit en el que trabajas.'),
]

const terminalPool = [
  () => choice('¿Qué comando lista los archivos del directorio actual?', ['ls', 'list', 'show', 'cat'], 'ls', null, 10, 'ls lista entradas del directorio; -a incluye ocultos.'),
  () => choice('¿Qué comando cambia de directorio?', ['cd', 'pwd', 'mv', 'chdir'], 'cd', null, 10, 'cd <ruta> desplaza el shell a otro directorio.'),
  () => choice('¿Qué comando imprime el directorio de trabajo actual?', ['pwd', 'where', 'cd', 'ls'], 'pwd', null, 10, 'pwd muestra la ruta absoluta en la que estás.'),
  () => choice('¿Qué comando crea un directorio nuevo?', ['mkdir', 'touch', 'new', 'makedir'], 'mkdir', null, 10, 'mkdir crea directorios; -p crea rutas intermedias.'),
  () => choice('¿Qué comando copia archivos?', ['cp', 'mv', 'ca', 'copy'], 'cp', null, 10, 'cp origen destino copia; mv mueve o renombra.'),
  () => choice('¿Qué comando mueve o renombra archivos?', ['mv', 'cp', 'rm', 'rename'], 'mv', null, 10, 'mv desplaza el archivo de una ruta a otra.'),
  () => choice('¿Qué comando elimina archivos?', ['rm', 'drop', 'remove', 'del'], 'rm', null, 10, 'rm borra; -r recorre directorios; cuidado con -f.'),
  () => choice('¿Qué comando imprime el contenido de un archivo?', ['cat', 'ls', 'echo', 'open'], 'cat', null, 10, 'cat concatena y muestra contenidos; less pagina la salida.'),
  () => choice('¿Qué bandera de ls muestra los archivos ocultos?', ['-a', '-l', '-h', '-r'], '-a', null, 10, '-a incluye entradas que comienzan con punto.'),
  () => truth('grep busca patrones de texto dentro de archivos.', true, 10, 'grep filtra las líneas que coinciden con una expresión regular.'),
  () => choice('¿Qué comando busca texto dentro de archivos?', ['grep', 'find', 'search', 'locate'], 'grep', null, 10, 'find localiza por nombre; grep busca contenido.'),
  () => truth('chmod +x script.sh otorga permiso de ejecución al script.', true, 10, 'Añade el bit de ejecución para quien lo ejecuta.'),
  () => choice('¿Qué operador envía la salida de un comando a un archivo?', ['>', '<', '|', '&'], '>', null, 10, '> redirige stdout a un archivo; | encadena comandos.'),
  () => choice('¿Qué comando muestra los procesos en ejecución?', ['ps', 'top', 'jobs', 'uptime'], 'ps', null, 10, 'ps lista procesos; top los muestra en vivo.'),
  () => choice('¿Qué comando muestra las primeras líneas de un archivo?', ['head', 'top', 'first', 'start'], 'head', null, 10, 'head muestra el inicio; tail el final.'),
  () => choice('¿Qué comando sigue un archivo y muestra las líneas nuevas?', ['tail -f', 'head -f', 'watch -l', 'less -v'], 'tail -f', null, 10, 'tail -f (follow) es ideal para logs en vivo.'),
  () => choice('¿Qué comando muestra la documentación de otro comando?', ['man', 'help', 'info', 'docs'], 'man', null, 10, 'man <comando> abre el manual completo.'),
  () => choice('¿Qué comando imprime texto en pantalla?', ['echo', 'print', 'cat', 'render'], 'echo', null, 10, 'echo "hola" escribe en stdout.'),
  () => choice('¿Qué comando cuenta líneas, palabras y caracteres?', ['wc', 'count', 'stat', 'num'], 'wc', null, 10, 'wc -l, -w y -c cuentan por separado.'),
  () => truth('El comando history lista los comandos que has ejecutado.', true, 10, 'history muestra el historial del shell.'),
  () => choice('¿Qué comando termina un proceso por su PID?', ['kill', 'stop', 'end', 'halt'], 'kill', null, 10, 'kill <pid> envía señales; kill -9 fuerza el cierre.'),
  () => choice('¿Qué comando busca archivos por su nombre?', ['find', 'cat', 'ls', 'echo'], 'find', null, 10, 'find <ruta> -name "*.py" localiza por nombre.'),
]

export const questionPools = { python: pythonPool, database: databasePool, react: reactPool, git: gitPool, terminal: terminalPool }

function generateQuestions(category, next, count) {
  const pool = questionPools[category] || pythonPool
  return shuffle(pool, next).slice(0, count).map((builder, index) => {
    const question = builder(next)
    return { ...question, id: `${category}-q${index + 1}` }
  })
}

const catalogSeeds = [
  { category: 'python', title: 'Funciones y testing', description: 'Escribe código limpio y valida cada caso en el sandbox.', level: 'beginner', is_exam: false, minutes: 30 },
  { category: 'database', title: 'Consultas SQL que sí escalan', description: 'Practica SELECT, JOIN y GROUP BY con datos de una tienda.', level: 'intermediate', is_exam: true, minutes: 35 },
  { category: 'react', title: 'React: estado sin sorpresas', description: 'Identifica cuándo usar estado, props y efectos.', level: 'intermediate', is_exam: true, minutes: 35 },
  { category: 'git', title: 'Git: historial limpio', description: 'Resuelve situaciones comunes de ramas y commits.', level: 'beginner', is_exam: false, minutes: 30 },
  { category: 'terminal', title: 'Terminal: moverse con intención', description: 'Practica navegación, búsqueda y composición de comandos.', level: 'beginner', is_exam: false, minutes: 25 },
  { category: 'python', title: 'Listas, diccionarios y comprehensions', description: 'Manipula colecciones con técnicas idiomáticas y legibles.', level: 'beginner', is_exam: false, minutes: 35 },
  { category: 'python', title: 'Bucles y control de flujo', description: 'Domina iteraciones, condicionales y estructuras de decisión.', level: 'beginner', is_exam: false, minutes: 40 },
  { category: 'database', title: 'Normalización de tablas', description: 'Diseña esquemas sólidos y elimina redundancias.', level: 'intermediate', is_exam: false, minutes: 45 },
  { category: 'database', title: 'Subconsultas y agregaciones', description: 'Resuelve consultas con filtros anidados y totales.', level: 'intermediate', is_exam: false, minutes: 35 },
  { category: 'react', title: 'Componentes reutilizables', description: 'Construye interfaces con composición y lógica clara.', level: 'intermediate', is_exam: false, minutes: 40 },
  { category: 'react', title: 'Hooks y efectos', description: 'Aprende cuándo usar useState, useMemo y useEffect.', level: 'intermediate', is_exam: false, minutes: 45 },
  { category: 'git', title: 'Ramas y merge', description: 'Gestiona ramas, resuelve conflictos y mantiene el historial limpio.', level: 'beginner', is_exam: false, minutes: 35 },
  { category: 'git', title: 'Rebase interactivo', description: 'Ajusta commits y mejora la narrativa del historial.', level: 'intermediate', is_exam: false, minutes: 40 },
  { category: 'terminal', title: 'Búsqueda y seguimiento', description: 'Usa grep, find y tail para trabajar con grandes proyectos.', level: 'beginner', is_exam: false, minutes: 30 },
  { category: 'terminal', title: 'Automatización básica', description: 'Escribe comandos y scripts para ganar velocidad.', level: 'intermediate', is_exam: false, minutes: 35 },
  { category: 'python', title: 'Módulos y paquetes', description: 'Organiza código en archivos reutilizables y bien estructurados.', level: 'intermediate', is_exam: false, minutes: 40 },
  { category: 'python', title: 'Excepciones y validación', description: 'Controla errores con mensajes con sentido y flujo seguro.', level: 'intermediate', is_exam: false, minutes: 35 },
  { category: 'database', title: 'Índices y rendimiento', description: 'Optimiza consultas para soportar más volumen con menos tiempo.', level: 'advanced', is_exam: false, minutes: 45 },
  { category: 'react', title: 'Rutas y navegación', description: 'Diseña flujo de vistas con enrutado claro y protegido.', level: 'advanced', is_exam: false, minutes: 40 },
  { category: 'git', title: 'Pull requests y revisión', description: 'Trabaja bien con cambios, revisiones y decisiones de equipo.', level: 'intermediate', is_exam: false, minutes: 30 },
  { category: 'terminal', title: 'Pipelines y redirección', description: 'Encadena comandos para automatizar tareas de análisis.', level: 'intermediate', is_exam: false, minutes: 35 },
  { category: 'python', title: 'Programación orientada a objetos', description: 'Modela sistemas con clases, propiedades y encapsulación.', level: 'advanced', is_exam: false, minutes: 50 },
  { category: 'database', title: 'Consultas transaccionales', description: 'Comprende inserciones, backups y consistencia en datos.', level: 'advanced', is_exam: false, minutes: 45 },
  { category: 'react', title: 'Accesibilidad y UX', description: 'Mejora la navegación para usuarios con distintos contextos.', level: 'advanced', is_exam: false, minutes: 35 },
  { category: 'git', title: 'Gestión de incidencias', description: 'Organiza cambios y rastreo de bugs con disciplina.', level: 'beginner', is_exam: false, minutes: 30 },
  { category: 'python', title: 'Tuplas y desempaquetado', description: 'Intercambia datos y lee colecciones con desempaquetado elegante.', level: 'beginner', is_exam: false, minutes: 30 },
  { category: 'python', title: 'Comprensión de listas a fondo', description: 'Transforma colecciones en una sola línea legible.', level: 'intermediate', is_exam: false, minutes: 35 },
  { category: 'python', title: 'Slices y subíndices', description: 'Extrae sub-secuencias y revierte datos con slicing.', level: 'beginner', is_exam: false, minutes: 30 },
  { category: 'python', title: 'Argumentos y kwargs', description: 'Domina *args, **kwargs y los parámetros con defecto.', level: 'intermediate', is_exam: false, minutes: 35 },
  { category: 'python', title: 'Iteradores y generadores', description: 'Procesa flujos de datos de memoria eficiente.', level: 'advanced', is_exam: false, minutes: 45 },
  { category: 'python', title: 'Funciones lambda', description: 'Escribe funciones anónimas cortas y claras.', level: 'intermediate', is_exam: false, minutes: 30 },
  { category: 'python', title: 'Entrada y salida de archivos', description: 'Lee y escribe datos con open() y gestión de contexto.', level: 'intermediate', is_exam: false, minutes: 40 },
  { category: 'python', title: 'Set y operaciones de conjuntos', description: 'Unión, intersección y diferencias sin duplicados.', level: 'beginner', is_exam: false, minutes: 30 },
  { category: 'database', title: 'Claves foráneas en acción', description: 'Modela relaciones y mantén consistencia entre tablas.', level: 'intermediate', is_exam: false, minutes: 40 },
  { category: 'database', title: 'Agrupaciones con HAVING', description: 'Filtra grupos agregados y descubre patrones.', level: 'intermediate', is_exam: false, minutes: 35 },
  { category: 'database', title: 'Consultas anidadas', description: 'Compone subconsultas en SELECT, WHERE y FROM.', level: 'advanced', is_exam: false, minutes: 45 },
  { category: 'database', title: 'Uniones LEFT y RIGHT', description: 'Conserva filas no emparejadas y decide bien el JOIN.', level: 'intermediate', is_exam: false, minutes: 35 },
  { category: 'database', title: 'Optimización con índices', description: 'Acelera filtros y comprensiones de consultas.', level: 'advanced', is_exam: false, minutes: 40 },
  { category: 'database', title: 'Transacciones y rollback', description: 'Garantiza consistencia ante fallos y cambios parciales.', level: 'advanced', is_exam: false, minutes: 45 },
  { category: 'react', title: 'Forms controlados', description: 'Maneja inputs con estado y validación en vivo.', level: 'intermediate', is_exam: false, minutes: 35 },
  { category: 'react', title: 'Lifting state up', description: 'Comparte estado entre componentes hermanos.', level: 'intermediate', is_exam: false, minutes: 35 },
  { category: 'react', title: 'Renderizado condicional', description: 'Muestra y oculta vistas según el estado.', level: 'beginner', is_exam: false, minutes: 30 },
  { category: 'react', title: 'Listas y keys', description: 'Renderiza colecciones con identidad estable.', level: 'beginner', is_exam: false, minutes: 30 },
  { category: 'react', title: 'Context API', description: 'Salta el prop drilling con contexto global.', level: 'advanced', is_exam: false, minutes: 40 },
  { category: 'react', title: 'Memoización', description: 'Evita renders innecesarios con useMemo y React.memo.', level: 'advanced', is_exam: false, minutes: 40 },
  { category: 'react', title: 'Custom hooks', description: 'Extrae lógica reutilizable en hooks propios.', level: 'advanced', is_exam: false, minutes: 45 },
  { category: 'git', title: 'Repositorio remoto', description: 'Clona, enlaza y sincroniza con GitHub.', level: 'beginner', is_exam: false, minutes: 30 },
  { category: 'git', title: 'Git log en profundidad', description: 'Lee historial con formato, filtros y rangos.', level: 'intermediate', is_exam: false, minutes: 30 },
  { category: 'git', title: 'Restablecer y revertir', description: 'Deshaz cambios de forma segura en cualquier escenario.', level: 'advanced', is_exam: false, minutes: 35 },
  { category: 'git', title: 'Tags y versiones', description: 'Marca releases y navega por versiones estables.', level: 'beginner', is_exam: false, minutes: 25 },
  { category: 'git', title: 'Bisect y depuración', description: 'Encuentra el commit que rompió tu código.', level: 'advanced', is_exam: false, minutes: 40 },
  { category: 'terminal', title: 'Permisos y propietarios', description: 'Entiende rwx, chmod y chown con claridad.', level: 'intermediate', is_exam: false, minutes: 30 },
  { category: 'terminal', title: 'Variables de entorno', description: 'Exporta, hereda y protege configuraciones.', level: 'intermediate', is_exam: false, minutes: 25 },
  { category: 'terminal', title: 'Procesos y señales', description: 'Administra tareas en segundo plano y su ciclo de vida.', level: 'advanced', is_exam: false, minutes: 35 },
  { category: 'terminal', title: 'Redirección de errores', description: 'Dirige stdout y stderr a donde los necesites.', level: 'intermediate', is_exam: false, minutes: 25 },
  { category: 'terminal', title: 'Crontab y tareas', description: 'Programa trabajos recurrentes en el servidor.', level: 'advanced', is_exam: false, minutes: 30 },
  { category: 'terminal', title: 'Compresión con tar', description: 'Empaqueta y comprime proyectos completos.', level: 'beginner', is_exam: false, minutes: 25 },
]

export function buildDemoCatalog() {
  const next = rand(new Date().getTime() % 2147483647)
  return catalogSeeds.map((seed, index) => {
    const meta = categoryMeta[seed.category]
    const isExam = Boolean(seed.is_exam)
    const questions = generateQuestions(seed.category, next, isExam ? 6 : 5)
    const minutes = (seed.minutes || meta.minutes) + (isExam ? 5 : 0)
    const points = questions.reduce((sum, question) => sum + Number(question.points || 10), 0)
    return {
      id: `demo-${index + 1}`,
      category: seed.category,
      subject: meta.subject,
      title: seed.title,
      description: seed.description,
      time: `${minutes} min`,
      time_limit_minutes: minutes,
      points,
      progress: null,
      level: seed.level,
      programming_language: meta.programming_language,
      is_exam: isExam,
      passing_score: 60,
      questions,
    }
  })
}