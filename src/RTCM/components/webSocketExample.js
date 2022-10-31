import React from 'react';
import Websocket from 'react-websocket';

class WebSocketExample extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            timer: 0
        };
    }

    handleData(data) {

        let result = JSON.parse(data);
        this.setState({timer: result.time});
    }

    onOpenConnection(data) {

    }

    onCloseConnection(data) {

    }

    render() {
        return (
            <div>
                <h1>
                    Timer:
                    <strong>{this.state.timer}</strong>
                </h1>

                <Websocket
                    url='ws://localhost:10113'
                    onMessage={this.handleData.bind(this)}
                    onOpen={this.onOpenConnection.bind(this)}
                    onClose={this.onCloseConnection.bind(this)}
                />
            </div>
        );
    }
}

export default WebSocketExample;
