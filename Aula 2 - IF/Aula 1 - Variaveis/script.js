//condições
let paes_comprados = 1;
let devocomprar = true;

devocomprar = paes_comprados < 3;
console.log(devocomprar);

// items a comprar
let pao = 1;
let leite = 2;
let abacate = 1;

let itemsdacompra = leite + abacate;

console.log("----Antes do condicional---");
console.log(itemsdacompra);

if (devocomprar) {
  itemsdacompra = itemsdacompra + pao;
  console.log("Compramos pão");
  console.log("Agora temos " + itemsdacompra + " items");
} else {
  console.log("Já tinha pão");
}
