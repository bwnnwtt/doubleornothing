use anchor_lang::prelude::*;

pub const TREASURY_SEED: &str = "TREASURY";
pub const STATS_SEED: &str = "STATSDATA";
pub const FEES_IN_PERCENT: u8 = 2;

#[account]
pub struct Treasury {
    pub authority: Pubkey,
}

#[account]
pub struct Stats {
    pub authority: Pubkey,
    pub bet_count: u64
}
