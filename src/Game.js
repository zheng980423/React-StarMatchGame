import React from "react";

import _ from "lodash";
require("./App.css");

//生成数组之和不大于maxSum的数字
const randomSum = (arr, maxSum) => {
  console.log(arr, maxSum);
  const sets = [[]],
    sums = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0, len = sets.length; j < len; j++) {
      const candidateSet = sets[j].concat(arr[i]);
      const candidateSum = _.sum(candidateSet);
      if (candidateSum <= maxSum) {
        sets.push(candidateSet);
        sums.push(candidateSum);
      }
    }
  }
  return _.sample(sums);
};
//为可能出现的每种情况设置参数
const colors = {
  available: "#eee",
  used: "lightgreen", //已使用过的数字,后面不能再选
  wrong: "lightcoral", //选择错误
  selected: "deepskyblue", //已选择的数字
};

//提取number component
class Number extends React.PureComponent {
  //点击事件
  handleClick = () => {
    if (this.props.status !== "used") {
      this.props.onClick(this.props.number);
    }
  };
  componentWillUpdate(nextProps) {
    console.log(this.props, nextProps);
  }

  render() {
    return (
      <button
        className="number"
        style={{ backgroundColor: colors[this.props.status] }}
        onClick={this.handleClick}
      >
        {/* 访问传入的props */}
        {this.props.number}
      </button>
    );
  }
}

//game component
class Game extends React.Component {
  //在render外面生成numbers数组
  numbers = _.range(1, 10);

  initialState = () => ({
    randomStars: randomSum(this.numbers, 9),
    selectedNumbers: [],
    usedNumbers: [],
  });

  state = this.initialState();

  //首先设置为false
  selectionIsWrong = false;
  //数字点击的函数，返回的是 selectedNumbers,usedNumbers,stars,三个state参数
  numberClick = (number) => {
    this.setState((prevState) => {
      let { selectedNumbers, usedNumbers, randomStars } = prevState;
      //解决能重复选择一个数字的bug
      if (selectedNumbers.indexOf(number) >= 0) {
        // 取消已经选择的数字
        selectedNumbers = selectedNumbers.filter((sn) => sn !== number);
      } else {
        // 将该数字放入已选择的数字数组里面
        selectedNumbers = [...selectedNumbers, number];
      }
      const selectedSum = _.sum(selectedNumbers);
      if (selectedSum === randomStars) {
        usedNumbers = [...usedNumbers, ...selectedNumbers];
        randomStars = randomSum(_.difference(this.numbers, usedNumbers), 9);
        selectedNumbers = [];
      }
      this.selectionIsWrong = selectedSum > this.state.randomStars;
      this.gameIsDone = usedNumbers.length === this.numbers.length;
      return {
        selectedNumbers,
        usedNumbers,
        randomStars,
      };
    });
  };
  numberStatus(number) {
    if (this.state.usedNumbers.indexOf(number) >= 0) {
      return "used";
    }
    const isSelected = this.state.selectedNumbers.indexOf(number) >= 0;
    if (isSelected) {
      return this.selectionIsWrong ? "wrong" : "selected";
    }
    return "available";
  }

  resetGame = () => {
    this.gameIsDone = false;
    this.setState(this.initialState());
  };
  //渲染星星
  renderStars() {
    return _.range(this.state.randomStars).map((starIndex) => (
      <div className="star" key={starIndex} />
    ));
  }

  renderPlayAgain() {
    return (
      <div className="game-done">
        <div className="message">太棒了！</div>
        <button onClick={this.resetGame}>再玩一次</button>
      </div>
    );
  }

  render() {
    return (
      <div className="game">
        <div className="help">选择一个或多个数字。使其加起来等于星星的数量</div>
        <div className="body">
          <div className="stars">
            {/* 判断游戏是否结束，若结束则渲染再玩一次的界面，否则，渲染星星 */}
            {this.gameIsDone ? this.renderPlayAgain() : this.renderStars()}
          </div>

          {/* 使用lodash的内置方法生成一个1-9的数组 */}
          <div className="play-numbers">
            {/* 设置number，isUsed，isSelected，selectionIsWrong onClick state */}
            {this.numbers.map((number) => {
              //usedNumbers初始为空
              const isUsed = this.state.usedNumbers.indexOf(number) >= 0;
              //selectedNumbers初始为空
              const isSelected =
                this.state.selectedNumbers.indexOf(number) >= 0;
              const isWrong = this.selectionIsWrong && isSelected;
              return (
                <Number
                  key={number}
                  number={number}
                  status={this.numberStatus(number)}
                  onClick={this.numberClick}
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
