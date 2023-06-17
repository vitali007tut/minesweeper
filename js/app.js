// add favicon
document.head.insertAdjacentHTML(
  "beforeend",
  '<link rel="shortcut icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAN0lEQVR42mNgGArgP90N+I9Eo2OiDfyPBxOnGQbIMYRsA/6Tgck2iOwA/E+3WKA4HQxsUiYJAAAf1lyk4ulhiwAAAABJRU5ErkJggg==" type="image/x-icon">'
);

let sec = 0;
let time = null;
let squares = [];
let stepsNumber = 0;
let flags = 0;
let isGameOver = false;
if (!localStorage.getItem("size")) localStorage.setItem("size", "easy");
const size = localStorage.getItem("size");


if (!localStorage.getItem("Results")) localStorage.setItem("Results", []);
const resultsArray = localStorage.getItem("Results").split(',');

// add in body
const result = addHtmlElement("div", "result", document.body);
const container = addHtmlElement("div", "container", document.body);
// add in container
const containerDropDown = addHtmlElement("div", "container__drop-downs", container);
const dropDowns = addHtmlElement("div", "mine__drop-downs", containerDropDown);
const topBar = addHtmlElement("div", "mine__top-bar", container);
// add in dropDowns
const dropDown = addHtmlElement("div", "mine__drop-down", dropDowns);
dropDown.classList.add("hidden");
// add in dropDown
const dropDownTitle = addHtmlElement(
  "div",
  "mine__drop-down__title",
  dropDown,
  "Game settings"
);
dropDownTitle.addEventListener("click", () => toggleMenu());
const dropDownMenu = addHtmlElement("div", "mine__drop-down__menu", dropDown);
// add in dropDownMenu
const dropDownRow = addHtmlElement("div", "mine__drop-down__row", dropDownMenu);
// add in dropDownRow
// addHtmlElement('div', 'mine__drop-down__check', dropDownRow);
const dropDownText = addHtmlElement(
  "div",
  "mine__drop-down__text",
  dropDownRow,
  "New game"
);
dropDownText.addEventListener("click", () => {
  toggleMenu();
  clearBoard();
  createBoard();
  // if (localStorage.getItem('color') === 'true') {
    // toggleColor()
    // document.querySelectorAll(".ceil").forEach((e) => { e.classList.toggle('color') });
  // }
  if (sound.checked) new Audio("./asserts/start.wav").play();
});
// add separator in dropDownMenu
addHtmlElement("div", "mine__drop-down__separator", dropDownMenu);
const dropDownRowSound = addHtmlElement(
  "div",
  "mine__drop-down__row",
  dropDownMenu
);
// add in dropDownSound 
// addHtmlElement('div', 'mine__drop-down__check', dropDownRowSound);
const dropDownTextSound = addHtmlElement(
  "div",
  "mine__drop-down__text",
  dropDownRowSound,
  `<label><input type="checkbox" id="sound">Sound
  </label>`
);
const sound = document.querySelector("#sound");
sound.addEventListener("change", () => {
  localStorage.setItem("sound", sound.checked);
});
// add separator in dropDownMenu after Sound
addHtmlElement("div", "mine__drop-down__separator", dropDownMenu);
// add size radio in dropDownMenu
const dropDownRowSize1 = addHtmlElement(
  "div",
  "mine__drop-down__row",
  dropDownMenu
);
const dropDownTextSize1 = addHtmlElement(
  "div",
  "mine__drop-down__text",
  dropDownRowSize1,
  `<label><input type="radio" id="easy" name="size" value="easy" checked>Easy (10x10)</label>`
);
const dropDownRowSize2 = addHtmlElement(
  "div",
  "mine__drop-down__row",
  dropDownMenu
);
const dropDownTextSize2 = addHtmlElement(
  "div",
  "mine__drop-down__text",
  dropDownRowSize2,
  `<label><input type="radio" id="medium" name="size" value="medium">Medium (15x15)</label>`
);
const dropDownRowSize3 = addHtmlElement(
  "div",
  "mine__drop-down__row",
  dropDownMenu
);
const dropDownTextSize3 = addHtmlElement(
  "div",
  "mine__drop-down__text",
  dropDownRowSize3,
  `<label><input type="radio" id="hard" name="size" value="hard">Hard (25x25)</label>`
);
document.querySelectorAll('input[name="size"]').forEach((e) => {
  e.addEventListener("change", () => {
    localStorage.setItem("size", e.value);
    clearBoard();
    createBoard();
  });
});

