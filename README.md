# chrome-remote-interface-issue

1. run the `node index.js > result.txt` command
2. switch to the chrome window
3. open DevTools, Network tab
4. clear the Network tab
5. click on the Card Number field
6. check that the request to `https://r.stripe.com/0` apeared in the Network Tab
7. check that the `result.txt` file does not contains logged request to `https://r.stripe.com/0` 
