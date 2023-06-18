use app_io::buy_request::{Action, Error, Event};
use gstd::{Encode};
use gtest::{System};
mod routines;
use routines::*;

const SELLER: u64 = USERS[0];
const BUYER: u64  = USERS[1];
const THIRD_PARTY: u64 = USERS[2];

#[test]
fn buy() {
    let sys = System::new();
    let buy_request = init(&sys);

    let _token_id: u64 = 0;
    let result = buy_request.send_with_value(SELLER, Action::Sell, 1_000_000_000);
    
    println!("{:?}", result.decoded_log::<Result<Event, Error>>());
    assert!(result.contains(&(
        SELLER,
        Ok::<Event, Error>(Event::Bought { 
            price: 1_000_000_000 
        })
        .encode()
    )));
}

#[test]
fn cancel() {
    let sys = System::new();
    let buy_request = init(&sys);

    let _token_id: u64 = 0;
    let result = buy_request.send_with_value(BUYER, Action::Cancel, 1_000_000_000);
    
    println!("{:?}", result.decoded_log::<Result<Event, Error>>());
    assert!(result.contains(&(
        BUYER,
        Ok::<Event, Error>(Event::Terminated { 
            buyer: BUYER.into(), seller: SELLER.into() } )
        .encode()
    )));
}

#[test]
fn cancel_from_seller() {
    let sys = System::new();
    let buy_request = init(&sys);

    let _token_id: u64 = 0;
    let result = buy_request.send_with_value(SELLER, Action::Cancel, 1_000_000_000);
    
    println!("{:?}", result.decoded_log::<Result<Event, Error>>());
    assert!(result.contains(&(
        SELLER,
        Err::<Event, Error>(Error::NotBuyer).encode()
    )));
}

#[test]
fn cancel_from_third_party() {
    let sys = System::new();
    let buy_request = init(&sys);

    let _token_id: u64 = 0;
    let result = buy_request.send_with_value(THIRD_PARTY, Action::Cancel, 1_000_000_000);
    
    println!("{:?}", result.decoded_log::<Result<Event, Error>>());
    assert!(result.contains(&(
        THIRD_PARTY,
        Err::<Event, Error>(Error::NotBuyer).encode()
    )));
}

#[test]
fn reward() {
    let sys = System::new();
    let buy_request = init(&sys);

    let _token_id: u64 = 0;
    buy_request.send_with_value(SELLER, Action::Sell, 1_000_000_000);
    let result = buy_request.send_with_value(BUYER, Action::Reward, 1_000_000_000);
    
    println!("{:?}", result.decoded_log::<Result<Event, Error>>());
    assert!(result.contains(&(
        BUYER,
        Ok::<Event, Error>(Event::Rewarded { 
            price: 1_000_000_000 
        })
        .encode()
    )));
}

#[test]
fn reward_incorrect_rewarder() {
    let sys = System::new();
    let buy_request = init(&sys);

    let _token_id: u64 = 0;
    buy_request.send_with_value(SELLER, Action::Sell, 1_000_000_000);
    let result = buy_request.send_with_value(BUYER, Action::Reward, 1_000_000_000);
    
    println!("{:?}", result.decoded_log::<Result<Event, Error>>());
    assert!(result.contains(&(
        BUYER,
        Err::<Event, Error>(Error::IncorrectRewarder)
        .encode()
    )));
}