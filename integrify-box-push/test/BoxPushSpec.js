"use strict";
var box = require("../index.js");
var expect = require("expect")


//create an instance of the IntegrifyLambda with the config


it("should return config.inputs", function() {
    var event = {"operation": "config.getInputs"}
    box.handler(event, null, function(err,result){
        "use strict";
        //console.log(result)
        expect(result.length).toBeGreaterThan(0);

    })

});

it("should return config.outputs", function() {
    var event = {"operation": "config.getOutputs"}
    box.handler(event, null, function(err,result){
        "use strict";
        //console.log(result)
        expect(result.length).toBeGreaterThan(0);

    })

});

it("should execute and return values", function(done) {
    this.timeout(100000);
    var event = { "operation": "runtime.execute",
        "inputs":{
            "requestSid": "33581110-7424-45d0-bd18-a4ee9df0d419",
            "file" : "2014-04-16T19-00-17.386Z.json",
            "parentFolderId":"37252521558",
            "boxClientID":"box app client id",
            "boxClientSecret": "box-app-client-secret",
            "publicKeyID": "box app public key",
            "privateKey": "-----BEGIN ENCRYPTED PRIVATE KEY-----\nMwwerjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQImNWzR27wMYgCAggA\nMBQGCCqGSIb3DQMHBAi8qRJdntdUjQSCBMjBY1/ckKLMURZjg99NxiG7Gu/KgC3r\nPHz97T1y8nsr3C1gjj9GVsGUAM8/ggV2jQF142huMhuYZI79BfZwxhcjxqdkE+6T\n2qD93zd1slNLvfUYbOdLz2FCUgQATnI8iszN89dcxysjWfQov19UVV1ivXBpwoj9\n/sxDe0z+Z2XkN7T1enxlMYSykfYvHxQM/qeE/M4UTHma4gmnkQWb7hpCD+vNv/K9\nFYn4T6a4Xs6mnhux0fewEJxkl8SuZuWGDA87aa8d0xGd9Z3NdTtJzy8rKxn6TgDD\nWRoXpKMcQnOnN5qwo63px1Ms1Ig+Wx6zEJ2CtH8jlJnWlY/oCAe+43g09EfwE/K6\nH28AG9q7g+finpGc0uBSLc4BfFJPU8IC+K+mrJiTPx5L0Nd22AG/1QQKx5V1Yclm\nV95GenB/8ou7zkDz8z/4PouGbZKt/T6IRGoXOra2C+jgll07ocKU9gkp+VtGtBSm\ncp9GnF/qt8JOZsMFQPl1opKLjuFQzVE76TKY/4aUKfvpHPdGFos4zPFRfLj/2jK2\ns7DNlTmxRFZpGJTQqHa4IM8LGQLQ2+XNyd6SBGwCeS0sfoUohZ5wmEOfcCarfYI0\nVjIwsnCgCLB6YAA+5MJslOlvG/GgFvcmCZGzVV6lw845X/6pP+OZ1g81eUjhkqFi\nfIfgFQ5GVBQuylvK/J4aWhwF/0Q3J5cFmIydZb16Ki1cENqmXj6PzQB+HxhBuGvB\ntFiO2lkL9n9Ix4Gpj/dHEbC8xexXDWcB8hA2I9Dfqr9mJgIzWj/9LlQJmLT5glbQ\nz3aqqa+TYv6L57iJqOm0GXpl4MKACpYKZox1HFy369JI7askaWxfLeY3pyYcFe0B\nyo4gc7nmSw1MmsIp4fJls1m3Yb515UwdCePpiOMqXWdjfe8OIXBw+23EpaS/1rsJ\nlkwQKqHvhruDu16Vicyf96GUVcD2+Xf5jg30wE8pNRA7s6h7a5de9fapUEI+VgVM\nrNeNjRHkZ355ws6eaWTH1d775PAjEswt/OHQSzCYjNl+uIrw1RCrh+RDNgpQWKa7\nNcMGZbHGeNS7c1tjU/2RT/8T4QY2eG4mwtyAh+lJljpezl9bC5LDsqMlOY6OIKM/\nC/XUl0ilu4qAMM5uzk0MxhnFBbzYXOFCxRNd24V1x+ydV2+Tw4UYdayc9tA28nhV\nP4fe+ZLkDTDOjvSpN6ZgFXxaCy1IrCiDmJKGJv9PtVjhkO7xWgL82/aXxHFvP1Oj\naCwz/tZ+/b62DvdQ92CP1wVDRA7+YZYHleAaHcR1KJmNvTWpiN6GNc/gyCwSQUwS\n9EWlUUYyl2M7O/4MBCt0pASchzkQQ5xBvgYI0NcB74LzEUZkr69u7iFsd6hIqFoA\nR4uYT58UBOgLCe3ck+80GJ+22G7WW3GfjuT2VZSnKyg1GMuPnVFd3WmydrnTHGnj\nsJiPsKYYhe7Wix2N8lRBKvvK0URl6TKlp4HYXGEQIY1cajbZ4TiBy2Y9nD6wU1Tf\n5gom+FJYXyaHINSpxCeyOyybrt4TdSxXRiJYC5eNIZ+aYj1eBOuvp+/ZB6q7Lhqy\n2S700RtyRdqFS+19se+n6cbz1NtzfeaOSSX/NIrdcCh0pac25z43w1zcJNozyViV\nlnk=\n-----END ENCRYPTED PRIVATE KEY-----\n",
            "passphrase": "ed1ccacaa5e7d73d57f7371d51e06976",
            //"enterpriseID": "27365781",
            "userID":"support@integrify.com"
        },"integrifyServiceUrl":"http://localhost:3500",
        "accessToken":"20e22223855e4a5ab0e6c17e2b49d409"

    }

    box.handler(event, null, function(err,result){
        "use strict";
        //console.log(result)
        expect(result.boxFileUrl).toExist();
        done();

    })

});