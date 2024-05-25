use anchor_lang::prelude::*;

use crate::states::*;

pub fn update_authorities(ctx: Context<UpdateAuthorities>, new_authority: Pubkey) -> Result<()> {
    let treasury = &mut ctx.accounts.treasury;
    let stats = &mut ctx.accounts.stats;

    treasury.authority = new_authority;
    stats.authority = new_authority;

    Ok(())
}

#[derive(Accounts)]
pub struct UpdateAuthorities<'info> {
    pub authority: Signer<'info>,
    #[account(mut, has_one = authority)]
    pub treasury: Account<'info, Treasury>,
    #[account(mut, has_one = authority)]
    pub stats: Account<'info, Stats>
}
