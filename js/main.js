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

let M = {
    datas: undefined,

    haikuBank: undefined,
    sonnetBank: undefined,
    
    init: function() {
        M.initBanks();
    },

    initBanks: function() {
        M.haikuBank = new Bank(M.datas.haiku);
        M.sonnetBank = new Bank(M.datas.sonnet);
    },
}

let C = {
    init: async function() {
        M.datas = await C.loadJson();
        M.init();
        V.init();
    },

    loadJson: async function() {
        const req = await fetch('./json/datas.json');
        return await req.json();
    },

    newHaikuHandler: function() {
        const haiku = M.haikuBank.random();
        V.updateHaiku(haiku.getLines());
    },

    newSonnetHandler: function() {
        const sonnet = M.sonnetBank.random();
        V.updateSonnet(sonnet.getLines());
    }

}

let V = {
    init: function() {
        V.cursor = document.querySelector('.cursor');
        V.hoverable = document.querySelectorAll('.hoverable')

        V.showHaikuButton = document.querySelector('#showHaiku');
        V.newHaikuButton = document.querySelector('#generateHaiku');
        V.haiku = document.querySelector('#haiku');
        V.haikuDiv = document.querySelector('.view__haiku');

        V.showSonnetButton = document.querySelector('#showSonnet');
        V.newSonnetButton = document.querySelector('#generateSonnet');
        V.sonnet = document.querySelector('#sonnet');
        V.sonnetDiv = document.querySelector('.view__sonnet');

        V.bindEvents();
    },

    bindEvents: function() {
        V.showHaikuButton.addEventListener("click", V.showHaiku);
        V.showSonnetButton.addEventListener("click", V.showSonnet);

        V.newHaikuButton.addEventListener("click", C.newHaikuHandler);
        V.newSonnetButton.addEventListener("click", C.newSonnetHandler);

        V.hoverable.forEach(e => {
            e.addEventListener("mouseover", V.addHoverButton);
            e.addEventListener("mouseout", V.removeHoverButton);
        });
    },

    // optimiser pour retirer à toutes les combinatoires
    showHaiku: function() {
        V.resetHaiku();
        V.haikuDiv.classList.add("active");
        V.sonnetDiv.classList.remove("active");
    },

    showSonnet: function() {
        V.resetSonnet();
        V.sonnetDiv.classList.add("active");
        V.haikuDiv.classList.remove("active");
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
        lines.forEach(line => {
            var li = document.createElement("li");
            li.textContent = line;
            V.sonnet.append(li);
        })
    },

    addHoverButton: function() {
        V.cursor.classList.add("cursor--hovering");
    },

    removeHoverButton: function() {
        V.cursor.classList.remove("cursor--hovering");
    },

    resetHaiku: function() {
        V.haiku.innerHTML = "";
    },

    resetSonnet: function() {
        V.sonnet.innerHTML = "";
    }
}

C.init();