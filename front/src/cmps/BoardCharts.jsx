import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

export function BoardCharts({label ,data , dataKey1 , dataKey2}) {
  return (
    <BarChart

    width={500}
    height={400}
    data={data}
    margin={{
    top: 20,
    right: 30,
    left: 20,
    bottom: 5 ,
    }}
    style={
        {background : "transparent"}}
    >
      {/* <CartesianGrid strokeDasharray="3 3" /> */}
      <XAxis dataKey="name" />
      <YAxis tick={{ fill: '#666666' }} />
      <Tooltip />
      <Legend />
      <Bar dataKey={dataKey1} stackId="a" fill="#FF3C41" />
      <Bar dataKey={dataKey2} stackId="a" fill="#59CF6D" />
    </BarChart>
  );
}
