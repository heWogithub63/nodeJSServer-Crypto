
     const express = require('express')
     const app = express()
     const { Readable } = require('stream');
     const bodyParser = require('body-parser')
     const cors = require('cors')
     const port =  process.env.PORT || 3030;

     const { Web3 } = require("web3");

     const { Block, Blockchain } = require('./blockchainImpl.js');
     const JeChain = new Blockchain();

     var obj;
     var arrk,arrv;
     var response;
     var request;
     var resent;
     var reqUrl;
     var trans;

     // We are using our packages here
     app.use(
       bodyParser.urlencoded({
         extended: true,
         limit: '35mb',
         parameterLimit: 50000,
       }),
     );

     // to support JSON-encoded bodies
     app.use(bodyParser.json({limit: '35mb'}));

     app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true}));
     app.use(cors());
     app.use(express.json());
     app.use(express.urlencoded({ extended: true }));

     //Start your server on a specified port
     app.listen(port, '0.0.0.0', () => {
            console.log('Server is running on port '+ port);
     });
     // Add a basic route to check if server's up
     app.get('/KryptoWallet', (req, res) => {
       res.status(200).send(`Server up and running`);
     });

     //Route that handles medOrganiser logic
     app.post('/KryptoWallet',async (req, res) =>{

         const data = req.body;

         if(data != null) {
             response = res;
             request = req;
             obj = data;
             arrk = Object.keys(data);
             arrv = Object.values(data);

             console.log("-->"+JSON.stringify(obj) +'----'+ arrv[0] +'----'+ arrv[1]);

             if(arrv[0].startsWith('Web3Request'))
                 checkConnection();
     	}

     })

     async function checkConnection() {
            const web3 = new Web3(arrv[1]);

            await web3.eth.getGasPrice().then((result) => {
                 if(result !== null) {
                      switch (arrv[0].substring(arrv[0].indexOf('_') +1)) {
                           case('createAccount'): {
                                var account = web3.eth.accounts.create();
                                dataReturn(account.address +'----'+ account.privateKey);
                              break;
                           }
                           case('getAccounts'): {
                               const myFunc = async () => {
                                   try {
                                       const myAccounts = await web3.eth.getAccounts();
                                       console.log(myAccounts)
                                       return myAccounts;

                                   } catch (err) {
                                       console.log(err);
                                   }
                               }

                               myFunc()
                              break;
                           }
                           case('addBlock'): {
                               delete obj.Caller;
                               delete obj.Network;
                               // Add a new block
                               JeChain.addBlock(new Block(Date.now().toString(), obj));

                               // Prints out the updated chain
                               console.log(JeChain.chain);
                               //Sends Object back
                               dataReturn(JeChain.chain);
                              break;
                           }
                           case('checkBalance'): {
                                let address = arrv[2];
                                let balance;


                                    try {
                                        web3.eth.getBalance(address).then((balanceInWei) => {
                                            balance = web3.utils.fromWei("1", "ether");
                                            console.log("Balance in wei:", balanceInWei);
                                            console.log("Balance in ETH:", balance);
                                            dataReturn(balance);
                                        });
                                    } catch (error) {
                                        console.log(error);
                                    }
                              break;
                           }
                           case('getGasPrice'): {
                                web3.eth.getGasPrice().then(console.log);
                              break;
                           }
                           case('getChainId'): {
                                web3.eth.getChainId().then(console.log);
                              break;
                           }
                           case('createWallet'): {
                                const wallet = web3.eth.accounts.wallet.create(1);
                                console.log(wallet);
                              break;
                           }
                      }
                 }
            });
     }

     async function dataReturn (trans) {
            console.dir('---'+trans+'....');
            await response.status(200).json({body: JSON.stringify(trans)});
     }
