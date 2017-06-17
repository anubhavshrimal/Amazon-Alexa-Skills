# Amazon-Alexa-Skill-Famous-Quotes
[Amazon Market Link](https://www.amazon.com/Anubhav-Shrimal-Famous-Quotes/dp/B071KLJHJ1)
Amazon Alexa Skill made using Alexa Skills Kit and AWS Lambda function

- Used AWS Lambda function to run node.js V6.0 on a server less platform.
- Code for Lambda function present in [index.js](./index.js).
- [authors.txt](./authors.txt) is the list of authors used as slot variables for `AUTHOR` {author} custom slot.
- [utterances.md](./utterances.md) has all the utterances used to build the Voice User Interface of the Alexa Skill.
- App tested on [https://echosim.io/](https://echosim.io/).
- Number of quotes = 1600+
- Number of authors = 600+
- You may say:
    
    "Ask famous quotes to tell me a quote"
    "Ask famous quotes for a quote"
    "Ask famous quotes to inspire me" 
    "Ask famous quotes to tell me Mahatma Gandhi's quote"
    etc.
- In response to which you may get:
    
    "Wayne Dyer once said, You'll see it when you believe it."
    "Mahatma Gandhi once said, Strength does not come from physical capacity. It comes from an indomitable will."
    etc.