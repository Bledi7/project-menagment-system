import { ResponsiveLine } from "@nivo/line";
import { memo } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { mockLineData as data } from "../data/mockData";

const MemoizedLineChart = memo(
  ({ isCustomLineColors = false, isDashboard = false }) => {
    const isSmallScreen = useMediaQuery((theme) =>
      theme.breakpoints.down("sm")
    );

    return (
      <Box height={isSmallScreen ? "250px" : "300px"} mt="10px">
        <ResponsiveLine
          data={data}
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: "#000",
                },
              },
              legend: {
                text: {
                  fill: "#000",
                },
              },
              ticks: {
                line: {
                  stroke: "#000",
                  strokeWidth: 1,
                },
                text: {
                  fill: "#000",
                },
              },
            },
            legends: {
              text: {
                fill: "#000",
              },
            },
            tooltip: {
              container: {
                color: "#000",
              },
            },
          }}
          colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }}
          margin={{ top: 50, right: 70, bottom: 70, left: 30 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: true,
            reverse: false,
          }}
          yFormat=" >-.2f"
          curve="catmullRom"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            legend: isDashboard ? undefined : "transportation",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            orient: "left",
            tickValues: 5,
            tickSize: 3,
            tickPadding: 5,
            tickRotation: 0,
            legend: isDashboard ? undefined : "count",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          enableGridX={false}
          enableGridY={false}
          pointSize={8}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </Box>
    );
  }
);
MemoizedLineChart.displayName = "MemoizedLineChart";

export default MemoizedLineChart;
