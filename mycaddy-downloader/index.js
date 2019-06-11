const request = require('request')

var request = require('request');
 function updateClient(postData){
            var clientServerOptions = {
                uri: 'http://'+clientHost+''+clientContext,
                body: JSON.stringify(postData),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            request(clientServerOptions, function (error, response) {
                console.log(error,response.body);
                return;
            });
        } 


excelDownNew.php?ACT=club&gubun="+gubun+"&Country="+Country+"&State="+State+"&City="+City+"&clubCode="+clubCode