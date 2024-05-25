use anchor_lang::prelude::*;
use crate::instructions::*;

pub mod states;
pub mod instructions;
pub mod errors;
declare_id!("7BphZadCBnMT1duPMHzsE92sYeBp6myuTREceF3bajdf");

#[program]
pub mod doubleornothing {

    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize_accounts(ctx)
    }

    pub fn update_authorities(ctx: Context<UpdateAuthorities>, new_authority: Pubkey) -> Result<()> {
        instructions::update_authorities(ctx, new_authority)
    }

    pub fn close_accounts(ctx: Context<CloseAccounts>) -> Result<()> {
        instructions::close_accounts(ctx)
    }

    pub fn bet(ctx: Context<Bet>, amount: u64) -> Result<()> {
        instructions::bet(ctx, amount)
    }
}
