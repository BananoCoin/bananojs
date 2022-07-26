declare namespace Main {
    /**
     * Sets the Bananode Api (useful for overriding some methods)
     * @param _bananodeApi - the new bananodeApi
     * @returns returns nothing.
     */
    function setBananodeApi(_bananodeApi: string): undefined;
    /**
     * Sets the Bananode Api Authorization
     * @param auth - the new authorization
     * @returns returns nothing.
     */
    function setAuth(auth: string): undefined;
    /**
     * Sets the URL to use for the node behind the Bananode Api
     * @param url - the new url
     * @returns returns nothing.
     */
    function setBananodeApiUrl(url: string): undefined;
}

declare namespace BananoUtil {
    /**
     * converts amount from decimal to bananoParts.
     * @param decimalAmount - the decimal amount of bananos.
     * @returns returns the banano parts of the decimal amount.
     */
    function getBananoPartsFromDecimal(decimalAmount: string): BananoParts;
    /**
     * converts amount from bananoParts to decimal.
     * @param bananoParts - the banano parts to describe.
     * @returns returns the decimal amount of bananos.
     */
    function getBananoPartsAsDecimal(bananoParts: BananoParts): string;
    /**
     * converts amount from decimal to raw.
     * @param amount - the decimal amount.
     * @returns returns amount in raw.
     */
    function getBananoDecimalAmountAsRaw(amount: string): string;
    /**
     * describes the banano parts in an english description.
     * @param bananoParts - the banano parts to describe.
     * @returns returns the description of the banano parts.
     */
    function getBananoPartsDescription(bananoParts: BananoParts): string;
    /**
     * Sends the amount to the account with an optional representative and
     * previous block hash.
     * If the representative is not sent, it will be pulled from the api.
     * If the previous is not sent, it will be pulled from the api.
     * Be very careful with previous, as setting it incorrectly
     * can cause an incorrect amount of funds to be sent.
     * @param seed - the seed to use to find the account.
     * @param seedIx - the index to use with the seed.
     * @param destAccount - the destination account.
     * @param amountRaw - the amount to send, in raw.
     * @param representative - the representative (optional).
     * @param previousHash - the previous hash (optional).
     * @returns returns the hash returned by the send.
     */
    function sendAmountToBananoAccountWithRepresentativeAndPrevious(seed: string, seedIx: string, destAccount: string, amountRaw: string, representative: string, previousHash: string): Promise<string>;
    /**
     * Sends the amount to the account with an optional representative and
     * previous block hash.
     * If the representative is not sent, it will be pulled from the api.
     * If the previous is not sent, it will be pulled from the api.
     * Be very careful with previous, as setting it incorrectly
     * can cause an incorrect amount of funds to be sent.
     * @param seed - the seed to use to find the account.
     * @param seedIx - the index to use with the seed.
     * @param destAccount - the destination account.
     * @param amountRaw - the amount to send, in raw.
     * @param representative - the representative (optional).
     * @param previousHash - the previous hash (optional).
     * @returns returns the hash returned by the send.
     */
    function sendAmountToNanoAccountWithRepresentativeAndPrevious(seed: string, seedIx: string, destAccount: string, amountRaw: string, representative: string, previousHash: string): Promise<string>;
    /**
     * Sends the amount to the banano account with a callback for success and failure.
     * @param seed - the seed to use to find the account.
     * @param seedIx - the index to use with the seed.
     * @param destAccount - the destination account.
     * @param amountRaw - the amount to send, in raw.
     * @param successCallback - the callback to call upon success.
     * @param failureCallback - the callback to call upon failure.
     * @returns returns the hash returned by the send.
     */
    function sendAmountToBananoAccount(seed: string, seedIx: string, destAccount: string, amountRaw: string, successCallback: string, failureCallback: string): Promise<string>;
    /**
     * Sends the amount to the nano account with a callback for success and failure.
     * @param seed - the seed to use to find the account.
     * @param seedIx - the index to use with the seed.
     * @param destAccount - the destination account.
     * @param amountRaw - the amount to send, in raw.
     * @param successCallback - the callback to call upon success.
     * @param failureCallback - the callback to call upon failure.
     * @returns returns the hash returned by the send.
     */
    function sendAmountToNanoAccount(seed: string, seedIx: string, destAccount: string, amountRaw: string, successCallback: string, failureCallback: string): Promise<string>;
    /**
     * Sets the rep for an account with a given seed.
     * @param seed - the seed to use to find the account.
     * @param seedIx - the index to use with the seed.
     * @param representative - the representative.
     * @returns returns the hash returned by the change.
     */
    function changeBananoRepresentativeForSeed(seed: string, seedIx: string, representative: string): Promise<string>;
    /**
     * Sets the rep for an account with a given seed.
     * @param seed - the seed to use to find the account.
     * @param seedIx - the index to use with the seed.
     * @param representative - the representative.
     * @returns returns the hash returned by the change.
     */
    function changeNanoRepresentativeForSeed(seed: string, seedIx: string, representative: string): Promise<string>;
    /**
     * Get the banano account with a given seed and index.
     * @param seed - the seed to use to find the account.
     * @param seedIx - the index to use with the seed.
     * @returns the account.
     */
    function getBananoAccountFromSeed(seed: string, seedIx: string): Promise<string>;
    /**
     * Get the banano account with a given seed and index.
     * @param seed - the seed to use to find the account.
     * @param seedIx - the index to use with the seed.
     * @returns the account.
     */
    function getNanoAccountFromSeed(seed: string, seedIx: string): Promise<string>;
    /**
     * Open a banano account with a given seed.
     * @param seed - the seed to use to find the account.
     * @param seedIx - the index to use with the seed.
     * @param representative - the representative.
     * @param pendingBlockHash - the pending block hash.
     * @param pendingValueRaw - the pending block hash.
     * @returns returns the hash returned by the open.
     */
    function openBananoAccountFromSeed(seed: string, seedIx: string, representative: string, pendingBlockHash: string, pendingValueRaw: string): Promise<string>;
    /**
     * Open a nano account with a given seed.
     * @param seed - the seed to use to find the account.
     * @param seedIx - the index to use with the seed.
     * @param representative - the representative.
     * @param pendingBlockHash - the pending block hash.
     * @param pendingValueRaw - the pending block hash.
     * @returns returns the hash returned by the open.
     */
    function openNanoAccountFromSeed(seed: string, seedIx: string, representative: string, pendingBlockHash: string, pendingValueRaw: string): Promise<string>;
    /**
     * Get the hash for a given block.
     * @param block - the seed to use to find the account.
     * @returns the block's hash.
     */
    function getBlockHash(block: string): string;
    /**
     * signs a hash.
     * @param privateKey - the private key to use to sign.
     * @param hash - the hash to sign.
     * @returns the block's hash.
     */
    function signHash(privateKey: string, hash: string): string;
    /**
     * verifys a hash.
     * @param hash - the hash to verify.
     * @param signature - the signature to verify.
     * @param publicKey - the public key to use to sign.
     * @returns true if verification passed.
     */
    function verify(hash: string, signature: string, publicKey: string): string;
    /**
     * Get the signature for a given block (gets the hash of the block, and signs the hash).
     * @param privateKey - the private key used to sign the block.
     * @param block - the block to sign.
     * @returns the block's signature.
     */
    function getSignature(privateKey: string, block: string): string;
    /**
     * Converts a hex string to bytes in a Uint8Array.
     * @param hex - the hex string to use.
     * @returns the bytes in a Uint8Array.
     */
    function getBytesFromHex(hex: string): Uint8Array;
    /**
     * Converts bytes in a Uint8Array to a hex string.
     * @param bytes - the bytes to use.
     * @returns the hex string.
     */
    function getHexFromBytes(bytes: Uint8Array): string;
    /**
     * gets work bytes using the CPU.
     * @param hash - the hash to use to calculate work bytes.
     * @param workBytes - the Uint8Array(8) used to store temporary calculations.
     * @returns the work bytes as a hex string.
     */
    function getWorkUsingCpu(hash: string, workBytes: Uint8Array): string;
    /**
     * Converts an amount into a raw amount.
     * @param amountStr - the amount, as a string.
     * @param amountPrefix - the amount, as a string.
     * @returns the banano as a raw value.
     */
    function getRawStrFromBananoStr(amountStr: string, amountPrefix: string): string;
    /**
     * Converts an amount into a raw amount.
     * @param amountStr - the amount, as a string.
     * @param amountPrefix - the amount, as a string.
     * @returns the banano as a raw value.
     */
    function getRawStrFromBanoshiStr(amountStr: string, amountPrefix: string): string;
    /**
     * Converts an amount into a raw amount.
     * @param amountStr - the amount, as a string.
     * @param amountPrefix - the amount, as a string.
     * @returns the banano as a raw value.
     */
    function getRawStrFromNanoStr(amountStr: string, amountPrefix: string): string;
    /**
     * Converts an amount into a raw amount.
     * @param amountStr - the amount, as a string.
     * @param amountPrefix - the amount, as a string.
     * @returns the banano as a raw value.
     */
    function getRawStrFromNanoshiStr(amountStr: string, amountPrefix: string): string;
    /**
     * Get the banano account for a given public key.
     * @param publicKey - the public key.
     * @returns the account.
     */
    function getBananoAccount(publicKey: string): string;
    /**
     * Get the banano account for a given public key.
     * @param publicKey - the public key.
     * @returns the account.
     */
    function getNanoAccount(publicKey: string): string;
    /**
     * Get the banano parts (banano, banoshi, raw) for a given raw value.
     * @param amountRawStr - the raw amount, as a string.
     * @returns the banano parts.
     */
    function getBananoPartsFromRaw(amountRawStr: string): BananoParts;
    /**
     * Get the nano parts nano, nanoshi, raw) for a given raw value.
     * @param amountRawStr - the raw amount, as a string.
     * @returns the banano parts.
     */
    function getNanoPartsFromRaw(amountRawStr: string): BananoParts;
    /**
     * Converts an amount into a raw amount.
     * @param amountStr - the amount, as a string.
     * @param amountPrefix - the amount, as a string.
     * @returns the banano as a raw value.
     */
    function getRawStrFromMajorAmountStr(amountStr: string, amountPrefix: string): string;
    /**
     * Converts a banoshi amount into a raw amount.
     * @param amountStr - the banoshi, as a string.
     * @param amountPrefix - the amount prefix, as a string.
     * @returns the banano as a raw value.
     */
    function getRawStrFromMinorAmountStr(amountStr: string, amountPrefix: string): string;
    /**
     * Get the banano parts (banano, banoshi, raw) for a given raw value.
     * @param amountRawStr - the raw amount, as a string.
     * @param amountPrefix - the amount prefix, as a string.
     * @returns the banano parts.
     */
    function getAmountPartsFromRaw(amountRawStr: string, amountPrefix: string): BananoParts;
    /**
     * Get the public key for a given account.
     * @param account - the account.
     * @returns the public key.
     */
    function getAccountPublicKey(account: string): string;
    /**
     * Get the account suffix for a given public key (everything but ban_ or camo_ or nano_).
     * @param publicKey - the public key.
     * @returns the account suffix.
     */
    function getAccountSuffix(publicKey: string): string;
    /**
     * Get the account for a given public key.
     * @param publicKey - the public key.
     * @param accountPrefix - the prefix. ban_ or nano_.
     * @returns the account.
     */
    function getAccount(publicKey: string, accountPrefix: string): string;
    /**
     * returns true if the work (in bytes) for the hash (in bytes) is valid.
     * @param hashBytes - the hash bytes to check.
     * @param workBytes - the work bytes to check.
     * @returns true if the work is valid for the hash.
     */
    function isWorkValid(hashBytes: string, workBytes: string): boolean;
    /**
     * creates a new Uint8Array(8) to calculate work bytes.
     * @returns the bytes in a Uint8Array.
     */
    function getZeroedWorkBytes(): Uint8Array;
    /**
     * Get the public key for a given private key.
     * @param privateKey - the private key.
     * @returns the public key.
     */
    function getPublicKey(privateKey: string): string;
    /**
     * validates a seed.
     * @param seed - the seed to use to validate.
     * @param seedIx - the index to use with the seed.
     * @returns {valid:[true/false] message:[if false, why]}.
     */
    function isSeedValid(seed: string, seedIx: string): any;
    /**
     * Get the private key for a given seed.
     * @param seed - the seed to use to find the account.
     * @param seedIx - the index to use with the seed.
     * @returns the private key.
     */
    function getPrivateKey(seed: string, seedIx: string): string;
    /**
     * Returns an object saying if the banano account is valid or not.
     * If the account is not valid, the message describes why it is not valid.
     * @param account - the account.
     * @returns an object saying if the account is valid, and why.
     */
    function getBananoAccountValidationInfo(account: string): AccountValidationInfo;
    /**
     * Returns an object saying if the nano account is valid or not.
     * If the account is not valid, the message describes why it is not valid.
     * @param account - the account.
     * @returns an object saying if the account is valid, and why.
     */
    function getNanoAccountValidationInfo(account: string): AccountValidationInfo;
}

