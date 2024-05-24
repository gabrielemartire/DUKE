const inputFile = document.getElementById('fileInput');
const textBox = document.getElementById('searchText');
const submitButton = document.getElementById('submitButton');
const resultsContainer = document.getElementById('searchResults');

submitButton.addEventListener('click', () => {
  if (inputFile.files.length === 0 || !textBox.value) {
    alert('Seleziona un file PDF e inserisci le parole da cercare');
    return;
  }

  const file = inputFile.files[0];
  const searchText = textBox.value;

  // Caricare e analizzare il file PDF utilizzando PDF.js
  PDFJS.getDocument({ data: file }).promise.then(pdf => {
    let allPagesText = '';

    // Estrarre il testo da tutte le pagine del PDF
    const promises = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      promises.push(pdf.getPage(i).then(page => page.getTextContent()));
    }

    Promise.all(promises).then(pageTexts => {
      pageTexts.forEach(text => {
        allPagesText += text;
      });

      // Cercare le parole chiave nel testo estratto
      const searchResults = [];
      const re = new RegExp(searchText, 'gi');
      const matches = allPagesText.matchAll(re);
      for (const match of matches) {
        searchResults.push({
          page: match.index / allPagesText.length * 100 + 1, // Calcola il numero di pagina approssimativo
          text: match[0],
        });
      }

      // Visualizzare i risultati di ricerca
      resultsContainer.innerHTML = '';
      searchResults.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.innerHTML = `Pagina: ${result.page} - Testo: ${result.text}`;
        resultsContainer.appendChild(resultElement);
      });
    });
  });
});
