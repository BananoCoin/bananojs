## Objects

<dl>
<dt><a href="#Main">Main</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#BananoUtil">BananoUtil</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#DepositUtil">DepositUtil</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#BananodeApi">BananodeApi</a> : <code>object</code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#BananoParts">BananoParts</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#AccountValidationInfo">AccountValidationInfo</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="Main"></a>

## Main : <code>object</code>
**Kind**: global namespace  

* [Main](#Main) : <code>object</code>
    * [.setBananodeApi(_bananodeApi)](#Main.setBananodeApi) ⇒ <code>undefined</code>
    * [.setAuth(auth)](#Main.setAuth) ⇒ <code>undefined</code>
    * [.setBananodeApiUrl(url)](#Main.setBananodeApiUrl) ⇒ <code>undefined</code>

<a name="Main.setBananodeApi"></a>

### Main.setBananodeApi(_bananodeApi) ⇒ <code>undefined</code>
Sets the Bananode Api (useful for overriding some methods)

**Kind**: static method of [<code>Main</code>](#Main)  
**Returns**: <code>undefined</code> - returns nothing.  

| Param | Type | Description |
| --- | --- | --- |
| _bananodeApi | <code>string</code> | the new bananodeApi |

<a name="Main.setAuth"></a>

### Main.setAuth(auth) ⇒ <code>undefined</code>
Sets the Bananode Api Authorization

**Kind**: static method of [<code>Main</code>](#Main)  
**Returns**: <code>undefined</code> - returns nothing.  

| Param | Type | Description |
| --- | --- | --- |
| auth | <code>string</code> | the new authorization |

<a name="Main.setBananodeApiUrl"></a>

### Main.setBananodeApiUrl(url) ⇒ <code>undefined</code>
Sets the URL to use for the node behind the Bananode Api

**Kind**: static method of [<code>Main</code>](#Main)  
**Returns**: <code>undefined</code> - returns nothing.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | the new url |

<a name="BananoUtil"></a>

## BananoUtil : <code>object</code>
**Kind**: global namespace  

* [BananoUtil](#BananoUtil) : <code>object</code>
    * [.getBananoPartsFromDecimal(decimalAmount)](#BananoUtil.getBananoPartsFromDecimal) ⇒ [<code>BananoParts</code>](#BananoParts)
    * [.getBananoPartsAsDecimal(bananoParts)](#BananoUtil.getBananoPartsAsDecimal) ⇒ <code>string</code>
    * [.getBananoDecimalAmountAsRaw(amount)](#BananoUtil.getBananoDecimalAmountAsRaw) ⇒ <code>string</code>
    * [.getBananoPartsDescription(bananoParts)](#BananoUtil.getBananoPartsDescription) ⇒ <code>string</code>
    * [.sendAmountToBananoAccountWithRepresentativeAndPrevious(seed, seedIx, destAccount, amountRaw, representative, previousHash)](#BananoUtil.sendAmountToBananoAccountWithRepresentativeAndPrevious) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.sendAmountToNanoAccountWithRepresentativeAndPrevious(seed, seedIx, destAccount, amountRaw, representative, previousHash)](#BananoUtil.sendAmountToNanoAccountWithRepresentativeAndPrevious) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.sendAmountToBananoAccount(seed, seedIx, destAccount, amountRaw, successCallback, failureCallback)](#BananoUtil.sendAmountToBananoAccount) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.sendAmountToNanoAccount(seed, seedIx, destAccount, amountRaw, successCallback, failureCallback)](#BananoUtil.sendAmountToNanoAccount) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.changeBananoRepresentativeForSeed(seed, seedIx, representative)](#BananoUtil.changeBananoRepresentativeForSeed) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.changeNanoRepresentativeForSeed(seed, seedIx, representative)](#BananoUtil.changeNanoRepresentativeForSeed) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.getBananoAccountFromSeed(seed, seedIx)](#BananoUtil.getBananoAccountFromSeed) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.getNanoAccountFromSeed(seed, seedIx)](#BananoUtil.getNanoAccountFromSeed) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.openBananoAccountFromSeed(seed, seedIx, representative, pendingBlockHash, pendingValueRaw)](#BananoUtil.openBananoAccountFromSeed) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.openNanoAccountFromSeed(seed, seedIx, representative, pendingBlockHash, pendingValueRaw)](#BananoUtil.openNanoAccountFromSeed) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.getBlockHash(block)](#BananoUtil.getBlockHash) ⇒ <code>string</code>
    * [.signHash(privateKey, hash)](#BananoUtil.signHash) ⇒ <code>string</code>
    * [.verify(hash, signature, publicKey)](#BananoUtil.verify) ⇒ <code>string</code>
    * [.getSignature(privateKey, block)](#BananoUtil.getSignature) ⇒ <code>string</code>
    * [.getBytesFromHex(hex)](#BananoUtil.getBytesFromHex) ⇒ <code>Uint8Array</code>
    * [.getHexFromBytes(bytes)](#BananoUtil.getHexFromBytes) ⇒ <code>string</code>
    * [.getWorkUsingCpu(hash, workBytes)](#BananoUtil.getWorkUsingCpu) ⇒ <code>string</code>
    * [.getRawStrFromBananoStr(amountStr, amountPrefix)](#BananoUtil.getRawStrFromBananoStr) ⇒ <code>string</code>
    * [.getRawStrFromBanoshiStr(amountStr, amountPrefix)](#BananoUtil.getRawStrFromBanoshiStr) ⇒ <code>string</code>
    * [.getRawStrFromNanoStr(amountStr, amountPrefix)](#BananoUtil.getRawStrFromNanoStr) ⇒ <code>string</code>
    * [.getRawStrFromNanoshiStr(amountStr, amountPrefix)](#BananoUtil.getRawStrFromNanoshiStr) ⇒ <code>string</code>
    * [.getBananoAccount(publicKey)](#BananoUtil.getBananoAccount) ⇒ <code>string</code>
    * [.getNanoAccount(publicKey)](#BananoUtil.getNanoAccount) ⇒ <code>string</code>
    * [.getBananoPartsFromRaw(amountRawStr)](#BananoUtil.getBananoPartsFromRaw) ⇒ [<code>BananoParts</code>](#BananoParts)
    * [.getNanoPartsFromRaw(amountRawStr)](#BananoUtil.getNanoPartsFromRaw) ⇒ [<code>BananoParts</code>](#BananoParts)
    * [.getRawStrFromMajorAmountStr(amountStr, amountPrefix)](#BananoUtil.getRawStrFromMajorAmountStr) ⇒ <code>string</code>
    * [.getRawStrFromMinorAmountStr(amountStr, amountPrefix)](#BananoUtil.getRawStrFromMinorAmountStr) ⇒ <code>string</code>
    * [.getAmountPartsFromRaw(amountRawStr, amountPrefix)](#BananoUtil.getAmountPartsFromRaw) ⇒ [<code>BananoParts</code>](#BananoParts)
    * [.getAccountPublicKey(account)](#BananoUtil.getAccountPublicKey) ⇒ <code>string</code>
    * [.getAccountSuffix(publicKey)](#BananoUtil.getAccountSuffix) ⇒ <code>string</code>
    * [.getAccount(publicKey, accountPrefix)](#BananoUtil.getAccount) ⇒ <code>string</code>
    * [.isWorkValid(hashBytes, workBytes)](#BananoUtil.isWorkValid) ⇒ <code>boolean</code>
    * [.getZeroedWorkBytes()](#BananoUtil.getZeroedWorkBytes) ⇒ <code>Uint8Array</code>
    * [.getPublicKey(privateKey)](#BananoUtil.getPublicKey) ⇒ <code>string</code>
    * [.isSeedValid(seed, seedIx)](#BananoUtil.isSeedValid) ⇒ <code>object</code>
    * [.getPrivateKey(seed, seedIx)](#BananoUtil.getPrivateKey) ⇒ <code>string</code>
    * [.getBananoAccountValidationInfo(account)](#BananoUtil.getBananoAccountValidationInfo) ⇒ [<code>AccountValidationInfo</code>](#AccountValidationInfo)
    * [.getNanoAccountValidationInfo(account)](#BananoUtil.getNanoAccountValidationInfo) ⇒ [<code>AccountValidationInfo</code>](#AccountValidationInfo)

<a name="BananoUtil.getBananoPartsFromDecimal"></a>

### BananoUtil.getBananoPartsFromDecimal(decimalAmount) ⇒ [<code>BananoParts</code>](#BananoParts)
converts amount from decimal to bananoParts.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: [<code>BananoParts</code>](#BananoParts) - returns the banano parts of the decimal amount.  

| Param | Type | Description |
| --- | --- | --- |
| decimalAmount | <code>string</code> | the decimal amount of bananos. |

<a name="BananoUtil.getBananoPartsAsDecimal"></a>

### BananoUtil.getBananoPartsAsDecimal(bananoParts) ⇒ <code>string</code>
converts amount from bananoParts to decimal.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - returns the decimal amount of bananos.  

| Param | Type | Description |
| --- | --- | --- |
| bananoParts | [<code>BananoParts</code>](#BananoParts) | the banano parts to describe. |

<a name="BananoUtil.getBananoDecimalAmountAsRaw"></a>

### BananoUtil.getBananoDecimalAmountAsRaw(amount) ⇒ <code>string</code>
converts amount from decimal to raw.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - returns amount in raw.  

| Param | Type | Description |
| --- | --- | --- |
| amount | <code>string</code> | the decimal amount. |

<a name="BananoUtil.getBananoPartsDescription"></a>

### BananoUtil.getBananoPartsDescription(bananoParts) ⇒ <code>string</code>
describes the banano parts in an english description.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - returns the description of the banano parts.  

| Param | Type | Description |
| --- | --- | --- |
| bananoParts | [<code>BananoParts</code>](#BananoParts) | the banano parts to describe. |

<a name="BananoUtil.sendAmountToBananoAccountWithRepresentativeAndPrevious"></a>

### BananoUtil.sendAmountToBananoAccountWithRepresentativeAndPrevious(seed, seedIx, destAccount, amountRaw, representative, previousHash) ⇒ <code>Promise.&lt;string&gt;</code>
Sends the amount to the account with an optional representative and
previous block hash.
If the representative is not sent, it will be pulled from the api.
If the previous is not sent, it will be pulled from the api.
Be very careful with previous, as setting it incorrectly
can cause an incorrect amount of funds to be sent.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>Promise.&lt;string&gt;</code> - returns the hash returned by the send.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |
| destAccount | <code>string</code> | the destination account. |
| amountRaw | <code>string</code> | the amount to send, in raw. |
| representative | <code>string</code> | the representative (optional). |
| previousHash | <code>string</code> | the previous hash (optional). |

<a name="BananoUtil.sendAmountToNanoAccountWithRepresentativeAndPrevious"></a>

### BananoUtil.sendAmountToNanoAccountWithRepresentativeAndPrevious(seed, seedIx, destAccount, amountRaw, representative, previousHash) ⇒ <code>Promise.&lt;string&gt;</code>
Sends the amount to the account with an optional representative and
previous block hash.
If the representative is not sent, it will be pulled from the api.
If the previous is not sent, it will be pulled from the api.
Be very careful with previous, as setting it incorrectly
can cause an incorrect amount of funds to be sent.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>Promise.&lt;string&gt;</code> - returns the hash returned by the send.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |
| destAccount | <code>string</code> | the destination account. |
| amountRaw | <code>string</code> | the amount to send, in raw. |
| representative | <code>string</code> | the representative (optional). |
| previousHash | <code>string</code> | the previous hash (optional). |

<a name="BananoUtil.sendAmountToBananoAccount"></a>

### BananoUtil.sendAmountToBananoAccount(seed, seedIx, destAccount, amountRaw, successCallback, failureCallback) ⇒ <code>Promise.&lt;string&gt;</code>
Sends the amount to the banano account with a callback for success and failure.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>Promise.&lt;string&gt;</code> - returns the hash returned by the send.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |
| destAccount | <code>string</code> | the destination account. |
| amountRaw | <code>string</code> | the amount to send, in raw. |
| successCallback | <code>string</code> | the callback to call upon success. |
| failureCallback | <code>string</code> | the callback to call upon failure. |

<a name="BananoUtil.sendAmountToNanoAccount"></a>

### BananoUtil.sendAmountToNanoAccount(seed, seedIx, destAccount, amountRaw, successCallback, failureCallback) ⇒ <code>Promise.&lt;string&gt;</code>
Sends the amount to the nano account with a callback for success and failure.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>Promise.&lt;string&gt;</code> - returns the hash returned by the send.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |
| destAccount | <code>string</code> | the destination account. |
| amountRaw | <code>string</code> | the amount to send, in raw. |
| successCallback | <code>string</code> | the callback to call upon success. |
| failureCallback | <code>string</code> | the callback to call upon failure. |

<a name="BananoUtil.changeBananoRepresentativeForSeed"></a>

### BananoUtil.changeBananoRepresentativeForSeed(seed, seedIx, representative) ⇒ <code>Promise.&lt;string&gt;</code>
Sets the rep for an account with a given seed.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>Promise.&lt;string&gt;</code> - returns the hash returned by the change.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |
| representative | <code>string</code> | the representative. |

<a name="BananoUtil.changeNanoRepresentativeForSeed"></a>

### BananoUtil.changeNanoRepresentativeForSeed(seed, seedIx, representative) ⇒ <code>Promise.&lt;string&gt;</code>
Sets the rep for an account with a given seed.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>Promise.&lt;string&gt;</code> - returns the hash returned by the change.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |
| representative | <code>string</code> | the representative. |

<a name="BananoUtil.getBananoAccountFromSeed"></a>

### BananoUtil.getBananoAccountFromSeed(seed, seedIx) ⇒ <code>Promise.&lt;string&gt;</code>
Get the banano account with a given seed and index.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>Promise.&lt;string&gt;</code> - the account.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |

<a name="BananoUtil.getNanoAccountFromSeed"></a>

### BananoUtil.getNanoAccountFromSeed(seed, seedIx) ⇒ <code>Promise.&lt;string&gt;</code>
Get the banano account with a given seed and index.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>Promise.&lt;string&gt;</code> - the account.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |

<a name="BananoUtil.openBananoAccountFromSeed"></a>

### BananoUtil.openBananoAccountFromSeed(seed, seedIx, representative, pendingBlockHash, pendingValueRaw) ⇒ <code>Promise.&lt;string&gt;</code>
Open a banano account with a given seed.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>Promise.&lt;string&gt;</code> - returns the hash returned by the open.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |
| representative | <code>string</code> | the representative. |
| pendingBlockHash | <code>string</code> | the pending block hash. |
| pendingValueRaw | <code>string</code> | the pending block hash. |

<a name="BananoUtil.openNanoAccountFromSeed"></a>

### BananoUtil.openNanoAccountFromSeed(seed, seedIx, representative, pendingBlockHash, pendingValueRaw) ⇒ <code>Promise.&lt;string&gt;</code>
Open a nano account with a given seed.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>Promise.&lt;string&gt;</code> - returns the hash returned by the open.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |
| representative | <code>string</code> | the representative. |
| pendingBlockHash | <code>string</code> | the pending block hash. |
| pendingValueRaw | <code>string</code> | the pending block hash. |

<a name="BananoUtil.getBlockHash"></a>

### BananoUtil.getBlockHash(block) ⇒ <code>string</code>
Get the hash for a given block.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - the block's hash.  

| Param | Type | Description |
| --- | --- | --- |
| block | <code>string</code> | the seed to use to find the account. |

<a name="BananoUtil.signHash"></a>

### BananoUtil.signHash(privateKey, hash) ⇒ <code>string</code>
signs a hash.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - the block's hash.  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | the private key to use to sign. |
| hash | <code>string</code> | the hash to sign. |

<a name="BananoUtil.verify"></a>

### BananoUtil.verify(hash, signature, publicKey) ⇒ <code>string</code>
verifys a hash.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - true if verification passed.  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>string</code> | the hash to verify. |
| signature | <code>string</code> | the signature to verify. |
| publicKey | <code>string</code> | the public key to use to sign. |

<a name="BananoUtil.getSignature"></a>

### BananoUtil.getSignature(privateKey, block) ⇒ <code>string</code>
Get the signature for a given block (gets the hash of the block, and signs the hash).

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - the block's signature.  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | the private key used to sign the block. |
| block | <code>string</code> | the block to sign. |

<a name="BananoUtil.getBytesFromHex"></a>

### BananoUtil.getBytesFromHex(hex) ⇒ <code>Uint8Array</code>
Converts a hex string to bytes in a Uint8Array.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>Uint8Array</code> - the bytes in a Uint8Array.  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>string</code> | the hex string to use. |

<a name="BananoUtil.getHexFromBytes"></a>

### BananoUtil.getHexFromBytes(bytes) ⇒ <code>string</code>
Converts bytes in a Uint8Array to a hex string.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - the hex string.  

| Param | Type | Description |
| --- | --- | --- |
| bytes | <code>Uint8Array</code> | the bytes to use. |

<a name="BananoUtil.getWorkUsingCpu"></a>

### BananoUtil.getWorkUsingCpu(hash, workBytes) ⇒ <code>string</code>
gets work bytes using the CPU.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - the work bytes as a hex string.  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>string</code> | the hash to use to calculate work bytes. |
| workBytes | <code>Uint8Array</code> | the Uint8Array(8) used to store temporary calculations. |

<a name="BananoUtil.getRawStrFromBananoStr"></a>

### BananoUtil.getRawStrFromBananoStr(amountStr, amountPrefix) ⇒ <code>string</code>
Converts an amount into a raw amount.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - the banano as a raw value.  

| Param | Type | Description |
| --- | --- | --- |
| amountStr | <code>string</code> | the amount, as a string. |
| amountPrefix | <code>string</code> | the amount, as a string. |

<a name="BananoUtil.getRawStrFromBanoshiStr"></a>

### BananoUtil.getRawStrFromBanoshiStr(amountStr, amountPrefix) ⇒ <code>string</code>
Converts an amount into a raw amount.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - the banano as a raw value.  

| Param | Type | Description |
| --- | --- | --- |
| amountStr | <code>string</code> | the amount, as a string. |
| amountPrefix | <code>string</code> | the amount, as a string. |

<a name="BananoUtil.getRawStrFromNanoStr"></a>

### BananoUtil.getRawStrFromNanoStr(amountStr, amountPrefix) ⇒ <code>string</code>
Converts an amount into a raw amount.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - the banano as a raw value.  

| Param | Type | Description |
| --- | --- | --- |
| amountStr | <code>string</code> | the amount, as a string. |
| amountPrefix | <code>string</code> | the amount, as a string. |

<a name="BananoUtil.getRawStrFromNanoshiStr"></a>

### BananoUtil.getRawStrFromNanoshiStr(amountStr, amountPrefix) ⇒ <code>string</code>
Converts an amount into a raw amount.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - the banano as a raw value.  

| Param | Type | Description |
| --- | --- | --- |
| amountStr | <code>string</code> | the amount, as a string. |
| amountPrefix | <code>string</code> | the amount, as a string. |

<a name="BananoUtil.getBananoAccount"></a>

### BananoUtil.getBananoAccount(publicKey) ⇒ <code>string</code>
Get the banano account for a given public key.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - the account.  

| Param | Type | Description |
| --- | --- | --- |
| publicKey | <code>string</code> | the public key. |

<a name="BananoUtil.getNanoAccount"></a>

### BananoUtil.getNanoAccount(publicKey) ⇒ <code>string</code>
Get the banano account for a given public key.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - the account.  

| Param | Type | Description |
| --- | --- | --- |
| publicKey | <code>string</code> | the public key. |

<a name="BananoUtil.getBananoPartsFromRaw"></a>

### BananoUtil.getBananoPartsFromRaw(amountRawStr) ⇒ [<code>BananoParts</code>](#BananoParts)
Get the banano parts (banano, banoshi, raw) for a given raw value.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: [<code>BananoParts</code>](#BananoParts) - the banano parts.  

| Param | Type | Description |
| --- | --- | --- |
| amountRawStr | <code>string</code> | the raw amount, as a string. |

<a name="BananoUtil.getNanoPartsFromRaw"></a>

### BananoUtil.getNanoPartsFromRaw(amountRawStr) ⇒ [<code>BananoParts</code>](#BananoParts)
Get the nano parts nano, nanoshi, raw) for a given raw value.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: [<code>BananoParts</code>](#BananoParts) - the banano parts.  

| Param | Type | Description |
| --- | --- | --- |
| amountRawStr | <code>string</code> | the raw amount, as a string. |

<a name="BananoUtil.getRawStrFromMajorAmountStr"></a>

### BananoUtil.getRawStrFromMajorAmountStr(amountStr, amountPrefix) ⇒ <code>string</code>
Converts an amount into a raw amount.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - the banano as a raw value.  

| Param | Type | Description |
| --- | --- | --- |
| amountStr | <code>string</code> | the amount, as a string. |
| amountPrefix | <code>string</code> | the amount, as a string. |

<a name="BananoUtil.getRawStrFromMinorAmountStr"></a>

### BananoUtil.getRawStrFromMinorAmountStr(amountStr, amountPrefix) ⇒ <code>string</code>
Converts a banoshi amount into a raw amount.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - the banano as a raw value.  

| Param | Type | Description |
| --- | --- | --- |
| amountStr | <code>string</code> | the banoshi, as a string. |
| amountPrefix | <code>string</code> | the amount prefix, as a string. |

<a name="BananoUtil.getAmountPartsFromRaw"></a>

### BananoUtil.getAmountPartsFromRaw(amountRawStr, amountPrefix) ⇒ [<code>BananoParts</code>](#BananoParts)
Get the banano parts (banano, banoshi, raw) for a given raw value.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: [<code>BananoParts</code>](#BananoParts) - the banano parts.  

| Param | Type | Description |
| --- | --- | --- |
| amountRawStr | <code>string</code> | the raw amount, as a string. |
| amountPrefix | <code>string</code> | the amount prefix, as a string. |

<a name="BananoUtil.getAccountPublicKey"></a>

### BananoUtil.getAccountPublicKey(account) ⇒ <code>string</code>
Get the public key for a given account.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - the public key.  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | the account. |

<a name="BananoUtil.getAccountSuffix"></a>

### BananoUtil.getAccountSuffix(publicKey) ⇒ <code>string</code>
Get the account suffix for a given public key (everything but ban_ or camo_ or nano_).

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - the account suffix.  

| Param | Type | Description |
| --- | --- | --- |
| publicKey | <code>string</code> | the public key. |

<a name="BananoUtil.getAccount"></a>

### BananoUtil.getAccount(publicKey, accountPrefix) ⇒ <code>string</code>
Get the account for a given public key.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - the account.  

| Param | Type | Description |
| --- | --- | --- |
| publicKey | <code>string</code> | the public key. |
| accountPrefix | <code>string</code> | the prefix. ban_ or nano_. |

<a name="BananoUtil.isWorkValid"></a>

### BananoUtil.isWorkValid(hashBytes, workBytes) ⇒ <code>boolean</code>
returns true if the work (in bytes) for the hash (in bytes) is valid.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>boolean</code> - true if the work is valid for the hash.  

| Param | Type | Description |
| --- | --- | --- |
| hashBytes | <code>string</code> | the hash bytes to check. |
| workBytes | <code>string</code> | the work bytes to check. |

<a name="BananoUtil.getZeroedWorkBytes"></a>

### BananoUtil.getZeroedWorkBytes() ⇒ <code>Uint8Array</code>
creates a new Uint8Array(8) to calculate work bytes.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>Uint8Array</code> - the bytes in a Uint8Array.  
<a name="BananoUtil.getPublicKey"></a>

### BananoUtil.getPublicKey(privateKey) ⇒ <code>string</code>
Get the public key for a given private key.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - the public key.  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | the private key. |

<a name="BananoUtil.isSeedValid"></a>

### BananoUtil.isSeedValid(seed, seedIx) ⇒ <code>object</code>
validates a seed.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>object</code> - {valid:[true/false] message:[if false, why]}.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to validate. |
| seedIx | <code>string</code> | the index to use with the seed. |

<a name="BananoUtil.getPrivateKey"></a>

### BananoUtil.getPrivateKey(seed, seedIx) ⇒ <code>string</code>
Get the private key for a given seed.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: <code>string</code> - the private key.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |

<a name="BananoUtil.getBananoAccountValidationInfo"></a>

### BananoUtil.getBananoAccountValidationInfo(account) ⇒ [<code>AccountValidationInfo</code>](#AccountValidationInfo)
Returns an object saying if the banano account is valid or not.
If the account is not valid, the message describes why it is not valid.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: [<code>AccountValidationInfo</code>](#AccountValidationInfo) - an object saying if the account is valid, and why.  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | the account. |

<a name="BananoUtil.getNanoAccountValidationInfo"></a>

### BananoUtil.getNanoAccountValidationInfo(account) ⇒ [<code>AccountValidationInfo</code>](#AccountValidationInfo)
Returns an object saying if the nano account is valid or not.
If the account is not valid, the message describes why it is not valid.

**Kind**: static method of [<code>BananoUtil</code>](#BananoUtil)  
**Returns**: [<code>AccountValidationInfo</code>](#AccountValidationInfo) - an object saying if the account is valid, and why.  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | the account. |

<a name="DepositUtil"></a>

## DepositUtil : <code>object</code>
**Kind**: global namespace  

* [DepositUtil](#DepositUtil) : <code>object</code>
    * [.receiveNanoDepositsForSeed(seed, seedIx, representative, specificPendingBlockHash)](#DepositUtil.receiveNanoDepositsForSeed) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.receiveBananoDepositsForSeed(seed, seedIx, representative, specificPendingBlockHash)](#DepositUtil.receiveBananoDepositsForSeed) ⇒ <code>Promise.&lt;object&gt;</code>

<a name="DepositUtil.receiveNanoDepositsForSeed"></a>

### DepositUtil.receiveNanoDepositsForSeed(seed, seedIx, representative, specificPendingBlockHash) ⇒ <code>Promise.&lt;object&gt;</code>
Recieve deposits for a nano account with a given seed.

**Kind**: static method of [<code>DepositUtil</code>](#DepositUtil)  
**Returns**: <code>Promise.&lt;object&gt;</code> - returns the response returned by the receive.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |
| representative | <code>string</code> | the representative. |
| specificPendingBlockHash | <code>string</code> | a specific block hash to receive (optional). |

<a name="DepositUtil.receiveBananoDepositsForSeed"></a>

### DepositUtil.receiveBananoDepositsForSeed(seed, seedIx, representative, specificPendingBlockHash) ⇒ <code>Promise.&lt;object&gt;</code>
Recieve deposits for a banano account with a given seed.

**Kind**: static method of [<code>DepositUtil</code>](#DepositUtil)  
**Returns**: <code>Promise.&lt;object&gt;</code> - returns the response returned by the receive.  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>string</code> | the seed to use to find the account. |
| seedIx | <code>string</code> | the index to use with the seed. |
| representative | <code>string</code> | the representative. |
| specificPendingBlockHash | <code>string</code> | a specific block hash to receive (optional). |

<a name="BananodeApi"></a>

## BananodeApi : <code>object</code>
**Kind**: global namespace  

* [BananodeApi](#BananodeApi) : <code>object</code>
    * [.getAccountBalanceRaw(account)](#BananodeApi.getAccountBalanceRaw) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.getAccountBalanceAndPendingRaw(account)](#BananodeApi.getAccountBalanceAndPendingRaw) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getAccountHistory(account, count, head, raw)](#BananodeApi.getAccountHistory) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getAccountInfo(account, representativeFlag)](#BananodeApi.getAccountInfo) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getBlockCount()](#BananodeApi.getBlockCount) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getAccountsPending(accounts, count, source)](#BananodeApi.getAccountsPending) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.setAuth(authString)](#BananodeApi.setAuth) ⇒ <code>undefined</code>

<a name="BananodeApi.getAccountBalanceRaw"></a>

### BananodeApi.getAccountBalanceRaw(account) ⇒ <code>Promise.&lt;string&gt;</code>
Get the balance, in raw, for an account.

(use other methods like getBananoPartsFromRaw to convert to banano or banoshi)

Calls [https://docs.nano.org/commands/rpc-protocol/#accounts_balances](https://docs.nano.org/commands/rpc-protocol/#accounts_balances)

**Kind**: static method of [<code>BananodeApi</code>](#BananodeApi)  
**Returns**: <code>Promise.&lt;string&gt;</code> - the account's balance, in raw.  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | the account to use. |

<a name="BananodeApi.getAccountBalanceAndPendingRaw"></a>

### BananodeApi.getAccountBalanceAndPendingRaw(account) ⇒ <code>Promise.&lt;object&gt;</code>
Get the balance and pending values, in raw, as an object like this one:
{ balance: '123', pending: '123' } for an account.

(use other methods like getBananoPartsFromRaw to convert to banano or banoshi)

Calls [https://docs.nano.org/commands/rpc-protocol/#accounts_balances](https://docs.nano.org/commands/rpc-protocol/#accounts_balances)

**Kind**: static method of [<code>BananodeApi</code>](#BananodeApi)  
**Returns**: <code>Promise.&lt;object&gt;</code> - the account's balances, in raw.  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | the account to use. |

<a name="BananodeApi.getAccountHistory"></a>

### BananodeApi.getAccountHistory(account, count, head, raw) ⇒ <code>Promise.&lt;object&gt;</code>
Get the history for an account.

Calls [https://docs.nano.org/commands/rpc-protocol/#account_history](https://docs.nano.org/commands/rpc-protocol/#account_history)

**Kind**: static method of [<code>BananodeApi</code>](#BananodeApi)  
**Returns**: <code>Promise.&lt;object&gt;</code> - the account's history.  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | the account to use. |
| count | <code>string</code> | the count to use (use -1 for all). |
| head | <code>string</code> | the head to start at (optional). |
| raw | <code>string</code> | if true, return raw history (optional). |

<a name="BananodeApi.getAccountInfo"></a>

### BananodeApi.getAccountInfo(account, representativeFlag) ⇒ <code>Promise.&lt;object&gt;</code>
Get the account info for an account.

Calls [https://docs.nano.org/commands/rpc-protocol/#account_info](https://docs.nano.org/commands/rpc-protocol/#account_info)

**Kind**: static method of [<code>BananodeApi</code>](#BananodeApi)  
**Returns**: <code>Promise.&lt;object&gt;</code> - the account's info.  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | the account to use. |
| representativeFlag | <code>boolean</code> | the representativeFlag to use (optional). |

<a name="BananodeApi.getBlockCount"></a>

### BananodeApi.getBlockCount() ⇒ <code>Promise.&lt;object&gt;</code>
Get the network block count.

Calls [https://docs.nano.org/commands/rpc-protocol/#block_count](https://docs.nano.org/commands/rpc-protocol/#block_count)

**Kind**: static method of [<code>BananodeApi</code>](#BananodeApi)  
**Returns**: <code>Promise.&lt;object&gt;</code> - the block count.  
<a name="BananodeApi.getAccountsPending"></a>

### BananodeApi.getAccountsPending(accounts, count, source) ⇒ <code>Promise.&lt;object&gt;</code>
Get the network block count.

Calls [https://docs.nano.org/commands/rpc-protocol/#accounts_pending](https://docs.nano.org/commands/rpc-protocol/#accounts_pending)

**Kind**: static method of [<code>BananodeApi</code>](#BananodeApi)  
**Returns**: <code>Promise.&lt;object&gt;</code> - the account's pending blocks.  

| Param | Type | Description |
| --- | --- | --- |
| accounts | <code>string\_array</code> | the array of pending accounts. |
| count | <code>number</code> | the max count to get. |
| source | <code>string</code> | if true, get source. |

<a name="BananodeApi.setAuth"></a>

### BananodeApi.setAuth(authString) ⇒ <code>undefined</code>
Sets an authorization string (http 'Authorization' header), useful if node requires api key.

**Kind**: static method of [<code>BananodeApi</code>](#BananodeApi)  
**Returns**: <code>undefined</code> - returns nothing.  

| Param | Type | Description |
| --- | --- | --- |
| authString | <code>string</code> | api key as a string\ |

<a name="BananoParts"></a>

## BananoParts : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| banano | <code>string</code> | The amount of banano. |
| banoshi | <code>string</code> | The amount of banoshi (not counting whole banano). |
| raw | <code>string</code> | The amount of raw (not counting whole banano and whole banoshi). |

<a name="AccountValidationInfo"></a>

## AccountValidationInfo : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | The message describing why the account is valid or not. |
| valid | <code>boolean</code> | True if account is valid. |

