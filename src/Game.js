import React from "react";

import _ from "lodash";
require("./App.css");
//为可能出现的每种情况设置参数
const colors = {
  used: "lightgreen", //已使用过的数字,后面不能再选
  wrong: "lightcoral", //选择错误
  selected: "deepskyblue", //已选择的数字
};
//提取number元素
class Number extends React.PureComponent {
  style() {
    if (this.props.isUsed) {
      return {
        backgroundColor: colors.used, //green
      };
    }
    //
    if (this.props.isSelected) {
      return {
        backgroundColor: this.props.selectionIsWrong
          ? colors.wrong //red
          : colors.selected, //blue
      };
    }
    return {};
  }

  //点击事件
  clickHandler = () => {
    //数字没有没点击过才会触发
    if (!this.props.isUsed) {
      this.props.onClick(this.props.number);
    }
  };

  render() {
    return (
      <button
        className="number"
        style={this.style()}
        onClick={this.clickHandler}
      >
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
    //已经原则过的数字
    selectedNumbers: [],
    //已经使用过的数字
    usedNumbers: [],
  };

  //当已挑选的数字大于星星数量，返回wrong否则返回true
  selectionIsWrong = _.sum(this.state.selectedNumbers) > this.state.stars;
  onNumberClick = (number) => {
    this.setState((prevState) => {
      let { selectedNumbers, usedNumbers, stars } = prevState;
      selectedNumbers = [...selectedNumbers, number];

      const selectedSum = _.sum(selectedNumbers);
      if (selectedSum === stars) {
        usedNumbers = [...usedNumbers, ...selectedNumbers];
        selectedNumbers = [];
        stars = 1 + Math.floor(9 * Math.random());
      }
      this.selectionIsWrong = selectedSum > this.state.stars;
      return {
        selectedNumbers,
        usedNumbers,
        stars,
      };
    });
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
            {/* 设置number，isUsed，isSelected，selectionIsWrong state */}
            {_.range(1, 10).map((number) => {
              //由于state中的usedNumbers的数字已经强制设置好，所以state isUsed只有2和4才有
              const isUsed = this.state.usedNumbers.indexOf(number) >= 0;
              //同理 state isSelected 参数只有7和8才有
              const isSelected =
                this.state.selectedNumbers.indexOf(number) >= 0;
              return (
                <Number
                  key={number}
                  number={number}
                  isUsed={isUsed}
                  isSelected={isSelected}
                  selectionIsWrong={this.selectionIsWrong}
                  onClick={this.onNumberClick}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
