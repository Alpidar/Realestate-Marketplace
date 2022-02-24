var Verifier = artifacts.require("Verifier");
var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
const proof = require(`../../zokrates/code/square/proof`);

contract("SolnSquareVerifier", (accounts) => {
  const account_one = accounts[0];
  const tokenId = 0;

  beforeEach(async function () {
    this.verifier = await Verifier.new({ from: account_one });
    this.contract = await SolnSquareVerifier.new(this.verifier.address, {
      from: account_one,
    });
  });

  // Test if a new solution can be added for contract - SolnSquareVerifier
  it("Test if a new solution can be added for contract", async function () {
    let result = await this.contract.addSolution(
      proof.proof.A,
      proof.proof.A_p,
      proof.proof.B,
      proof.proof.B_p,
      proof.proof.C,
      proof.proof.C_p,
      proof.proof.H,
      proof.proof.K,
      proof.input,
      tokenId,
      { from: account_one }
    );
    assert.equal(result.logs[0].event, "solutionAdded");
  });

  // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
  it("Test if an ERC721 token can be minted for contract", async function () {
    let beforeResult = (await this.contract.totalSupply()).toNumber();

    await this.contract.addSolution(
      proof.proof.A,
      proof.proof.A_p,
      proof.proof.B,
      proof.proof.B_p,
      proof.proof.C,
      proof.proof.C_p,
      proof.proof.H,
      proof.proof.K,
      proof.input,
      tokenId,
      { from: account_one }
    );

    await this.contract.mintToken(account_one, tokenId, {
      from: account_one,
    });
    let afterResult = (await this.contract.totalSupply()).toNumber();

    assert.equal(afterResult, beforeResult + 1);
  });
});
