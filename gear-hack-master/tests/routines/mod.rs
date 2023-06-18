use app_io::buy_request::{Action, CreateConfig, Duration, Error, Event};

use gmeta::Encode;
use gtest::{Program, RunResult, System};

pub const USERS: &[u64] = &[3, 4, 5];
#[allow(dead_code)]
pub const DURATION: u32 = 169 * 60 * 60;

pub fn init(sys: &System) -> Program {
    USERS.iter().for_each(|user| sys.mint_to(*user, 1_000_000_000));

    let seller = USERS[0];
    let buyer = USERS[1];

    sys.init_logger();

    let buy_request_program = Program::current(sys);
    
    buy_request_program.send(seller, ());
    
    let result = update_buy_request(
        &buy_request_program, 
        buyer,
        seller, 
        1_000_000_000
    );
    println!(
        "update_buy_request result = {:?}",
        result.decoded_log::<Result<Event, Error>>()
    );

    assert!(result.contains(&(
        buyer,
        Ok::<app_io::buy_request::Event, Error>(Event::BuyRequestCreated { 
            buyer: buyer.into(), 
            seller: seller.into(), 
            price: 1_000_000_000
        })
        .encode()
    )));

    buy_request_program
}

pub fn update_buy_request(
    buy_request: &Program, 
    from: u64, 
    seller_id: u64,
    price: u128,
) -> RunResult {
    let payload = Action::Create(CreateConfig { 
        seller: seller_id.into(),
        token_id: 0.into(), 
        price: price, 
        duration: Duration {
            hours: 168,
            minutes: 0,
            seconds: 0,
        } 
    });
    buy_request.send(from, payload)
}
