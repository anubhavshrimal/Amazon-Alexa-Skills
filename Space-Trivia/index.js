'use strict';
var Alexa = require("alexa-sdk");

const APP_ID = undefined;

exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.dynamoDBTableName = 'spaceTrivia';
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'NewSession': function() {
        if(Object.keys(this.attributes).length === 0) {
            setUserStatus.call(this, "easy", 0);
        }
        this.emit("LaunchRequest");
    },
    'LaunchRequest': function() {
        getPrompt.call(this, "Welcome to Space Trivia! ");
    },
    'QuestionIntent': function() {
        getPrompt.call(this, "");
    },
    'AnswerIntent': function () {
        //get and check the answer
        let stage = this.attributes['currentStage'];
        let level = parseInt(this.attributes['currentLevel']);

        let slotValues = getSlotValues(this.event.request.intent.slots);
        let givenAnswer = slotValues.answer.resolved;
        let correctAnswer = spaceTriviaQuiz[stage][level].answer;

        let speechOutput = "";

        if(givenAnswer != undefined && correctAnswer.toUpperCase() == givenAnswer.toUpperCase()) {
            speechOutput += getSpeechCon(true)+ " you got it! " + givenAnswer + " was right. ";
            
            // increase their level
            this.attributes['currentLevel'] = parseInt(level) + 1;
            checkUserStatus.call(this);

            if (this.attributes['currentStage'] == "easy" && parseInt(this.attributes['currentLevel']) == 0) {
                // if we reach this circle back to the beginning state, they have finished all of the mixes
                speechOutput += " And you completed all of the space trivia!";
            }

            speechOutput += " To know a fact related to "+ givenAnswer +", say play fact. To move on, say next question.";
            this.response.speak(speechOutput).listen("Say, play fact or next question.");
            this.emit(':responseReady');
        } else {
            //incorrect + hint
            speechOutput =
                getSpeechCon(false) 
                    + " you are almost right! Here is a hint. "
                    + spaceTriviaQuiz[stage][level].hint
                    + ". Now let's try that one again. ";
            getPrompt.call(this, speechOutput);
        }
    },
    'PlayFactIntent': function() {
        // since the user status was already updated, call playScene with the previous state
        let stage = this.attributes['currentStage'];
        let level = parseInt(this.attributes['currentLevel']);
        let tempStage = stage;
        let tempLevel = level - 1;
        if (level == 0) {
            switch(stage) {
                case "easy":
                    tempStage = "hard";
                    break;
                case "medium":
                    tempStage = "easy";
                    break;
                case "hard":
                    tempStage = "medium";
                    break;
                default:
                    getPrompt.call(this, "Could not play fact at this time. ");
            }
            tempLevel = spaceTriviaQuiz[tempStage].length - 1;
        }

        playScene.call(this, tempStage, tempLevel);
    },
    'HintIntent': function() {
        let speechOutput = "Here is a hint. " + spaceTriviaQuiz[this.attributes['currentStage']][this.attributes['currentLevel']].hint + ". Here it comes again, ";
        getPrompt.call(this, speechOutput);
    },
    'NewGameIntent':function(){
      this.emit('LaunchRequest');
    },

    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak("You can try: let's play a game");
        this.response.listen("You can try: let's play a game");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.emit('AMAZON.HelpIntent');
    }
};


//=========================================================================================================================================
// HELPER FUNCTIONS
//=========================================================================================================================================

function setUserStatus(stage, level) {
    this.attributes['currentStage'] = stage;
    this.attributes['currentLevel'] = level;
    console.log("attributes after" + this.attributes['currentStage'], this.attributes['currentLevel']);
}

function checkUserStatus() {
    let stage = this.attributes['currentStage'];
    let level = this.attributes['currentLevel'];
    
    // new user
    if(stage == undefined || level == undefined) {
        console.log("New user made")
        setUserStatus.call(this, "easy", 0);
    }
    
    //account for an incorrect status
    if (parseInt(level) >= spaceTriviaQuiz[stage].length) {
        if (stage == 'easy') {
            setUserStatus.call(this, "medium", 0);
        } else if (stage == 'medium') {
            setUserStatus.call(this, "hard", 0);
        } else {
            setUserStatus.call(this, "easy", 0);
        }
    }
}

function getPrompt(speechOutput) {
    checkUserStatus.call(this);

    let stage = this.attributes['currentStage'];
    let level = parseInt(this.attributes['currentLevel']);

    let data = spaceTriviaQuiz[stage][level];
    speechOutput += data.question;

    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(':responseReady');
}

function playScene(stage, level) {
    let fact = spaceTriviaQuiz[stage][level].fact;
    let speechOutput = fact + getSpeechCon(true) + " that was fun! Here comes your next question. ";
    getPrompt.call(this, speechOutput);
}

function getSpeechCon(type) {
    var speechCon = "";
    if (type) return "<say-as interpret-as='interjection'>" + speechConsCorrect[getRandom(0, speechConsCorrect.length-1)] + "! </say-as><break strength='strong'/>";
    else return "<say-as interpret-as='interjection'>" + speechConsWrong[getRandom(0, speechConsWrong.length-1)] + " </say-as><break strength='strong'/>";
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max-min+1)+min);
}

