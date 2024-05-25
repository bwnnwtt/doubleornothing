use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};
// use rand::Rng;

use crate::states::*;
use crate::errors::*;

pub fn bet(ctx: Context<Bet>, amount: u64) -> Result<()> {
    let bet_plus_fee = amount + (amount * FEES_IN_PERCENT as u64 / 100);
    let rent_exempt = Rent::get()?.minimum_balance(ctx.accounts.treasury.to_account_info().data_len());

    require!(ctx.accounts.treasury.get_lamports() + rent_exempt > amount , CustomError::BetExceedsTreasury);
    require!(bet_plus_fee < ctx.accounts.player.get_lamports(), CustomError::InsufficientFunds);
    
    let from = &ctx.accounts.player;
    let to = &ctx.accounts.treasury;
    let system_program = &ctx.accounts.system_program;

    let ix = system_instruction::transfer(
        &from.key(),
        &to.key(),
        bet_plus_fee,
    );

    invoke(
        &ix,
        &[
            from.to_account_info(),
            to.to_account_info(),
            system_program.to_account_info(),
        ],
    )?;

    // Access the clock sysvar
    let clock = Clock::get()?;
    let timestamp = clock.unix_timestamp;

    // Generate a random number 0 or 1 using the least significant bit of the timestamp
    let random_number = (timestamp & 1) as u8;

    if random_number == 1 {
        ctx.accounts.treasury.sub_lamports(2*amount)?;
        ctx.accounts.player.add_lamports(2*amount)?;
        msg!("won");
    } else {
        msg!("lost")
    }

    (&mut ctx.accounts.stats).bet_count += 1;

    Ok(())
}

#[derive(Accounts)]
pub struct Bet<'info> {
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(
        mut,
        seeds=[TREASURY_SEED.as_bytes()],
        bump)]
    pub treasury: Account<'info, Treasury>,
    #[account(
        mut,
        seeds=[STATS_SEED.as_bytes()],
        bump)]
    pub stats: Account<'info, Stats>,
    pub system_program: Program<'info, System>
}
