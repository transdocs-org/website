# Trading Signals

![Language Details](https://img.shields.io/github/languages/top/bennycode/trading-signals) ![Code Coverage](https://img.shields.io/codecov/c/github/bennycode/trading-signals/main) ![License](https://img.shields.io/npm/l/trading-signals.svg) ![Package Version](https://img.shields.io/npm/v/trading-signals.svg)

Technical indicators and overlays to run technical analysis with JavaScript / TypeScript.

## Motivation

The "trading-signals" library provides a TypeScript implementation for common technical indicators. It is well-suited for algorithmic trading, allowing developers to perform signal computations for automated trading strategies.

All indicators can be updated over time by streaming data (prices or [candles](https://en.wikipedia.org/wiki/Candlestick_chart)) to the `add` method. Some indicators also provide `static` batch methods for further performance improvements when providing data up-front during a backtest or historical data import. You can try it out streaming input data by running the provided [demo script](https://github.com/bennycode/trading-signals/blob/main/src/start/demo.ts) with `npm start`, which uses a keyboard input stream.

## Installation

```bash
npm install trading-signals
```

## Usage

**CommonJS:**

```ts
const {SMA} = require('trading-signals');
```

**ESM:**

```ts
import {SMA} from 'trading-signals';
```

**Example:**

```typescript
import {SMA} from 'trading-signals';

const sma = new SMA(3);

// You can add values individually:
sma.add(40);
sma.add(30);
sma.add(20);

// You can add multiple values at once:
sma.updates([20, 40, 80]);

// You can replace a previous value (useful for live charting):
sma.replace(40);

// You can check if an indicator is stable:
console.log(sma.isStable); // true

// If an indicator is stable, you can get its result:
console.log(sma.getResult()); // 50.0003

// You can also get the result without optional chaining:
console.log(sma.getResultOrThrow()); // 50.0003

// Various precisions are available too:
console.log(sma.getResultOrThrow().toFixed(2)); // "50.00"
console.log(sma.getResultOrThrow().toFixed(4)); // "50.0003"

// Each indicator also includes convenient features such as "lowest" and "highest" lifetime values:
console.log(sma.lowest?.toFixed(2)); // "23.33"
console.log(sma.highest?.toFixed(2)); // "53.33"
```

### When to use `add(...)`?

To input data, you need to call the indicator's `add` method. Depending on whether the minimum required input data for the interval has been reached, the `add` method may or may not return a result from the indicator.

### When to use `getResultOrThrow()`?

You can call `getResultOrThrow()` at any point in time, but it throws errors unless an indicator has received the minimum amount of data. If you call `getResultOrThrow()` before an indicator has received the required amount of input values, a `NotEnoughDataError` will be thrown.

**Example:**

```ts
import {SMA} from 'trading-signals';

// Our interval is 3, so we need 3 input values
const sma = new SMA(3);

// We supply 2 input values
sma.add(10);
sma.add(40);

try {
  // We will get an error, because the minimum amount of inputs is 3
  sma.getResultOrThrow();
} catch (error) {
  console.log(error.constructor.name); // "NotEnoughDataError"
}

// We will supply the 3rd input value
sma.add(70);

// Now, we will receive a proper result
console.log(sma.getResultOrThrow()); // 40
```

Most of the time, the minimum amount of data depends on the interval / time period used. If you’re not sure, take a look at the test files for the indicator to see examples of correct usage.

## Technical Indicator Types

* Exhaustion indicators: Identify trend exhaustion and potential reversal.
* Momentum indicators: Measure the speed and strength of price movements in a particular direction
* Trend indicators: Measure the direction of a trend (uptrend, downtrend or sideways trend)
* Volatility indicators: Measure the degree of variation in prices over time, regardless of direction
* Volume indicators: Measure the strength of a trend based on volume

## Supported Technical Indicators

1. Acceleration Bands (ABANDS)
2. Accelerator Oscillator (AC)
3. Average Directional Index (ADX)
4. Average True Range (ATR)
5. Awesome Oscillator (AO)
6. Bollinger Bands (BBANDS)
7. Bollinger Bands Width (BBW)
8. Center of Gravity (CG)
9. Commodity Channel Index (CCI)
10. Directional Movement Index (DMI / DX)
11. Double Exponential Moving Average (DEMA)
12. Dual Moving Average (DMA)
13. Exponential Moving Average (EMA)
14. Interquartile Range (IQR)
15. Linear Regression (LINREG)
16. Mean Absolute Deviation (MAD)
17. Momentum (MOM / MTM)
18. Moving Average Convergence Divergence (MACD)
19. On-Balance Volume (OBV)
20. Parabolic SAR (PSAR)
21. Range Expansion Index (REI)
22. Rate-of-Change (ROC)
23. Relative Moving Average (RMA)
24. Relative Strength Index (RSI)
25. Simple Moving Average (SMA)
26. Spencer's 15-Point Moving Average (SMA15)
27. Stochastic Oscillator (STOCH)
28. Stochastic RSI (STOCHRSI)
29. Tom Demark's Sequential Indicator (TDS)
30. True Range (TR)
31. Volume-Weighted Average Price (VWAP)
32. Weighted Moving Average (WMA)
33. Wilder's Smoothed Moving Average (WSMA / WWS / SMMA / MEMA)
34. Zig Zag Indicator (ZigZag)

Utility Methods:

1. Average / Mean
2. Grid Sizing (for [grid trading bots](https://b2broker.com/news/understanding-grid-trading-purpose-pros-cons/))
3. Maximum
4. Median
5. Minimum
6. Quartile
7. Standard Deviation
8. Streaks

## Performance

### Floating-point arithmetic caveats

JavaScript uses double-precision floating-point arithmetic. For example, `0.1 + 0.2` yields `0.30000000000000004` due to binary floating-point representation.

![JavaScript arithmetic](https://raw.githubusercontent.com/bennycode/trading-signals/HEAD/js-arithmetic.png)

While this isn’t perfectly accurate, it usually doesn’t matter in practice since indicators often work with averages, which already smooth out precision. In test cases, you can control precision by using Vitest’s [toBeCloseTo](https://vitest.dev/api/expect.html#tobecloseto) assertion.

Earlier versions of this library (up to version 6) used [big.js][1] for arbitrary-precision arithmetic, but that made calculations about 100x slower on average. For this reason, support for [big.js][1] was removed starting with version 7.

## Disclaimer

The information and publications of [trading-signals](https://github.com/bennycode/trading-signals) do not constitute financial advice, investment advice, trading advice or any other form of advice. All results from [trading-signals](https://github.com/bennycode/trading-signals) are intended for information purposes only.

It is very important to do your own analysis before making any investment based on your own personal circumstances. If you need financial advice or further advice in general, it is recommended that you identify a relevantly qualified individual in your jurisdiction who can advise you accordingly.

## Alternatives

* [Cloud9Trader Indicators (JavaScript)](https://github.com/Cloud9Trader/TechnicalIndicators)
* [Crypto Trading Hub Indicators (TypeScript)](https://github.com/anandanand84/technicalindicators)
* [Highcharts Indicators (TypeScript)](https://github.com/highcharts/highcharts/tree/v12.3.0/ts/Stock/Indicators)
* [Indicator TS (TypeScript)](https://github.com/cinar/indicatorts)
* [Jesse Trading Bot Indicators (Python)](https://docs.jesse.trade/docs/indicators/reference.html)
* [LEAN Indicators (C#)](https://github.com/QuantConnect/Lean/tree/master/Indicators)
* [libindicators (C#)](https://github.com/mgfx/libindicators)
* [Pandas TA (Python)](https://github.com/twopirllc/pandas-ta)
* [Stock Indicators for .NET (C#)](https://github.com/DaveSkender/Stock.Indicators)
* [StockSharp (C#)](https://github.com/StockSharp/StockSharp)
* [ta-lib (C)](https://github.com/TA-Lib/ta-lib/tree/main/src/ta_func)
* [ta-math (TypeScript)](https://github.com/munrocket/ta-math)
* [ta4j (Java)](https://github.com/ta4j/ta4j)
* [Technical Analysis for Rust (Rust)](https://github.com/greyblake/ta-rs)
* [Technical Analysis Library using Pandas and Numpy (Python)](https://github.com/bukosabino/ta)
* [Tulip Indicators (ANSI C)](https://github.com/TulipCharts/tulipindicators)

## Maintainers

[![Benny Neugebauer on Stack Exchange][stack_exchange_bennycode_badge]][stack_exchange_bennycode_url]

## ⭐️ Become a TypeScript rockstar! ⭐️

This package was built by Benny Code. Checkout my [**TypeScript course**](https://typescript.tv/) to become a coding rockstar!

[<img src="https://raw.githubusercontent.com/bennycode/trading-signals/main/tstv.png">](https://typescript.tv/)

[1]: http://mikemcl.github.io/big.js/

[stack_exchange_bennycode_badge]: https://stackexchange.com/users/flair/203782.png?theme=default

[stack_exchange_bennycode_url]: https://stackexchange.com/users/203782/benny-neugebauer?tab=accounts

## License

This project is [MIT](https://github.com/bennycode/trading-signals/blob/main/LICENSE) licensed.
