class Poeme {
    constructor(lines) {
        this.lines = lines;
    }

    getLines = function() {
        return this.lines;
    }

    format = function() {
        let format = "";
        this.lines.forEach(line => { format += line + "\n"; });
        return format;
    }

    log = function() {
        console.log(this.format());
    }
}

class Bank {
    constructor(bank) {
        this.bank = bank;
    }

    random = function() {
        let random = this.bank.map(lines => lines[Math.floor(Math.random() * lines.length)]);
        return new Poeme(random); 
    }
}

class BristolsBank extends Bank {
    random = function() {
        let random = this.bank.sort((a, b) => 0.5 - Math.random());
        return new Poeme(random);
    }
}

class Conte {
    constructor(chapters) {
        this.chapters = chapters;
    }

    getChapters = function() {
        return this.chapters;
    }

    getChoicesFromChapter(id) {
        return this.chapters[id].choices;
    }
}

let M = {
    datas: undefined,

    haikuBank: undefined,
    sonnetBank: undefined,
    bristolsBank: undefined,
    conte: undefined,
    
    init: function() {
        M.initBanks();
    },

    initBanks: function() {
        M.haikuBank = new Bank(M.datas.haiku);
        M.sonnetBank = new Bank(M.datas.sonnet);
        M.bristolsBank = new BristolsBank(M.datas.bristols);
        M.conte = new Conte(M.datas.conte);
    },

    getHaikuDescription: function() {
        const nbCombinaisons = Math.pow(M.datas.haiku[0].length, M.datas.haiku.length);
        M.datas.haikuDesc = M.datas.haikuDesc.replace('$', nbCombinaisons);
        return M.datas.haikuDesc;
    },

    getSonnetDescription: function() {
        const nbCombinaisons = Math.pow(M.datas.sonnet[0].length, M.datas.sonnet.length);
        M.datas.sonnetDesc = M.datas.sonnetDesc.replace('$', nbCombinaisons);
        return M.datas.sonnetDesc;
    },

    getBristolsDescription: function() {
        return M.datas.bristolsDesc;
    },

    getConteDescription: function() {
        return M.datas.conteDesc;
    }
}

let C = {
    init: async function() {
        M.datas = await C.loadJson();
        M.init();
        V.init();
        C.showHaikuHandler();
    },

    loadJson: async function() {
        const req = await fetch('./json/datas.json');
        return await req.json();
    },

    showHaikuHandler: function() {
        const descInfo = M.getHaikuDescription();
        V.updateDescription(descInfo);
        V.showHaiku();
    },

    showSonnetHandler: function() {
        const descInfo = M.getSonnetDescription();
        V.updateDescription(descInfo);
        V.showSonnet();
    },

    showBristolsHandler: function() {
        const descInfo = M.getBristolsDescription();
        V.updateDescription(descInfo);
        V.showBristols();
    },

    showConteHandler: function() {
        const descInfo = M.getConteDescription();
        V.updateDescription(descInfo);
        V.showConte();
    },

    newHaikuHandler: function() {
        const haiku = M.haikuBank.random();
        V.updateHaiku(haiku.getLines());
    },

    newSonnetHandler: function() {
        const sonnet = M.sonnetBank.random();
        V.updateSonnet(sonnet.getLines());
    },

    newBristolsHandler: function() {
        const bristols = M.bristolsBank.random();
        V.updateBristols(bristols.getLines());
    },

    newConteHandler: function() {
        const chapters = M.conte.getChapters();
        V.startConte(chapters);
    },

    nextChapterHandler: function(e) {
        const directionID = e.target.dataset.direction;
        const chapter = M.conte.getChapters().find(c => c.id == directionID);
        V.nextChapter(chapter);
    }
}

