/* eslint-disable comma-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { expect } = require('chai');

describe('Token', function () {
  let Token, token, Faucet, dev, alice, bob, eve;

  const NAME = 'SAGISTAMI';
  const FAUCET_NAME = 'Faucet';
  const SYMBOL = 'SGSA';
  const INITIAL_SUPPLY = ethers.utils.parseEther('8000');

  this.beforeEach(async function () {
    [dev, alice, bob, eve] = await ethers.getSigners();
    Token = await ethers.getContractFactory('Token');
    token = await Token.connect(dev).deploy(NAME, SYMBOL, INITIAL_SUPPLY);
    await token.deployed();
  });

  describe('Deployement', function () {
    it('should emit the event OwnershipTransferred correctly', async function () {
      await expect(token.deployTransaction)
        .to.emit(token, 'OwnershipTransferred')
        .withArgs(ethers.constants.AddressZero, dev.address);
    });
  });

  describe('Functions', function () {
    describe('owner', function () {
      it('Should return the owner', async function () {
        expect(await token.owner()).to.equal(dev.address);
      });
    });

    describe('totalSupply', function () {
      it('Should return the totalSupply', async function () {
        expect(await token.totalSupply()).to.equal(ethers.utils.parseEther('8000'));
      });
    });

    describe('balanceOf', function () {
      it('Should return balance of owner', async function () {
        expect(await token.connect(dev).balanceOf(dev.address)).to.equal(INITIAL_SUPPLY);
      });
    });
    describe('approval', function () {
      it('approve', async function () {
        Faucet = await ethers.getContractFactory('Faucet');
        faucet = await Faucet.connect(dev).deploy(token.address, FAUCET_NAME);
        await faucet.deployed();
        await token.approve(faucet.address, INITIAL_SUPPLY);
        expect(await token.allowance(dev.address, faucet.address)).to.equal(ethers.utils.parseEther('8000'));
      });
    });
  });
});
