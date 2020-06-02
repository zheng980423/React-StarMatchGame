import React from "react";
import _ from "lodash";
require("./App.css");
console.log(_.range(1, 10));

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
            {_.range(1, 10).map((number) => (
              <button key={number} className="number">
                {number}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
