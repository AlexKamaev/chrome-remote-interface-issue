const CDP            = require('chrome-remote-interface');
const ChromeLauncher = require('chrome-launcher');

async function start () {
    ChromeLauncher.launch({
        startingUrl: 'https://stripe-payments-demo.appspot.com/',
        port:        9223,
    }).then(chrome => {
        console.log(`Chrome debugging port running on ${chrome.port}`);
    }).then(async () => {
            const client = await CDP({ port: 9223 });

            await client.Target.setAutoAttach({
                autoAttach:             true,
                waitForDebuggerOnStart: false,
                flatten:                true
            });

            // Enable for iframes
            await client.Target.on('attachedToTarget', async (event) => {
                console.log('INIT NETWORK EVENTS: ' + event.sessionId + ':' + event.targetInfo.type);

                await client.Fetch.enable({}, event.sessionId);
                await client.Network.enable({}, event.sessionId);
            });

            await client.Fetch.enable({});

            client.Network.on('requestWillBeSent', e => {
                // console.log('Network.requestWillBeSent: ' + e.request.url + ':' + e.requestId);
            });

            client.Fetch.on('requestPaused', (e, sessionId) => {
                console.log('Fetch.requestPaused: ' + e.request.url);

                if (e.responseStatusCode === void 0) {
                    client.Fetch.continueRequest({ requestId: e.requestId }, sessionId)
                }
                else {
                    client.Fetch.continueResponse({ requestId: e.requestId }, sessionId);
                }
            });
        }
    )
}

start();
