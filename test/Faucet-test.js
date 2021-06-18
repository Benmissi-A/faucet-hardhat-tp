/* eslint-disable comma-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { expect } = require('chai');

describe('Faucet', function () {
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
    Faucet = await ethers.getContractFactory('Faucet');
    faucet = await Faucet.connect(dev).deploy(token.address, FAUCET_NAME);
    await faucet.deployed();
    await token.approve(faucet.address, INITIAL_SUPPLY);
  });

  describe('Deployement', function () {
    it('Test deploy ownable event', async function () {
      await expect(faucet.deployTransaction)
        .to.emit(faucet, 'Deployed')

        .withArgs(FAUCET_NAME);
    });
  });

  describe('Functions', function () {
    describe('sendToken', function () {
      it('Should emit Bought', async function () {
        const tx = await faucet.connect(alice).sendToken();
        const receipt = await tx.wait();
        const blockNumber = receipt.blockNumber;
        const block = await ethers.provider.getBlock(blockNumber);
        const timestamp = block.timestamp;
        expect(tx)
          .to.emit(faucet, 'Bought')
          .withArgs(alice.address, ethers.utils.parseEther('100'), timestamp);
      });
      it('Should emit Bought because timeLapse over 3 days', async function () {
        await faucet.connect(alice).sendToken();
        await ethers.provider.send('evm_increaseTime', [300000]);
        await ethers.provider.send('evm_mine');
        const tx = await faucet.connect(alice).sendToken();
        const block = await ethers.provider.getBlock();
        const timestamp = block.timestamp;
        expect(tx)
          .to.emit(faucet, 'Bought')
          .withArgs(alice.address, ethers.utils.parseEther('100'), timestamp);
      });
      it('Should revert because timeLapse under 3 days', async function () {
        await faucet.connect(alice).sendToken();
        await ethers.provider.send('evm_increaseTime', [250000]);
        await ethers.provider.send('evm_mine');
        await expect(faucet.connect(alice).sendToken()).to.be.revertedWith('Faucet: await 3 days');
      });
      /*
      it('Should revert if supply of Token too short', async function () {
        //set allowance < 100 ??;
        await expect(faucet.connect(bob).sendToken()).to.be.reverted();
      });
      */
    });

    describe('totalSupply', function () {
      it('Should return totalSupply', async function () {
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
