const zoomButton = document.getElementById('zoom');
const input = document.getElementById('inputFile');
const openFile = document.getElementById('openPDF');
const currentPage = document.getElementById('current_page');
const viewer = document.querySelector('.pdf-viewer');
const searchResults = document.getElementById('search-results');
const searchAgainButton = document.getElementById('search-again');
let currentPDF = {};
let wordsToSearch = [];

function resetCurrentPDF() {
    currentPDF = {
        file: null,
        countOfPages: 0,
        currentPage: 1,
        zoom: 0.5,
        foundElements: []
    }
}

openFile.addEventListener('click', () => {
    const keywordsInput = document.getElementById('exampleFormControlTextarea1').value;
    wordsToSearch = keywordsInput.split(',').map(keyword => keyword.trim());
    input.click();
});

input.addEventListener('change', event => {
    const inputFile = event.target.files[0];
    if (inputFile.type === 'application/pdf') {
        const reader = new FileReader();
        reader.readAsDataURL(inputFile);
        reader.onload = () => {
            loadPDF(reader.result);
            zoomButton.disabled = false;
        }
    } else {
        alert("Il file che stai cercando di aprire non è un file PDF!")
    }
});

function loadPDF(data) {
    const pdfFile = pdfjsLib.getDocument(data);
    resetCurrentPDF();
    pdfFile.promise.then((doc) => {
        currentPDF.file = doc;
        currentPDF.countOfPages = doc.numPages;
        viewer.classList.remove('hidden');
        processAllPages();
    });
}

function processAllPages() {
    let pagePromises = [];
    for (let i = 1; i <= currentPDF.countOfPages; i++) {
        pagePromises.push(currentPDF.file.getPage(i).then(processPage));
    }
    Promise.all(pagePromises).then(() => {
        displaySearchResults();
    });
}

function processPage(page) {
    return page.getTextContent().then((textContent) => {
        var pageText = textContent.items.map(function (item) {
            return item.str;
        }).join(' ');

        wordsToSearch.forEach((word) => {
            var regex = new RegExp(word, 'gi');
            var matches = pageText.match(regex);
            if (matches) {
                let foundElement = currentPDF.foundElements.find(element => element.word === word);
                if (foundElement) {
                    foundElement.count += matches.length;
                } else {
                    currentPDF.foundElements.push({ word, count: matches.length });
                }
            }
        });
    });
}

function displaySearchResults() {
    let resultsHTML = '<ul class="list-group">';
    currentPDF.foundElements.forEach((element) => {
        resultsHTML += `<li class="list-group-item">${element.word}: ${element.count}</li>`;
    });
    resultsHTML += '</ul>';
    searchResults.innerHTML = resultsHTML;
    searchResults.innerHTML += '<button id="search-again" class="btn btn-dark mt-3"><i class="fa-solid fa-repeat"></i> Cerca di nuovo</button>';
    renderCurrentPage();

    document.getElementById('search-again').addEventListener('click', () => {
        const keywordsInput = prompt('Inserisci nuove parole chiave separate da virgola:');
        if (keywordsInput) {
            wordsToSearch = keywordsInput.split(',').map(keyword => keyword.trim());
            currentPDF.foundElements = [];
            processAllPages();
        }
    });
}

function renderCurrentPage() {
    currentPDF.file.getPage(currentPDF.currentPage).then((page) => {
        var context = viewer.getContext('2d');
        var viewport = page.getViewport({ scale: currentPDF.zoom });
        viewer.height = viewport.height;
        viewer.width = viewport.width;

        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        page.render(renderContext);

        currentPage.innerHTML = currentPDF.currentPage + ' of ' + currentPDF.countOfPages;
    });
}
