use anchor_lang::prelude::*;

use crate::states::*;

pub fn close_accounts(_ctx: Context<CloseAccounts>) -> Result<()> {
  Ok(())
}

#[derive(Accounts)]
pub struct CloseAccounts<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        close = authority,
        has_one = authority,
        seeds = [TREASURY_SEED.as_bytes()],
        bump)]
    pub treasury: Account<'info, Treasury>,
    #[account(
        mut,
        close = authority,
        has_one = authority,
        seeds=[STATS_SEED.as_bytes()],
        bump)]
    pub stats: Account<'info, Stats>,
}
