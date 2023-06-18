//! State conversion functions.
//!
//! This module is responsible for converting the state of the contract into a
//! format that can be used by the off-chain Wasm executor (e.g., in the
//! browser).

#![no_std]

use app_io::{
    buy_request::{Status, BuyRequestInfo},
    io::ContractMetadata
};
use gmeta::{metawasm, Metadata};
use gstd::{prelude::*, exec};

#[cfg(feature = "binary-vendor")]
include!(concat!(env!("OUT_DIR"), "/wasm_binary.rs"));

#[metawasm]
pub mod metafns {

    pub type State = <ContractMetadata as Metadata>::State;

    pub fn info(mut state: State) -> BuyRequestInfo {
        if matches!(state.status, Status::Active) && exec::block_timestamp() >= state.expires_at
        {
            state.status = Status::Inactive
        }
        state
    }
}
