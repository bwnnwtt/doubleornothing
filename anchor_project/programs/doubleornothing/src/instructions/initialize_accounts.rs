use anchor_lang::prelude::*;
use crate::states::*;

pub fn initialize_accounts(ctx: Context<Initialize>) -> Result<()> {
    let treasury = &mut ctx.accounts.treasury;
    let stats = &mut ctx.accounts.stats;

    treasury.authority = ctx.accounts.initializer.key();

    stats.authority = ctx.accounts.initializer.key();
    stats.bet_count = u64::default();
    
    Ok(())
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub initializer: Signer<'info>,
    #[account(
        init,
        payer=initializer,
        space = 8 + 32,
        seeds=[TREASURY_SEED.as_bytes()],
        bump)]
    pub treasury: Account<'info, Treasury>,
    #[account(
        init,
        payer=initializer,
        space = 8 + 32 + 8,
        seeds=[STATS_SEED.as_bytes()],
        bump)]
    pub stats: Account<'info, Stats>,
    pub system_program: Program<'info, System>
}
