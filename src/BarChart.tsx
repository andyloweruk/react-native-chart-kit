import React from "react";
import { View, ViewStyle } from "react-native";
import {
  Defs,
  G,
  LinearGradient,
  Rect,
  Stop,
  Svg,
  Text
} from "react-native-svg";

import AbstractChart, {
  AbstractChartConfig,
  AbstractChartProps
} from "./AbstractChart";
import { ChartData } from "./HelperTypes";

const barWidth = 32;

export interface BarChartProps extends AbstractChartProps {
  data: ChartData;
  width: number;
  height: number;
  fromZero?: boolean;
  withInnerLines?: boolean;
  yAxisLabel: string;
  yAxisSuffix: string;
  chartConfig: AbstractChartConfig;
  style?: Partial<ViewStyle>;
  horizontalLabelRotation?: number;
  verticalLabelRotation?: number;
  /**
   * Show vertical labels - default: True.
   */
  withVerticalLabels?: boolean;
  /**
   * Show horizontal labels - default: True.
   */
  withHorizontalLabels?: boolean;
  /**
   * The number of horizontal lines
   */
  segments?: number;
  showBarTops?: boolean;
  showValuesOnTopOfBars?: boolean;
  withCustomBarColorFromData?: boolean;
  flatColor?: boolean;
  renderBar?: Function;
  renderColor?: Function;
  renderValuesOnTopOfBar?: Function;
  renderBarTop?: Function;
  renderDefs?: Function;
  renderHorizontalLines?: Function;
  paddingTopVerticalLabels?: number;
}

type BarChartState = {};

class BarChart extends AbstractChart<BarChartProps, BarChartState> {
  getBarPercentage = () => {
    const { barPercentage = 1 } = this.props.chartConfig;
    return barPercentage;
  };

  renderBars = ({
    data,
    data2,
    width,
    height,
    paddingTop,
    paddingRight,
    barRadius,
    barRadiusX,
    barRadiusY,
    withCustomBarColorFromData
  }: Pick<
    Omit<AbstractChartConfig, "data">,
    "width" | "height" | "paddingRight" | "paddingTop" | "barRadius"
  > & {
    data: number[];
    data2?: number[];
    barRadiusX: number;
    barRadiusY: number;
    withCustomBarColorFromData: boolean;
  }) => {
    const baseHeight = this.calcBaseHeight(data, height);
    const baseHeight2 = this.calcBaseHeight(data2, height);

    return data.map((x, i) => {
      const barHeight = this.calcHeight(x, data, height);
      const barHeight2 = this.calcHeight(data2[i], data2, height);
      const barWidth = 32 * this.getBarPercentage();
      return this.props.renderBar != null
        ? this.props.renderBar({
            i,
            barRadius,
            height,
            width,
            barWidth,
            baseHeight,
            baseHeight2,
            barHeight2,
            barHeight,
            barRadiusX,
            barRadiusY,
            data,
            data2,
            paddingTop: paddingTop as number,
            paddingRight: paddingRight as number,
            withCustomBarColorFromData: withCustomBarColorFromData
          })
        : this.renderBar({
            i,
            height,
            width,
            barWidth,
            baseHeight,
            barHeight,
            baseHeight2,
            barHeight2,
            barRadius,
            barRadiusX,
            barRadiusY,
            data,
            data2,
            paddingTop: paddingTop as number,
            paddingRight: paddingRight as number,
            withCustomBarColorFromData: withCustomBarColorFromData
          });
    });
  };

  renderBar = ({
    i,
    data,
    width,
    barWidth,
    baseHeight,
    barHeight,
    paddingTop,
    paddingRight,
    barRadius,
    barRadiusX,
    barRadiusY,
    withCustomBarColorFromData
  }: Pick<
    Omit<AbstractChartConfig, "data">,
    "width" | "height" | "paddingRight" | "paddingTop"
  > & {
    data: number[];
    data2?: number[];
    i: number;
    barWidth: number;
    baseHeight: number;
    barHeight: number;
    baseHeight2?: number;
    barHeight2?: number;
    barRadius: number;
    barRadiusX: number;
    barRadiusY: number;
    withCustomBarColorFromData: boolean;
  }) => (
    <Rect
      key={Math.random()}
      x={
        paddingRight + (i * (width - paddingRight)) / data.length + barWidth / 2
      }
      y={
        ((barHeight > 0 ? baseHeight - barHeight : baseHeight) / 4) * 3 +
        paddingTop
      }
      rx={barRadiusX || barRadius}
      ry={barRadiusY || barRadius}
      width={barWidth}
      height={(Math.abs(barHeight) / 4) * 3}
      fill={
        withCustomBarColorFromData
          ? `url(#customColor_0_${i})`
          : "url(#fillShadowGradient)"
      }
    />
  );