const sizeObject = {
  easy: {
    widthContent: "266px", // mineContent.style.width
    grid: "repeat(10, 25px)", // mineContentInner.style.gridTemplateColumns && mineContentInner.style.gridTemplateRows
    widthCeil: 10,
    amountMines: 10,
  },
  medium: {
    widthContent: "390px", // mineContent.style.width
    grid: "repeat(15, 25px)", // mineContentInner.style.gridTemplateColumns && mineContentInner.style.gridTemplateRows
    widthCeil: 15,
    amountMines: 40,
  },
  hard: {
    widthContent: "640px", // mineContent.style.width
    grid: "repeat(25, 25px)", // mineContentInner.style.gridTemplateColumns && mineContentInner.style.gridTemplateRows
    widthCeil: 25,
    amountMines: 99,
  },
};

// add separator in dropDownMenu after Size
addHtmlElement("div", "mine__drop-down__separator", dropDownMenu);
// add last results in dropDownMenu
const dropDownRowResults = addHtmlElement(
  "div",
  "mine__drop-down__row",
  dropDownMenu
);
const dropDownResults = addHtmlElement(
  "div",
  "mine__drop-down__text",
  dropDownRowResults,
  "Last 10 results..."
);
// add separator in dropDownMenu after 10 results
addHtmlElement("div", "mine__drop-down__separator", dropDownMenu);
// add last color check in dropDownMenu
const dropDownRowColor = addHtmlElement("div","mine__drop-down__row", dropDownMenu);
// add Color 
const dropDownTextColor = addHtmlElement("div", "mine__drop-down__text", dropDownRowColor,
  `<label><input type="checkbox" id="color">Color</label>`);
const color = document.querySelector("#color");
color.addEventListener("change", () => {
  localStorage.setItem("color", color.checked);
  toggleColor();
});

// add in topBar
const backOpacity = addHtmlElement("div", "backOpacity", topBar);
const topBarText = addHtmlElement(
  "div",
  "mine__top-bar__text",
  topBar,
  "Game settings"
);
topBarText.addEventListener("click", () => {
  toggleMenu();
});

backOpacity.addEventListener("click", () => {
  toggleMenu();
});

function addHtmlElement(element, classElement, insert, innerText = "") {
  const newElement = document.createElement(element);
  newElement.classList.add(classElement);
  newElement.innerHTML = innerText;
  return insert.appendChild(newElement);
}

const mineContent = addHtmlElement("div", "mine-content", container);
const scoreBar = addHtmlElement("div", "mine__score-bar", mineContent);

const flagsLine = document.createElement("div");
flagsLine.innerHTML = `Flags left: <span class='flags-amount'></span>`;
scoreBar.appendChild(flagsLine);
const flagsAmount = document.querySelector(".flags-amount");

const timer = document.createElement("div");
timer.classList.add("timer");
timer.innerHTML = `${sec / 60} min ${sec % 60} sec`;
scoreBar.appendChild(timer);

const clicksNumber = document.createElement("div");
clicksNumber.classList.add("clicks-number");
clicksNumber.innerHTML = `Clicks number: ${stepsNumber}`;
scoreBar.appendChild(clicksNumber);

const mineContentInner = document.createElement("div");
mineContentInner.classList.add("mine-content__inner");
mineContent.appendChild(mineContentInner);

// add radio mark if reload window
document.getElementById(size).checked = true;

function startTimer() {
  time = setInterval(() => {
    sec++;
    timer.innerHTML = `${Math.floor(sec / 60)} min ${sec % 60} sec`;
  }, 1000);
}

