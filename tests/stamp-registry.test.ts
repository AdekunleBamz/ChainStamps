import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

const STAMP_FEE = 50000n; // 0.05 STX in microSTX

describe("stamp-registry", () => {
  it("ensures simnet is well initialized", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  it("should return correct stamp fee", () => {
    const { result } = simnet.callReadOnlyFn(
      "stamp-registry",
      "get-stamp-fee",
      [],
      wallet1
    );
    expect(result).toBeUint(STAMP_FEE);
  });

  it("should start with zero stamps", () => {
    const { result } = simnet.callReadOnlyFn(
      "stamp-registry",
      "get-stamp-count",
      [],
      wallet1
    );
    expect(result).toBeUint(0);
  });

  it("should allow user to stamp a message", () => {
    const message = "Hello ChainStamp!";
    const { result } = simnet.callPublicFn(
      "stamp-registry",
      "stamp-message",
      [Cl.stringUtf8(message)],
      wallet1
    );
    expect(result).toBeOk(Cl.uint(1));

    // Verify stamp count increased
    const { result: countResult } = simnet.callReadOnlyFn(
      "stamp-registry",
      "get-stamp-count",
      [],
      wallet1
    );
    expect(countResult).toBeUint(1);
  });

  it("should store stamp with correct data", () => {
    const message = "Test message";
    simnet.callPublicFn(
      "stamp-registry",
      "stamp-message",
      [Cl.stringUtf8(message)],
      wallet1
    );

    const { result } = simnet.callReadOnlyFn(
      "stamp-registry",
      "get-stamp",
      [Cl.uint(1)],
      wallet1
    );
    
    expect(result).toBeSome(
      Cl.tuple({
        sender: Cl.principal(wallet1),
        message: Cl.stringUtf8(message),
        timestamp: Cl.uint(expect.any(Number)),
        "block-height": Cl.uint(expect.any(Number)),
      })
    );
  });

  it("should track fees collected", () => {
    simnet.callPublicFn(
      "stamp-registry",
      "stamp-message",
      [Cl.stringUtf8("Fee test")],
      wallet1
    );

    const { result } = simnet.callReadOnlyFn(
      "stamp-registry",
      "get-total-fees",
      [],
      wallet1
    );
    expect(result).toBeUint(STAMP_FEE);
  });

  it("should track user stamps", () => {
    simnet.callPublicFn(
      "stamp-registry",
      "stamp-message",
      [Cl.stringUtf8("Message 1")],
      wallet2
    );
    simnet.callPublicFn(
      "stamp-registry",
      "stamp-message",
      [Cl.stringUtf8("Message 2")],
      wallet2
    );

    const { result } = simnet.callReadOnlyFn(
      "stamp-registry",
      "get-user-stamps",
      [Cl.principal(wallet2)],
      wallet2
    );
    expect(result).toBeList([Cl.uint(1), Cl.uint(2)]);
  });

  it("should return user stamp count", () => {
    simnet.callPublicFn(
      "stamp-registry",
      "stamp-message",
      [Cl.stringUtf8("Count 1")],
      wallet1
    );
    simnet.callPublicFn(
      "stamp-registry",
      "stamp-message",
      [Cl.stringUtf8("Count 2")],
      wallet1
    );

    const { result } = simnet.callReadOnlyFn(
      "stamp-registry",
      "get-user-stamp-count",
      [Cl.principal(wallet1)],
      wallet1
    );
    expect(result).toBeUint(2);
  });

  it("should return contract owner", () => {
    const { result } = simnet.callReadOnlyFn(
      "stamp-registry",
      "get-contract-owner",
      [],
      wallet1
    );
    expect(result).toBePrincipal(deployer);
  });
});
