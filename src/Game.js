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
  used: "lightgreen", //已使用过的数字,后面不能再选
  wrong: "lightcoral", //选择错误
  selected: "deepskyblue", //已选择的数字
};
//提取number component
class Number extends React.PureComponent {
  style() {
    if (this.props.isUsed) {
      return {
        backgroundColor: colors.used, //green
      };
    }

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
      //执行传入的props
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

//game component
class Game extends React.Component {
  //在render外面生成numbers数组和随机的星星数量
  numbers = _.range(1, 10);
  stars = _.range(randomSum(this.numbers, 9));

  //生成随机的星星数
  state = {
    //已挑选过的数字
    selectedNumbers: [],

    //已经使用过的数字
    usedNumbers: [],
  };

  //当已挑选的数字大于星星数量，返回wrong否则返回true
  selectionIsWrong = _.sum(this.state.selectedNumbers) > this.stars.length;

  //数字点击的函数，返回的是 selectedNumbers,usedNumbers,stars,三个state参数
  onNumberClick = (number) => {
    this.setState((prevState) => {
      let { selectedNumbers, usedNumbers } = prevState;

      if (selectedNumbers.indexOf(number) >= 0) {
        // 取消已经选择的数字
        selectedNumbers = selectedNumbers.filter((sn) => sn !== number);
      } else {
        // 将该数字放入已选择的数字数组里面
        selectedNumbers = [...selectedNumbers, number];
      }
      //计算已选择的数字之和
      const selectedSum = _.sum(selectedNumbers);
      //若数组之和大于星星的数量， 返回true、否则返回false
      this.selectionIsWrong = selectedSum > this.stars.length;
      //若数租之和跟星星的数量相等
      if (selectedSum === this.stars.length) {
        // 将已选择的数字放入已使用的数组里面
        usedNumbers = [...usedNumbers, ...selectedNumbers];
        //将selectedNumbers置空
        selectedNumbers = [];
        //utility函数
        this.stars = _.range(
          randomSum(_.difference(this.numbers, usedNumbers), 9)
        );
      }

      return {
        selectedNumbers,
        usedNumbers,
      };
    });
  };
  render() {
    return (
      <div className="game">
        <div className="help">选择一个或多个数字。使其加起来等于星星的数量</div>
        <div className="body">
          <div className="stars">
            {this.stars.map((starIndex) => (
              <div key={starIndex} className="star" />
            ))}
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
