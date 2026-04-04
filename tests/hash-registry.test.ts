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

  it("should return contract owner", () => {
    const { result } = simnet.callReadOnlyFn(
      "hash-registry",
      "get-contract-owner",
      [],
      wallet1
    );
    expect(result).toBePrincipal(deployer);
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
});
