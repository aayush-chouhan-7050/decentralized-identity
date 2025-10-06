const { expect } = require("chai");
const { ethers } = require("hardhat");

// `describe`
describe("Identity Contract", function () {
  let Identity, identityContract, owner, addr1, addr2;

  beforeEach(async function () {
    Identity = await ethers.getContractFactory("Identity");
    [owner, addr1, addr2] = await ethers.getSigners();

    identityContract = await Identity.deploy();
  });

  // Test Case 1: Deployment
  describe("Deployment", function () {
    it("Should deploy without errors", async function () {
      const address = await identityContract.getAddress();
      expect(address).to.not.be.undefined;
      expect(address).to.be.properAddress;
    });
  });

  // Test Case 2: Identity Creation
  describe("Identity Creation", function () {
    it("Should allow a user to create a new identity", async function () {
      const tx = await identityContract.connect(addr1).createIdentity("Alice", "alice@email.com");
      await tx.wait(); 

      const userIdentity = await identityContract.identities(addr1.address);

      expect(userIdentity.name).to.equal("Alice");
      expect(userIdentity.email).to.equal("alice@email.com");
      expect(userIdentity.isCreated).to.be.true;
    });

    it("Should emit an IdentityCreated event upon creation", async function () {
      await expect(identityContract.connect(addr1).createIdentity("Alice", "alice@email.com"))
        .to.emit(identityContract, "IdentityCreated")
        .withArgs(addr1.address, "Alice", (timestamp) => timestamp > 0); 
    });

    it("Should NOT allow a user to create an identity twice", async function () {
      // Create the first identity
      const tx = await identityContract.connect(addr1).createIdentity("Alice", "alice@email.com");
      await tx.wait();
      await expect(
        identityContract.connect(addr1).createIdentity("Bob", "bob@email.com")
      ).to.be.revertedWith("Identity already exists for this address.");
    });

    it("Should NOT allow creating an identity with an empty name", async function () {
      await expect(
        identityContract.connect(addr1).createIdentity("", "alice@email.com")
      ).to.be.revertedWith("Name cannot be empty.");
    });
  });
});