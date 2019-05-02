// const assert = require('chai').assert;
const expect = require('chai').expect;

const bananoTest = require('./banano-test.json');

const bananojs = require('../util/test-util.js').getBananojsWithMockApi();

const block = bananoTest.block;

describe('account-validation', () => {
  it('getAccountValidationInfo valid account matches expected', () => {
    const validationInfo = bananojs.getAccountValidationInfo(block.account);
    expect(validationInfo).to.deep.equal({
      valid: true,
      message: 'valid',
    });
  });
  it('getAccountValidationInfo null account matches expected', () => {
    const validationInfo = bananojs.getAccountValidationInfo(null);
    expect(validationInfo).to.deep.equal({
      valid: false,
      message: 'Invalid BANANO Account (null)',
    });
  });
  it('getAccountValidationInfo undefined account matches expected', () => {
    const validationInfo = bananojs.getAccountValidationInfo(undefined);
    expect(validationInfo).to.deep.equal({
      valid: false,
      message: 'Invalid BANANO Account (undefined)',
    });
  });
  it('getAccountValidationInfo too short account matches expected', () => {
    const badAccount = 'ban_1bad1not64chars';
    const validationInfo = bananojs.getAccountValidationInfo(badAccount);
    expect(validationInfo).to.deep.equal({
      valid: false,
      message: 'Invalid BANANO Account (not 64 characters)',
    });
  });
  it('getAccountValidationInfo malformed prefix account matches expected', () => {
    const badAccount = 'ban_4bad1ppzmj146pdxgbmph3wmeg15t8zk1yfwbozysoxtti3xqa15qufta5tq';
    const validationInfo = bananojs.getAccountValidationInfo(badAccount);
    expect(validationInfo).to.deep.equal({
      valid: false,
      message: 'Invalid BANANO Account (does not start with ban_1 or ban_3)',
    });
  });
  it('getAccountValidationInfo incorrect alphabet account matches expected', () => {
    const badAccount = 'ban_1BAD1ppzmj146pdxgbmph3wmeg15t8zk1yfwbozysoxtti3xqa15qufta5tq';
    const validationInfo = bananojs.getAccountValidationInfo(badAccount);
    expect(validationInfo).to.deep.equal({
      valid: false,
      message: 'Invalid BANANO account (characters after ban_ must be one of:13456789abcdefghijkmnopqrstuwxyz)',
    });
  });
  it('getAccountValidationInfo checksum alphabet account matches expected', () => {
    const badAccount = 'ban_1111111111111111111111111111111111111111111111111111hifc8npq';
    const validationInfo = bananojs.getAccountValidationInfo(badAccount);
    expect(validationInfo).to.deep.equal({
      valid: false,
      message: 'Invalid BANANO account (Incorrect checksum hifc8npq <> hifc8npp)',
    });
  });
});
