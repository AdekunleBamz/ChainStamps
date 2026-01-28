import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

const TAG_FEE = 40000n; // 0.04 STX in microSTX

describe("tag-registry", () => {
  it("ensures simnet is well initialized", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  it("should return correct tag fee", () => {
    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-tag-fee",
      [],
      wallet1
    );
    expect(result).toBeUint(TAG_FEE);
  });

  it("should start with zero tags", () => {
    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-tag-count",
      [],
      wallet1
    );
    expect(result).toBeUint(0);
  });

  it("should allow user to store a tag", () => {
    const key = "project";
    const value = "chainstamp-v1";
    
    const { result } = simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8(key), Cl.stringUtf8(value)],
      wallet1
    );
    expect(result).toBeOk(Cl.uint(1));

    // Verify tag count increased
    const { result: countResult } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-tag-count",
      [],
      wallet1
    );
    expect(countResult).toBeUint(1);
  });

  it("should retrieve tag by ID", () => {
    const key = "version";
    const value = "1.0.0";
    
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8(key), Cl.stringUtf8(value)],
      wallet1
    );

    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-tag",
      [Cl.uint(1)],
      wallet1
    );
    
    expect(result).toBeSome(
      Cl.tuple({
        owner: Cl.principal(wallet1),
        key: Cl.stringUtf8(key),
        value: Cl.stringUtf8(value),
        timestamp: Cl.uint(expect.any(Number)),
        "block-height": Cl.uint(expect.any(Number)),
      })
    );
  });

  it("should retrieve tag by owner and key", () => {
    const key = "config";
    const value = "production";
    
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8(key), Cl.stringUtf8(value)],
      wallet1
    );

    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-tag-by-key",
      [Cl.principal(wallet1), Cl.stringUtf8(key)],
      wallet1
    );
    
    expect(result).toBeSome(
      Cl.tuple({
        owner: Cl.principal(wallet1),
        key: Cl.stringUtf8(key),
        value: Cl.stringUtf8(value),
        timestamp: Cl.uint(expect.any(Number)),
        "block-height": Cl.uint(expect.any(Number)),
      })
    );
  });

  it("should allow updating existing tag", () => {
    const key = "status";
    const value1 = "pending";
    const value2 = "completed";
    
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8(key), Cl.stringUtf8(value1)],
      wallet1
    );

    const { result } = simnet.callPublicFn(
      "tag-registry",
      "update-tag",
      [Cl.stringUtf8(key), Cl.stringUtf8(value2)],
      wallet1
    );
    expect(result).toBeOk(Cl.uint(1));
  });

  it("should reject update for non-existent tag", () => {
    const { result } = simnet.callPublicFn(
      "tag-registry",
      "update-tag",
      [Cl.stringUtf8("nonexistent"), Cl.stringUtf8("value")],
      wallet2
    );
    expect(result).toBeErr(Cl.uint(103)); // ERR-TAG-NOT-FOUND
  });

  it("should track fees collected", () => {
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8("test"), Cl.stringUtf8("value")],
      wallet1
    );

    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-total-fees",
      [],
      wallet1
    );
    expect(result).toBeUint(TAG_FEE);
  });

  it("should track user tags", () => {
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8("key1"), Cl.stringUtf8("value1")],
      wallet2
    );
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8("key2"), Cl.stringUtf8("value2")],
      wallet2
    );

    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-user-tags",
      [Cl.principal(wallet2)],
      wallet2
    );
    expect(result).toBeList([Cl.uint(1), Cl.uint(2)]);
  });

  it("should return tag owner", () => {
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8("owner-key"), Cl.stringUtf8("owner-value")],
      wallet1
    );

    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-tag-owner",
      [Cl.uint(1)],
      wallet1
    );
    expect(result).toBeSome(Cl.principal(wallet1));
  });

  it("should return contract owner", () => {
    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-contract-owner",
      [],
      wallet1
    );
    expect(result).toBePrincipal(deployer);
  });
});
