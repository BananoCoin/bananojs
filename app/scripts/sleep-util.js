const sleep = ( millis ) => {
    return new Promise( resolve => setTimeout( resolve, millis ) );
}

exports.sleep = sleep;