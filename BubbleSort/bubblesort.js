let vetor = [3,1,2];

for(let i=0;i<vetor.length-1;i++) {
    for(let j=i+1;j<vetor.length;j++) {
        if(vetor[i] > vetor[j]) {
            let temp = vetor[i];
            vetor[i] = vetor[j];
            vetor[j] = temp;
        }
    }
}