  renderBarTops = ({
    data,
    width,
    height,
    paddingTop,
    paddingRight
  }: Pick<
    Omit<AbstractChartConfig, "data">,
    "width" | "height" | "paddingRight" | "paddingTop"
  > & {
    data: number[];
  }) => {
    const baseHeight = this.calcBaseHeight(data, height);

    return data.map((x, i) => {
      const barHeight = this.calcHeight(x, data, height);
      const barWidth = 32 * this.getBarPercentage();
      return this.props.renderBarTop != null
        ? this.props.renderBarTop({
            data,
            barHeight,
            baseHeight,
            height,
            i,
            width,
            barWidth,
            paddingTop: paddingTop as number,
            paddingRight: paddingRight as number
          })
        : this.renderBarTop({
            data,
            barHeight,
            baseHeight,
            height,
            i,
            width,
            barWidth,
            paddingTop: paddingTop as number,
            paddingRight: paddingRight as number
          });
    });
  };

  renderBarTop = ({
    i,
    baseHeight,
    barHeight,
    data,
    barWidth,
    width,
    paddingTop,
    paddingRight
  }: Pick<
    Omit<AbstractChartConfig, "data">,
    "width" | "height" | "paddingRight" | "paddingTop"
  > & {
    i: number;
    baseHeight: number;
    barHeight: number;
    barWidth: number;
    data: number[];
  }) => (
    <Rect
      key={Math.random()}
      x={
        paddingRight + (i * (width - paddingRight)) / data.length + barWidth / 2
      }
      y={((baseHeight - barHeight) / 4) * 3 + paddingTop}
      width={barWidth}
      height={2}
      fill={this.props.chartConfig.color(0.6)}
    />
  );

  renderColors = ({
    data,
    flatColor
  }: Pick<AbstractChartConfig, "data"> & {
    flatColor: boolean;
  }) => {
    return data.map((dataset, index) => (
      <Defs key={dataset.key ?? index}>
        {dataset.colors?.map((color, colorIndex) => {
          const highOpacityColor = color(1.0);
          const lowOpacityColor = color(0.1);

          return this.props.renderBarTop != null
            ? this.props.renderColor({
                index,
                colorIndex,
                highOpacityColor,
                lowOpacityColor,
                flatColor
              })
            : this.renderColor({
                index,
                colorIndex,
                highOpacityColor,
                lowOpacityColor,
                flatColor
              });
        })}
      </Defs>
    ));
  };

  renderColor = ({
    index,
    colorIndex,
    highOpacityColor,
    lowOpacityColor,
    flatColor
  }: Pick<AbstractChartConfig, "data"> & {
    index: number;
    colorIndex: number;
    highOpacityColor: string;
    lowOpacityColor: string;
    flatColor: boolean;
  }) => (
    <LinearGradient
      id={`customColor_${index}_${colorIndex}`}
      key={`${index}_${colorIndex}`}
      x1={0}
      y1={0}
      x2={0}
      y2={1}
    >
      <Stop offset="0" stopColor={highOpacityColor} stopOpacity="1" />
      {flatColor ? (
        <Stop offset="1" stopColor={highOpacityColor} stopOpacity="1" />
      ) : (
        <Stop offset="1" stopColor={lowOpacityColor} stopOpacity="0" />
      )}
    </LinearGradient>
  );

  renderValuesOnTopOfBars = ({
    data,
    width,
    height,
    paddingTop,
    paddingRight
  }: Pick<
    Omit<AbstractChartConfig, "data">,
    "width" | "height" | "paddingRight" | "paddingTop"
  > & {
    data: number[];
  }) => {
    const baseHeight = this.calcBaseHeight(data, height);

    return data.map((x, i) => {
      const barHeight = this.calcHeight(x, data, height);
      const barWidth = 32 * this.getBarPercentage();
      return this.props.renderBarTop != null
        ? this.props.renderValuesOnTopOfBar({
            i,
            baseHeight,
            barHeight,
            barWidth,
            data,
            width,
            height,
            paddingTop,
            paddingRight
          })
        : this.renderValuesOnTopOfBar({
            i,
            baseHeight,
            barHeight,
            barWidth,
            data,
            width,
            height,
            paddingTop,
            paddingRight
          });
    });
  };

