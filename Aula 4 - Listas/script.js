let exemploArray = ["pão", "leite", "manteiga", "abacate"];

let exemploMatrix = [
  ["pão", "leite", "abacate"],
  ["pão", "leite", "manteiga", "abacate"],
  ["leite", "abacate"],
];

let itemDeCompra = {
  item: "pão",
  quantidade: 1,
  valor: 0.5,
  foicomprado: false,
};

let infoCompra = [
  {
    item: "pão",
    quantidade: 1,
    valor: 0.5,
  },
  {
    item: "leite",
    quantidade: 1,
    valor: 1.5,
  },
  {
    item: "manteiga",
    quantidade: 1,
    valor: 3,
  },
  {
    item: "abacate",
    quantidade: 1,
    valor: 5,
  },
];

console.log("Iniciando a lista de compras");

//Escrevendo Array
for (let index = 0; index < exemploArray.length; index++) {
  const element = exemploArray[index];
  console.log(element);
}

console.log("Escrevendo a matriz");
//Escrevendo Matrix
for (let compra = 0; compra < exemploMatrix.length; compra++) {
  const element = exemploMatrix[compra];

  for (let items = 0; items < element.length; items++) {
    const element = exemploMatrix[compra][items];
    console.log(element);
  }
}

console.log("Escrevendo os objetos");

//Utilizando lista de objetos
let items = "Vamos comprar ";
let preco = 0;
for (let index = 0; index < infoCompra.length; index++) {
  const element = infoCompra[index];

  items = items + (element.item + ","); //concatenando string
  preco = preco + element.quantidade * element.valor;
}

console.log(items);
console.log(preco);
