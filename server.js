
const EXPRESS = require("express");
const SM_NODE_CLIENT = require("sourcemint-node/lib/client");


var app = EXPRESS();

app.use(EXPRESS.bodyParser());

app.post("/api/github.com/post-receive", function(req, res) {

    if (req.body && req.body.payload) {
        var payload = false;
        try {
            payload = JSON.parse(req.body.payload);
        } catch(err) {
            console.error(err.stack);
            res.writeHead(500);
            res.end("Error parsing payload!");
            return;
        }

        if (payload.ref) {
            console.log("Got '/api/github.com/post-receive' for '" + payload.repository.url + "' at ref '" + payload.ref + "'!");

            if (/^refs\/tags\//.test(payload.ref)) {

                console.log("Broadcasting `RepositoryNewTag` event.");

                SM_NODE_CLIENT.broadcast("RepositoryNewTag", {
                    repository: payload.repository.url,
                    tag: payload.ref.match(/\/([^\/]*)$/)[1]
                });
            }
        }

        res.send("OK");
        return;
    }
    res.writeHead(400);
    res.end();
});

app.listen(9999);