  renderValuesOnTopOfBar = ({
    i,
    baseHeight,
    barHeight,
    barWidth,
    data,
    width,
    paddingTop,
    paddingRight
  }: Pick<
    Omit<AbstractChartConfig, "data">,
    "width" | "height" | "paddingRight" | "paddingTop"
  > & {
    i: number;
    baseHeight: number;
    barHeight: number;
    barWidth: number;
    data: number[];
  }) => (
    <Text
      key={Math.random()}
      x={paddingRight + (i * (width - paddingRight)) / data.length + barWidth}
      y={((baseHeight - barHeight) / 4) * 3 + paddingTop - 1}
      fill={this.props.chartConfig.color(0.6)}
      fontSize="12"
      textAnchor="middle"
    >
      {data[i]}
    </Text>
  );

  render() {
    const {
      width,
      height,
      data,
      style = {},
      withHorizontalLabels = true,
      withVerticalLabels = true,
      verticalLabelRotation = 0,
      horizontalLabelRotation = 0,
      withInnerLines = true,
      showBarTops = true,
      withCustomBarColorFromData = false,
      showValuesOnTopOfBars = false,
      flatColor = false,
      segments = 4
    } = this.props;

    const { borderRadius = 0, paddingTop = 16, paddingRight = 64 } = style;

    const config = {
      width,
      height,
      verticalLabelRotation,
      horizontalLabelRotation,
      barRadiusX:
        (this.props.chartConfig && this.props.chartConfig.barRadiusX) || 0,
      barRadiusY:
        (this.props.chartConfig && this.props.chartConfig.barRadiusY) || 0,
      barRadius:
        (this.props.chartConfig && this.props.chartConfig.barRadius) || 0,
      decimalPlaces:
        (this.props.chartConfig && this.props.chartConfig.decimalPlaces) ?? 2,
      formatYLabel:
        (this.props.chartConfig && this.props.chartConfig.formatYLabel) ||
        function(label) {
          return label;
        },
      formatXLabel:
        (this.props.chartConfig && this.props.chartConfig.formatXLabel) ||
        function(label) {
          return label;
        }
    };

    return (
      <View style={style}>
        <Svg height={height} width={width}>
          {this.props.renderDefs != null
            ? this.props.renderDefs({
                ...config,
                ...this.props.chartConfig
              })
            : this.renderDefs({
                ...config,
                ...this.props.chartConfig
              })}
          {this.renderColors({
            ...this.props.chartConfig,
            flatColor: flatColor,
            data: this.props.data.datasets
          })}
          <Rect
            width="100%"
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G>
            {withInnerLines
              ? this.props.renderHorizontalLines != null
                ? this.props.renderHorizontalLines({
                    ...config,
                    count: segments,
                    paddingTop
                  })
                : this.renderHorizontalLines({
                    ...config,
                    count: segments,
                    paddingTop: paddingTop
                  })
              : null}
          </G>
          <G>
            {withHorizontalLabels
              ? this.renderHorizontalLabels({
                  ...config,
                  count: segments,
                  data: data.datasets[0].data,
                  paddingTop: paddingTop as number,
                  paddingRight: paddingRight as number
                })
              : null}
          </G>
          <G>
            {withVerticalLabels
              ? this.props.renderVerticalLabels != null
                ? this.props.renderVerticalLabels({
                    ...config,
                    labels: data.labels,
                    paddingRight: paddingRight as number,
                    paddingTop:
                      this.props.paddingTopVerticalLabels ||
                      (paddingTop as number),
                    horizontalOffset: barWidth * this.getBarPercentage()
                  })
                : this.renderVerticalLabels({
                    ...config,
                    labels: data.labels,
                    paddingRight: paddingRight as number,
                    paddingTop:
                      this.props.paddingTopVerticalLabels ||
                      (paddingTop as number),
                    horizontalOffset: barWidth * this.getBarPercentage()
                  })
              : null}
          </G>
          <G>
            {this.renderBars({
              ...config,
              data: data.datasets[0].data,
              data2: data.datasets[1].data || data.datasets[0].data,
              paddingTop: paddingTop as number,
              paddingRight: paddingRight as number,
              withCustomBarColorFromData: withCustomBarColorFromData
            })}
          </G>
          <G>
            {showValuesOnTopOfBars &&
              this.renderValuesOnTopOfBars({
                ...config,
                data: data.datasets[0].data,
                paddingTop: paddingTop as number,
                paddingRight: paddingRight as number
              })}
          </G>
          <G>
            {showBarTops &&
              this.renderBarTops({
                ...config,
                data: data.datasets[0].data,
                paddingTop: paddingTop as number,
                paddingRight: paddingRight as number
              })}
          </G>
        </Svg>
      </View>
    );
  }
}

export default BarChart;
