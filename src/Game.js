import React from "react";

import _ from "lodash";
require("./App.css");
console.log(_.range(1, 10));
//提取number元素
class Number extends React.PureComponent {
  //这是一个空的点击事件

  clickHandler = () => console.log("Click on " + this.props.number);

  render() {
    return (
      <button className="number" onClick={this.clickHandler}>
        {/* 访问传入的props */}
        {this.props.number}
      </button>
    );
  }
}
class Game extends React.Component {
  //生成随机的星星数
  state = {
    stars: 1 + Math.floor(9 * Math.random()), //Math.random 本身只生成0-1的小数
  };
  render() {
    return (
      <div className="game">
        <div className="help">选择一个或多个数字。使其加起来等于星星的数量</div>
        <div className="body">
          <div className="stars">
            {_.range(this.state.stars).map((starIndex) => (
              <div key={starIndex} className="star" />
            ))}
          </div>

          {/* 使用lodash的内置方法生成一个1-9的数组 */}
          <div className="play-numbers">
            {/* 设置一个props */}
            {_.range(1, 10).map((number) => (
              <Number key={number} number={number} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
