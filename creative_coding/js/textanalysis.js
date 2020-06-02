function setupApi() {

    window.loadedApi = UTILS.DeferredPromise();

    gapi.load('client', function() {
        gapi.client.init({
            'apiKey': 'AIzaSyBYry8O_oJgNjG2BrfmFJ7GZnAUqzWUITg',
            'discoveryDocs': ['https://language.googleapis.com/$discovery/rest?version=v1beta1'],
        }).then(function() {
            console.log('API loaded')
            window.loadedApi._resolve();
        });
    });

    return window.loadedApi;
}


async function request(text, options = {}) {

    let defaults = {
        language: 'FR', //'DE''FR''IT''ES',
        extractSyntax: true,
        extractEntities: false,
        extractDocumentSentiment: false,
    }

    options = Object.assign({}, defaults, options);

    await window.loadedApi;

    let response = await gapi.client.language.documents.annotateText({
        'document': {
            'type': 'PLAIN_TEXT',
            'content': text,
            'language': options.language,
        },
        'features': {
            'extractSyntax': options.extractSyntax,
            'extractEntities': options.extractEntities,
            'extractDocumentSentiment': options.extractDocumentSentiment,
        },
        "encodingType": "UTF8"
    });

    return response;
}

async function getTokens(text, options = {}) {

    let response = await request(text, options);
    console.log('text loaded');

    return response.result.tokens
}

function analyseChunk(result, sentence, entities) {
    let simpEntities = simplifyEntities(entities);

    let text = sentence.text.content;
    let score = sentence.sentiment.score;
    let chunks = text.split(/\s+/g); //séparer les mots par les white spaces (espace, tabs, newlines)

    let ignoredChar = /[!-/:-@[-`{-~¡-©«-¬®-±´¶-¸»¿×÷˂-˅˒-˟˥-˫˭˯-˿͵;΄-΅·϶҂՚-՟։-֊־׀׃׆׳-״؆-؏؛؞-؟٪-٭۔۩۽-۾܀-܍߶-߹।-॥॰৲-৳৺૱୰௳-௺౿ೱ-ೲ൹෴฿๏๚-๛༁-༗༚-༟༴༶༸༺-༽྅྾-࿅࿇-࿌࿎-࿔၊-၏႞-႟჻፠-፨᎐-᎙᙭-᙮᚛-᚜᛫-᛭᜵-᜶។-៖៘-៛᠀-᠊᥀᥄-᥅᧞-᧿᨞-᨟᭚-᭪᭴-᭼᰻-᰿᱾-᱿᾽᾿-῁῍-῏῝-῟῭-`´-῾\u2000-\u206e⁺-⁾₊-₎₠-₵℀-℁℃-℆℈-℉℔№-℘℞-℣℥℧℩℮℺-℻⅀-⅄⅊-⅍⅏←-⏧␀-␦⑀-⑊⒜-ⓩ─-⚝⚠-⚼⛀-⛃✁-✄✆-✉✌-✧✩-❋❍❏-❒❖❘-❞❡-❵➔➘-➯➱-➾⟀-⟊⟌⟐-⭌⭐-⭔⳥-⳪⳹-⳼⳾-⳿⸀-\u2e7e⺀-⺙⺛-⻳⼀-⿕⿰-⿻\u3000-〿゛-゜゠・㆐-㆑㆖-㆟㇀-㇣㈀-㈞㈪-㉃㉐㉠-㉿㊊-㊰㋀-㋾㌀-㏿䷀-䷿꒐-꓆꘍-꘏꙳꙾꜀-꜖꜠-꜡꞉-꞊꠨-꠫꡴-꡷꣎-꣏꤮-꤯꥟꩜-꩟﬩﴾-﴿﷼-﷽︐-︙︰-﹒﹔-﹦﹨-﹫！-／：-＠［-｀｛-･￠-￦￨-￮￼-�]|\ud800[\udd00-\udd02\udd37-\udd3f\udd79-\udd89\udd90-\udd9b\uddd0-\uddfc\udf9f\udfd0]|\ud802[\udd1f\udd3f\ude50-\ude58]|\ud809[\udc00-\udc7e]|\ud834[\udc00-\udcf5\udd00-\udd26\udd29-\udd64\udd6a-\udd6c\udd83-\udd84\udd8c-\udda9\uddae-\udddd\ude00-\ude41\ude45\udf00-\udf56]|\ud835[\udec1\udedb\udefb\udf15\udf35\udf4f\udf6f\udf89\udfa9\udfc3]|\ud83c[\udc00-\udc2b\udc30-\udc93]/g

    let amp = 5;

    for (let text of chunks) {

        let word = text.replace(ignoredChar, '');
        let salience = simpEntities[word] || 0;

        salience *= amp;

        let attributes = {
            word: word,
            text: text,
            scoreContext: score,
            scoreWord: Math.sign(score || 1) * (Math.abs(score) + salience),
            salience: salience
        }

        result.push(attributes);
    }
}

function getColumnIdByScore(score) {

    let scores = [];
    for (let column of COLUMNS) {
        scores.push(column.score);
    }

    let columnId = UTILS.getClosestInArray(score, scores);

    return columnId;
}

function simplifyEntities(entities) {

    let result = {};

    for (let entity of entities) {
        result[entity.name] = entity.salience;
    }

    return result;

}
