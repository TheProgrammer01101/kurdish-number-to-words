let readBtn = document.querySelector('button');
let audio;
let inputHTML = document.querySelector('input');
let outputHTML = document.querySelector('p');
let ones = ['', 'یەک', 'دوو', 'سێ', 'چوار', 'پێنج', 'شەش', 'حەوت', 'هەشت', 'نۆ'];
let teens = ['دە', 'یانزە', 'دوانزە', 'سیانزە' ,'چواردە' ,'پانزە' ,'شانزە', 'حەڤە', 'هەژدە', 'نۆزدە'];
let tens = ['','','بیست','سی','چل','پەنجا','شەست','حەفتا','هەشتا','نەوە'];

inputHTML.addEventListener('input', () => {
    outputHTML.innerHTML = "ئەنجام: " + convertToWords(inputHTML.value);
});

function playAudio(number) {
    audio = new Audio(`audio/${number}.m4a`);
    audio.play();
}
readBtn.addEventListener('click', ()=> {
    let number = inputHTML.value;
    readHundreds(number);
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
        else {
            readHundreds(number);
        }
    }
     function readHundreds(number) {
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
});

function convertToWords(number) {
    if(number == 0)
        return 'سفر';
    else if(number.length >= 16)
        return 'لە 15 ژمارە زیاتر ناکات.'
    else 
        return converTrillion(number);
    
    function convertTens(number) {
        if(number < 10)
            return ones[number];
        else if(number >= 10 && number < 20) 
            return teens[number - 10];
        else if(number >= 20) 
            if(number % 10 != 0)
                return tens[Math.floor(number / 10)] + ' و ' + ones[number % 10];
            else 
                return tens[Math.floor(number / 10)];
        else 
            return '';
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
                return 'هەزار' + (number % 1000 == 0 ? '' : ' و ') + convertTens(number % 1000);
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
