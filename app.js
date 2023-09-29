let readBtn = document.querySelector('button');
let audio;
let inputElement = document.querySelector('input');
let outputElement = document.querySelector('p');
let numbers = {
    ones: ['', 'یەک', 'دوو', 'سێ', 'چوار', 'پێنج', 'شەش', 'حەوت', 'هەشت', 'نۆ'],
    teens: ['دە', 'یانزە', 'دوانزە', 'سیانزە' ,'چواردە' ,'پانزە' ,'شانزە', 'حەڤە', 'هەژدە', 'نۆزدە'],
    tens: ['','','بیست','سی','چل','پەنجا','شەست','حەفتا','هەشتا','نەوە']
}

inputElement.addEventListener('input', (e) => {
    outputElement.innerHTML = "ئەنجام: " + convertToWords(e.target.value);
});

readBtn.addEventListener('click', ()=> {
    let number = inputElement.value;
    if(number < 0) 
        alert ('پشتگیری ژمارەی نێگەتڤ ناکات.');
    else if(number.length > 3)
        alert ('لە 3 ژمارە زیاتر ناخوێنێتەوە.');
    else {
        readNumber(number);
    }
});

function playAudio(number) {
    audio = new Audio(`audio/${number}.m4a`);
    audio.play();
}

function readTens(number) {
    if (number < 20) { 
        playAudio(number);
    } 
    else if(number > 19) {
        if(number % 10 != 0) {
            playAudio(Math.floor(number / 10) * 10);
            audio.addEventListener('ended', ()=> {
                playAudio('و');
                audio.addEventListener('ended', ()=> {
                    playAudio(number % 10);
                })
            })
        } else {
            playAudio(number)   
        }
    }
}
function readNumber(number) {
    if(number > 99) {
        if(number <= 199) {
            playAudio(100);
            audio.addEventListener('ended', ()=> {
                if(number % 100 != 0) {
                    playAudio('و');
                    audio.addEventListener('ended', () => {
                        readTens(number % 100);
                    })
                }
            })
        }
        else {
            playAudio(Math.floor(number / 100));
            audio.addEventListener('ended', ()=> {
                playAudio(100);
                audio.addEventListener('ended', ()=> {
                    if(number % 100 != 0) {
                        playAudio('و');
                        audio.addEventListener('ended', () => {
                            readTens(number % 100);
                        })
                    }
                })
            })
        }    
    } else {
        readTens(number);
    }
 }

function convertToWords(number) {
    if(number == 0)
        return 'سفر';
    if(number < 0) 
        return 'سالب ' + converTrillion(Math.abs(number));
    else if(number.length >= 16)
        return 'لە 15 ژمارە زیاتر ناکات.'
    else 
        return converTrillion(number);
    
    function convertTens(number) {
        if(number < 10)
            return numbers.ones[number];
        else if(number >= 10 && number < 20) 
            return numbers.teens[number - 10];
        else if(number >= 20) 
            if(number % 10 != 0)
                return numbers.tens[Math.floor(number / 10)] + ' و ' + numbers.ones[number % 10];
            else 
                return numbers.tens[Math.floor(number / 10)];
        else 
            return undefined;
    }
    function converHundreds(number) {
        if(number > 99)
            if(number < 200)
                return 'سەد' + (number % 100 == 0 ? '' : ' و ') + convertTens(number % 100);
            else
                return convertTens(Math.floor(number / 100)) + ' سەد ' + (number % 100 == 0 ? '' : ' و ') + convertTens((number % 100));
        else 
            return convertTens(number);
    }
    function converThousands(number) {
        if(number > 999)
            if(number < 2000)
                return 'هەزار' + (number % 1000 == 0 ? '' : ' و ') + converHundreds(number % 1000);
            else
                return converHundreds(Math.floor(number / 1000)) + ' هەزار ' + (number % 1000 == 0 ? '' : ' و ') + converHundreds((number % 1000));
        else 
            return converHundreds(number);
    }
    function converMillion(number) {
        if(number > 999999)
            return converThousands(Math.floor(number / 1000000)) + ' ملیۆن ' + (number % 1000000 == 0 ? '' : ' و ') + converThousands((number % 1000000));
        else 
            return converThousands(number);
    }
    function converBillion(number) {
        if(number > 999999999)
            return converMillion(Math.floor(number / 1000000000)) + ' ملیار ' + (number % 1000000000 == 0 ? '' : ' و ') + converMillion((number % 1000000000));
        else 
            return converMillion(number);
    }
    function converTrillion(number) {
        if(number > 999999999999)
            return converBillion(Math.floor(number / 1000000000000)) + ' ترلیۆن ' + (number % 1000000000000 == 0 ? '' : ' و ') + converBillion((number % 1000000000000));
        else 
            return converBillion(number);
    }
}
