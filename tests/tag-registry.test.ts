/**
 * Tag Registry Contract Tests
 * 
 * Tests for the tag-registry Clarity contract covering:
 * - Fee structure and initial state
 * - Tag storage and retrieval (by ID and by key)
 * - Fee collection tracking
 * - User tag management
 * - Tag updates and ownership verification
 * - Namespace support and multi-user scenarios
 * - Edge cases (special characters, unicode)
 * 
 * @author Adekunle Bamz (@AdekunleBamz)
 * @license MIT
 */

import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

// Get test accounts from simnet
const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

interface StoredTagResult {
  value: {
    value: {
      timestamp: {
        value: bigint;
      };
    };
  };
}

// Fee constants (in microSTX)
const TAG_FEE = 40000n; // 0.04 STX = 40000 microSTX

describe("tag-registry", () => {
  // ============================================================
  // Initialization Tests
  // ============================================================

  it("ensures simnet is well initialized", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  // ============================================================
  // Fee Structure Tests
  // ============================================================

  it("should return correct tag fee", () => {
    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-tag-fee",
      [],
      wallet1
    );
    expect(result).toBeUint(TAG_FEE);
  });

  // ============================================================
  // Initial State Tests
  // ============================================================

  it("should start with zero tags", () => {
    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-tag-count",
      [],
      wallet1
    );
    expect(result).toBeUint(0);
  });

  // ============================================================
  // Tag Storage Tests
  // ============================================================

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
    expect(user1Email).not.toBeNone();

    const { result: user2Email } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-tag-by-key",
      [Cl.principal(wallet2), Cl.stringUtf8(key)],
      wallet2
    );
    expect(user2Email).not.toBeNone();
  });

  // ============================================================
  // Tag Retrieval Tests
  // ============================================================

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

    expect(result).not.toBeNone();
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
    expect(result).not.toBeNone();
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

  it("should return none for non-existent tag", () => {
    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-tag",
      [Cl.uint(9999)],
      wallet1
    );
    expect(result).toBeNone();
  });

  // ============================================================
  // Fee Collection Tests
  // ============================================================

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

  // ============================================================
  // User Tag Management Tests
  // ============================================================

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

  it("should return empty list for user with no tags", () => {
    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-user-tags",
      [Cl.principal(wallet3)],
      wallet3
    );
    expect(result).toBeList([]);
  });

  // ============================================================
  // Ownership Tests
  // ============================================================

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

  it("should confirm when a user owns a tag", () => {
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8("owned-key"), Cl.stringUtf8("owned-value")],
      wallet1
    );

    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "is-tag-owner",
      [Cl.uint(1), Cl.principal(wallet1)],
      wallet1
    );
    expect(result).toBeBool(true);
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

  // ============================================================
  // Tag Update Tests
  // ============================================================

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
      [Cl.stringUtf8("updatekey"), Cl.stringUtf8("newvalue")],
      wallet1
    );
    expect(result).toBeOk(Cl.uint(1));

    const { result: updatedTag } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-tag",
      [Cl.uint(1)],
      wallet1
    );
    expect(updatedTag).not.toBeNone();
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
      [Cl.stringUtf8("protected"), Cl.stringUtf8("hacked")],
      wallet2
    );
    expect(result).toBeErr(Cl.uint(103));
  });

  // ============================================================
  // Stats and Contract Info Tests
  // ============================================================

  it("should return contract stats", () => {
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8("stats-key"), Cl.stringUtf8("stats-val")],
      wallet1
    );

    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-stats",
      [],
      wallet1
    );

    expect(result).toBeTuple({
      "total-tags": Cl.uint(1),
      "total-fees": Cl.uint(TAG_FEE),
      "fee-per-tag": Cl.uint(TAG_FEE)
    });
  });

  it("should return namespace tag IDs for a user", () => {
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8("namespace-key"), Cl.stringUtf8("namespace-val")],
      wallet1
    );

    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-user-namespace-tags",
      [Cl.principal(wallet1), Cl.stringUtf8("default")],
      wallet1
    );
    expect(result).toBeList([Cl.uint(1)]);
  });

  it("should report active tags as not deleted", () => {
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8("active-key"), Cl.stringUtf8("active-val")],
      wallet1
    );

    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "is-tag-deleted",
      [Cl.uint(1)],
      wallet1
    );
    expect(result).toBeBool(false);
  });

  // ============================================================
  // Metadata Retrieval Tests
  // ============================================================

  it("should return tag timestamp data from the stored record", () => {
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8("time-key"), Cl.stringUtf8("time-val")],
      wallet1
    );

    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-tag",
      [Cl.uint(1)],
      wallet1
    );
    expect(result).not.toBeNone();
    const tagData = (result as StoredTagResult).value.value;
    expect(BigInt(tagData.timestamp.value)).toBeGreaterThan(0n);
  });

  it("should return tag block height", () => {
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8("block-key"), Cl.stringUtf8("block-val")],
      wallet1
    );

    const { result } = simnet.callReadOnlyFn(
      "tag-registry",
      "get-tag-block-height",
      [Cl.uint(1)],
      wallet1
    );
    expect(result).not.toBeNone();
  });

  // ============================================================
  // Ownership Verification Tests
  // ============================================================

  it("should allow only owner to verify ownership", () => {
    const { result: ownerResult } = simnet.callPublicFn(
      "tag-registry",
      "verify-owner",
      [],
      deployer
    );
    expect(ownerResult).toBeOk(Cl.bool(true));

    const { result: nonOwnerResult } = simnet.callPublicFn(
      "tag-registry",
      "verify-owner",
      [],
      wallet1
    );
    expect(nonOwnerResult).toBeErr(Cl.uint(100));
  });

  it("should verify tag ownership by id", () => {
    simnet.callPublicFn(
      "tag-registry",
      "store-tag",
      [Cl.stringUtf8("verify-key"), Cl.stringUtf8("verify-val")],
      wallet1
    );

    const { result: isOwner } = simnet.callReadOnlyFn(
      "tag-registry",
      "is-tag-owner",
      [Cl.uint(1), Cl.principal(wallet1)],
      wallet1
    );
    expect(isOwner).toBeBool(true);

    const { result: notOwner } = simnet.callReadOnlyFn(
      "tag-registry",
      "is-tag-owner",
      [Cl.uint(1), Cl.principal(wallet2)],
      wallet2
    );
    expect(notOwner).toBeBool(false);
  });
});
