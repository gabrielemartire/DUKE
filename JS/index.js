const zoomButton = document.getElementById('zoom');
const input = document.getElementById('inputFile');
const openFile = document.getElementById('openPDF');
const currentPage = document.getElementById('current_page');
const viewer = document.querySelector('.pdf-viewer');
const searchResults = document.getElementById('search-results');
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
    console.log(wordsToSearch);
    // Ora l'array wordsToSearch è popolato con le parole inserite nel modal
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
		//document.getElementById('btn-import-pdf').classList.add("hidden");
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
			var regex = new RegExp(word, 'gi'); // 'gi' flag for global and case-insensitive search
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
	let resultsHTML = '<ul>';
	currentPDF.foundElements.forEach((element) => {
		resultsHTML += `<li>${element.word}: ${element.count}</li>`;
	});
	resultsHTML += '</ul>';
	searchResults.innerHTML = resultsHTML;
	renderCurrentPage(); // Optional: To render the first page after processing all pages
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

		// Render the page
		page.render(renderContext);

		currentPage.innerHTML = currentPDF.currentPage + ' of ' + currentPDF.countOfPages;
	});
}
