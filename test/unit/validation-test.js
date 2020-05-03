'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const bananoTest = require('./banano-test.json');

const testUtil = require('../util/test-util.js');
const bananojs = testUtil.getBananojsWithMockApi();

const bananoAccount = bananoTest.bananoAccount;
const nanoAccount = bananoTest.nanoAccount;

describe('account-validation', () => {
  describe('banano', () => {
    it('getBananoAccountValidationInfo valid account matches expected', () => {
      const validationInfo = bananojs.getBananoAccountValidationInfo(bananoAccount);
      expect(validationInfo).to.deep.equal({
        valid: true,
        message: 'valid',
      });
    });
    it('getBananoAccountValidationInfo null account matches expected', () => {
      const validationInfo = bananojs.getBananoAccountValidationInfo(null);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message: 'Invalid BANANO Account (null)',
      });
    });
    it('getBananoAccountValidationInfo undefined account matches expected', () => {
      const validationInfo = bananojs.getBananoAccountValidationInfo(undefined);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message: 'Invalid BANANO Account (undefined)',
      });
    });
    it('getBananoAccountValidationInfo too short account matches expected', () => {
      const badAccount = 'ban_1bad1not64chars';
      const validationInfo = bananojs.getBananoAccountValidationInfo(badAccount);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message: 'Invalid BANANO Account (not 64 characters)',
      });
    });
    it('getBananoAccountValidationInfo malformed prefix account matches expected', () => {
      const badAccount = 'ban_4bad1ppzmj146pdxgbmph3wmeg15t8zk1yfwbozysoxtti3xqa15qufta5tq';
      const validationInfo = bananojs.getBananoAccountValidationInfo(badAccount);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message: 'Invalid BANANO Account (does not start with ban_1 or ban_3)',
      });
    });
    it('getBananoAccountValidationInfo incorrect alphabet account matches expected', () => {
      const badAccount = 'ban_1BAD1ppzmj146pdxgbmph3wmeg15t8zk1yfwbozysoxtti3xqa15qufta5tq';
      const validationInfo = bananojs.getBananoAccountValidationInfo(badAccount);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message: 'Invalid BANANO account (characters after ban_ must be one of:13456789abcdefghijkmnopqrstuwxyz)',
      });
    });
    it('getBananoAccountValidationInfo checksum alphabet account matches expected', () => {
      const badAccount = 'ban_1111111111111111111111111111111111111111111111111111hifc8npq';
      const validationInfo = bananojs.getBananoAccountValidationInfo(badAccount);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message: 'Invalid BANANO account (Incorrect checksum hifc8npq <> hifc8npp)',
      });
    });
  });
  describe('nano', () => {
    it('getNanoAccountValidationInfo valid account matches expected', () => {
      const validationInfo = bananojs.getNanoAccountValidationInfo(nanoAccount);
      expect(validationInfo).to.deep.equal({
        valid: true,
        message: 'valid',
      });
    });
    it('getNanoAccountValidationInfo null account matches expected', () => {
      const validationInfo = bananojs.getNanoAccountValidationInfo(null);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message: 'Invalid NANO Account (null)',
      });
    });
    it('getNanoAccountValidationInfo undefined account matches expected', () => {
      const validationInfo = bananojs.getNanoAccountValidationInfo(undefined);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message: 'Invalid NANO Account (undefined)',
      });
    });
    it('getNanoAccountValidationInfo too short account matches expected', () => {
      const badAccount = 'nano_1bad1not65chars';
      const validationInfo = bananojs.getNanoAccountValidationInfo(badAccount);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message: 'Invalid NANO Account (not 65 characters)',
      });
    });
    it('getNanoAccountValidationInfo malformed prefix account matches expected', () => {
      const badAccount = 'nano_4bad1ppzmj146pdxgbmph3wmeg15t8zk1yfwbozysoxtti3xqa15qufta5tq';
      const validationInfo = bananojs.getNanoAccountValidationInfo(badAccount);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message: 'Invalid NANO Account (does not start with nano_1 or nano_3)',
      });
    });
    it('getNanoAccountValidationInfo incorrect alphabet account matches expected', () => {
      const badAccount = 'nano_1BAD1ppzmj146pdxgbmph3wmeg15t8zk1yfwbozysoxtti3xqa15qufta5tq';
      const validationInfo = bananojs.getNanoAccountValidationInfo(badAccount);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message: 'Invalid NANO account (characters after nano_ must be one of:13456789abcdefghijkmnopqrstuwxyz)',
      });
    });
    it('getNanoAccountValidationInfo checksum alphabet account matches expected', () => {
      const badAccount = 'nano_1111111111111111111111111111111111111111111111111111hifc8npq';
      const validationInfo = bananojs.getNanoAccountValidationInfo(badAccount);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message: 'Invalid NANO account (Incorrect checksum hifc8npq <> hifc8npp)',
      });
    });
  });

  beforeEach(async () => {
  });

  afterEach(async () => {
    testUtil.deactivate();
  });
});
