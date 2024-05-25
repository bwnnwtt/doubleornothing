use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("bet size exceeds the treasury threshold")]
    BetExceedsTreasury,
    #[msg("insufficient funds")]
    InsufficientFunds
}
