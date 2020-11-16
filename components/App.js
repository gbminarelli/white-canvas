import { Cell } from "./Cell.js";
import { initSocket } from "../ws-manager.js";

const e = React.createElement;

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.onSocketMessage = this.onSocketMessage.bind(this);
    this.onSocketOpen = this.onSocketOpen.bind(this);
    this.state = {
      dimension: 4,
      paintColor: "#000000",
      colors: [],
      socketWrapper: initSocket(this.onSocketMessage, this.onSocketOpen),
    };
  }

  handleClick(event, cell) {
    this.state.socketWrapper.socket.send(
      JSON.stringify({
        type: "click",
        uuid: this.state.socketWrapper.uuid,
        colors: this.state.colors.map((value, index) =>
          index === cell.index ? this.state.paintColor : value
        ),
      })
    );
  }

  handleColorChange(event) {
    this.setState({
      paintColor: event.target.value,
    });
  }

  onSocketMessage(messageJSON) {
    const message = JSON.parse(messageJSON.data);
    this.setState({
      colors: message.colors,
    });
  }

  onSocketOpen() {
    this.state.socketWrapper.socket.send(
      JSON.stringify({
        type: "open",
      })
    );
  }

  render() {
    return e(
      "div",
      null,
      e(
        "div",
        null,
        e("input", { type: "color", onChange: this.handleColorChange }, null)
      ),
      e(
        "div",
        { id: "canvas" },
        ...this.state.colors.map((value, index) =>
          e(Cell, { color: value, index, handleClick: this.handleClick })
        )
      )
    );
  }
}
