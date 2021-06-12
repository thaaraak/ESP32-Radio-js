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
        <div className="frequency-box">
        {this.props.frequency}
        </div>
        <div className="mhz-box">
        MHz
        </div>
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

    onClick(i) {
      this.props.keypad.handleUpDownClick(i);
    }

    render() {
      return (
        <div>
          <button onClick={() => this.onClick('up')} className="updown-button"><img src="/upsmall.png" alt="up"/></button>
          <button onClick={() => this.onClick('down')} className="updown-button"><img src="/downsmall.png" alt="down"/></button>
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

  function SidebandButton(props)
  {
    return (
      <button 
          className={props.buttonclass} 
          onClick={() => props.onClick()}>
        {props.value}
      </button>
    );
  }

  class Sideband extends React.Component {

    constructor(props){
      super(props)
      this.state ={
        sideband: this.props.sideband
      }
    }

    renderButton(i) {
      return (
        <SidebandButton value={i} buttonclass={this.state.sideband==i ? "sideband-button-pressed" : "sideband-button"} 
          onClick={() => this.onClick(i)}
        />
      );
    }

    onClick(i) {
      this.setState({ sideband : i });
      this.props.keypad.handleSidebandClick(i);
    }

    render() {
      return (
        <div className="sideband-box">
          {this.renderButton('USB')}
          {this.renderButton('LSB')}
          </div>
      );
    }
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
        sideband: this.props.sideband,
        frequency: this.format(this.props.frequency),
        typed: ''
      };

      this.initRadio( this.props.frequency, this.props.sideband );
    }

    format(s) {
      var sprintf = require('sprintf-js').sprintf;
      return sprintf('%2.6f', s )
    }

    initRadio( freq, sideband ) {
      var command = 'frequency=' + freq + "&sideband=" + sideband;
      this.sendCommand( command );
    }

    changeFrequency( freq ) {
      var command = 'frequency=' + freq;
      this.sendCommand( command );
    }

    changeSideband( sideband ) {
      var command = 'sideband=' + sideband;
      this.sendCommand( command );
    }

    sendCommand( c ) {
      console.log( c );
      fetch("http://esp32-radio.attlocal.net/command?" + c )
        .then(response => response.json())
        .then(data => console.log(data));
    }

    handleUpDownClick(i) {
      var mult = 1;
      if ( i == 'down' ) {
        mult = -1;
      }

      var freq = parseFloat( this.state.frequency ) + mult*.0005;
      var sprintf = require('sprintf-js').sprintf;
      freq = sprintf('%2.6f', freq ); 
      this.changeFrequency( freq );
      this.setState( { frequency : freq } );
    }

    handleSidebandClick(i) {
      this.setState({ sideband : i });
      this.changeSideband(i);
    }

    handlePanelClick(i) {
 
      var s;

      if (  i == '.'  &&  this.state.typed.indexOf('.') >= 0 ) {
          return;
      }

      if ( i == 'E') {
          s = this.format( this.state.typed ) ;
          this.setState({ typed : '', frequency : s });
          this.changeFrequency(s);
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
            <FrequencyUpDown keypad={this} />
            <Sideband keypad={this} sideband={this.state.sideband}/>
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
    <RadioPanel frequency={'14.2'} sideband={'USB'} />,
    document.getElementById('root')
  );
  