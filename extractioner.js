const fs = require('fs');
const pdf = require('pdf-parse');

// Funzione per estrarre il testo da un PDF
async function extractTextFromPDF(pdfPath) {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    return data.text;
}

// Funzione per cercare le parole in un testo
function searchWordsInText(text, words) {
    const wordArray = words.split(',');
    const foundWords = {};

    wordArray.forEach(word => {
        const regex = new RegExp(`\\b${word.trim()}\\b`, 'gi');
        const matches = text.match(regex);
        const count = matches ? matches.length : 0;
        if (count > 0) {
            foundWords[word.trim()] = count;
        }
    });

    return foundWords;
}

// Funzione principale
async function main() {
    const pdfPath = 'C:/Users/Gabri/Desktop/apple.pdf'; // Percorso corretto al file PDF
    const words = 'AIoT, voice control, smart';

    console.log('Nome del file:', pdfPath);

    try {
        const text = await extractTextFromPDF(pdfPath);
        const result = searchWordsInText(text, words);
        console.log('Parole trovate:', result);
    } catch (error) {
        console.error('Errore durante l\'estrazione del testo o la ricerca delle parole:', error);
    }
}

main();
