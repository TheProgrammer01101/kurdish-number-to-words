// ---------- DOM references ----------
const readBtn = document.querySelector('button');
const inputElement = document.querySelector('input');
const outputElement = document.querySelector('p');

// ---------- Vocabulary ----------
const numbers = {
    ones: ['', 'یەک', 'دوو', 'سێ', 'چوار', 'پێنج', 'شەش', 'حەوت', 'هەشت', 'نۆ'],
    teens: ['دە', 'یانزە', 'دوانزە', 'سیانزە', 'چواردە', 'پانزە', 'شانزە', 'حەڤە', 'هەژدە', 'نۆزدە'],
    tens: ['', '', 'بیست', 'سی', 'چل', 'پەنجا', 'شەست', 'حەفتا', 'هەشتا', 'نەوە']
};

// Scale words used above 99, largest first. Driven by data instead of
// five near-identical functions (converHundreds/Thousands/Million/...).
const scales = [
    { value: 1000000000000n, word: 'ترلیۆن' },
    { value: 1000000000n,    word: 'ملیار'  },
    { value: 1000000n,       word: 'ملیۆن'  },
    { value: 1000n,          word: 'هەزار'  },
    { value: 100n,           word: 'سەد'    },
];

// ---------- Text conversion (recursive) ----------

function convertBelowHundred(n) {
    if (n < 10n) return numbers.ones[Number(n)];
    if (n < 20n) return numbers.teens[Number(n) - 10];
    const tensPart = numbers.tens[Number(n / 10n)];
    const onesPart = n % 10n;
    return onesPart === 0n ? tensPart : `${tensPart} و ${numbers.ones[Number(onesPart)]}`;
}

// Recursively converts a non-negative BigInt into Kurdish words.
// Handles any scale in `scales` without needing a separate function per scale.
function convertMagnitude(n) {
    if (n < 100n) return convertBelowHundred(n);

    for (const { value, word } of scales) {
        if (n >= value) {
            const count = n / value;
            const remainder = n % value;

            // "یەک سەد" isn't idiomatic for 100-199; omit the leading "یەک".
            const countWord = count === 1n ? '' : convertMagnitude(count) + ' ';
            const remainderWord = remainder === 0n ? '' : ' و ' + convertMagnitude(remainder);

            return `${countWord}${word}${remainderWord}`;
        }
    }
}

function convertToWords(rawInput) {
    const isNegative = rawInput.trim().startsWith('-');
    const digitsOnly = rawInput.replace('-', '');

    if (digitsOnly === '' || digitsOnly === '0') return 'سفر';
    if (digitsOnly.length >= 16) return 'لە 15 ژمارە زیاتر ناکات.';

    const words = convertMagnitude(BigInt(digitsOnly));
    return isNegative ? 'سالب ' + words : words;
}

inputElement.addEventListener('input', (e) => {
    outputElement.innerHTML = 'ئەنجام: ' + convertToWords(e.target.value || '0');
});

// ---------- Audio playback ----------

// Wraps a single audio file in a Promise that resolves when playback ends,
// so sequences can be played with a plain loop instead of nested callbacks.
function playAudio(token) {
    return new Promise((resolve, reject) => {
        const audio = new Audio(`audio/${token}.m4a`);
        audio.addEventListener('ended', () => resolve(), { once: true });
        audio.addEventListener('error', reject, { once: true });
        audio.play();
    });
}

async function speakSequence(tokens) {
    for (const token of tokens) {
        await playAudio(token);
    }
}

// Builds the list of audio tokens to play for a number 0-99.
function buildTensTokens(number) {
    if (number < 20) return [number];
    if (number % 10 === 0) return [number];
    return [Math.floor(number / 10) * 10, 'و', number % 10];
}

// Builds the list of audio tokens to play for a number 0-999
// (input is capped at 3 digits by the click handler below).
function buildTokens(number) {
    if (number > 99) {
        const tokens = [];
        if (number <= 199) {
            tokens.push(100);
        } else {
            tokens.push(Math.floor(number / 100), 100);
        }
        if (number % 100 !== 0) {
            tokens.push('و', ...buildTensTokens(number % 100));
        }
        return tokens;
    }
    return buildTensTokens(number);
}

readBtn.addEventListener('click', () => {
    const raw = inputElement.value;
    const number = Number(raw);

    if (number < 0) {
        alert('پشتگیری ژمارەی نێگەتڤ ناکات.');
    } else if (raw.length > 3) {
        alert('لە 3 ژمارە زیاتر ناخوێنێتەوە.');
    } else {
        speakSequence(buildTokens(number)).catch((err) => {
            console.error('Audio playback failed:', err);
        });
    }
});