
     const express = require('express')
     const app = express()
     const { Readable } = require('stream');
     const bodyParser = require('body-parser')
     const cors = require('cors')
     const port =  process.env.PORT || 3030;

     const { Web3 } = require("web3");

     const { Block, Blockchain } = require('./blockchainImpl.js');
     const JeChain = new Blockchain();

     let latestKnownBlockNumber = -1;
     let blockTime = 5000;

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

             //console.log("-->"+JSON.stringify(obj) +'----'+ arrv[0] +'----'+ arrv[1]);

             if(arrv[0].startsWith('Web3Request'))
                 checkConnection();
     	}

     })

     async function checkConnection() {
            const web3 = new Web3(arrv[1]);


            //if(result !== null) {
                 switch (arrv[0].substring(arrv[0].indexOf('_') +1)) {
                      case('createAccount'): {
                           var account = await web3.eth.accounts.create();
                           dataReturn(account);
                         break;
                      }
                      case('addAccount'): {
                           var existingAccount = await web3.eth.accounts.privateKeyToAccount(arv[2]);
                           dataReturn(existingAccount);
                      }
                      case('getAccounts'): {
                          const myFunc = async () => {
                              try {
                                  const myAccounts = await web3.eth.getAccounts();
                                  console.log(myAccounts[0])
                                  dataReturn(myAccounts);

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

                          dataReturn(JeChain.chain);
                         break;
                      }
                      case('lastBlock'): {
                          let blockNr = await web3.eth.getBlockNumber();
                          let block = await web3.eth.getBlock(blockNr);
                          let transactSum = new Object();
                          let n = 1
                          for (const transactionHash of block.transactions) {
                              let transaction = await web3.eth.getTransaction(transactionHash);
                              let transactionReceipt = await web3.eth.getTransactionReceipt(transactionHash);
                              let action = 'Transaction_0'+n;
                              transaction = Object.assign(transaction, transactionReceipt);

                              Object.assign(transactSum, {[action] :  transaction});
                              if(n >= parseInt(arrv[3]))
                                break;
                              n++;
                          }
                          dataReturn(transactSum);
                         break;
                      }
                      case('checkBalance'): {
                           let address = arrv[2];
                           let balance;


                               try {
                                   await web3.eth.getBalance(address)
                                      .then((balanceInWei) => {
                                       balance = web3.utils.fromWei(balanceInWei, "ether");
                                       dataReturn({ Balance : balance });
                                      });
                               } catch (error) {
                                   console.log(error);
                               }
                         break;
                      }
                      case('getGasPrice'): {
                               await web3.eth.getGasPrice()
                                   .then(data=> {
                                         dataReturn(data);
                                   });
                         break;
                      }
                      case('getChainId'): {
                               await web3.eth.getChainId()
                                   .then(data=> {
                                         dataReturn(data);
                                   });
                         break;
                      }
                      case('createWallet'): {
                               await web3.eth.accounts.wallet.create(1)
                                   .then(data=> {

                                         dataReturn(data);
                                   });
                         break;
                      }
                      case('accountToWallet'): {

                           var accToWa = await web3.eth.accounts.wallet.add(arrv[2]);
                           dataReturn(accToWa);

                         break;
                      }
                      case('transactionSend'): {

                          var arrsk = Object.keys(arrv[2]);
                          var arrsv = Object.values(arrv[2]);
                          let sender = arrsv[1];
                          let recipient = arrsv[2];
                          let sum = arrsv[3];
                          let pkey = arrsv[0];

                          await web3.eth.accounts.wallet.add(pkey);
                          var response = await web3.eth.sendTransaction({from: sender, to: recipient, value: web3.utils.toWei(sum, 'ether'), gasLimit: 21000});

                          dataReturn(response);
                         break;
                      }
                 }
            //}

     }



     async function dataReturn (trans) {
            //console.dir('---'+trans+'....');
            await response.status(200).json({body: JSON.stringify(trans, (key, value) =>
              typeof value === "bigint" ? Number(value) : value,
            )});
     }
