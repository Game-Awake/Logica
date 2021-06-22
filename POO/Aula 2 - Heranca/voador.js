class AnimalVoador extends Animal {
  constructor(nome) {
    super(nome);
  }

  voar() {
    this.voou++;
    console.log("Eu estou voando");
  }

  informacoes() {
    console.log("NOVA INFORMAÇÂO");
  }
}
