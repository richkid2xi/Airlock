use anchor_lang::prelude::*;

declare_id!("Air1ockPo1icy111111111111111111111111111111");

#[program]
pub mod airlock_policy {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
