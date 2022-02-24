var ERC721Mintable = artifacts.require("ERC721Mintable");

contract("TestERC721Mintable", (accounts) => {
  const account_one = accounts[0];
  const account_two = accounts[1];
  const account_three = accounts[3];

  describe('match erc721 spec', function () {
      beforeEach(async function () {
          this.contract = await ERC721Mintable.new({from: account_one});

          // TODO: mint multiple tokens
          await this.contract.mint(account_one, 1, { from: account_one });
          await this.contract.mint(account_two, 2, { from: account_one });
          await this.contract.mint(account_three, 3, { from: account_one });
      })

      it('should return total supply', async function () {
          let result = await this.contract.totalSupply.call();
          assert.equal(result.toNumber(), 3);
      })

      it('should get token balance', async function () {
          let result = await this.contract.balanceOf(account_one);
          assert.equal(result, 1);
      })

      // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
      it('should return token uri', async function () {
          let result = await this.contract.tokenURI(1);
          assert.equal(
            result,
            "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1"
          );
      })

      it('should transfer token from one owner to another', async function () {
          const tokenId = 1;
          const owner = await this.contract.ownerOf(tokenId);
          await this.contract.transferFrom(
            owner,
            account_two,
            tokenId,
            { from: account_one }
          );
          let newOwner = await this.contract.ownerOf(tokenId);
          assert.equal(
            newOwner,
            account_two
          );
      })
  });

  describe("have ownership properties", function () {
    beforeEach(async function () {
      this.contract = await ERC721Mintable.new({ from: account_one });
    });

    it("should fail when minting when address is not contract owner", async function () {
      let flag = false;
      try {
        await this.contract.mint(account_one, 4, { from: account_two });
      } catch (e) {
        flag = true;
      }
      assert(flag);
    });

    it("should return contract owner", async function () {
        assert.equal(await this.contract.getOwner(), account_one);
    });
  });
});
