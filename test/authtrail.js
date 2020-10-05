const { expectRevert } = require('@openzeppelin/test-helpers');
const Authtrail = artifacts.require("Authtrail");

contract("Authtrail test", async accounts => {
  it("Deployer should be the owner of the contract", async () => {
    let instance = await Authtrail.deployed();
    let owner = await instance.owner.call();
    assert.equal(owner, accounts[0]);
  });

  it("Owner sets authorized address", async () => {
    let instance = await Authtrail.deployed();
    await instance.setAuthorizedAddress(accounts[1], true, { from: accounts[0] });
    const isAuthorized = await instance.authorizedAddresses.call(accounts[1]);
    assert.equal(isAuthorized, true);
  });

  it("Owner revokes authorized address", async () => {
    let instance = await Authtrail.deployed();
    await instance.setAuthorizedAddress(accounts[1], false, { from: accounts[0] });
    const isAuthorized = await instance.authorizedAddresses.call(accounts[1]);
    assert.equal(isAuthorized, false);
  });

  it("Reverts if someone other then the owner tries to set authorized address", async () => {
    let instance = await Authtrail.deployed();
    await expectRevert(instance.setAuthorizedAddress(accounts[1], true, { from: accounts[2] }), "Ownable: caller is not the owner");
  });

  it("Anchors data.", async () => {
    let instance = await Authtrail.deployed();
    await instance.setAuthorizedAddress(accounts[1], true, { from: accounts[0] });
    const appId = "8gd25b";
    const height = 1;
    const digest = "n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg=";
    await instance.anchor(appId, height, digest, { from: accounts[1] });
    const anchorDigest = await instance.anchors.call(appId, height);
    assert.equal(digest, anchorDigest);
  });

  it("Reverts if trying to create two anchors for same appId and height", async () => {
    let instance = await Authtrail.deployed();
    const appId = "8gd25c";
    const height = 1;
    const digest1 = "n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg=";
    const digest2 = "YDA64iuZiGG847KPM+7BvnWKITyGyTwHbb6fVYwRx1I=";
    await instance.anchor(appId, height, digest1, { from: accounts[1] });
    await expectRevert(instance.anchor(appId, height, digest2, { from: accounts[1] }), "Authtrail: anchor already exists");
  });

  it("Reverts if a non authorized address tries to anchor", async () => {
    let instance = await Authtrail.deployed();
    const appId = "8gd25d";
    const height = 1;
    const digest = "n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg=";
    await expectRevert(instance.anchor(appId, height, digest, { from: accounts[2] }), "Authtrail: not authorized");
  });
});
