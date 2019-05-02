const getAccountBalanceRaw = (account) => {
  throw new Error(`getAccountBalanceRaw account:${account}`);
};

const getAccountRepresentative = (account) => {
  throw new Error(`getAccountRepresentative account:${account}`);
};

const getPrevious = (account) => {
  throw new Error(`getPrevious account:${account}`);
};


const process = (block) => {
  throw new Error(`process block:${block}`);
};

const getGeneratedWork = async (hash) => {
  throw new Error(`getGeneratedWork hash:${hash}`);
};

exports.getAccountBalanceRaw = getAccountBalanceRaw;
exports.getAccountRepresentative = getAccountRepresentative;
exports.getPrevious = getPrevious;
exports.process = process;
exports.getGeneratedWork = getGeneratedWork;
