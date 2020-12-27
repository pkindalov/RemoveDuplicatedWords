let that = this;
that.allWords = [];
that.originalWords = [];
that.latestDeletedWords = [];

function filterWords () {
    let nonFilteredWords = getUserText();
    let counterInput = document.getElementById('wordsCounter');
    let btnAddWords = document.getElementById('btnAddWords');
    that.allWords = getWords(nonFilteredWords);
    that.originalWords = that.allWords;
    filteringAllWords();
    fillResultDiv();
    writeWordsCount();
    showHideElement(counterInput, that.allWords.length > 0);
    showHideElement(btnAddWords, true);
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
    // if(that.allWords.length > 0){
      showHideElement(btn, that.allWords.length > 0);
      // return;
      // console.log(btn.classList);
      // console.log(typeof btn.classList);
    // }

    // btn.classList.add('invisible');
  }

  function showHideElement(el, condition){
    if(condition){
        if(el.classList.contains('invisible')){
          el.classList.remove('invisible');
        }
      return;  
    }
    el.classList.add('invisible');
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
    let wordsObj = convertArrayToObj(that.allWords);
    delete wordsObj[word];
    that.allWords = Object.keys(wordsObj);
    that.latestDeletedWords.push(word);
    //old way to remove words from array
    // that.allWords = Array.from(wordsObj);
    // let index  = that.allWords.indexOf(word);
    // if(index === -1){
    //   alert('No such word');
    //   return;
    // }
    // that.allWords.splice(index, 1);
    let counterInput = document.getElementById('wordsCounter');
    let undoBtn = document.getElementById('btnUndoDeleteWord');
    filteringAllWords();
    fillResultDiv();
    writeWordsCount();
    showHideElement(counterInput, that.allWords.length > 0);
    showHideElement(undoBtn, that.latestDeletedWords.length > 0);
    showCopyWordsBtn();
  }

  function convertArrayToObj(arr){
    return arr.reduce((a,b)=> (a[b]=b,a),{});
  }

  function copyWords(){
    const el = document.createElement('textarea');
    el.value = that.allWords.join(', ');
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  function undoDelete(){
    let lastElement = that.latestDeletedWords[that.latestDeletedWords.length - 1];
    let lastElPosition = that.originalWords.indexOf(lastElement);
    if(lastElement && lastElPosition !== -1){
      that.latestDeletedWords.splice(that.latestDeletedWords.length - 1, 1);
      if(lastElPosition > 0 && lastElPosition !== that.allWords.length){
        lastElPosition--;
      }
      that.allWords.splice(lastElPosition, 0, lastElement);
    }
    let counterInput = document.getElementById('wordsCounter');
    let undoBtn = document.getElementById('btnUndoDeleteWord');
    filteringAllWords();
    fillResultDiv();
    writeWordsCount();
    showHideElement(counterInput, that.allWords.length > 0);
    showHideElement(undoBtn, that.latestDeletedWords.length > 0);
    showCopyWordsBtn();
  }

  function showHideAddWordsForm(){
    showHideContainer('addWordsCont');
  }

  function showHideContainer(container){
    let addWordsCont = document.getElementById(container);
    if(addWordsCont.classList.contains('invisible')){
      addWordsCont.classList.remove('invisible');
      return;
    }
    addWordsCont.classList.add('invisible');
  }

  function addNewWord(){
    let wordCont = document.getElementById('addWordInput');
    let newWord = wordCont.value;
    if(!newWord){
      wordCont.value = 'Invalid word';
      return;
    }
    that.allWords.push(newWord);
    that.originalWords.push(newWord);
    let counterInput = document.getElementById('wordsCounter');
    let undoBtn = document.getElementById('btnUndoDeleteWord');
    filteringAllWords();
    fillResultDiv();
    writeWordsCount();
    showHideElement(counterInput, that.allWords.length > 0);
    showHideElement(undoBtn, that.latestDeletedWords.length > 0);
    showCopyWordsBtn();
  }

  function resetWords(){
    document.getElementById('nonFilteredWords').value = '';
  }


  //----------------------------------------------------------------------------------------------------------------------------------
  //Image view functionalities
  //----------------------------------------------------------------------------------------------------------------------------------

  that.imgInputCont = document.getElementById('imgInput');
  that.imgDivCont = document.getElementById('imgContainer');
  that.imgBrowseCont = document.getElementById('browseImg');
  that.imgHeightPercent = 40;
  that.imgWidthPercent = 40;
  that.imgCountId = 0;
  that.errors = {
    invalidURL: 'Invalid Input. Please enter a valid URL'
  };

  that.imgInputCont.addEventListener('focus', function(e){
      if(that.imgDivCont && that.imgDivCont.children.length < 1){
        putImageFromClipboard();
      }
  });

  that.imgBrowseCont.addEventListener('change', function(){
    readBrowseImg(this);
  });


  that.imgInputCont.addEventListener('keypress', function(e){
  // let urlFromClipboart = getImageFromClipboard();  
  // return;
  let imgURL = e.target.value;
    
    if(!imgURL || imgURL.indexOf('http') < 0){
      alert('Invalid Input. Please enter a valid URL');
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
    that.imgCountId++;
    let currentDivId = that.imgCountId;
    let imgEl = createImgEl(url, {heightPercent: 0, widthPercent: 0});
    let closeBtn = createCloseBtn(currentDivId);
    let zoomInBtn = createZoomInBtn(currentDivId);
    let imgBtnCont = document.createElement('div');
    imgBtnCont.setAttribute('id', 'image' + that.imgCountId);
    imgBtnCont.setAttribute('class', 'ml-3');
    imgBtnCont.style.display = 'inline';
    imgBtnCont.onclick = () => zoomInImg(currentDivId);
    imgBtnCont.append(imgEl);
    imgBtnCont.append(closeBtn);
    imgBtnCont.append(zoomInBtn);
    // clearImageDivContainer();85555
    that.imgDivCont = !that.imgDivCont ? document.getElementById('imgContainer') : that.imgDivCont;
    that.imgDivCont.append(imgBtnCont);
    // that.imgDivCont.innerHTML = '';
    // that.imgDivCont.append(imgEl);
    // that.imgDivCont.append(closeBtn);
  }

  function createImgEl(url, data){
    let {heightPercent, widthPercent} = data;
    let img = document.createElement('img');
    // that.imgCountId++;
    img.setAttribute('src', url);
    img.setAttribute('alt', 'keyworded image');
    img.setAttribute('class', 'img-fluid mt-3');
    // img.setAttribute('id', 'image' + that.imgCountId);
    img.style.height = (that.imgHeightPercent + heightPercent) + '%';
    img.style.width = (that.imgWidthPercent + widthPercent) + '%';
    // img.style.height = (1200 * 0.5) + 'px';
    // img.style.width = (1200 * 0.5) + 'px';
    return img;
  }

  function createCloseBtn(currentDivId){
    let closeLink = document.createElement('a');
    closeLink.setAttribute('href', '#');
    closeLink.setAttribute('class', 'btn btn-danger');
    closeLink.innerText = 'X';
    closeLink.style.position = 'absolute';
    closeLink.style.marginLeft = '-50px';
    closeLink.style.marginTop = '20px';
    closeLink.onclick = () => clearImageDivContainer(currentDivId);
    return closeLink;
  }

  function createZoomInBtn(currentDivId){
    let zoomInLink = document.createElement('a');
    zoomInLink.setAttribute('href', '#');
    zoomInLink.setAttribute('class', 'btn btn-primary');
    zoomInLink.innerText = '+';
    zoomInLink.style.position = 'absolute';
    zoomInLink.style.marginLeft = '-50px';
    zoomInLink.style.marginTop = '70px';
    zoomInLink.onclick = () => zoomInImg(currentDivId);
    return zoomInLink;
  }

  function zoomInImg(currentDivId){
   let div = document.getElementById('image' + currentDivId);
   if(!div) return;
   let img = div.children[0];
   let imgLink = img.src;
   let newImgCont = document.createElement('div');
   let imgEl = createImgEl(imgLink, {heightPercent: 60, widthPercent: 60});
   newImgCont = createModal({content: [imgEl] , title: 'Zoomed Image'});

  //  newImgCont.style.position = 'absolute';
  //  newImgCont.style.marginTop = '-50%';
  //  newImgCont.style.zIndex = '999';
   newImgCont.setAttribute('id', 'zoomedImg' + currentDivId);
   newImgCont.setAttribute('class', 'jumbotron bg-light zoomed');
  //  newImgCont.append(imgEl);
   newImgCont.onclick = () => closeZoomedImg(currentDivId);
   document.getElementById('imgContainer').innerHTML = '';
   document.getElementById('imgContainer').append(newImgCont);

   $(".modal-dialog").draggable({
    handle: ".modal-header, .modal-body, .modal-footer"
    });

  }

  function createModal(data){
    const { content, title } = data; //content must be an array with valid html elements. They will be put directly in the content of the modal div.
    let modalDiv = document.createElement('div');
    modalDiv.setAttribute('class', 'modal');
    modalDiv.setAttribute('tabindex', '-1');
    modalDiv.setAttribute('role', 'dialog');

    let modalDialogDiv = document.createElement('div');
    modalDialogDiv.setAttribute('class', 'modal-dialog');
    modalDialogDiv.setAttribute('role', 'document');

    let modalContentDiv = document.createElement('div');
    modalContentDiv.setAttribute('class', 'modal-content');

    let modalHeader = document.createElement('div');
    modalHeader.setAttribute('class', 'modal-header');
    let header = document.createElement('h5');
    header.setAttribute('class', 'modal-title');
    header.innerText = title;
    modalHeader.append(header);
    let headerCloseBtn = document.createElement('button');
    headerCloseBtn.setAttribute('type', 'button');
    headerCloseBtn.setAttribute('class', 'close');
    headerCloseBtn.setAttribute('data-dismiss', 'modal');
    headerCloseBtn.setAttribute('aria-label', 'Close');
    let headerBtnSpan = document.createElement('span');
    headerBtnSpan.setAttribute('aria-hidden', 'true');
    headerBtnSpan.innerHTML = '&times';
    headerCloseBtn.append(headerBtnSpan);
    modalHeader.append(headerCloseBtn);


    let modalBody = document.createElement('div');
    modalBody.setAttribute('class', 'modal-body');
    for(let element of content){
      modalBody.append(element);
    }


    let modalFooter = document.createElement('div');
    modalFooter.setAttribute('class','modal-footer');
    // let footerBtnSave = document.createElement('button');
    // footerBtnSave.setAttribute('type', 'button');
    // footerBtnSave.setAttribute('class', 'btn btn-primary');
    // footerBtnSave.innerText = 'Save Changes';
    // modalFooter.append(footerBtnSave);
    let footerCloseBtn = document.createElement('button');
    footerCloseBtn.setAttribute('type', 'button');
    footerCloseBtn.setAttribute('class', 'btn btn-secondary');
    footerCloseBtn.setAttribute('data-dismiss', 'modal');
    footerCloseBtn.innerText = 'Close';
    modalFooter.append(footerCloseBtn);

    modalContentDiv.append(modalHeader, modalBody, modalFooter);
    modalDialogDiv.append(modalContentDiv);
    modalDiv.append(modalDialogDiv);
    return modalDiv;
  }

  function closeZoomedImg(currentDivId){
    document.getElementById('zoomedImg' + currentDivId).remove();
  }

  function clearImageDivContainer(currentDivId){
    let elementForRemoving = document.getElementById('image' + currentDivId);
    elementForRemoving.remove();
    // that.imgDivCont = document.getElementById('imgContainer');
    // that.imgDivCont.innerHTML = '';
  }

  function readBrowseImg(input){
    if(input.files && input.files[0]){
      let reader = new FileReader();

      reader.onload = function(e){
        let link = e.target.result;
        showImgByURL(link);
        // let img = createImgEl(link, {heightPercent: 20, widthPercent: 20});
        // let img = document.createElement('img');
        // img.src = e.target.result;
        // img.setAttribute('height', '40%');
        // img.setAttribute('width', '40%');
        // that.imgDivCont.append(img);
      }

      reader.readAsDataURL(input.files[0])
    }
  }

  function showHideURLform(){
    showHideContainer('imgInput');
  }

  function showHideBrowseImgform(){
    showHideContainer('browseImg');
  }