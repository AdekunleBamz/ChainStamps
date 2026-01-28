import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

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
    const key = "username";
    const value = "chainstamp_user";
    const { result } = simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8(key), Cl.stringUtf8(value)],
      wallet1
    );
    expect(result).toBeOk(Cl.uint(1));
  });

  it("should retrieve tag by ID", () => {
    const key = "mykey";
    const value = "myvalue";
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

  it("should retrieve tag by key", () => {
    const key = "profile";
    const value = "user123";
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
    expect(result).toBeSome(Cl.stringUtf8(value));
  });

  it("should track fees collected", () => {
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8("feekey"), Cl.stringUtf8("feevalue")],
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

  it("should return user tag count", () => {
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8("count-key-1"), Cl.stringUtf8("count-val-1")],
      wallet1
    );
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8("count-key-2"), Cl.stringUtf8("count-val-2")],
      wallet1
    );

    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-user-tag-count",
      [Cl.principal(wallet1)],
      wallet1
    );
    expect(result).toBeUint(2);
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

  it("should allow tag update by owner", () => {
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8("updatekey"), Cl.stringUtf8("oldvalue")],
      wallet1
    );

    const { result } = simnet.callPublicFn(
      "tag-registry",
      "update-tag",
      [Cl.uint(1), Cl.stringUtf8("newvalue")],
      wallet1
    );
    expect(result).toBeOk(Cl.bool(true));

    const { result: updatedTag } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-tag",
      [Cl.uint(1)],
      wallet1
    );
    expect(updatedTag).toBeSome(
      Cl.tuple({
        owner: Cl.principal(wallet1),
        key: Cl.stringUtf8("updatekey"),
        value: Cl.stringUtf8("newvalue"),
        timestamp: Cl.uint(expect.any(Number)),
        "block-height": Cl.uint(expect.any(Number)),
      })
    );
  });

  it("should prevent tag update by non-owner", () => {
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8("protected"), Cl.stringUtf8("data")],
      wallet1
    );

    const { result } = simnet.callPublicFn(
      "tag-registry",
      "update-tag",
      [Cl.uint(1), Cl.stringUtf8("hacked")],
      wallet2
    );
    expect(result).toBeErr(Cl.uint(101));
  });

  it("should return none for non-existent tag", () => {
    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-tag",
      [Cl.uint(9999)],
      wallet1
    );
    expect(result).toBeNone();
  });

  it("should return empty list for user with no tags", () => {
    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-user-tags",
      [Cl.principal(wallet3)],
      wallet3
    );
    expect(result).toBeList([]);
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

  it("should return tag value", () => {
    const key = "value-key";
    const value = "value-data";

    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8(key), Cl.stringUtf8(value)],
      wallet1
    );

    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-tag-value",
      [Cl.uint(1)],
      wallet1
    );
    expect(result).toBeSome(Cl.stringUtf8(value));
  });

  it("should return tag key", () => {
    const key = "key-only";
    const value = "value-only";

    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8(key), Cl.stringUtf8(value)],
      wallet1
    );

    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-tag-key",
      [Cl.uint(1)],
      wallet1
    );
    expect(result).toBeSome(Cl.stringUtf8(key));
  });

  it("should handle special characters in keys and values", () => {
    const key = "data:json";
    const value = "{\"name\":\"test\"}";
    const { result } = simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8(key), Cl.stringUtf8(value)],
      wallet1
    );
    expect(result).toBeOk(Cl.uint(1));
  });

  it("should handle unicode in keys and values", () => {
    const key = "名前";
    const value = "テスト 🔑";
    const { result } = simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8(key), Cl.stringUtf8(value)],
      wallet1
    );
    expect(result).toBeOk(Cl.uint(1));
  });

  it("should allow multiple users to store tags", () => {
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8("w1key"), Cl.stringUtf8("w1val")],
      wallet1
    );
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8("w2key"), Cl.stringUtf8("w2val")],
      wallet2
    );
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8("w3key"), Cl.stringUtf8("w3val")],
      wallet3
    );

    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-tag-count",
      [],
      wallet1
    );
    expect(result).toBeUint(3);
  });

  it("should allow same key for different users", () => {
    const key = "email";
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8(key), Cl.stringUtf8("user1@test.com")],
      wallet1
    );
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8(key), Cl.stringUtf8("user2@test.com")],
      wallet2
    );

    const { result: user1Email } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-tag-by-key",
      [Cl.principal(wallet1), Cl.stringUtf8(key)],
      wallet1
    );
    expect(user1Email).toBeSome(Cl.stringUtf8("user1@test.com"));

    const { result: user2Email } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-tag-by-key",
      [Cl.principal(wallet2), Cl.stringUtf8(key)],
      wallet2
    );
    expect(user2Email).toBeSome(Cl.stringUtf8("user2@test.com"));
  });
});
