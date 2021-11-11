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
<a name="BananoUtil"></a>

## BananoUtil : <code>object</code>
**Kind**: global namespace  

* [BananoUtil](#BananoUtil) : <code>object</code>
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
<a name="BananodeApi"></a>

## BananodeApi : <code>object</code>
**Kind**: global namespace  
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

