let leite = 0;
let pao = 0;
let abacate = 0;

//Parte 1 - Funçoes sem argumento

function inicializarCompras() {
  leite = 0;
  pao = 0;
  abacate = 0;
}

function comprarLeite() {
  leite++;
}

function comprarPao() {
  pao++;
}

function comprarAbacate() {
  abacate++;
}

function calcularQuantidadeTotal() {
  return leite + pao + abacate;
}

function mostrarLista() {
  console.log("Pao:" + pao);
  console.log("Leite:" + leite);
  console.log("Abacate:" + abacate);
}

//Parte 2 - Função com argumento

function comprarLeites(quantidade) {
  leite += quantidade;
}

function comprarPaes(quantidade) {
  pao += quantidade;
}

function comprarAbacates(quantidade) {
  abacate += quantidade;
}

//Parte 3 - Função com multiplos argumentos

function comprarItens(quantidadePaes, quantidadeLeites, quantidadeAbacates) {
  leite += quantidadeLeites;
  pao += quantidadePaes;
  abacate += quantidadeAbacates;
}

//Uso

inicializarCompras();
let preco = calcularQuantidadeTotal();
let count = 0;
console.log("Valor " + count++ + ": = " + preco);
mostrarLista();

comprarLeite();
comprarPao();
comprarAbacate();

console.log("Valor " + count++ + ": = " + calcularQuantidadeTotal());
mostrarLista();

inicializarCompras();
comprarLeites(10);
console.log("Valor " + count++ + ": = " + calcularQuantidadeTotal());
mostrarLista();

inicializarCompras();
comprarItens(10, 10, 10);
console.log("Valor " + count++ + ": = " + calcularQuantidadeTotal());
mostrarLista();

inicializarCompras();
