/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = "amzn1.ask.skill.b896bc9f-11dc-420f-b798-b7fd14f7117c";

const languageStrings = {
    'en': {
        translation: {
            JOKES: ['What goes up and down but does not move?... Stairs', 'Where should a 500 pound alien go?... On a diet', 'What did one toilet say to the other?... You look a bit flushed.', 'Why did the picture go to jail?... Because it was framed.', "What did one wall say to the other wall?... I'll meet you at the corner.", 'What did the paper say to the pencil?... Write on!', 'What do you call a boy named Lee that no one talks to?... Lonely', 'What gets wetter the more it dries?... A towel.', 'Why do bicycles fall over?... Because they are two-tired!', 'Why do dragons sleep during the day?... So they can fight knights!', 'What did Cinderella say when her photos did not show up?... Someday my prints will come!', 'Why was the broom late?... It over swept!', 'What part of the car is the laziest?... The wheels, because they are always tired!', 'What did the stamp say to the envelope?... Stick with me and we will go places!', 'What is blue and goes ding dong?... An Avon lady at the North Pole!', "We're you long in the hospital?... No, I was the same size I am now!", "Why couldn't the pirate play cards?... Because he was sitting on the deck!", 'What did the laundryman say to the impatient customer?... Keep your shirt on!', "What's the difference between a TV and a newspaper?... Ever tried swatting a fly with a TV", "What did one elevator say to the other elevator?... I think I'm coming down with something!", 'Why was the belt arrested?... Because it held up some pants!', 'Why was everyone so tired on April 1st?... They had just finished a March of 31 days.', "Which hand is it better to write with?... Neither, it's best to write with a pen!", "Why can't your nose be 12 inches long?... Because then it would be a foot!", 'What makes the calendar seem so popular?... Because it has a lot of dates!', 'Why did Mickey Mouse take a trip into space?... He wanted to find Pluto!', 'What is green and has yellow wheels?... Grass...I lied about the wheels!', 'What is it that even the most careful person overlooks?... Her nose!', 'Did you hear about the robbery last night?... Two clothes pins held up a pair of pants!', "Why do you go to bed every night?... Because the bed won't come to you!", "Why did Billy go out with a prune?... Because he couldn't find a date!", "Why do eskimos do their laundry in Tide?... Because it's too cold out-tide!", 'How do you cure a headache?... Put your head through a window and the pane will just disappear!', 'What has four wheels and flies?... A garbage truck!', "What kind of car does Mickey Mouse's wife drive?... A minnie van!", "Why don't traffic lights ever go swimming?... Because they take too long to change!", 'Why did the man run around his bed?... To catch up on his sleep!', 'Why did the robber take a bath before he stole from the bank?... He wanted to make a clean get away!', "Did you hear about the guy whose whole left side was cut off?... He's all right now.", "I'm reading a book about anti-gravity. It's impossible to put down.", 'I wondered why the baseball was getting bigger. Then it hit me.', "It's not that the man did not know how to juggle, he just didn't have the balls to do it.", "I'm glad I know sign language, it's pretty handy.", "My friend's bakery burned down last night. Now his business is toast.", 'Why did the cookie cry?... It was feeling crumby.', 'I used to be a banker, but I lost interest.', 'A drum and a symbol fall off a cliff', "Why do seagulls fly over the sea?... Because they aren't bay-gulls!", 'Why did the fireman wear red, white, and blue suspenders?... To hold his pants up.', "Why didn't the crab share his food?... Because crabs are territorial animals, that don't share anything.", "Why was the javascript developer sad?... Because he didn't Node how to Express himself.", 'What do I look like?... A JOKE MACHINE!?...', 'How did the hipster burn the roof of his mouth?... He ate the pizza before it was cool.', 'Why is it hard to make puns for kleptomaniacs?... They are always taking things literally.', 'Why do mermaid wear sea-shells?... Because b-shells are too small.', "I'm a humorless, cold hearted, machine.", "Two fish in a tank. One looks to the other and says 'Can you even drive this thing?'", "Two fish swim down a river, and hit a wall. One says: 'Dam!'", "What's funnier than a monkey dancing with an elephant?... Two monkeys dancing with an elephant.", 'How did Darth Vader know what Luke was getting for Christmas?... He felt his presents.', "What's red and bad for your teeth?... A Brick.", "What's orange and sounds like a parrot?... A Carrot.", 'What do you call a cow with no legs?... Ground beef', "Two guys walk into a bar. You'd think the second one would have noticed.", "What is a centipedes's favorite Beatle song?...  I want to hold your hand, hand, hand, hand...", 'What do you call a chicken crossing the road?... Poultry in moton.', 'Did you hear about the Mexican train killer?...  He had locomotives', 'What do you call a fake noodle?...  An impasta', 'How many tickles does it take to tickle an octupus?... Ten tickles!', 'At the rate law schools are turning them out, by 2050 there will be more lawyers than humans.']
            ,
            SKILL_NAME: 'Humour Me',
            LAUNCH_MESSAGE: 'Welcome to Humour Me... To listen a joke try saying, tell me a joke. What can I help you with?',
            HELP_MESSAGE: "You can say, tell me a joke, or you can say, tell me a funny joke, or, you can say exit... What can I help you with?",
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye! Have a lively day.'
        }
    }
};

const handlers = {
    'LaunchRequest': function () {
        const speechOutput = this.t('LAUNCH_MESSAGE');
        const reprompt = this.t('LAUNCH_MESSAGE');
        this.emit(':ask', speechOutput, reprompt, false);
    },
    'SessionEndedRequest': function () {
        console.log('session ended')
    },
    'Getjokeintent': function () {
        this.emit('GetJoke');
    },
    'GetJoke': function () {
        // Get a random space fact from the space facts list
        // Use this.t() to get corresponding language data
        const jokesArr = this.t('JOKES');
        const jokesIndex = Math.floor(Math.random() * jokesArr.length);
        const randomJoke = jokesArr[jokesIndex];

        // Create speech output
        const speechOutput = randomJoke;
        this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), randomJoke);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function () {
        console.log('unhandled')
        this.emit(':tell', this.t('STOP_MESSAGE'));
    }
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
