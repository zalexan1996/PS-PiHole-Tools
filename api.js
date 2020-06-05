const express = require('express');
const shell = require('shelljs');
const fs = require("fs");

var port = process.env.pihole_port || 3000;

var app = express();
app.use(express['static'](__dirname));





// Status Page
app.get('/pihole/status',function(req, res) {
        if (authenticate(req)) {
                var data = shell.exec("pihole status").stdout;
                res.status(200).send(data);
        }
});


// Statistic page
app.get('/pihole/stats', function(req, res){
        if (authenticate(req)) {
                var data = shell.exec('pihole -c -e').stdout;
                res.status(200).send(data);
        }
});


// Get Log
app.get('/pihole/log', function(req, res) {
        if (authenticate(req)) {
                var data = shell.exec('cat /var/log/pihole.log').stdout;
                res.status(200).send(data);
        }
});


// Get Pihole version
app.get('/pihole/version', function(req, res) {
        if (authenticate(req)) {
                var data = shell.exec('pihole -v').stdout;
                res.status(200).send(data);
        }
});


// Get Whitelist
app.get('/pihole/whitelist', function(req, res) {
        if (authenticate(req)) {
                // Get the whitelist
                var data = shell.exec('pihole -w -l').stdout;
                res.status(200).send(data);

        }
});


// Add a site to the Whitelist
app.post('/pihole/whitelist', function (req, res) {
        
        if (authenticate(req)) {
                let add_domain = req.headers.add_domain
                let remove_domain = req.headers.remove_domain
                // Make sure they supplied a site.
                if (add_domain) {
                        // Add the site to the whitelist.
                        var data = shell.exec(`pihole -w ${add_domain}`).stdout;
                        res.status(200).send(data);
                }
                else if (remove_domain) {
                        // Remove a site from the blacklist.
                        var data = shell.exec(`pihole -w -d ${remove_domain}`).stdout;
                        res.status(200).send(data);
                }
                else {
                        res.status(400).send("You need to include a 'add_domain' field or a 'remove_domain' in the POST headers");
                }
        }
});


// Get Blacklist
app.get('/pihole/blacklist', function(req, res) {
        if (authenticate(req)) {
                var data = shell.exec('pihole -b -l').stdout;
                res.status(200).send(data);
        }
});


// Add a site to the Blacklist
app.post('/pihole/blacklist', function (req, res) {
        if (authenticate(req)) {
                let add_domain = req.headers.add_domain
                let remove_domain = req.headers.remove_domain
                // Make sure they supplied a site.
                if (add_domain) {
                        // Add the site to the blacklist.
                        var data = shell.exec(`pihole -b ${add_domain}`).stdout;
                        res.status(200).send(data);
                }
                else if (remove_domain) {
                        // Remove a site from the blacklist.
                        var data = shell.exec(`pihole -b -d ${remove_domain}`).stdout;
                        res.status(200).send(data);
                }
                else {
                        res.status(400).send("You need to include a 'add_domain' field or a 'remove_domain' field in the POST headers");
                }
        }
});











// Requests to any other URL are forbidden
app.get("*", function(req, res) {
        res.status(404).send("Unrecognized API call");
});




app.listen(port, ()=>console.log(`Server is running on port ${port}`));


function authenticate(req)
{
        let token = req.headers.apitoken
        if (token)
        {
                console.log(`Checking if ${token} is a valid token`);
                return fs.readFileSync("./apikeys.list").includes(token);
        }
}