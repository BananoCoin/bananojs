
# camo bananos account setup

1) create a seed, (seed0)

2) get the account for the source seed:

    npm start checkpending ${seed0}

    checkpending account ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7
    checkpending  0 pending blocks []

3) send some bananos to the account.

4) ensure the bans are pending:

    npm start checkpending ${seed0}

    checkpending account ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7
    checkpending  1 pending blocks [ '47DF7B2B0D6FBB3A9C6171B07755F6BB618775291D664951ABC08D1C9C5839B1' ]

4) set your rep to be your camo account

    npm start register ${seed0}

    register pendingResponse [ '2DA9516C8C66D47978CFAD19776EEC1EA8DE9231DE6A00AC404802904EA14701' ]
    register bananoAccount ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7
    register camoAccount ban_1mgadefd5c676kebpfxifhggkuy38pb18wkh7kichk8kte339udifiykwo7j
    register account response 88F20CC57C39F857C945BC3FEA6227F4AAC0DB6AD677A4B3430AE71B069AB81B

5) verify your seed and banano account have a camo account.

    npm start checkseed ${seed0}

    checkseed bananoAccount ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7
    checkseed camoAccount ban_1mgadefd5c676kebpfxifhggkuy38pb18wkh7kichk8kte339udifiykwo7j

    npm start checkaccount ${bananoAccount}

    checkaccount representative ban_1mgadefd5c676kebpfxifhggkuy38pb18wkh7kichk8kte339udifiykwo7j

6) send to a camo account

    npm start sendraw ${fundingPrivateKey} ${camoSeed} ${toBananoAccount} ${amountRaw}

    send response [ '860F6A56B5EADF3A3582E2C5BE107D8E7781C67614EA14F4E5CCCA792B70845C' ]

7) receive at the camo account.

    npm start receive ${camoSeed} ${fromBananoAccount}

    receive response [ '3AA8564507D096A4351B74E49E4FE421A4192DA7F5097281268966DEB0E03503' ]