declare namespace DepositUtil {
    /**
     * Recieve deposits for a nano account with a given seed.
     * @param seed - the seed to use to find the account.
     * @param seedIx - the index to use with the seed.
     * @param representative - the representative.
     * @param specificPendingBlockHash - a specific block hash to receive (optional).
     * @returns returns the response returned by the receive.
     */
    function receiveNanoDepositsForSeed(seed: string, seedIx: string, representative: string, specificPendingBlockHash: string): Promise<object>;
    /**
     * Recieve deposits for a banano account with a given seed.
     * @param seed - the seed to use to find the account.
     * @param seedIx - the index to use with the seed.
     * @param representative - the representative.
     * @param specificPendingBlockHash - a specific block hash to receive (optional).
     * @returns returns the response returned by the receive.
     */
    function receiveBananoDepositsForSeed(seed: string, seedIx: string, representative: string, specificPendingBlockHash: string): Promise<object>;
}

declare namespace BananodeApi {
    /**
     * Get the balance, in raw, for an account.
     *
     * (use other methods like getBananoPartsFromRaw to convert to banano or banoshi)
     *
     * Calls {@link https://docs.nano.org/commands/rpc-protocol/#accounts_balances}
     * @param account - the account to use.
     * @returns the account's balance, in raw.
     */
    function getAccountBalanceRaw(account: string): Promise<string>;
    /**
     * Get the balance and pending values, in raw, as an object like this one:
     * { balance: '123', pending: '123' } for an account.
     *
     * (use other methods like getBananoPartsFromRaw to convert to banano or banoshi)
     *
     * Calls {@link https://docs.nano.org/commands/rpc-protocol/#accounts_balances}
     * @param account - the account to use.
     * @returns the account's balances, in raw.
     */
    function getAccountBalanceAndPendingRaw(account: string): Promise<object>;
    /**
     * Get the balances and pending values, in raw, as an object for all given account. Returns the Node object without transformation.
     *
     * (use other methods like getBananoPartsFromRaw to convert to banano or banoshi)
     *
     * Calls {@link https://docs.nano.org/commands/rpc-protocol/#accounts_balances}
     * @param accounts - the account to use.
     * @returns the account's balances, in raw.
     */
    function getAccountsBalances(accounts: string_array): Promise<object>;
    /**
     * Get the history for an account.
     *
     * Calls {@link https://docs.nano.org/commands/rpc-protocol/#account_history}
     * @param account - the account to use.
     * @param count - the count to use (use -1 for all).
     * @param head - the head to start at (optional).
     * @param raw - if true, return raw history (optional).
     * @returns the account's history.
     */
    function getAccountHistory(account: string, count: number, head: string, raw: string): Promise<object>;
    /**
     * Get the account info for an account.
     *
     * Calls {@link https://docs.nano.org/commands/rpc-protocol/#account_info}
     * @param account - the account to use.
     * @param representativeFlag - the representativeFlag to use (optional).
     * @returns the account's info.
     */
    function getAccountInfo(account: string, representativeFlag: boolean): Promise<object>;
    /**
     * Get the network block count.
     *
     * Calls {@link https://docs.nano.org/commands/rpc-protocol/#block_count}
     * @returns the block count.
     */
    function getBlockCount(): Promise<object>;
    /**
     * Get the pending blocks for the account.
     *
     * Calls {@link https://docs.nano.org/commands/rpc-protocol/#accounts_pending}
     * @param accounts - the array of pending accounts.
     * @param count - the max count to get.
     * @param source - if true, get source.
     * @returns the account's pending blocks.
     */
    function getAccountsPending(accounts: string_array, count: number, source: string): Promise<object>;
    /**
     * Sets an authorization string (http 'Authorization' header), useful if node requires api key.
     * @param authString - api key as a string\
     * @returns returns nothing.
     */
    function setAuth(authString: string): undefined;
}

/**
 * @property banano - The amount of banano.
 * @property banoshi - The amount of banoshi (not counting whole banano).
 * @property raw - The amount of raw (not counting whole banano and whole banoshi).
 */
declare type BananoParts = {
    banano: string;
    banoshi: string;
    raw: string;
};

/**
 * @property message - The message describing why the account is valid or not.
 * @property valid - True if account is valid.
 */
declare type AccountValidationInfo = {
    message: string;
    valid: boolean;
};


