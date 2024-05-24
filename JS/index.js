const zoomButton = document.getElementById('zoom');
const input = document.getElementById('inputFile');
const openFile = document.getElementById('openPDF');
const currentPage = document.getElementById('current_page');
const viewer = document.querySelector('.pdf-viewer');
const searchResults = document.getElementById('search-results');
let currentPDF = {}

function resetCurrentPDF() {
	currentPDF = {
		file: null,
		countOfPages: 0,
		currentPage: 1,
		zoom: 0.25 // Ridimensiona il PDF a un quarto della pagina
	}
}

openFile.addEventListener('click', () => {
	input.click();
});

input.addEventListener('change', event => {
	const inputFile = event.target.files[0];
	if (inputFile.type == 'application/pdf') {
		const reader = new FileReader();
		reader.readAsDataURL(inputFile);
		reader.onload = () => {
			loadPDF(reader.result);
			zoomButton.disabled = false;
		}
	}
	else {
		alert("Il file che stai cercando di aprire non è un file PDF!")
	}
});


zoomButton.addEventListener('input', () => {
	if (currentPDF.file) {
		document.getElementById('zoomValue').innerHTML = zoomButton.value + "%";
		currentPDF.zoom = parseInt(zoomButton.value) / 100;
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

document.getElementById('previous').addEventListener('click', () => {
	const isValidPage = currentPDF.currentPage - 1 > 0;
	if (isValidPage) {
		currentPDF.currentPage -= 1;
		renderCurrentPage();
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
		renderCurrentPage();
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

        // Render the page
        page.render(renderContext);

        // Get the text content of the page
        page.getTextContent().then((textContent) => {
            // Convert textContent.items to a string
            var pageText = textContent.items.map(function (item) {
                return item.str;
            }).join(' ');

            // List of words to search for
            var wordsToSearch = ['stelle', 'asd', 'paperino'];
            var foundElements = [];

            // Check if any of the words exist on the page
            wordsToSearch.forEach((word) => {
                var regex = new RegExp(word, 'gi'); // 'gi' flag for global and case-insensitive search
                var matches = pageText.match(regex);
                if (matches) {
                    foundElements.push({ word, count: matches.length });
                }
            });

            // Display search results
            let resultsHTML = '<ul>';
            foundElements.forEach((element) => {
                resultsHTML += `<li>${element.word}: ${element.count}</li>`;
            });
            resultsHTML += '</ul>';
            searchResults.innerHTML = resultsHTML;
        });
    });

    currentPage.innerHTML = currentPDF.currentPage + ' of ' + currentPDF.countOfPages;
}
