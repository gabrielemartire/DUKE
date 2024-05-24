document.getElementById('searchButton').addEventListener('click', async () => {
  const fileInput = document.getElementById('fileInput').files[0];
  const wordsInput = document.getElementById('wordsInput').value;
  const resultsElement = document.getElementById('results');
  resultsElement.innerHTML = '';

  if (!fileInput || !wordsInput) {
      alert('Please select a PDF file and enter words to search.');
      return;
  }

  const words = wordsInput.split(',').map(word => word.trim());
  const arrayBuffer = await fileInput.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
  let pdfText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      textContent.items.forEach(item => {
          pdfText += item.str + ' ';
      });
  }

  const foundWords = words.filter(word => pdfText.includes(word));

  foundWords.forEach(word => {
      const li = document.createElement('li');
      li.textContent = word;
      resultsElement.appendChild(li);
  });
});
