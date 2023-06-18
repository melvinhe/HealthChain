use app_io::buy_request::{
    Action, BuyRequestInfo, CreateConfig, Error, Event, Status, Transaction, TransactionId
};
use app_io::io::ContractMetadata;
use gmeta::Metadata;
use gstd::ActorId;
use gstd::{errors::Result as GstdResult, exec, msg, prelude::*, MessageId, debug};
use primitive_types::U256;

static mut BUY_REQUEST: Option<BuyRequest> = None;

#[derive(Debug, Clone, Default)]
pub struct BuyRequest {
    pub buyer: ActorId,
    pub seller: ActorId,
    pub token_id: U256,
    pub price: u128,
    pub expires_at: u64,
    pub status: Status,

    pub transactions: BTreeMap<ActorId, Transaction<Action>>,
    pub current_tid: TransactionId,
}

impl BuyRequest {
    pub async fn sell(&mut self, transaction_id: TransactionId) -> Result<(Event, u128), Error> {
        self.status = Status::Purchased { price: self.price };
        let value = msg::value();
        if value < self.price {
            return Err(Error::InsufficientMoney);
        }
        self.status = Status::Purchased { price: self.price };

        let refund = value - self.price;
        let refund = if refund < 500 { 0 } else { refund };

        Ok((Event::Bought { price: self.price }, refund))
    }

    pub async fn reward(&mut self) -> Result<Event, Error> {
        let price = match self.status {
            Status::Purchased { price } => price,
            _ => return Err(Error::WrongState),
        };
        if msg::source().ne(&self.seller) {
            return Err(Error::IncorrectRewarder);
        }

        if let Err(_e) = msg::send(self.seller, "REWARD", price) {
            return Err(Error::RewardSendFailed);
        }
        self.status = Status::Rewarded { price: self.price };
        Ok(Event::Rewarded { price: self.price })
    }

    pub async fn renew_contract(
        &mut self,
        transaction_id: TransactionId,
        config: &CreateConfig,
    ) -> Result<Event, Error> {
        if matches!(self.status, Status::Active) {
            return Err(Error::AlreadyRunning);
        }
        let minutes_count = config.duration.hours * 60 + config.duration.minutes;
        let duration_in_seconds = minutes_count * 60 + config.duration.seconds;

        self.status = Status::Active;
        self.expires_at = exec::block_timestamp() + duration_in_seconds * 1000;
        self.token_id = config.token_id;
        self.seller = config.seller;
        self.price = config.price;
        self.buyer = msg::source();
        
        Ok(Event::BuyRequestCreated { 
            buyer: self.buyer, 
            seller: self.seller, 
            price: self.price
        })
    }

    pub async fn cancel(&mut self, transaction_id: TransactionId) 
    -> Result<Event, Error> {
        if msg::source() != self.buyer {
            return Err(Error::NotBuyer);
        }
        if let Status::Purchased { price: _ } = self.status {
            return Err(Error::NotRewarded);
        }

        let stopped = Event::Terminated { 
            buyer: self.buyer, 
            seller: self.seller
        };

        if let Status::Rewarded { price: _ } = self.status {
            return Ok(stopped);
        }
        
        self.status = Status::Inactive;
        Ok(stopped)
    }

    pub fn stop_if_time_is_over(&mut self) {
        if (matches!(self.status, Status::Active) 
            && exec::block_timestamp() >= self.expires_at) {
                self.status = Status::Inactive;
        }
    }

    pub fn info(&mut self) -> BuyRequestInfo {
        self.stop_if_time_is_over();
        BuyRequestInfo { 
            token_id: self.token_id, 
            seller: self.seller, 
            buyer: self.buyer, 
            price: self.price, 
            time_left: self.expires_at.saturating_sub(exec::block_timestamp()),
            expires_at: self.expires_at, 
            status: self.status.clone(), 
            transactions: self.transactions.clone(),
            current_tid: self.current_tid
        }
    }
}

#[no_mangle]
extern "C" fn init() {
    let buyRequest = BuyRequest {
        buyer: msg::source(),
        ..Default::default()
    };

    unsafe { BUY_REQUEST = Some(buyRequest) };
}

#[gstd::async_main]
async fn main() {
    let action: Action = msg::load().expect("Could not load Activities");
    let buy_req: &mut BuyRequest = unsafe { 
        BUY_REQUEST.get_or_insert(BuyRequest::default()) 
    };

    buy_req.stop_if_time_is_over();

    let msg_source = msg::source();

    let r: Result<Action, Error> = Err(Error::PreviousTxMustBeCompleted);
    let transaction_id = if let Some(Transaction {
        id: tid,
        action: pend_action,
    }) = buy_req.transactions.get(&msg_source) {
        if action != *pend_action {
            reply(r, 0).expect("Failed to encode or reply with `Result<Action, Error>`");
            return;
        }
        *tid
    } else {
        let transaction_id = buy_req.current_tid;
        buy_req.transactions.insert(
            msg_source,
            Transaction {
                id: transaction_id,
                action: action.clone(),
            },
        );
        buy_req.current_tid = buy_req.current_tid.wrapping_add(1);
        transaction_id
    };

    let (result, value) = match &action {
        Action::Sell => {
            let reply = buy_req.sell(transaction_id).await;
            let result = match reply {
                Ok((event, refund)) => (Ok(event), refund),
                Err(_e) => (Err(_e), 0),
            };
            buy_req.transactions.remove(&msg_source);
            result
        }
        Action::Create(config) => {
            let result = (buy_req.renew_contract(transaction_id, config).await, 0);
            buy_req.transactions.remove(&msg_source);
            result
        }
        Action::Reward => {
            let result = (buy_req.reward().await, 0);
            buy_req.transactions.remove(&msg_source);
            result
        }
        Action::Cancel => {
            let result = (buy_req.cancel(transaction_id).await, 0);
            buy_req.transactions.remove(&msg_source);
            result
        }
    };
    reply(result, value).expect("Faied to encode or reply");
}

fn common_state() -> <ContractMetadata as Metadata>::State {
    static_mut_state().info()
}

fn static_mut_state() -> &'static mut BuyRequest {
    unsafe { BUY_REQUEST.get_or_insert(Default::default()) }
}

#[no_mangle]
extern "C" fn state() {
    reply(common_state(), 0).expect(
        "Failed to encode or reply with `<ContractMetadata as Metadata>::State` from `state()`",
    );
}

#[no_mangle]
extern "C" fn metahash() {
    let metahash: [u8; 32] = include!("../.metahash");
    reply(metahash, 0).expect("Failed to encode or reply with `[u8; 32]` from `metahash()`");
}

fn reply(payload: impl Encode, value: u128) -> GstdResult<MessageId> {
    msg::reply(payload, value)
}