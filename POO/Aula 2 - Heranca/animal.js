class Animal {
  constructor(nome) {
    this.nome = nome;
    this.comeu = 0;
    this.andou = 0;
  }

  comer() {
    this.comeu++;
    console.log("Comeu");
  }
  andar() {
    this.andou++;
    console.log("Andou");
  }

  informacoes() {
    console.log("==========INFO==================");
    console.log(`Animal: ${this.nome}`);
    console.log(`Comeu: ${this.comeu} vezes`);
    console.log(`Andou: ${this.andou} vezes`);
    console.log("================================");
  }
}