function createBoard() {
  sound.checked = localStorage.getItem("sound") === "true" ? true : false;
  // check size in localStorage
  const size = localStorage.getItem("size");
  const width = sizeObject[size].widthCeil;
  const minesAmount = sizeObject[size].amountMines;
  flagsAmount.innerHTML = minesAmount;
  // check styles in localStorage
  mineContent.style.width = sizeObject[size].widthContent;
  mineContentInner.style.gridTemplateColumns = sizeObject[size].grid;
  mineContentInner.style.gridTemplateRows = sizeObject[size].grid;

  const minesArray = Array(minesAmount).fill("mine");
  const emptyArray = Array(width * width - minesAmount).fill("empty");
  const gameArray = emptyArray.concat(minesArray);
  const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    square.setAttribute("id", i);
    square.classList.add(`ceil`, `${shuffledArray[i]}`);
    mineContentInner.appendChild(square);
    squares.push(square);

    square.addEventListener("click", function (e) {
      click(square);
    });
    square.oncontextmenu = function (e) {
      e.preventDefault();
      addFlag(square);
    };
  }

  // add total mines around the empty ceil
  for (let i = 0; i < squares.length; i++) {
    let total = 0;
    const isLeftEdge = i % width === 0; // left column
    const isRightEdge = i % width === width - 1; // right column
    if (squares[i].classList.contains("empty")) {
      if (!isLeftEdge && squares[i - 1].classList.contains("mine")) total++;
      if (!isRightEdge && squares[i + 1].classList.contains("mine")) total++;
      if (i >= width && squares[i - width].classList.contains("mine")) total++;
      if (
        i < width * (width - 1) &&
        squares[i + width].classList.contains("mine")
      )
        total++;
      if (
        i >= width &&
        !isLeftEdge &&
        squares[i - 1 - width].classList.contains("mine")
      )
        total++;
      if (
        i >= width &&
        !isRightEdge &&
        squares[i - width + 1].classList.contains("mine")
      )
        total++;
      if (
        i < width * (width - 1) &&
        !isLeftEdge &&
        squares[i - 1 + width].classList.contains("mine")
      )
        total++;
      if (
        i < width * (width - 1) &&
        !isRightEdge &&
        squares[i + 1 + width].classList.contains("mine")
      )
        total++;
      squares[i].setAttribute("data", total);
      // squares[i].innerHTML = total; // testing
    }
  }

  // mouse left click in ceil counter
  document.querySelectorAll(".ceil").forEach((e) =>
    e.addEventListener("mousedown", () => {
      var e = e || window.event;
      var btnCode;
      btnCode = e.button;
      if (btnCode === 0) {
        if (sound.checked) new Audio("./asserts/click.wav").play();
        stepsNumber++;
      }
      if (btnCode === 2) {
        if (sound.checked) new Audio("./asserts/right-click.mp3").play();
      }
    })
  );
}



function click(square) {
  let currentId = square.id;
  if (isGameOver) return;

  clicksNumber.innerHTML = `Clicks number: ${stepsNumber}`;
  if (
    document.querySelectorAll(".checked").length === 0 &&
    !square.classList.contains("flag")
  ) {
    // if (square.classList[1] != "mine") {
    //   startTimer();
    // } else {
    //   clearBoard();
    //   createBoard();
    //   const newSquare = document.getElementById(square.getAttribute("id"));
    //   click(newSquare);
    //   return;
    // }
    while (square.classList[1] === "mine") {
      clearBoard();
      createBoard();
      const newSquare = document.getElementById(square.getAttribute("id"));
      click(newSquare);
      return;
    }
    startTimer();
  }

  if (square.classList.contains("checked") || square.classList.contains("flag"))
    return;
  if (square.classList.contains("mine")) {
    gameOver(square);
  } else {
    let total = square.getAttribute("data");
    if (total != 0) {
      square.classList.add("checked");
      if (total === "1") square.classList.add("one");
      if (total === "2") square.classList.add("two");
      if (total === "3") square.classList.add("three");
      if (total === "4") square.classList.add("four");
      if (total === "5") square.classList.add("five");
      if (total === "6") square.classList.add("six");
      square.innerHTML = total;
      return;
    }
    checkSquare(square, currentId); // if total = 0, recursion on id
  }
  square.classList.add("checked");


}

