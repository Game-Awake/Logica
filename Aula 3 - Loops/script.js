let tabuada = 2;
let maximo = 10;

// Usando o Loop For
console.log("Loop For");
for (let atual = 0; atual <= maximo; atual++) {
  let valor = tabuada * atual;

  console.log(tabuada + " X " + atual + " = " + valor);
}

// Diferença do While e Do While é o momento da comparação

// Usando o Loop While
console.log("Loop While");
let atual = 0;
while (atual > maximo + 1) {
  let valor = tabuada * atual;

  console.log(tabuada + " X " + atual + " = " + valor);

  // incrementar o contador
  atual = atual + 1;
}

// Usando o Loop Do While
atual = 0;
console.log("Loop Do While");
do {
  let valor = tabuada * atual;

  console.log(tabuada + " X " + atual + " = " + valor);

  // incrementar o contador
  atual = atual + 1;
} while (atual > maximo + 1);
