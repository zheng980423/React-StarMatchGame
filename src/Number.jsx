class Number extends React.PureComponent {
  clickHandler = () => console.log("Click on " + this.props.number);

  render() {
    return (
      <button className="number" onClick={this.clickHandler}>
        {this.props.number}
      </button>
    );
  }
}
