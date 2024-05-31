const input = document.getElementById('inputFile');
const openFile = document.getElementById('openPDF');
const currentPage = document.getElementById('current_page');
const viewer = document.querySelector('.pdf-viewer');
const searchResults = document.getElementById('search-results');
const searchAgainButton = document.getElementById('search-again');
const pageToStartSearch = document.getElementById('page-to-start-search');
const caseSensitiveSearchCheckbox = document.getElementById('case-sensitive-search');
const displayPagesCheckbox = document.getElementById('display-pages');
const displaySdgGriClm = document.getElementById('allow-Sdg-Gri');

let currentPDF = {};
let wordsToSearch = [];
let startPage = 1;
let pdfImportedStatus = false

const sdgMapping = {
    "2-7": [" SDG 8", " SDG 10"],
    "2-8": [" SDG 8"],
    "2-9": [" SDG 5", " SDG 16"],
    "2-10": [" SDG 5", " SDG 16"],
    "2-11": [" SDG 16"],
    "2-12": [" SDG 16"],
    "2-15": [" SDG 16"],
    "2-23": [" SDG 16"],
    "2-26": [" SDG 16"],
    "2-30": [" SDG 8"],
    "201-1": [" SDG 8", " SDG 9"],
    "201-2": [" SDG 13"],
    "202-1": [" SDG 1", " SDG 5", " SDG 8"],
    "202-2": [" SDG 8"],
    "203-1": [" SDG 5", " SDG 9", " SDG 11"],
    "203-2": [" SDG 1", " SDG 3", " SDG 8"],
    "204-1": [" SDG 8"],
    "205-1": [" SDG 16"],
    "205-2": [" SDG 16"],
    "205-3": [" SDG 16"],
    "206-1": [" SDG 16"],
    "207-1": [" SDG 1", " SDG 10", " SDG 17"],
    "207-2": [" SDG 1", " SDG 10", " SDG 17"],
    "207-3": [" SDG 1", " SDG 10", " SDG 17"],
    "207-4": [" SDG 1", " SDG 10", " SDG 17"],
    "301-1": [" SDG 8", " SDG 12"],
    "301-2": [" SDG 8", " SDG 12"],
    "301-3": [" SDG 8", " SDG 12"],
    "302-1": [" SDG 7", " SDG 8", " SDG 12", " SDG 13"],
    "302-2": [" SDG 7", " SDG 8", " SDG 12", " SDG 13"],
    "302-3": [" SDG 7", " SDG 8", " SDG 12", " SDG 13"],
    "302-4": [" SDG 7", " SDG 8", " SDG 12", " SDG 13"],
    "302-5": [" SDG 7", " SDG 8", " SDG 12", " SDG 13"],
    "303-1": [" SDG 6", " SDG 12"],
    "303-2": [" SDG 6"],
    "303-3": [" SDG 6"],
    "303-4": [" SDG 6"],
    "303-5": [" SDG 6"],
    "304-1": [" SDG 6", " SDG 14", " SDG 15"],
    "304-2": [" SDG 6", " SDG 14", " SDG 15"],
    "304-3": [" SDG 15", " SDG 6", " SDG 14"],
    "304-4": [" SDG 6", " SDG 14", " SDG 15"],
    "305-1": [" SDG 3", " SDG 12", " SDG 13", " SDG 14", " SDG 15"],
    "305-2": [" SDG 3", " SDG 12", " SDG 13", " SDG 14", " SDG 15"],
    "305-3": [" SDG 3", " SDG 12", " SDG 13", " SDG 14", " SDG 15"],
    "305-4": [" SDG 13", " SDG 14", " SDG 15"],
    "305-5": [" SDG 13", " SDG 14", " SDG 15"],
    "305-6": [" SDG 3", " SDG 12"],
    "305-7": [" SDG 3", " SDG 12", " SDG 14", " SDG 15"],
    "306-1": [" SDG 3", " SDG 6", " SDG 11", " SDG 12"],
    "306-2": [" SDG 3", " SDG 6", " SDG 8", " SDG 11", " SDG 12"],
    "306-3": [" SDG 3", " SDG 6", " SDG 11", " SDG 12", " SDG 15"],
    "306-4": [" SDG 3", " SDG 11", " SDG 12"],
    "306-5": [" SDG 3", " SDG 6", " SDG 11", " SDG 12", " SDG 15"],
    "307-1": [" SDG 16"],
    "401-1": [" SDG 5", " SDG 8", " SDG 10"],
    "401-2": [" SDG 5", " SDG 3", " SDG 8"],
    "401-3": [" SDG 5", " SDG 8"],
    "402-1": [" SDG 8"],
    "403-1": [" SDG 8"],
    "403-10": [" SDG 3", " SDG 8", " SDG 16"],
    "403-2": [" SDG 8"],
    "403-3": [" SDG 8"],
    "403-4": [" SDG 8", " SDG 16"],
    "403-5": [" SDG 8"],
    "403-6": [" SDG 3"],
    "403-7": [" SDG 8"],
    "403-8": [" SDG 8"],
    "403-9": [" SDG 8", " SDG 3", " SDG 16"],
    "404-1": [" SDG 4", " SDG 8", " SDG 10"],
    "404-2": [" SDG 8"],
    "404-3": [" SDG 5", " SDG 8", " SDG 10"],
    "405-1": [" SDG 5", " SDG 8"],
    "405-2": [" SDG 5", " SDG 10", " SDG 8"],
    "406-1": [" SDG 5", " SDG 8"],
    "407-1": [" SDG 8"],
    "408-1": [" SDG 8", " SDG 16", " SDG 5"],
    "409-1": [" SDG 8", " SDG 5"],
    "410-1": [" SDG 16"],
    "411-1": [" SDG 2"],
    "413-2": [" SDG 1", " SDG 2"],
    "414-1": [" SDG 5", " SDG 8", " SDG 16"],
    "414-2": [" SDG 5", " SDG 8", " SDG 16"],
    "415-1": [" SDG 16"],
    "416-2": [" SDG 16"],
    "417-1": [" SDG 12"],
    "417-2": [" SDG 16"],
    "417-3": [" SDG 16"],
    "418-1": [" SDG 16"],
    "419-1": [" SDG 16"]
}


