### with seed

# get random seed:

        npm start getseed

# get private key from seed:

        npm start bgetprivatekey ${seed} ${seedIx}

# get the account for the private key:

        npm start bgetaccount ${privateKey}

        npm start bgetaccount 1111111111111111111111111111111111111111111111111111111111111111
        bananojs
        banano getaccount publicKey ACA68A2D52FE17BAB36D48456569FE7F91F23CB57B971B13FAF236EBBCC7FA94
        banano getaccount account ban_3d78japo7ziqqcsptk47eonzwzwjyaydcywq5ebzowjpxgyehynnjc9pd5zj

# check pending using public key:

        npm start bcheckpending ${account} ${maxAccountsPending}

        npm start bcheckpending ban_3d78japo7ziqqcsptk47eonzwzwjyaydcywq5ebzowjpxgyehynnjc9pd5zj 10

        bananojs
        banano checkpending response {
          blocks: {
            ban_3d78japo7ziqqcsptk47eonzwzwjyaydcywq5ebzowjpxgyehynnjc9pd5zj: {
              '48818DC7E09AA8EE12A62D23FBB4AD0D687087C8B3D2C5B5835951162D5DA615': '100000000000000000000000000000'
            }
          }
        }

# recieve pending using private key:

        npm start breceive ${privateKey} ${hash}

        npm start breceive 1111111111111111111111111111111111111111111111111111111111111111 48818DC7E09AA8EE12A62D23FBB4AD0D687087C8B3D2C5B5835951162D5DA615

        bananojs
        banano receive response {
          pendingCount: 1,
          receiveCount: 1,
          pendingMessage: 'pending 1 blocks, of max 10.',
          receiveMessage: 'received 1 blocks.'
        }

# convert amount to raw:

        npm start bamountraw 1

        bananojs
        bamountraw response 100000000000000000000000000000

# send using private key:

        npm start bsendraw ${privateKey} ${destAccount} ${amountRaw}

        npm start bsendraw 1111111111111111111111111111111111111111111111111111111111111111 ban_1coranoshiqdentfbwkfo7fxzgg1jhz6m33pt9aa8497xxfageuskroocdxa 100000000000000000000000000000

        bananojs
        banano sendbanano response BF3BA5C6F91D52E88658E6AB800237C4023AD59392B4AB203EBA1E5BF706E535

# send using private key and a json file

        json file is of the format:
        (account can start with nano_ or ban_ for compatibility with nano-banano airdrops)
        (amount can be called amount or balance for compatibility with nano-banano airdrops)

        ```js
        {
          "accounts":[
          {
            "account":"ban_1coranoshiqdentfbwkfo7fxzgg1jhz6m33pt9aa8497xxfageuskroocdxa"
            ,
            "amount":"1.2"
          },
          {
            "account":"nano_1coranoshiqdentfbwkfo7fxzgg1jhz6m33pt9aa8497xxfageuskroocdxa"
            ,
            "balance":"1.3"}
          ]
        }
        ```

        npm start bsendjson ${privateKey} ${jsonfile}

        npm start bsendjson 1111111111111111111111111111111111111111111111111111111111111111 test-airdrop.json

        bananojs
        banano bsendjson response BF3BA5C6F91D52E88658E6AB800237C4023AD59392B4AB203EBA1E5BF706E535
        BF3BA5C6F91D52E88658E6AB800237C4023AD59392B4AB203EBA1E5BF706E535
        BF3BA5C6F91D52E88658E6AB800237C4023AD59392B4AB203EBA1E5BF706E535

# check account info

        npm start baccountinfo ban_1coranoshiqdentfbwkfo7fxzgg1jhz6m33pt9aa8497xxfageuskroocdxa

        bananojs
        banano accountinfo response {
          frontier: '41E7FF66C785F3DE2F192BA05C8DEBDC2B33D89B85C5BB49B4F219C8112A5BC8',
          open_block: 'B6BD40F6F400BF0D81F2A28218039EBB1E6B9EE2764A0EFF344F7B9A123D5067',
          representative_block: '41E7FF66C785F3DE2F192BA05C8DEBDC2B33D89B85C5BB49B4F219C8112A5BC8',
          balance: '100000000000000000000000000000000000',
          modified_timestamp: '1604070386',
          block_count: '704',
          account_version: '0',
          confirmation_height: '704',
          representative: 'ban_1fomoz167m7o38gw4rzt7hz67oq6itejpt4yocrfywujbpatd711cjew8gjj',
          balanceParts: {
            majorName: 'banano',
            minorName: 'banoshi',
            banano: '1000000',
            banoshi: '0',
            raw: '0'
          },
          balanceDescription: '1,000,000 banano',
          balanceDecimal: '1000000.0000000000000000000000000000000'
        }