function addFlag(square) {
  const size = localStorage.getItem("size");
  const minesAmount = sizeObject[size].amountMines;
  if (square.classList.contains("checked")) {
    return;
  }
  if (isGameOver) return;
  if (!square.classList.contains("flag")) {
    square.classList.add("flag");
    square.innerHTML = " 🚩";
    flags++;
    flagsAmount.innerHTML = minesAmount - flags;
    checkForWin();
  } else {
    square.classList.remove("flag");
    square.innerHTML = "";
    flags--;
    flagsAmount.innerHTML = minesAmount - flags;
  }
}

function gameOver(square) {
  if (sound.checked) new Audio("./asserts/lose.wav").play();
  clearInterval(time);
  result.innerHTML = "Boom! Game Over! Try one more time...";
  result.classList.add("game-over");
  isGameOver = true;
  const size = localStorage.getItem("size");
  resultsArray.push(`Lose level-${size} in ${Math.floor(sec / 60)} min ${sec % 60} sec`);
  localStorage.setItem('Results', resultsArray);

  squares.forEach((square) => {
    if (square.classList.contains("mine")) {
      square.innerHTML = "💣";
      // square.classList.remove("mine");
      square.classList.add("checked");
    }
  });
}

function checkSquare(square, currentId) {
  const size = localStorage.getItem("size");
  const width = sizeObject[size].widthCeil;

  const isLeftEdge = currentId % width === 0; // left column
  const isRightEdge = currentId % width === width - 1; // right column
  setTimeout(() => {
    if (!isLeftEdge) {
      const newId = squares[parseInt(currentId) - 1].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (!isRightEdge) {
      const newId = squares[parseInt(currentId) + 1].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId >= width) {
      const newId = squares[parseInt(currentId - width)].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < width * (width - 1)) {
      const newId = squares[parseInt(currentId) + width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId >= width && !isLeftEdge) {
      const newId = squares[parseInt(currentId) - 1 - width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId >= width && !isRightEdge) {
      const newId = squares[+currentId - width + 1].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < width * (width - 1) && !isLeftEdge) {
      const newId = squares[+currentId - 1 + width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < width * (width - 1) && !isRightEdge) {
      const newId = squares[+currentId + 1 + width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
  }, 10);
}

function checkForWin() {
  const size = localStorage.getItem("size");
  const minesAmount = sizeObject[size].amountMines;

  let matches = 0;
  for (let i = 0; i < squares.length; i++) {
    if (
      squares[i].classList.contains("flag") &&
      squares[i].classList.contains("mine")
    ) {
      matches++;
    }
    if (matches === minesAmount) {
      if (sound.checked) new Audio("./asserts/win.wav").play();
      result.innerHTML = `Hooray! You found all mines in ${Math.floor(sec / 60)} min ${sec % 60} sec and ${stepsNumber} moves`;
      result.classList.add("game-win");
      clearInterval(time);
      isGameOver = true;
    }
  }
  if (matches === minesAmount) {
    resultsArray.push(`Win level-${size} in ${Math.floor(sec / 60)} min ${sec % 60} sec and ${stepsNumber} moves`)
    localStorage.setItem('Results', resultsArray);
}

}

function clearBoard() {
  const size = localStorage.getItem("size");
  const minesAmount = sizeObject[size].amountMines;

  mineContentInner.innerHTML = "";
  flags = 0;
  clearInterval(time);
  sec = 0;
  stepsNumber = 0;
  flagsAmount.innerHTML = minesAmount;
  timer.innerHTML = `${Math.floor(sec / 60)} min ${sec % 60} sec`;
  clicksNumber.innerHTML = `Clicks number: ${stepsNumber}`;
  result.innerHTML = "";
  result.classList.remove("game-over", "game-win");
  squares = [];
  isGameOver = false;
}
function toggleMenu() {
  dropDown.classList.toggle("hidden");
  dropDowns.classList.toggle("z-index");
  backOpacity.classList.toggle("menu-open");
}

// modal window with results
const modalOverlay = addHtmlElement("div", "modal-overlay", document.body);
const modalWindow = addHtmlElement("div", "modal", document.body);

dropDownResults.addEventListener("click", () => {
  toggleMenu();
  modalWindow.innerHTML = 'Last 10 results: ';
  const array = localStorage.getItem('Results').split(',').reverse();
  const length = array.length > 10 ? 10 : array.length;
  for (let i = 0; i < length; i++) {
    if (array[i] != '') {
      const classResult = array[i].includes('Win') ? 'result-win' : 'result-lose';
      addHtmlElement('li', classResult, modalWindow, `${i+1}. ${array[i]}`);
      }

    }

  modalWindow.classList.add("modal--visible");
  modalOverlay.classList.add("modal-overlay--visible");
});
modalOverlay.addEventListener("click", (e) => {
  if (e.target == modalOverlay) {
    modalOverlay.classList.remove("modal-overlay--visible");
    modalWindow.classList.remove("modal--visible");
  }
});


// save board , flags, timer, steps
function saveBoard() {
  const size = localStorage.getItem("size");
  const width = sizeObject[size].widthCeil;
  const object = {}

  for (let i = 0; i < width * width; i++) {
    const element = document.getElementById(i)
    object[i] = {
      classes: element.className,
      data: element.getAttribute('data') || '',
      innerHTML: element.innerHTML,
    }
  }
  localStorage.setItem('board', JSON.stringify(object));
}

function saveElements() {
  const objectElements = {};
  objectElements.flags = flags;
  objectElements.sec = sec;
  objectElements.isGameOver = isGameOver;
  objectElements.stepsNumber = stepsNumber;
  if (isGameOver) {
    objectElements.resultClass = result.classList[1];
    objectElements.resultHTML = result.innerHTML;
  }
  
  localStorage.setItem('elements', JSON.stringify(objectElements));
}

function loadElements() {
  const size = localStorage.getItem("size");
  const minesAmount = sizeObject[size].amountMines;

  const objectElements = JSON.parse(localStorage.getItem('elements'));
  sec = objectElements.sec;
  isGameOver = objectElements.isGameOver;
  flags = objectElements.flags;
  stepsNumber = objectElements.stepsNumber;
  resultClass = objectElements.resultClass;
  resultHTML = objectElements.resultHTML;

  timer.innerHTML = `${Math.floor(sec / 60)} min ${sec % 60} sec`;
  if (isGameOver) {
    result.innerHTML = resultHTML;
    result.classList.add(resultClass);
  } else {
    if (sec > 0) startTimer();
  }
  clicksNumber.innerHTML = `Clicks number: ${stepsNumber}`;
  flagsAmount.innerHTML = minesAmount - flags;
}

function loadBoard() {
  const size = localStorage.getItem("size");
  const width = sizeObject[size].widthCeil;
  const object = JSON.parse(localStorage.getItem('board'));

  for (let i = 0; i < width * width; i++) {
    const element = document.getElementById(i);
    element.className = '';
    element.innerHTML = '';
    element.setAttribute('data', '');

    element.className = object[i].classes;
    element.setAttribute('data', object[i].data);
    element.innerHTML = object[i].innerHTML;
  }

}


window.addEventListener('beforeunload', () => {
  saveBoard();
  saveElements();
})
window.addEventListener('load', () => { 
  createBoard();
  if (!localStorage.getItem('board')) {
      saveBoard();
  saveElements();
  }


  loadBoard();
  loadElements();
  if (localStorage.getItem('color') === 'true') {
    color.checked = true;
    toggleColor();
  }
})

// color theme
function toggleColor() {
  const topBarText = document.querySelector('.mine__top-bar__text');
  document.body.classList.toggle('color');
  topBar.classList.toggle('color');
  topBarText.classList.toggle('color');
  dropDownMenu.classList.toggle('color');
  mineContent.classList.toggle('color');
  result.classList.toggle('color');
  modalWindow.classList.toggle('color');
}