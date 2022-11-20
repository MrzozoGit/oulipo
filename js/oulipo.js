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

var M = {
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

var C = {
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

var V = {
    init: function() {
        V.newHaikuButton = document.querySelector('#generateHaiku');
        V.haiku = document.querySelector('#haiku');
        V.newSonnetButton = document.querySelector('#generateSonnet');
        V.sonnet = document.querySelector('#sonnet');

        V.bindEvents();
    },

    bindEvents: function() {
        V.newHaikuButton.addEventListener("click", C.newHaikuHandler);
        V.newSonnetButton.addEventListener("click", C.newSonnetHandler);
    },

    updateHaiku: function(lines) {
        V.haiku.innerHTML = "";
        lines.forEach(line => {
            var li = document.createElement("li");
            li.textContent = line;
            V.haiku.append(li);
        })
    },

    updateSonnet: function(lines) {
        V.sonnet.innerHTML = "";
        lines.forEach(line => {
            var li = document.createElement("li");
            li.textContent = line;
            V.sonnet.append(li);
        })
    }
}

C.init();