const ACCOUNTS_BALANCES = account => ({ action: 'accounts_balances', accounts: [ account ] });
const ACCOUNT_REPRESENTATIVE = account => ({ action: 'account_representative', account: account });
const ACCOUNTS_FRONTIERS = account => ({ action: 'accounts_frontiers', accounts: [ account ], count: 1 });
const ACCOUNT_HISTORY = ( account, count ) => ({ action: 'account_history', account: account, count });
const ACCOUNT_INFO = account => ({ action: 'account_info', account: account });
const BLOCKS = hashes => ({ action: 'blocks', hashes });
const PROCESS = block => ({ action: 'process', block });
const WORK_GENERATE = hash => ({ action: 'work_generate', hash });
const ACCOUNTS_PENDING = ( accounts, count ) => ({ action: 'accounts_pending', accounts, count, threshold: 1 });
const BLOCK_ACCOUNT = hash => ({ action: 'block_account', hash });
const FRONTIERS = ( account, count ) => ({ action: 'frontiers', account, count });


exports.ACCOUNTS_BALANCES = ACCOUNTS_BALANCES;
exports.ACCOUNT_REPRESENTATIVE =  ACCOUNT_REPRESENTATIVE;
exports.ACCOUNTS_FRONTIERS =  ACCOUNTS_FRONTIERS;
exports.ACCOUNT_HISTORY =  ACCOUNT_HISTORY;
exports.ACCOUNT_INFO =  ACCOUNT_INFO;
exports.BLOCKS =  BLOCKS;
exports.PROCESS =  PROCESS;
exports.WORK_GENERATE =  WORK_GENERATE;
exports.ACCOUNTS_PENDING =  ACCOUNTS_PENDING;
exports.BLOCK_ACCOUNT =  BLOCK_ACCOUNT;
exports.FRONTIERS =  FRONTIERS;