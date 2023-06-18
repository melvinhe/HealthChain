use gstd::{prelude::*, ActorId};

use primitive_types::U256;

pub type TransactionId = u64;

#[derive(Debug, Decode, Encode, TypeInfo)]
pub struct BuyRequestInfo {
    pub token_id: U256,
    pub seller: ActorId,
    pub buyer: ActorId,
    pub price: u128,
    pub time_left: u64,
    pub expires_at: u64,
    pub status: Status,
    // Transactions that cached on contract
    pub transactions: BTreeMap<ActorId, Transaction<Action>>,
    // Current transaction id
    pub current_tid: u64,
}

/// An enum that represent current auction status
#[derive(Debug, Decode, Default, Encode, TypeInfo, Clone)]
pub enum Status {
    #[default]
    None,
    /// Auction is running right now
    Active,
    /// Someone purchased NFT, but previous NFT owner not rewarded
    Purchased { price: u128 },
    /// Someone purchased NFT and previous NFT owner rewarded
    Rewarded { price: u128 },
    /// Time for the auction has expired and no one has made a purchase.
    Inactive,
}

#[derive(Debug, Clone, Default, Encode, Decode, TypeInfo)]
pub struct Transaction<T: Clone> {
    pub id: TransactionId,
    pub action: T,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo, PartialEq, Eq)]
pub enum Action {
    // creates buy request
    Create(CreateConfig),
    // Accept buy request
    Sell,
    // Cancel order
    Cancel,
    // Reward gas to seller
    Reward,
}

#[derive(Debug, Encode, Decode, TypeInfo)]
pub enum Event {
    BuyRequestCreated {
        buyer: ActorId,
        seller: ActorId, // TODO: doublecheck
        price: u128,
    },
    Bought {
        price: u128,
    },
    Rewarded {
        price: u128
    },
    // Contract either was cancelled, expired, or completed
    Terminated {
        buyer: ActorId,
        seller: ActorId,
    }
}

/// Dutch Auction config
#[derive(Debug, Clone, Encode, Decode, TypeInfo, PartialEq, Eq)]
pub struct CreateConfig {
    // Address of contract
    pub seller: ActorId,
    pub token_id: U256,
    pub price: u128,
    pub duration: Duration,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo, PartialEq, Eq)]
pub struct Duration {
    pub hours: u64,
    pub minutes: u64,
    pub seconds: u64,
}

// An enum that contains a error of processed [`Action`].
#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum Error {
    PreviousTxMustBeCompleted,
    SendingError,
    NotRewarded,
    WrongReply,
    RewardSendFailed,
    AlreadyRunning,
    AlreadyStopped,
    InsufficientMoney,
    Expired,
    WrongState,
    IncorrectRewarder,
    TransferFailed,
    NotBuyer
}