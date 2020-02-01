# get private key from seed:
```
    npm start bgetprivatekey ${seed} ${seedIx}
```
# get the account for the private key:
```
    npm start bgetaccount ${privateKey}

    npm start bgetaccount 1111111111111111111111111111111111111111111111111111111111111111
    bananojs
    banano getaccount publicKey ACA68A2D52FE17BAB36D48456569FE7F91F23CB57B971B13FAF236EBBCC7FA94
    banano getaccount account ban_3d78japo7ziqqcsptk47eonzwzwjyaydcywq5ebzowjpxgyehynnjc9pd5zj
```
# check pending using private key:
```
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
```
# recieve pending using private key:
```
    npm start breceive ${privateKey} ${hash}

    npm start breceive 1111111111111111111111111111111111111111111111111111111111111111 48818DC7E09AA8EE12A62D23FBB4AD0D687087C8B3D2C5B5835951162D5DA615

    bananojs
    banano receive response {
      pendingCount: 1,
      receiveCount: 1,
      pendingMessage: 'pending 1 blocks, of max 10.',
      receiveMessage: 'received 1 blocks.'
    }
```
# send using private key:
```
    npm start bsendraw ${privateKey} ${destAccount} ${amountRaw}

    npm start bsendraw 1111111111111111111111111111111111111111111111111111111111111111 ban_1coranoshiqdentfbwkfo7fxzgg1jhz6m33pt9aa8497xxfageuskroocdxa 100000000000000000000000000000

    bananojs
    banano sendbanano response BF3BA5C6F91D52E88658E6AB800237C4023AD59392B4AB203EBA1E5BF706E535
```
# check account info
```
    npm start baccountinfo ban_1coranoshiqdentfbwkfo7fxzgg1jhz6m33pt9aa8497xxfageuskroocdxa

    bananojs
    banano accountinfo response {
      frontier: 'A9A8AED92C5B6C2CFF7A6954690C0763CFF1ADC906B8CF056BA1B20678A101C7',
      open_block: 'B6BD40F6F400BF0D81F2A28218039EBB1E6B9EE2764A0EFF344F7B9A123D5067',
      representative_block: 'A9A8AED92C5B6C2CFF7A6954690C0763CFF1ADC906B8CF056BA1B20678A101C7',
      balance: '344319743000000000000000000000000594',
      modified_timestamp: '1577058733',
      block_count: '630',
      account_version: '0',
      confirmation_height: '630',
      representative: 'ban_1bananobh5rat99qfgt1ptpieie5swmoth87thi74qgbfrij7dcgjiij94xr'
    }
```