function resetCurrentPDF() {
    currentPDF = {
        file: null,
        countOfPages: 0,
        currentPage: 1,
        zoom: 1.2,
        foundElements: []
    }
}

openFile.addEventListener('click', () => {
    const keywordsInput = document.getElementById('keywords-text-area').value;
    wordsToSearch = keywordsInput.split(',').map(keyword => keyword.trim());
    startPage = parseInt(pageToStartSearch.value) || 1;
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
        alert("Il file che stai cercando di aprire non è un file PDF!");
    }
});

function loadPDF(data) {
    const pdfFile = pdfjsLib.getDocument(data);
    resetCurrentPDF();
    pdfFile.promise.then((doc) => {
        currentPDF.file = doc;
        currentPDF.countOfPages = doc.numPages;
        viewer.classList.remove('hidden');
        document.querySelector('main h3').classList.add("hidden");
        const toolPdfBtnsDiv = document.getElementById('tool-pdf-btns-div')
        toolPdfBtnsDiv.classList.remove("hidden");
        document.getElementById('navbar-collapse-btn').classList.add("navbar-collapse-animation");
        processAllPages();
    });
}

function processAllPages() {
    let pagePromises = [];
    for (let i = startPage; i <= currentPDF.countOfPages; i++) {
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
            var regexFlags = caseSensitiveSearchCheckbox.checked ? 'g' : 'gi';
            var regexPattern = `\\b${word}\\b`; // only whole Word Search
            var regex = new RegExp(regexPattern, regexFlags);
            var matches = pageText.match(regex);
            if (matches) { 
                //true se trova la parola nel PDF
                //foundElements contiene gli elementi trovati fin ora
                let foundElement = currentPDF.foundElements.find(element => element.word === word);
                //find scorre ogni element del pdf e controlla se la sua word corrisponda alla specifica word ceh ci interessa
                if (foundElement) {
                    foundElement.count += matches.length;
                    foundElement.pages.push(page.pageNumber);
                } else {
                    let sdg = sdgMapping[word] || "N/A";
                    // se non trovo l'elemento tra la lista di quelli gia' creati, allora creo un nuovo risultato in foundElements
                    currentPDF.foundElements.push({ word, count: matches.length, pages: [page.pageNumber], sdg });
                }
            }
        });
    });
}


function displaySearchResults() {
    let resultsHTML = '<table class="table">';
    resultsHTML += '<thead><tr><th>Keyword</th><th>Count</th>';
    if (displayPagesCheckbox.checked) {
        resultsHTML += '<th>Pages</th>';
    }
    if (displaySdgGriClm.checked) {
        resultsHTML += '<th>SDG</th></tr></thead><tbody>';
    } else {
    resultsHTML += '</tr></thead><tbody>';
    }
    currentPDF.foundElements.forEach((element) => {
        resultsHTML += `<tr><td>${element.word}</td><td>${element.count}</td>`;
        if (displayPagesCheckbox.checked) {
            // resultsHTML += `<td>${element.pages.join(', ')}</td>`;
            // creare un pulsante per ogni pagina
            console.log(element.pages)
            resultsHTML += `<td>`;
            element.pages.sort().forEach(page => {
                console.log(page)
                resultsHTML += `<a type="button" id="page-${page}" href="#scrollspyHeading4" class="btn btn-outline-secondary" style="margin: 2px;">${page}</a>`;
            }); 
            resultsHTML += `</td>`;
        }
        console.log(displaySdgGriClm.checked)
        if (displaySdgGriClm.checked) { resultsHTML += `<td>${element.sdg}</td></tr>` } else {}
    });

    resultsHTML += '</tbody></table>';
    searchResults.innerHTML = resultsHTML;
    //searchResults.innerHTML += '<button id="search-again" class="btn btn-dark mt-3"><i class="fa-solid fa-repeat"></i> Cerca di nuovo sullo stesso PDF</button>';
    renderCurrentPage();

    //document.getElementById('search-again').addEventListener('click', () => {
    //   const keywordsInput = prompt('Inserisci nuove parole chiave separate da virgola:');
    //   if (keywordsInput) {
    //       wordsToSearch = keywordsInput.split(',').map(keyword => keyword.trim());
    //       currentPDF.foundElements = [];
    //       startPage = parseInt(prompt('Inserisci il numero della pagina da cui iniziare la ricerca:', '1')) || 1;
    //       processAllPages();
    //   }
    //);
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

//andare alla pagina relativa al pulsante premuto
document.getElementById('search-results').addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
        currentPDF.currentPage = parseInt(event.target.textContent);
        renderCurrentPage();
    }
});

document.getElementById('next').addEventListener('click', () => {
	const isValidPage = currentPDF.currentPage < currentPDF.countOfPages;
	if (isValidPage) {
        currentPDF.currentPage += 1;
		renderCurrentPage();
	}
});

document.getElementById('prev').addEventListener('click', () => {
	const isValidPage = currentPDF.currentPage < currentPDF.countOfPages;
	if (isValidPage) {
		currentPDF.currentPage -= 1;
		renderCurrentPage();
	}
});