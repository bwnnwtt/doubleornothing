import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Doubleornothing } from "../target/types/doubleornothing";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { assert, expect, should } from "chai";

const TREASURY = "TREASURY";
const STATS = "STATSDATA";

describe("doubleornothing", () => {
  const provider = anchor.AnchorProvider.local("http://127.0.0.1:8899");
  anchor.setProvider(provider);

  const program = anchor.workspace.Doubleornothing as Program<Doubleornothing>;

  const tom = anchor.web3.Keypair.generate();
  const jerry = anchor.web3.Keypair.generate();

  const [treasury_pkey] = getTreasuryAddress(TREASURY, program.programId);
  const [stats_pkey] = getStatsAddress(STATS, program.programId);

  before(async () => {
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        tom.publicKey,
        1 * LAMPORTS_PER_SOL
      ),
      "confirmed"
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        jerry.publicKey,
        1 * LAMPORTS_PER_SOL
      ),
      "confirmed"
    );
  });

  describe("Initialize Program PDAs", async () => {
    it("Initialize PDAs", async () => {
      await program.methods
        .initialize()
        .accounts({
          initializer: tom.publicKey,
        })
        .signers([tom])
        .rpc({ commitment: "confirmed" });

      await checkTreasury(program, treasury_pkey, tom.publicKey);
      await checkStats(program, stats_pkey, tom.publicKey);
    });
    it("Program PDAs cannot be initialized more than once", async () => {
      let should_fail = "This should Fail";

      try {
        await program.methods
          .initialize()
          .accounts({
            initializer: tom.publicKey,
          })
          .signers([tom])
          .rpc({ commitment: "confirmed" });
      } catch (error) {
        should_fail = "Failed";
      }

      assert.strictEqual(should_fail, "Failed");
    });
  });

  describe("Bet", async () => {
    before(async () => {
      await provider.connection.confirmTransaction(
        await provider.connection.requestAirdrop(
          treasury_pkey,
          10 * LAMPORTS_PER_SOL
        ),
        "confirmed"
      );
    });

    it("Player is unable to bet if bet exceeds players funds", async () => {
      let should_fail = "This should Fail";
      let bet_amount = 2 * LAMPORTS_PER_SOL;

      try {
        await program.methods
          .bet(new anchor.BN(bet_amount))
          .accounts({
            player: jerry.publicKey,
          })
          .signers([jerry])
          .rpc({ commitment: "confirmed" });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "InsufficientFunds");
        should_fail = "Failed";
      }

      assert.strictEqual(should_fail, "Failed");
    });

    it("Player is unable to bet if bet exceeds treasury funds", async () => {
      await provider.connection.confirmTransaction(
        await provider.connection.requestAirdrop(
          jerry.publicKey,
          30 * LAMPORTS_PER_SOL
        ),
        "confirmed"
      );

      let should_fail = "This should Fail";
      let bet_amount = 20 * LAMPORTS_PER_SOL;

      try {
        await program.methods
          .bet(new anchor.BN(bet_amount))
          .accounts({
            player: jerry.publicKey,
          })
          .signers([jerry])
          .rpc({ commitment: "confirmed" });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "BetExceedsTreasury");
        should_fail = "Failed";
      }

      assert.strictEqual(should_fail, "Failed");
    });

    it("Bet is placed successfully", async () => {
      let bet_amount = 0.5 * LAMPORTS_PER_SOL;

      const { betCount: beforeBetCount } = await program.account.stats.fetch(
        stats_pkey
      );
      // const beforeBalance = await provider.connection.getBalance(jerry.publicKey)

      try {
        const tx = await program.methods
          .bet(new anchor.BN(bet_amount))
          .accounts({
            player: jerry.publicKey,
          })
          .signers([jerry])
          .rpc({ commitment: "confirmed" });

        // const confirmedTx = await provider.connection.getParsedTransaction(tx, "confirmed");
        // console.log("Logs: ");
        // console.log(confirmedTx?.meta?.logMessages);
      } catch (error) {
        console.log(error);
      }

      const { betCount: afterBetCount } = await program.account.stats.fetch(
        stats_pkey
      );
      // const afterBalance = await provider.connection.getBalance(jerry.publicKey)

      expect(afterBetCount.toNumber()).to.equal(beforeBetCount.toNumber() + 1);
      // console.log("balance before bet: " + beforeBalance)
      // console.log("balance after bet: " + afterBalance)
    });
  });

  describe("Update Authorities", async () => {
    it("Non-authority should not be able to update authority", async () => {
      let should_fail = "This should Fail";

      try {
        await program.methods
          .updateAuthorities(jerry.publicKey)
          .accountsStrict({
            authority: jerry.publicKey,
            treasury: treasury_pkey,
            stats: stats_pkey,
          })
          .signers([jerry])
          .rpc({ commitment: "confirmed" });
      } catch (error) {
        should_fail = "Failed";
      }

      assert.strictEqual(should_fail, "Failed");
    });
    it("Authority updates account authorities successfully", async () => {
      await program.methods
        .updateAuthorities(jerry.publicKey)
        .accountsStrict({
          authority: tom.publicKey,
          treasury: treasury_pkey,
          stats: stats_pkey,
        })
        .signers([tom])
        .rpc({ commitment: "confirmed" });

      await checkTreasury(program, treasury_pkey, jerry.publicKey);
      await checkStats(program, stats_pkey, jerry.publicKey);
    });

    // transfer authority back to Tom after test suite completes
    after(async () => {
      await program.methods
        .updateAuthorities(tom.publicKey)
        .accountsStrict({
          authority: jerry.publicKey,
          treasury: treasury_pkey,
          stats: stats_pkey,
        })
        .signers([jerry])
        .rpc({ commitment: "confirmed" });
    });
  });

  describe("Close Treasury", async () => {
    it("Non-authority should not be able to close treasury", async () => {
      let should_fail = "This should Fail";

      try {
        await program.methods
          .closeAccounts()
          .accounts({
            authority: jerry.publicKey,
            treasury: treasury_pkey,
            stats: stats_pkey,
          })
          .signers([jerry])
          .rpc({ commitment: "confirmed" });
      } catch (error) {
        should_fail = "Failed";
      }

      assert.strictEqual(should_fail, "Failed");
    });
    it("Authority closes treasury successfully", async () => {
      let should_fail = "This should Fail";
      let before_balance = await provider.connection.getBalance(tom.publicKey);

      await program.methods
        .closeAccounts()
        .accounts({
          authority: tom.publicKey,
          treasury: treasury_pkey,
          stats: stats_pkey,
        })
        .signers([tom])
        .rpc({ commitment: "confirmed" });

      let after_balance = await provider.connection.getBalance(tom.publicKey);
      expect(before_balance).to.be.lessThan(after_balance);

      try {
        await program.account.treasury.fetch(treasury_pkey);
      } catch (error) {
        should_fail = "Failed";
      }

      assert.strictEqual(should_fail, "Failed");
    });
  });
});

function getTreasuryAddress(treasury: string, programId: PublicKey) {
  return PublicKey.findProgramAddressSync([Buffer.from(treasury)], programId);
}

function getStatsAddress(stats: string, programId: PublicKey) {
  return PublicKey.findProgramAddressSync([Buffer.from(stats)], programId);
}

async function checkTreasury(
  program: anchor.Program<Doubleornothing>,
  treasury_pkey: PublicKey,
  authority?: PublicKey
) {
  let treasury_data = await program.account.treasury.fetch(treasury_pkey);

  if (authority) {
    assert.strictEqual(
      treasury_data.authority.toString(),
      authority.toString()
    );
  }
}

async function checkStats(
  program: anchor.Program<Doubleornothing>,
  stats_pkey: PublicKey,
  authority?: PublicKey,
  bet_count?: number
) {
  let users_stats_data = await program.account.stats.fetch(stats_pkey);

  if (authority) {
    assert.strictEqual(
      users_stats_data.authority.toString(),
      authority.toString()
    );
  }

  if (bet_count) {
    assert.strictEqual(
      users_stats_data.betCount.toString(),
      bet_count.toString()
    );
  }
}
