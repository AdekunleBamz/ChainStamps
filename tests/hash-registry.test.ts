/**
 * Hash Registry Contract Tests
 * 
 * Tests for the hash-registry Clarity contract covering:
 * - Fee structure and initial state
 * - Hash storage and verification
 * - Duplicate hash rejection
 * - Fee collection tracking
 * - User hash management
 * - Ownership and metadata retrieval
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

// Fee constants (in microSTX)
const HASH_FEE = 30000n; // 0.03 STX = 30000 microSTX

/**
 * Helper function to generate a deterministic 32-byte hash for testing.
 * Each seed produces a unique hash pattern.
 * 
 * @param seed - A number used to generate a unique hash pattern
 * @returns A 32-byte Uint8Array representing a SHA-256 hash
 */
const createTestHash = (seed: number): Uint8Array => {
  const hash = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    hash[i] = (seed + i) % 256;
  }
  return hash;
};

describe("hash-registry", () => {
  // ============================================================
  // Initialization Tests
  // ============================================================

  it("ensures simnet is well initialized", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  // ============================================================
  // Fee Structure Tests
  // ============================================================

  it("should return correct hash fee", () => {
    const { result } = simnet.callReadOnlyFn(
      "hash-registry",
      "get-hash-fee",
      [],
      wallet1
    );
    expect(result).toBeUint(HASH_FEE);
  });

  it("should return the maximum allowed batch size", () => {
    const { result } = simnet.callReadOnlyFn(
      "hash-registry",
      "get-max-batch-size",
      [],
      wallet1
    );
    expect(result).toBeUint(10);
  });

  it("should return the description update fee", () => {
    const { result } = simnet.callReadOnlyFn(
      "hash-registry",
      "get-update-fee",
      [],
      wallet1
    );
    expect(result).toBeUint(10000);
  });

  // ============================================================
  // Initial State Tests
  // ============================================================

  it("should start with zero hashes", () => {
    const { result } = simnet.callReadOnlyFn(
      "hash-registry",
      "get-hash-count",
      [],
      wallet1
    );
    expect(result).toBeUint(0);
  });

  // ============================================================
  // Hash Storage Tests
  // ============================================================

  it("should allow user to store a hash", () => {
    const testHash = createTestHash(1);
    const description = "My document hash";

    const { result } = simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(testHash), Cl.stringUtf8(description)],
      wallet1
    );
    expect(result).toBeOk(Cl.uint(1));

    // Verify hash count increased
    const { result: countResult } = simnet.callReadOnlyFn(
      "hash-registry",
      "get-hash-count",
      [],
      wallet1
    );
    expect(countResult).toBeUint(1);
  });

  // ============================================================
  // Hash Verification Tests
  // ============================================================

  it("should verify hash exists", () => {
    const testHash = createTestHash(2);

    simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(testHash), Cl.stringUtf8("Test doc")],
      wallet1
    );

    const { result } = simnet.callReadOnlyFn(
      "hash-registry",
      "verify-hash",
      [Cl.buffer(testHash)],
      wallet1
    );
    expect(result).toBeBool(true);
  });

  it("should return false for non-existent hash", () => {
    const nonExistentHash = createTestHash(99);

    const { result } = simnet.callReadOnlyFn(
      "hash-registry",
      "verify-hash",
      [Cl.buffer(nonExistentHash)],
      wallet1
    );
    expect(result).toBeBool(false);
  });

  it("should reject duplicate hash", () => {
    const testHash = createTestHash(3);

    simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(testHash), Cl.stringUtf8("First")],
      wallet1
    );

    const { result } = simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(testHash), Cl.stringUtf8("Duplicate")],
      wallet2
    );
    expect(result).toBeErr(Cl.uint(101)); // ERR-HASH-ALREADY-EXISTS
  });

  // ============================================================
  // Fee Collection Tests
  // ============================================================

  it("should track fees collected", () => {
    const testHash = createTestHash(4);

    simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(testHash), Cl.stringUtf8("Fee test")],
      wallet1
    );

    const { result } = simnet.callReadOnlyFn(
      "hash-registry",
      "get-total-fees",
      [],
      wallet1
    );
    expect(result).toBeUint(HASH_FEE);
  });

  // ============================================================
  // User Hash Management Tests
  // ============================================================

  it("should return user hash count", () => {
    const hash1 = createTestHash(5);
    const hash2 = createTestHash(6);

    simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(hash1), Cl.stringUtf8("Count test 1")],
      wallet1
    );
    simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(hash2), Cl.stringUtf8("Count test 2")],
      wallet1
    );

    const { result } = simnet.callReadOnlyFn(
      "hash-registry",
      "get-user-hash-count",
      [Cl.principal(wallet1)],
      wallet1
    );
    expect(result).toBeUint(2);
  });

  it("should track user hashes", () => {
    const testHash1 = createTestHash(9);
    const testHash2 = createTestHash(10);

    simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(testHash1), Cl.stringUtf8("Hash 1")],
      wallet2
    );

    simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(testHash2), Cl.stringUtf8("Hash 2")],
      wallet2
    );

    const { result } = simnet.callReadOnlyFn(
      "hash-registry",
      "get-user-hashes",
      [Cl.principal(wallet2)],
      wallet2
    );
    expect(result).toBeList([Cl.buffer(testHash1), Cl.buffer(testHash2)]);
  });

  it("should return an empty list for users without hashes", () => {
    const { result } = simnet.callReadOnlyFn(
      "hash-registry",
      "get-user-hashes",
      [Cl.principal(wallet2)],
      wallet2
    );
    expect(result).toBeList([]);
  });

  // ============================================================
  // Ownership Tests
  // ============================================================

  it("should return hash owner", () => {
    const testHash = createTestHash(7);

    simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(testHash), Cl.stringUtf8("Owner test")],
      wallet2
    );

    const { result } = simnet.callReadOnlyFn(
      "hash-registry",
      "get-hash-owner",
      [Cl.buffer(testHash)],
      wallet2
    );
    expect(result).toBeSome(Cl.principal(wallet2));
  });

  it("should return none for missing hash owner lookups", () => {
    const { result } = simnet.callReadOnlyFn(
      "hash-registry",
      "get-hash-owner",
      [Cl.buffer(createTestHash(70))],
      wallet1
    );
    expect(result).toBeNone();
  });

  it("should return contract owner", () => {
    const { result } = simnet.callReadOnlyFn(
      "hash-registry",
      "get-contract-owner",
      [],
      wallet1
    );
    expect(result).toBePrincipal(deployer);
  });

  it("should allow the deployer to verify contract ownership", () => {
    const { result } = simnet.callPublicFn(
      "hash-registry",
      "verify-owner",
      [],
      deployer
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it("should reject ownership verification from non-owners", () => {
    const { result } = simnet.callPublicFn(
      "hash-registry",
      "verify-owner",
      [],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(100));
  });

  it("should identify whether a principal is the contract owner", () => {
    const { result: deployerResult } = simnet.callReadOnlyFn(
      "hash-registry",
      "is-contract-owner",
      [Cl.principal(deployer)],
      wallet1
    );
    expect(deployerResult).toBeBool(true);

    const { result: userResult } = simnet.callReadOnlyFn(
      "hash-registry",
      "is-contract-owner",
      [Cl.principal(wallet1)],
      wallet1
    );
    expect(userResult).toBeBool(false);
  });

  // ============================================================
  // Metadata Retrieval Tests
  // ============================================================

  it("should retrieve hash by ID", () => {
    const testHash = createTestHash(8);

    simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(testHash), Cl.stringUtf8("By ID test")],
      wallet1
    );

    const { result } = simnet.callReadOnlyFn(
      "hash-registry",
      "get-hash-by-id",
      [Cl.uint(1)],
      wallet1
    );
    expect(result).toBeSome(Cl.buffer(testHash));
  });

  it("should return none for missing hash info by id", () => {
    const { result } = simnet.callReadOnlyFn(
      "hash-registry",
      "get-hash-info-by-id",
      [Cl.uint(9999)],
      wallet1
    );
    expect(result).toBeNone();
  });

  it("should return hash description", () => {
    const testHash = createTestHash(11);
    const description = "Description lookup";

    simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(testHash), Cl.stringUtf8(description)],
      wallet1
    );

    const { result } = simnet.callReadOnlyFn(
      "hash-registry",
      "get-hash-description",
      [Cl.buffer(testHash)],
      wallet1
    );
    expect(result).toBeSome(Cl.stringUtf8(description));
  });

  it("should report whether a user owns a hash", () => {
    const testHash = createTestHash(71);

    simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(testHash), Cl.stringUtf8("Ownership flag")],
      wallet1
    );

    const { result: ownerResult } = simnet.callReadOnlyFn(
      "hash-registry",
      "is-hash-owner",
      [Cl.buffer(testHash), Cl.principal(wallet1)],
      wallet1
    );
    expect(ownerResult).toBeBool(true);

    const { result: outsiderResult } = simnet.callReadOnlyFn(
      "hash-registry",
      "is-hash-owner",
      [Cl.buffer(testHash), Cl.principal(wallet2)],
      wallet2
    );
    expect(outsiderResult).toBeBool(false);
  });

  it("should return hash block height", () => {
    const testHash = createTestHash(12);

    simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(testHash), Cl.stringUtf8("Block height test")],
      wallet1
    );

    const { result } = simnet.callReadOnlyFn(
      "hash-registry",
      "get-hash-block-height",
      [Cl.buffer(testHash)],
      wallet1
    );
    expect(result).toBeSome(Cl.uint(simnet.blockHeight));
  });

  // ============================================================
  // Hash Revocation Tests
  // ============================================================

  it("should allow owner to revoke hash", () => {
    const testHash = createTestHash(13);

    simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(testHash), Cl.stringUtf8("Revoke test")],
      wallet1
    );

    const { result } = simnet.callPublicFn(
      "hash-registry",
      "revoke-hash",
      [Cl.buffer(testHash)],
      wallet1
    );
    expect(result).toBeOk(Cl.bool(true));

    // Verify hash is now revoked
    const { result: verifyResult } = simnet.callReadOnlyFn(
      "hash-registry",
      "verify-hash",
      [Cl.buffer(testHash)],
      wallet1
    );
    expect(verifyResult).toBeBool(false);
  });

  it("should reject revocation by non-owner", () => {
    const testHash = createTestHash(14);

    simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(testHash), Cl.stringUtf8("Non-owner revoke")],
      wallet1
    );

    const { result } = simnet.callPublicFn(
      "hash-registry",
      "revoke-hash",
      [Cl.buffer(testHash)],
      wallet2
    );
    expect(result).toBeErr(Cl.uint(108)); // ERR-NOT-HASH-OWNER
  });

  it("should reject revoking already revoked hash", () => {
    const testHash = createTestHash(15);

    simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(testHash), Cl.stringUtf8("Double revoke")],
      wallet1
    );

    simnet.callPublicFn(
      "hash-registry",
      "revoke-hash",
      [Cl.buffer(testHash)],
      wallet1
    );

    const { result } = simnet.callPublicFn(
      "hash-registry",
      "revoke-hash",
      [Cl.buffer(testHash)],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(103)); // ERR-HASH-ALREADY-REVOKED
  });

  // ============================================================
  // Hash Transfer Tests
  // ============================================================

  it("should allow owner to transfer hash", () => {
    const testHash = createTestHash(16);

    simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(testHash), Cl.stringUtf8("Transfer test")],
      wallet1
    );

    const { result } = simnet.callPublicFn(
      "hash-registry",
      "transfer-hash",
      [Cl.buffer(testHash), Cl.principal(wallet2)],
      wallet1
    );
    expect(result).toBeOk(Cl.bool(true));

    // Verify new owner
    const { result: ownerResult } = simnet.callReadOnlyFn(
      "hash-registry",
      "get-hash-owner",
      [Cl.buffer(testHash)],
      wallet2
    );
    expect(ownerResult).toBeSome(Cl.principal(wallet2));
  });

  it("should reject transfer by non-owner", () => {
    const testHash = createTestHash(17);

    simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(testHash), Cl.stringUtf8("Non-owner transfer")],
      wallet1
    );

    const { result } = simnet.callPublicFn(
      "hash-registry",
      "transfer-hash",
      [Cl.buffer(testHash), Cl.principal(wallet2)],
      wallet2
    );
    expect(result).toBeErr(Cl.uint(108)); // ERR-NOT-HASH-OWNER
  });

  it("should reject transfer to self", () => {
    const testHash = createTestHash(18);

    simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(testHash), Cl.stringUtf8("Self transfer")],
      wallet1
    );

    const { result } = simnet.callPublicFn(
      "hash-registry",
      "transfer-hash",
      [Cl.buffer(testHash), Cl.principal(wallet1)],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(107)); // ERR-TRANSFER-TO-SELF
  });

  // ============================================================
  // Description Update Tests
  // ============================================================

  it("should allow owner to update description", () => {
    const testHash = createTestHash(19);

    simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(testHash), Cl.stringUtf8("Original description")],
      wallet1
    );

    const { result } = simnet.callPublicFn(
      "hash-registry",
      "update-description",
      [Cl.buffer(testHash), Cl.stringUtf8("Updated description")],
      wallet1
    );
    expect(result).toBeOk(Cl.bool(true));

    // Verify description was updated
    const { result: descResult } = simnet.callReadOnlyFn(
      "hash-registry",
      "get-hash-description",
      [Cl.buffer(testHash)],
      wallet1
    );
    expect(descResult).toBeSome(Cl.stringUtf8("Updated description"));
  });

  it("should reject description update by non-owner", () => {
    const testHash = createTestHash(20);

    simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(testHash), Cl.stringUtf8("Owner only update")],
      wallet1
    );

    const { result } = simnet.callPublicFn(
      "hash-registry",
      "update-description",
      [Cl.buffer(testHash), Cl.stringUtf8("Unauthorized update")],
      wallet2
    );
    expect(result).toBeErr(Cl.uint(108)); // ERR-NOT-HASH-OWNER
  });

  // ============================================================
  // Batch Operation Tests
  // ============================================================

  it("should allow batch storing multiple hashes", () => {
    const hash1 = createTestHash(21);
    const hash2 = createTestHash(22);

    const { result } = simnet.callPublicFn(
      "hash-registry",
      "store-hashes-batch",
      [
        Cl.list([
          Cl.tuple({
            hash: Cl.buffer(hash1),
            description: Cl.stringUtf8("Batch hash 1")
          }),
          Cl.tuple({
            hash: Cl.buffer(hash2),
            description: Cl.stringUtf8("Batch hash 2")
          })
        ])
      ],
      wallet1
    );

    expect(result).toBeOk(Cl.list([Cl.uint(1), Cl.uint(2)]));
  });

  it("should charge discounted fee for batch operations", () => {
    const hash3 = createTestHash(23);
    const hash4 = createTestHash(24);
    const BATCH_FEE = 50000n; // 2 * 25000 microSTX

    simnet.callPublicFn(
      "hash-registry",
      "store-hashes-batch",
      [
        Cl.list([
          Cl.tuple({
            hash: Cl.buffer(hash3),
            description: Cl.stringUtf8("Discount test 1")
          }),
          Cl.tuple({
            hash: Cl.buffer(hash4),
            description: Cl.stringUtf8("Discount test 2")
          })
        ])
      ],
      wallet2
    );

    // Check that the correct batch fee was collected
    const { result } = simnet.callReadOnlyFn(
      "hash-registry",
      "get-total-fees",
      [],
      wallet2
    );
    // Total fees should include previous batch + this batch
    expect(result).toBeUint(BATCH_FEE);
  });

  it("should reject empty batch", () => {
    const { result } = simnet.callPublicFn(
      "hash-registry",
      "store-hashes-batch",
      [Cl.list([])],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(106)); // ERR-EMPTY-BATCH
  });

  it("should skip duplicate hashes in batch", () => {
    const hash5 = createTestHash(25);

    // First store a hash normally
    simnet.callPublicFn(
      "hash-registry",
      "store-hash",
      [Cl.buffer(hash5), Cl.stringUtf8("Pre-existing")],
      wallet1
    );

    // Try to batch store with one new and one duplicate
    const hash6 = createTestHash(26);
    const { result } = simnet.callPublicFn(
      "hash-registry",
      "store-hashes-batch",
      [
        Cl.list([
          Cl.tuple({
            hash: Cl.buffer(hash5),
            description: Cl.stringUtf8("Duplicate in batch")
          }),
          Cl.tuple({
            hash: Cl.buffer(hash6),
            description: Cl.stringUtf8("New in batch")
          })
        ])
      ],
      wallet2
    );

    // Should only return the ID for the new hash
    expect(result).toBeOk(Cl.list([Cl.uint(2)]));
  });

  it("should return correct batch fee", () => {
    const { result } = simnet.callReadOnlyFn(
      "hash-registry",
      "get-batch-hash-fee",
      [],
      wallet1
    );
    expect(result).toBeUint(25000); // 0.025 STX per hash in batch
  });
});
