use gmeta::{InOut, Metadata};
use crate::buy_request::{Action, Event, Error, BuyRequestInfo};

// Contract metadata. This is the contract's interface description.
//
// It defines the types of messages that can be sent to the contract.
pub struct ContractMetadata;

impl Metadata for ContractMetadata {
    // Init message type.
    //
    // Describes incoming/outgoing types for the `init()` function.
    //
    // The unit tuple is used as neither incoming nor outgoing messages are
    // expected in the `init()` function.
    type Init = ();
    // Handle message type.
    //
    // Describes incoming/outgoing types for the `handle()` function.
    //
    // We use the same [`PingPong`] type for both incoming and outgoing
    // messages.
    type Handle = InOut<Action, Result<Event, Error>>;
    // Asynchronous handle message type.
    //
    // Describes incoming/outgoing types for the `main()` function in case of
    // asynchronous interaction.
    //
    // The unit tuple is used as we don't use asynchronous interaction in this
    // contract.
    type Others = ();
    // Reply message type.
    //
    // Describes incoming/outgoing types of messages performed using the
    // `handle_reply()` function.
    //
    // The unit tuple is used as we don't process any replies in this contract.
    type Reply = ();
    // Signal message type.
    //
    // Describes only the outgoing type from the program while processing the
    // system signal.
    //
    // The unit tuple is used as we don't process any signals in this contract.
    type Signal = ();
    // State message type.
    //
    // Describes the type for the queried state returned by the `state()`
    // function.
    //
    // We use a list of ping counts (`u128`) for each pinger (`ActorId`).
    type State = BuyRequestInfo;
}
