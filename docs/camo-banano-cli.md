
# camo bananos account setup

# create a seed, (seed0)

# get the account for the source seed:
```
    npm start cbcheckpending ${seed0}

    checkpending account ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7
    checkpending  0 pending blocks []
```
# send some bananos to the account.

# ensure the bans are pending:
```
    npm start cbcheckpending ${seed0}

    checkpending account ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7
    checkpending  1 pending blocks [ '47DF7B2B0D6FBB3A9C6171B07755F6BB618775291D664951ABC08D1C9C5839B1' ]
```
# set your rep to be your camo account
```
    npm start cbregister ${seed0}

    register pendingResponse [ '2DA9516C8C66D47978CFAD19776EEC1EA8DE9231DE6A00AC404802904EA14701' ]
    register bananoAccount ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7
    register camoAccount ban_1mgadefd5c676kebpfxifhggkuy38pb18wkh7kichk8kte339udifiykwo7j
    register account response 88F20CC57C39F857C945BC3FEA6227F4AAC0DB6AD677A4B3430AE71B069AB81B
```
# verify your seed and banano account have a camo account.
```
    npm start cbcheckseed ${seed0}

    checkseed bananoAccount ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7
    checkseed camoAccount ban_1mgadefd5c676kebpfxifhggkuy38pb18wkh7kichk8kte339udifiykwo7j

    npm start cbcheckaccount ${bananoAccount}

    checkaccount representative ban_1mgadefd5c676kebpfxifhggkuy38pb18wkh7kichk8kte339udifiykwo7j
```
# send to a camo account
```
    npm start cbsendraw ${fundingPrivateKey} ${camoSeed} ${toBananoAccount} ${amountRaw}

    send response [ '860F6A56B5EADF3A3582E2C5BE107D8E7781C67614EA14F4E5CCCA792B70845C' ]
```
# receive at the camo account.
```
    npm start cbreceive ${camoSeed} ${fromBananoAccount}

    receive response [ '3AA8564507D096A4351B74E49E4FE421A4192DA7F5097281268966DEB0E03503' ]
```
