(function() {
	Vue.config.devtools = false;
	new Vue({
		el: 'body',
		data: {
			optStack: [], // 运算符栈
			numStack: [], // 数字栈
			varHash: {}, // 存放变量的哈希表
			stringList: [],
			inputString: ''
		},
		ready: function() {
			// this.splitString("234.324 + 5");
			var string = "'123'456";
			console.log(this.isValuate(string));
		},
		methods: {

			/*
			 * 当输入字符串后，
			 * 对数据结构stringList进行条目的添加
			 * 添加的条目是词法分析和语法分析后的结果
			 */
			pushData: function() {
				var prevList = this.stringList;
				var originString = this.inputString;
				this.splitString(originString);
				var resultString = this.formatStack();

				// 将计算结果添加进视图数组中
				prevList.push({
					stringOrigin: originString,
					stringResult: resultString,
					type: 'success'
				});
				this.$set('stringList', prevList); // 更新数据结构stringList
				this.$set('inputString', ''); // 还原input控件的内容
			},

			/*
			 * 分析输入的字符串
			 * 1. 为直接的运算语句，如 3 + 5
			 * 2. 还是赋值语句，如 c = 3 + 5
			 * return true:赋值语句 、 false: 直接的运算语句
			 */
			isValuate: function(string) {
				var quoteReg = /(\'.*\'|\".*\")/g; // 匹配引号中的内容
				// 判断字符串是否为赋值语句，需去除引号，再确认"="号
				string = string.replace(quoteReg, "");
				if (string.indexOf("=") > 0) {
					return true;
				} else {
					return false;
				}
			},

			/*
			 * @param string 可运算的字符串
			 * 对给定字符串进行切割
			 * 切割的同时分析字符串是否合法
			 * 切割后分析，并压入对应的栈
			 * 变量或数字压入this.numStack，运算符压入this.optStack
			 * return
			 */
			splitString: function(string) {
				var blankReg = /(^\s*)|(\s*$)/g; // 匹配首尾空格
				var optReg = /(^[\+\-\*\/\!\%\^\&\(\)])/; // 匹配运算符+-*/!%&左右括号
				var numReg = /(^\d+|\-\d+)(\.?)(\d*)/; // 匹配数字（包括正负、int、double） 
				var varReg = /(^\w+)/; // 匹配变量 
				var target = ""; // 匹配的字符串
				var validSymbol = 'identifier'; // 下一个后续合法的字符类型

				while (string.length > 0) {

					string = string.replace(blankReg, ''); // 去除空格
					if (validSymbol == 'identifier') { // 下一个合法字符为数字或变量
						if (numReg.test(string)) { // 数字
							target = parseFloat(string.match(numReg)[0]);
							string = string.replace(numReg, "");

						} else if (varReg.test(string)) { // 变量
							target = string.match(varReg)[0];
							string = string.replace(varReg, "");
						}
						this.numStack.push(target);
						validSymbol = 'opt';

					} else if (validSymbol == 'opt') { // 下一个合法字符为运算符
						if (optReg.test(string)) { // 匹配结果为运算符
							this.optStack.push(string[0]);
							string = string.substring(1);
						}
						validSymbol = 'identifier';
					}

					/*if (optReg.test(string)) { // 匹配结果为运算符
						this.optStack.push(string[0]);
						string = string.substring(1);

					} else if (numReg.test(string)) { // 数字
						var temp = parseFloat(string.match(numReg)[0]);
						this.numStack.push(temp);
						string = string.replace(numReg, "");

					} else if (varReg.test(string)) { // 变量
						var temp = string.match(varReg)[0];
						this.numStack.push(temp);
						string = string.replace(varReg, "");

					} else {
						console.log("ERROR - 无法处理的符号：" + string[0] + "(来自" + string + ")");
						break;
					}*/
				}
			},

			/*
			 * 对optStack和numStack两个栈进行计算
			 */
			formatStack: function() {
				var optStack = this.optStack;
				var numStack = this.numStack;
				// 循环地弹出栈并进行计算
				while (optStack.length > 0) {
					var temp = this.calculate(optStack.pop(), numStack.pop(), numStack.pop());
					numStack.push(temp);
				}
				// 当optStack为空时，numStack剩下唯一一个元素，即numStack[0]即为结果
				return numStack.pop();
			},

			/*
			 * 运算
			 * @param opt 运算符
			 * @param n1
			 * @param n1
			 * @return 
			 */
			calculate: function(opt, n2, n1) {
				switch (opt) {
					case "+":
						return n1 + n2;
					case "-":
						return n1 - n2;
					case "*":
						return n1 * n2;
					case "/":
						return n1 / n2;
					default:
						throw new Error("unexpected operator:" + opt);
				}
			},

			/*
			 * 检查string是否为数字
			 */
			isNumber: function(string) {

			}
		}
	});
})();