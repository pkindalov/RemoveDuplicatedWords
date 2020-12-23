let that = this;
that.allWords = [];

function filterWords () {
    let nonFilteredWords = getUserText();
    that.allWords = getWords(nonFilteredWords);
    filteringAllWords();
    fillResultDiv();
    writeWordsCount();
    showCopyWordsBtn();
  }

  function getUserText(){
    let textArea = document.getElementById('nonFilteredWords');
    return textArea.value;
  }

  function getWords(wordsStr){
    return wordsStr.split(/[,\s+]+/g);
 }

  function filteringAllWords(){
    let filteredWords = getFilteredWords();
    filteredWords = Array.from(filteredWords);
    that.allWords = filteredWords;
  }


  function getFilteredWords(){
    return fillSet();
  }

  function fillSet(wordsArr){
    let wordsSet = new Set();
    for(let word of that.allWords){
      wordsSet.add(word);
    }
    return wordsSet;
  }

  function fillResultDiv(){
    let divCont = document.getElementById('result');
    divCont.innerHTML = '';
    for(let word of that.allWords){
      let el = createTagEl(word);
      divCont.append(el);
    }
  }

  function writeWordsCount(){
    let container = document.getElementById('wordsCounter');
    container.value = that.allWords.length;
  }

  function showCopyWordsBtn(){
    let btn = document.getElementById('btnCopyWords');
    if(that.allWords.length > 0){
      if(btn.classList.contains('invisible')){
        btn.classList.remove('invisible');
      }
      return;
      // console.log(btn.classList);
      // console.log(typeof btn.classList);
    }

    btn.classList.add('invisible');
  }

  function createTagEl(word){
    let element = document.createElement('a');
    let colorOfTag = getRndColorClass();
    let className = 'btn btn-' + colorOfTag;
    element.setAttribute('href', '#');
    element.setAttribute('class', className);
    // element.setAttribute('style', 'margin-left: 10px');
    element.style.marginLeft = '10px';
    element.style.marginRight = '10px';
    element.style.marginBottom = '10px';
    element.innerText = word;
    element.onclick = () => removeCurrentWord(word);
    return element;
  }

  function getRndColorClass(){
    let bootstrapColorsClassess = [
      'primary', 'secondary', 'success', 'danger', 'warning', 'info'
    ];
    let min = 0;
    let max = bootstrapColorsClassess.length;
    return bootstrapColorsClassess[Math.floor(Math.random() * (max - min) + min)];

  }

  function removeCurrentWord(word){
    let index  = that.allWords.indexOf(word);
    if(index === -1){
      alert('No such word');
      return;
    }
    that.allWords.splice(index, 1);
    filteringAllWords();
    fillResultDiv();
    writeWordsCount();
    showCopyWordsBtn();
  }

  function copyWords(){
    const el = document.createElement('textarea');
    el.value = that.allWords.join(', ');
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  //----------------------------------------------------------------------------------------------------------------------------------
  //Image view functionalities
  //----------------------------------------------------------------------------------------------------------------------------------

  that.imgInputCont = document.getElementById('imgInput');
  that.imgDivCont = document.getElementById('imgContainer');

  that.imgInputCont.addEventListener('focus', function(e){
      if(that.imgDivCont && that.imgDivCont.children.length < 1){
        putImageFromClipboard();
      }
  });


  that.imgInputCont.addEventListener('keypress', function(e){
  // let urlFromClipboart = getImageFromClipboard();  
  // return;
  let imgURL = e.target.value;
    
    if(!imgURL){
      that.imgCont.value = 'Invalid Input. Please enter a valid URL';
      return;
    }

    switch (e.key.toLowerCase()) {
      case 'enter':
        showImgByURL(imgURL);
        break;
    
      default:
        break;
    }
  });

   function putImageFromClipboard(){
    // let url;
    navigator.clipboard.readText()
    .then(text => {
      if(text.indexOf('.jpg') !== -1 || text.indexOf('.png') !== -1){
        let reversedStr = reverseStr(text);
        let extension = reversedStr.split('.')[0];
        extension = reverseStr(extension);
        let start = text.indexOf('http');
        let end = text.indexOf(extension);
         url = text.substr(start, end + (extension.length));
         showImgByURL(url);
         return;
      }

      // clearImageDivContainer();
     
    })
    .catch(err => {
      console.error('Failed to read clipboard contents: ', err);
    });
   

  }

  function reverseStr(str){
    str = str.split("").reverse().join("");
    return str;
  }


  function showImgByURL(url){
    let imgEl = createImgEl(url);
    let closeBtn = createCloseBtn();
    // clearImageDivContainer();85555
    that.imgDivCont = !that.imgDivCont ? document.getElementById('imgContainer') : that.imgDivCont;
    that.imgDivCont.append(imgEl);
    that.imgDivCont.append(closeBtn);
  }

  function createImgEl(url){
    let img = document.createElement('img');
    img.setAttribute('src', url);
    img.setAttribute('alt', 'keyworded image');
    img.setAttribute('class', 'img-fluid');
    img.style.height = '40%';
    img.style.width = '40%';
    // img.style.height = (1200 * 0.5) + 'px';
    // img.style.width = (1200 * 0.5) + 'px';
    return img;
  }

  function createCloseBtn(){
    let closeLink = document.createElement('a');
    closeLink.setAttribute('href', '#');
    closeLink.setAttribute('class', 'btn btn-danger');
    closeLink.innerText = 'X';
    closeLink.style.position = 'absolute';
    closeLink.style.marginLeft = '-50px';
    closeLink.style.marginTop = '10px';
    closeLink.onclick = () => clearImageDivContainer();
    return closeLink;
  }


  function clearImageDivContainer(){
    that.imgDivCont = document.getElementById('imgContainer');
    that.imgDivCont.innerHTML = '';
  }