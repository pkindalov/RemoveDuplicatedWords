let that = this;
that.allWords = [];
that.originalWords = [];
that.latestDeletedWords = [];
that.imgInputCont = document.getElementById('imgInput');
that.imgDivCont = document.getElementById('imgContainer');
that.imgBrowseCont = document.getElementById('browseImg');
that.imgHeightPercent = 40;
that.imgWidthPercent = 40;
that.imgCountId = 0;
that.errors = {
	invalidURL: 'Invalid Input. Please enter a valid URL'
};

function filterWords() {
	let nonFilteredWords = getUserText();
	if (!checkUserInput(nonFilteredWords)) {
		notification({ msg: 'Missing or too short words', cls: 'bg bg-warning' });
		return;
	}
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

function checkUserInput(input) {
	const MIN_INPUT_LENGTH = 2;
	if (!input || input.length < MIN_INPUT_LENGTH) {
		return false;
	}
	return true;
}

function getUserText() {
	let textArea = document.getElementById('nonFilteredWords');
	return textArea.value;
}

function getWords(wordsStr) {
	return wordsStr.split(/[,\s+]+/g);
}

function filteringAllWords() {
	let filteredWords = getFilteredWords();
	filteredWords = Array.from(filteredWords);
	that.allWords = filteredWords;
}

function getFilteredWords() {
	return fillSet();
}

function fillSet() {
	let wordsSet = new Set();
	for (let word of that.allWords) {
		wordsSet.add(word);
	}
	return wordsSet;
}

function fillResultDiv() {
	let divCont = document.getElementById('result');
	resetResultField();
	for (let word of that.allWords) {
		let el = createTagEl(word);
		divCont.append(el);
	}
}

function resetResultField() {
	let divCont = document.getElementById('result');
	divCont.innerHTML = '';
}

function createTagEl(word) {
	let colorOfTag = getRndColorClass();
	let className = 'btn btn-' + colorOfTag;
	let element = createFullElement({
		type: 'a',
		propsObj: { href: '#', class: className },
		innerText: word,
		innerHTML: '',
		htmls: ''
	});
	addStyleProps({ el: element, styles: { marginLeft: '10px', marginRight: '10px', marginBottom: '10px' } });
	element.onclick = () => removeCurrentWord(word);
	return element;
}

function getRndColorClass() {
	let bootstrapColorsClassess = [ 'primary', 'secondary', 'success', 'danger', 'warning', 'info' ];
	let min = 0;
	let max = bootstrapColorsClassess.length;
	let rndNum = getRandomNum({ min: min, max: max });
	return bootstrapColorsClassess[rndNum];
}

function getRandomNum(data) {
	let { min, max } = data;
	return Math.floor(Math.random() * (max - min) + min);
}

function createFullElement(elementInfo) {
	let { type, propsObj, innerText, innerHTML, htmls } = elementInfo;
  let element = document.createElement(type);
  if(isValidPropertiesObj(propsObj)){
    for (let prop of Object.keys(propsObj)) {
      element.setAttribute(prop, propsObj[prop]);
    }
  }
	if (innerHTML) element.innerHTML = innerHTML;
	if (innerText) element.innerText = innerText;
	if (htmls) {
    addHtmlTagsToEl({'el': element, 'htmls': htmls});
		// for (let el of htmls) {
		// 	element.append(el);
		// }
	}
	return element;
}

function isValidPropertiesObj(props){
  const MIN_ALLOWED_COUNT_PROPERTIES = 1;
  if(Object.keys(props).length < MIN_ALLOWED_COUNT_PROPERTIES || Object.values(props).length < MIN_ALLOWED_COUNT_PROPERTIES){
    return false;
  }
  return true;
}

function addHtmlTagsToEl(data){
  let { el , htmls } = data;
  for (let htmlEl of htmls) {
    el.append(htmlEl);
  }
}

function addStyleProps(data) {
	let { el, styles } = data;
	if (!el) {
		throw new Error('Not valid html element');
	}
	for (let rule of Object.keys(styles)) {
		el.style[rule] = styles[rule];
	}
}

function writeWordsCount() {
	let container = document.getElementById('wordsCounter');
	container.value = that.allWords.length;
}

function showHideElement(el, condition) {
	if (condition) {
		if (el.classList.contains('invisible')) {
			el.classList.remove('invisible');
		}
		return;
	}
	el.classList.add('invisible');
}

function showCopyWordsBtn() {
	let btn = document.getElementById('btnCopyWords');
	showHideElement(btn, that.allWords.length > 0);
}

function removeCurrentWord(word) {
	let wordsObj = convertArrayToObj(that.allWords);
	delete wordsObj[word];
	that.allWords = Object.keys(wordsObj);
	that.latestDeletedWords.push(word);
	let counterInput = document.getElementById('wordsCounter');
	let undoBtn = document.getElementById('btnUndoDeleteWord');
	filteringAllWords();
	fillResultDiv();
	writeWordsCount();
	showHideElement(counterInput, that.allWords.length > 0);
	showHideElement(undoBtn, that.latestDeletedWords.length > 0);
	showCopyWordsBtn();
}

function convertArrayToObj(arr) {
	return arr.reduce((a, b) => ((a[b] = b), a), {});
}

function copyWords() {
	// const el = document.createElement('textarea');
	const el = createFullElement({'type': 'textarea', 'propsObj': {}, 'innerText': '', 'innerHTML': '', 'htmls': ''});
	el.value = that.allWords.join(', ');
	addElToBody(el);
	copyToClipboard(el);
	removeElFromDoc(el);
	notification({ msg: 'Words Copied Successfully', cls: 'bg bg-success' });
}

function addElToBody(el){
  document.body.appendChild(el);
}

function copyToClipboard(el){
  el.select();
	document.execCommand('copy');
}


function undoDelete() {
	let lastElement = that.latestDeletedWords[that.latestDeletedWords.length - 1];
	let lastElPosition = that.originalWords.indexOf(lastElement);
	if (lastElement && lastElPosition !== -1) {
		that.latestDeletedWords.splice(that.latestDeletedWords.length - 1, 1);
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
	notification({ msg: 'Deleted word returned successfully', cls: 'bg bg-info' });
}

function showHideAddWordsForm() {
	showHideContainer('addWordsCont');
}

function showHideContainer(container) {
	let addWordsCont = document.getElementById(container);
	if (isInvisible()) {
		makeElVisible(addWordsCont);
		return;
	}
	makeElInvisible(addWordsCont);
}

function isInvisible() {
	return addWordsCont.classList.contains('invisible');
}

function makeElVisible(el) {
	el.classList.remove('invisible');
}

function makeElInvisible(el) {
	el.classList.add('invisible');
}

function addNewWord() {
	let wordCont = document.getElementById('addWordInput');
	let newWord = wordCont.value;
	if (!checkUserInput(newWord)) {
		notification({ msg: 'Missing or too short word', cls: 'bg bg-warning' });
		return;
	}
	that.allWords.push(newWord);
	that.originalWords.push(newWord);
	let counterInput = document.getElementById('wordsCounter');
	let undoBtn = document.getElementById('btnUndoDeleteWord');
	notification({ msg: 'Word Added Successfully', cls: 'bg bg-success' });
	filteringAllWords();
	fillResultDiv();
	writeWordsCount();
	showHideElement(counterInput, that.allWords.length > 0);
	showHideElement(undoBtn, that.latestDeletedWords.length > 0);
	showCopyWordsBtn();
}

function resetWords() {
	document.getElementById('nonFilteredWords').value = '';
}

function notification(data) {
	let { msg, cls } = data;
	let notifDiv = createFullElement({
		type: 'div',
		propsObj: { class: cls },
		innerText: msg,
		innerHTML: '',
		htmls: ''
	});
	try {
		addStyleProps({ el: notifDiv, styles: { padding: '1% 0 1% 0', textAlign: 'center', fontWeight: 'bold' } });
		prependElToDoc(notifDiv);
		notifDiv.onclick = () => removeElFromDoc(notifDiv);
		removeElAfter({ el: notifDiv, sec: 4000 });
	} catch (err) {
		console.log(err);
	}
}

function prependElToDoc(el) {
	document.body.prepend(el);
}

function removeElFromDoc(el) {
	document.body.removeChild(el);
}

function removeElAfter(data) {
	let { el, sec } = data;
	if (!el) {
		return;
	}
	setTimeout(() => {
		if (isDocBodyContainsEl(el)) {
			removeElFromDoc(el);
		}
	}, sec);
}

function isDocBodyContainsEl(el) {
	return document.body.contains(el);
}

//----------------------------------------------------------------------------------------------------------------------------------
//Image view functionalities
//----------------------------------------------------------------------------------------------------------------------------------

that.imgInputCont.addEventListener('focus', function(e) {
	if (isImgContValid()) {
		putImageFromClipboard();
	}
});

function isImgContValid() {
	// const MIN_CHILDREN_COUNT = 1;
	// return that.imgDivCont && that.imgDivCont.children.length < MIN_CHILDREN_COUNT;
	return that.imgDivCont ? true : false;
}

function putImageFromClipboard() {
	navigator.clipboard
		.readText()
		.then((text) => {
			if (isThereImgURL(text)) {
				let reversedStr = reverseStr(text);
				let extension = getExtension(reversedStr);
				extension = reverseStr(extension);
				let start = text.indexOf('http');
				let end = text.indexOf(extension);
				url = getURL({ 'text': text, 'start': start, 'end': end, 'extension': extension});
				showImgByURL(url);
				return;
			}
		})
		.catch((err) => {
			console.error('Failed to read clipboard contents: ', err);
		});
}

function isThereImgURL(text) {
	return text.indexOf('.jpg') !== -1 || text.indexOf('.png') !== -1;
}

function reverseStr(str) {
	str = str.split('').reverse().join('');
	return str;
}

function getExtension(str) {
	return str.split('.')[0];
}

function getURL(data) {
	let { text, start, end, extension } = data;
	return text.substr(start, end + extension.length);
}

function showImgByURL(url) {
	that.imgCountId++;
	let currentDivId = that.imgCountId;
	let imgEl = createImgEl(url, { heightPercent: 0, widthPercent: 0 });
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
	that.imgDivCont = !that.imgDivCont ? document.getElementById('imgContainer') : that.imgDivCont;
	that.imgDivCont.append(imgBtnCont);
}

function createImgEl(url, data) {
	let { heightPercent, widthPercent } = data;
	let img = document.createElement('img');
	img.setAttribute('src', url);
	img.setAttribute('alt', 'keyworded image');
	img.setAttribute('class', 'img-fluid mt-3');
	img.style.height = that.imgHeightPercent + heightPercent + '%';
	img.style.width = that.imgWidthPercent + widthPercent + '%';
	return img;
}

function createCloseBtn(currentDivId) {
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

function createZoomInBtn(currentDivId) {
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

function zoomInImg(currentDivId) {
	let div = document.getElementById('image' + currentDivId);
	if (!div) return;
	let img = div.children[0];
	let imgLink = img.src;
	let newImgCont = document.createElement('div');
	let imgEl = createImgEl(imgLink, { heightPercent: 60, widthPercent: 60 });
	newImgCont = createModal({ content: [ imgEl ], title: 'Zoomed Image' });
	newImgCont.setAttribute('id', 'zoomedImg' + currentDivId);
	newImgCont.setAttribute('class', 'jumbotron bg-light zoomed');
	newImgCont.onclick = () => closeZoomedImg(currentDivId);
	document.getElementById('imgContainer').innerHTML = '';
	document.getElementById('imgContainer').append(newImgCont);
	makeModalDraggable();
}

function makeModalDraggable() {
	$('.modal-dialog').draggable({
		handle: '.modal-header, .modal-body, .modal-footer'
	});
}

that.imgBrowseCont.addEventListener('change', function() {
	readBrowseImg(this);
});

that.imgInputCont.addEventListener('keypress', function(e) {
	let imgURL = e.target.value;

	if (!imgURL || imgURL.indexOf('http') < 0) {
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

function createModal(data) {
	const { content, title } = data; //content must be an array with valid html elements. They will be put directly in the content of the modal div.
	let modalDiv = createFullElement({
		type: 'div',
		propsObj: { class: ',modal', tabindex: '-1', role: 'dialog' },
		innerText: '',
		innerHTML: ''
	});
	let modalDialogDiv = createFullElement({
		type: 'div',
		propsObj: { class: 'modal-dialog', role: 'document' },
		innerText: '',
		innerHTML: ''
	});
	let modalContentDiv = createFullElement({
		type: 'div',
		propsObj: { class: 'modal-content' },
		innerText: '',
		innerHTML: ''
	});
	let modalHeader = createFullElement({
		type: 'div',
		propsObj: { class: 'modal-header' },
		innerText: '',
		innerHTML: ''
	});
	let header = createFullElement({ type: 'h5', propsObj: { class: 'modal-title' }, innerText: title, innerHTML: '' });

	modalHeader.append(header);

	let headerCloseBtn = createFullElement({
		type: 'button',
		propsObj: { type: 'button', class: 'close', 'data-dismiss': 'modal', 'aria-label': 'Close' },
		innerText: '',
		innerHTML: ''
	});
	let headerBtnSpan = createFullElement({
		type: 'span',
		propsObj: { 'aria-hidden': 'true' },
		innerText: '',
		innerHTML: '&times;'
	});

	headerCloseBtn.append(headerBtnSpan);
	modalHeader.append(headerCloseBtn);

	let modalBody = createFullElement({
		type: 'div',
		propsObj: { class: 'modal-body' },
		innerText: '',
		innerHTML: '',
		htmls: content
	});
	let modalFooter = createFullElement({ type: 'div', propsObj: { class: 'modal-footer' } });
	let footerCloseBtn = createFullElement({
		type: 'button',
		propsObj: { type: 'button', class: 'btn btn-secondary', 'data-dismiss': 'modal' },
		innerText: 'Close',
		innerHTML: ''
	});

	modalFooter.append(footerCloseBtn);
	modalContentDiv.append(modalHeader, modalBody, modalFooter);
	modalDialogDiv.append(modalContentDiv);
	modalDiv.append(modalDialogDiv);
	return modalDiv;
}

function closeZoomedImg(currentDivId) {
	document.getElementById('zoomedImg' + currentDivId).remove();
}

function clearImageDivContainer(currentDivId) {
	let elementForRemoving = document.getElementById('image' + currentDivId);
	elementForRemoving.remove();
	// that.imgDivCont = document.getElementById('imgContainer');
	// that.imgDivCont.innerHTML = '';
}

function readBrowseImg(input) {
	if (input.files && input.files[0]) {
		let reader = new FileReader();

		reader.onload = function(e) {
			let link = e.target.result;
			showImgByURL(link);
			// let img = createImgEl(link, {heightPercent: 20, widthPercent: 20});
			// let img = document.createElement('img');
			// img.src = e.target.result;
			// img.setAttribute('height', '40%');
			// img.setAttribute('width', '40%');
			// that.imgDivCont.append(img);
		};

		reader.readAsDataURL(input.files[0]);
	}
}

function showHideURLform() {
	showHideContainer('imgInput');
}

function showHideBrowseImgform() {
	showHideContainer('browseImg');
}
