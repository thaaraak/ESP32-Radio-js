import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Frequency extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
          value: null
      }
  }

  render() {
    return (
      <div>
        <h1>{this.props.frequency}</h1>
      </div>
    );
  }

}

  class FrequencyUpDown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: null
        }
    }

    render() {
      return (
        <div>
          <button className="updown-button"><img src="/upsmall.png" alt="up"/></button>
          <button className="updown-button"><img src="/downsmall.png" alt="down"/></button>
        </div>
      );
    }

  }

  function KeyButton(props)
  {
    return (
      <button 
          className="panel-button" 
          onClick={() => props.onClick()}>
        {props.value}
      </button>
    );
  }

  class FrequencyKeypad extends React.Component {

    renderButton(i) {
      return (
        <KeyButton value={i}
          onClick={() => this.onClick(i)}
        />
      );
    }

    onClick(i) {
      this.props.keypad.handlePanelClick(i);
    }

    render() {
      return (
        <div className="keypad">
          <div className="keypad-row">
          {this.renderButton('7')}
          {this.renderButton('8')}
          {this.renderButton('9')}
          {this.renderButton('0')}
          </div>
          <div className="keypad-row">
          {this.renderButton('4')}
          {this.renderButton('5')}
          {this.renderButton('6')}
          {this.renderButton('.')}
          </div>
          <div className="keypad-row">
          {this.renderButton('1')}
          {this.renderButton('2')}
          {this.renderButton('3')}
          {this.renderButton('E')}
          </div>
        </div>
      );
    }
  }
  
  class RadioPanel extends React.Component {

    constructor(props) {
      super(props);
      
      this.state = {
        frequency: this.format(this.props.frequency),
        typed: ''
      };

    }

    format(s) {
      var sprintf = require('sprintf-js').sprintf;
      return sprintf('%2.6f', s )
    }

    sendCommand( freq )
    {
      fetch('http://esp32-radio.attlocal.net/command?frequency=' + freq )
        .then(response => response.json())
        .then(data => console.log(data));
    }

    handlePanelClick(i) {
 
      var s;

      if (  i == '.'  &&  this.state.typed.indexOf('.') >= 0 ) {
          return;
      }

      if ( i == 'E') {
          s = this.format( this.state.typed ) ;
          this.setState({ typed : '', frequency : s });
          this.sendCommand(s);
      }

      else {
          s = this.state.typed + i;
          this.setState({ typed : s, frequency : s })
      }
    }

    render() {
      return (
        <div className="radio-panel">
          <div className="frequency">
            <Frequency frequency={this.state.frequency}/>
          </div>
          <div className="frequency-updown">
            <FrequencyUpDown />
          </div>
          <div className="frequency-keypad">
            <FrequencyKeypad keypad={this} />
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <RadioPanel frequency={'7.2'} />,
    document.getElementById('root')
  );
  