let V = {
    init: function() {
        // Global
        V.allDiv = document.querySelectorAll('.view__element');
        V.allButton = document.querySelectorAll('.header__nav__ul__li__button');

        // Cursor
        V.cursor = document.querySelector('.cursor');
        V.hoverable = document.querySelectorAll('.hoverable')

        // Haiku
        V.showHaikuButton = document.querySelector('#showHaiku');
        V.newHaikuButton = document.querySelector('#generateHaiku');
        V.haiku = document.querySelector('#haiku');
        V.haikuDiv = document.querySelector('.view__haiku');

        // Sonnet
        V.showSonnetButton = document.querySelector('#showSonnet');
        V.newSonnetButton = document.querySelector('#generateSonnet');
        V.sonnet = document.querySelector('#sonnet');
        V.sonnetDiv = document.querySelector('.view__sonnet');

        // Bristols
        V.showBristolsButton = document.querySelector('#showBristols');
        V.newBristolsButton = document.querySelector('#generateBristols');
        V.bristols = document.querySelector('#bristols');
        V.bristolsDiv = document.querySelector('.view__bristols');

        // Conte
        V.showConteButton = document.querySelector('#showConte');
        V.newConteButton = document.querySelector('#generateConte');
        V.conte = document.querySelector('#conte');
        V.conteDiv = document.querySelector('.view__conte');
        V.conteStory = document.querySelector('.view__conte__story');
        V.conteChoices = document.querySelector('.view__conte__choices');

        // Background
        V.bgGradienElement = document.querySelector('.background__gradient');
        V.colorHaiku = "background__gradient--blue";
        V.colorSonnet = "background__gradient--green";
        V.colorBristols = "background__gradient--red";
        V.colorConte = "background__gradient--grey";

        // Description
        V.description = document.querySelector('.header__description');

        V.bindEvents();
    },

    bindEvents: function() {
        V.showHaikuButton.addEventListener("click", C.showHaikuHandler);
        V.showSonnetButton.addEventListener("click", C.showSonnetHandler);
        V.showBristolsButton.addEventListener("click", C.showBristolsHandler);
        V.showConteButton.addEventListener("click", C.showConteHandler);

        V.newHaikuButton.addEventListener("click", C.newHaikuHandler);
        V.newSonnetButton.addEventListener("click", C.newSonnetHandler);
        V.newBristolsButton.addEventListener("click", C.newBristolsHandler);
        V.newConteButton.addEventListener("click", C.newConteHandler);

        V.hoverable.forEach(e => {
            e.addEventListener("mouseover", V.addHoverButton);
            e.addEventListener("mouseout", V.removeHoverButton);
        });
    },

    updateDescription: function(desc) {
        V.description.textContent = desc;
    },

    showHaiku: function() {
        V.resetHaiku();

        Array.from(V.allDiv).find(div => div.classList.contains("active")).classList.remove("active");
        Array.from(V.allButton).find(btn => btn.classList.contains("button--active")).classList.remove("button--active");

        V.haikuDiv.classList.add("active");
        V.showHaikuButton.classList.add("button--active");
        
        V.changeColor(V.colorHaiku);
    },

    showSonnet: function() {
        V.resetSonnet();
        
        Array.from(V.allDiv).find(div => div.classList.contains("active")).classList.remove("active");
        Array.from(V.allButton).find(btn => btn.classList.contains("button--active")).classList.remove("button--active");

        V.sonnetDiv.classList.add("active");
        V.showSonnetButton.classList.add("button--active");

        V.changeColor(V.colorSonnet);
    },

    showBristols: function() {
        V.resetBristols();

        Array.from(V.allDiv).find(div => div.classList.contains("active")).classList.remove("active");
        Array.from(V.allButton).find(btn => btn.classList.contains("button--active")).classList.remove("button--active");

        V.bristolsDiv.classList.add("active");
        V.showBristolsButton.classList.add("button--active");

        V.changeColor(V.colorBristols);
    },

    showConte: function() {
        V.resetConte();

        Array.from(V.allDiv).find(div => div.classList.contains("active")).classList.remove("active");
        Array.from(V.allButton).find(btn => btn.classList.contains("button--active")).classList.remove("button--active");

        V.conteDiv.classList.add("active");
        V.showConteButton.classList.add("button--active");


        V.changeColor(V.colorConte);
    },

    updateHaiku: function(lines) {
        V.resetHaiku();
        lines.forEach(line => {
            var li = document.createElement("li");
            li.textContent = line;
            V.haiku.append(li);
        })
    },

    updateSonnet: function(lines) {
        V.resetSonnet();
        var divQuatrain1 = document.createElement("div");
        var divQuatrain2 = document.createElement("div");
        var divQuatrain3 = document.createElement("div");
        var divQuatrain4 = document.createElement("div");

        for(i=1; i<=lines.length; i++) {
            var li = document.createElement("li");
            li.textContent = lines[i-1];
            // V.sonnet.append(li);
            if(i >= 1 && i <= 4) divQuatrain1.append(li);
            if(i >= 5 && i <= 8) divQuatrain2.append(li);
            if(i >= 9 && i <= 11) divQuatrain3.append(li);
            if(i >= 12 && i <= 14) divQuatrain4.append(li);
        }
        
        V.sonnet.append(divQuatrain1);
        V.sonnet.append(divQuatrain2);
        V.sonnet.append(divQuatrain3);
        V.sonnet.append(divQuatrain4);
    },

    updateBristols: function(lines) {
        V.resetBristols();
        for(i=1; i<=lines.length; i++) {
            var card = document.createElement("li");
            card.classList.add("view__bristols__list__card");

            var content = document.createElement("p");
            content.classList.add("view__bristols__list__card__text");
            content.textContent = lines[i-1];

            var num = document.createElement("p");
            num.classList.add("view__bristols__list__card__num");
            num.textContent = i;

            card.append(content);
            card.append(num);
            V.bristols.append(card);
        }
    },

    updateConte: function(chapter) {
        V.conteStory.textContent = chapter.story;
        chapter.choices.forEach(choice => {
            var choiceElement = document.createElement('li');
            choiceElement.textContent = choice.text;
            choiceElement.classList.add('button');
            choiceElement.classList.add('view__conte__choices__li');
            choiceElement.dataset.direction = choice.directionID;
            choiceElement.addEventListener("click", C.nextChapterHandler);
            V.conteChoices.append(choiceElement);
        });
    },

    startConte: function(chapters) {
        V.resetConte();
        V.conteStory.classList.add("view__conte__story--started")
        V.newConteButton.textContent = "Relancer le conte";
        const chapter = chapters.find(c => c.id == 1);
        V.updateConte(chapter);
    },

    nextChapter: function(chapter) {
        V.resetConte();
        V.updateConte(chapter);
    },

    resetHaiku: function() {
        V.haiku.innerHTML = "";
    },

    resetSonnet: function() {
        V.sonnet.innerHTML = "";
    },

    resetBristols: function() {
        V.bristols.innerHTML = "";
    },

    resetConte: function() {
        V.conteStory.innerHTML = "";
        V.conteChoices.innerHTML = "";
    },

    addHoverButton: function() {
        V.cursor.classList.add("cursor--hovering");
    },

    removeHoverButton: function() {
        V.cursor.classList.remove("cursor--hovering");
    },

    changeColor: function(color) {
        // V.bgGradienElement.classList.remove("background__gradient--blue");
        // V.bgGradienElement.classList.remove("background__gradient--green");
        // V.bgGradienElement.classList.remove("background__gradient--red");
        // V.bgGradienElement.classList.remove("background__gradient--grey");
        V.bgGradienElement.className = `background__gradient ${color}`;
    }
}

C.init();