//This is a list of positive speechcons that this skill will use when a user gets a correct answer.  For a full list of supported
//speechcons, go here: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference
var speechConsCorrect = ["Booya", "All righty", "Bam", "Bazinga", "Bingo", "Boom", "Bravo", "Cha Ching", "Cheers", "Dynomite",
"Hip hip hooray", "Hurrah", "Hurray", "Huzzah", "Oh dear.  Just kidding.  Hurray", "Kaboom", "Kaching", "Oh snap", "Phew",
"Righto", "Way to go", "Well done", "Whee", "Woo hoo", "Yay", "Wowza", "Yowsa"];

//This is a list of negative speechcons that this skill will use when a user gets an incorrect answer.  For a full list of supported
//speechcons, go here: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference
var speechConsWrong = ["Argh", "Aw man", "Blarg", "Blast", "Boo", "Bummer", "Darn", "D'oh", "Dun dun dun", "Eek", "Honk", "Le sigh",
"Mamma mia", "Oh boy", "Oh dear", "Oof", "Ouch", "Ruh roh", "Shucks", "Uh oh", "Wah wah", "Whoops a daisy", "Yikes"];

function getSlotValues (filledSlots) {
    //given event.request.intent.slots, a slots values object so you have
    //what synonym the person said - .synonym
    //what that resolved to - .resolved
    //and if it's a word that is in your slot values - .isValidated
    let slotValues = {};

    console.log(JSON.stringify(filledSlots));

    Object.keys(filledSlots).forEach(function(item) {
        //console.log("item in filledSlots: "+JSON.stringify(filledSlots[item]));
        var name=filledSlots[item].name;
        //console.log("name: "+name);
        if(filledSlots[item]&&
           filledSlots[item].resolutions &&
           filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
           filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
           filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code ) {

            switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
                case "ER_SUCCESS_MATCH":
                    slotValues[name] = {
                        "synonym": filledSlots[item].value,
                        "resolved": filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
                        "isValidated": filledSlots[item].value == filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name
                    };
                    break;
                case "ER_SUCCESS_NO_MATCH":
                    slotValues[name] = {
                        "synonym":filledSlots[item].value,
                        "resolved":filledSlots[item].value,
                        "isValidated":false
                    };
                    break;
                }
            } else {
                slotValues[name] = {
                    "synonym": filledSlots[item].value,
                    "resolved":filledSlots[item].value,
                    "isValidated": false
                };
            }
        },this);
        //console.log("slot values: "+JSON.stringify(slotValues));
        return slotValues;
}

//=========================================================================================================================================
// DATA
//=========================================================================================================================================

const spaceTriviaQuiz = {
    "easy": [
        {
            "answer":"Neil Armstrong",
            "question":"Who was the first astronaut that landed on the moon in 1969?",
            "hint":"his last name is armstrong",
            "synonyms":["neil"],
            "fact":"Buzz Aldrin was the second person to land on the moon."
        },
        {
            "answer":"Mercury",
            "question":"What is the closest planet to the Sun?",
            "synonyms":[],
            "hint":"It is also the name of the metal in a thermometer",
            "fact":"Mercury is the smallest planet of the solar system."
        },
        {
            "answer":"A star",
            "question":"Is the sun a star or a planet?",
            "synonyms":["star", "little star", "twinkling star"],
            "hint":"twinkle twinkle",
            "fact":"One million Earths could fit inside the Sun."
        },
        {
            "answer":"Mars",
            "question":"What planet is known as the red planet?",
            "synonyms":[],
            "hint":"It is like the neighbor of Earth",
            "fact":"Mars is home to the tallest mountain in the solar system named Olympus Mons."
        }
        
    ],
    "medium": [
        {
            "answer":"Saturn",
            "question":"What is the name of the 2nd biggest planet in our solar system?",
            "synonyms":["rings planet"],
            "hint":"It has rings around it.",
            "fact":"Saturn can be seen with the naked eye. It is the fifth brightest object in the solar system."
        },
        {
            "answer":"Venus",
            "question":"What is the hottest planet in our solar system?",
            "synonyms":[],
            "hint":"Goddess of love has the same name as this planet.",
            "fact":"The surface temperature on Venus can reach 471 degree celsius."
        }
    ],
    "hard": [
        {
            "answer":"Hubble Space Telescope",
            "question":"What is the name of NASA’s most famous space telescope?",
            "synonyms":["Hubble", "Hubble telescope"],
            "hint":"It starts with letter H",
            "fact":"Hubble can observe the furthest away galaxies ever seen but there are a couple of nearby objects it cannot look at. These are the Sun and the planet Mercury."
        },
        {
            "answer":"The Milky Way Galaxy",
            "question":"Earth is located in which galaxy?",
            "synonyms":["milky way", "milky way galaxy", "milky galaxy", "milky"],
            "hint":"Milk can help you with its name.",
            "fact":"Our galaxy will collide with Andromeda Galaxy in about 5 billion years."
        }
    ]
};