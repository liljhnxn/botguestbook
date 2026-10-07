import { expect } from "chai";
import hre from "hardhat";
const ethers = hre.ethers;
import { BotGuestbook } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("BotGuestbook", function () {
  let guestbook: BotGuestbook;
  let owner: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  let bob: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();
    const BotGuestbookFactory = await ethers.getContractFactory("BotGuestbook");
    guestbook = (await BotGuestbookFactory.deploy()) as unknown as BotGuestbook;
    await guestbook.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should start with 0 messages", async function () {
      expect(await guestbook.getMessageCount()).to.equal(0);
    });

    it("Should have MAX_MESSAGE_LENGTH set to 280", async function () {
      expect(await guestbook.MAX_MESSAGE_LENGTH()).to.equal(280);
    });
  });

  describe("Message creation", function () {
    it("A user can add a valid message, sender is correct, timestamp exists", async function () {
      const text = "Hello Botchain Testnet!";
      const tx = await guestbook.connect(alice).addMessage(text);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt!.blockNumber);

      expect(await guestbook.getMessageCount()).to.equal(1);

      const [sender, msgText, timestamp] = await guestbook.getMessage(0);
      expect(sender).to.equal(alice.address);
      expect(msgText).to.equal(text);
      expect(timestamp).to.equal(block!.timestamp);
    });
  });

  describe("Validation", function () {
    it("Empty message reverts", async function () {
      await expect(guestbook.connect(alice).addMessage(""))
        .to.be.revertedWith("Message cannot be empty");
    });

    it("Message above MAX_MESSAGE_LENGTH reverts", async function () {
      const longMessage = "a".repeat(281);
      await expect(guestbook.connect(alice).addMessage(longMessage))
        .to.be.revertedWith("Message exceeds maximum length");
    });

    it("Message exactly MAX_MESSAGE_LENGTH (280 chars) succeeds", async function () {
      const maxMessage = "x".repeat(280);
      await expect(guestbook.connect(alice).addMessage(maxMessage))
        .to.not.be.reverted;
      expect(await guestbook.getMessageCount()).to.equal(1);
    });
  });

  describe("Multiple messages", function () {
    it("Multiple wallets can submit messages, count increases, order is preserved", async function () {
      await guestbook.connect(alice).addMessage("First message from Alice");
      await guestbook.connect(bob).addMessage("Second message from Bob");
      await guestbook.connect(owner).addMessage("Third message from Owner");

      expect(await guestbook.getMessageCount()).to.equal(3);

      const msg0 = await guestbook.getMessage(0);
      const msg1 = await guestbook.getMessage(1);
      const msg2 = await guestbook.getMessage(2);

      expect(msg0.sender).to.equal(alice.address);
      expect(msg0.text).to.equal("First message from Alice");

      expect(msg1.sender).to.equal(bob.address);
      expect(msg1.text).to.equal("Second message from Bob");

      expect(msg2.sender).to.equal(owner.address);
      expect(msg2.text).to.equal("Third message from Owner");
    });
  });

  describe("Events", function () {
    it("MessageAdded event is emitted with the correct data", async function () {
      const messageText = "Testing event emission on Botchain";
      await expect(guestbook.connect(alice).addMessage(messageText))
        .to.emit(guestbook, "MessageAdded")
        .withArgs(alice.address, messageText, (val: any) => typeof val === "bigint" || typeof val === "number");
    });
  });

  describe("Read functions", function () {
    it("getMessageCount works accurately", async function () {
      expect(await guestbook.getMessageCount()).to.equal(0);
      await guestbook.connect(alice).addMessage("Msg 1");
      expect(await guestbook.getMessageCount()).to.equal(1);
      await guestbook.connect(bob).addMessage("Msg 2");
      expect(await guestbook.getMessageCount()).to.equal(2);
    });

    it("getMessage works and getAllMessages works", async function () {
      await guestbook.connect(alice).addMessage("Msg 1");
      await guestbook.connect(bob).addMessage("Msg 2");

      const m0 = await guestbook.getMessage(0);
      expect(m0.sender).to.equal(alice.address);
      expect(m0.text).to.equal("Msg 1");

      const all = await guestbook.getAllMessages();
      expect(all.length).to.equal(2);
      expect(all[0].text).to.equal("Msg 1");
      expect(all[1].text).to.equal("Msg 2");
    });

    it("Invalid message index reverts naturally", async function () {
      await expect(guestbook.getMessage(0)).to.be.reverted;
      await guestbook.connect(alice).addMessage("Only message");
      await expect(guestbook.getMessage(1)).to.be.reverted;
    });
  });
});
