"use client";

import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import DefaultCard from "@/components/card/default-card";
import { DatePickerWithRange } from "@/components/date-picker/date-rage-picker";

export const description = "A pie chart with a legend";

const chartData = [
  {
    id: "produk-a",
    product: "Produk A",
    penggunaan: 45,
    fill: "var(--color-produk-a)",
  },
  {
    id: "produk-b",
    product: "Produk B",
    penggunaan: 38,
    fill: "var(--color-produk-b)",
  },
  {
    id: "produk-c",
    product: "Produk C",
    penggunaan: 32,
    fill: "var(--color-produk-c)",
  },
  {
    id: "produk-d",
    product: "Produk D",
    penggunaan: 28,
    fill: "var(--color-produk-d)",
  },
  {
    id: "produk-e",
    product: "Produk E",
    penggunaan: 22,
    fill: "var(--color-produk-e)",
  },
];

const chartConfig = {
  penggunaan: {
    label: "Penggunaan",
  },
  "produk-a": {
    label: "Produk A",
    color: "var(--chart-1)",
  },
  "produk-b": {
    label: "Produk B",
    color: "var(--chart-2)",
  },
  "produk-c": {
    label: "Produk C",
    color: "var(--chart-3)",
  },
  "produk-d": {
    label: "Produk D",
    color: "var(--chart-4)",
  },
  "produk-e": {
    label: "Produk E",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function ChartPie() {
  const handleDateRangeChange = (
    startDate?: Date | null,
    endDate?: Date | null,
  ) => {
    console.log("Selected date range:", { startDate, endDate });
  };
  return (
    <DefaultCard>
      <div className="flex items-center gap-2 mb-4">
        <h1 className="font-semibold">Pie Chart - Penggunaan Produk</h1>
        <div className="ml-auto">
          <DatePickerWithRange
            placeholder="Pilih rentang tanggal"
            onValueChange={handleDateRangeChange}
            hideLabel
          />
        </div>
      </div>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="penggunaan"
              nameKey="id"
              innerRadius={60}
              strokeWidth={5}
              label
              labelLine={false}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          165
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Berkurang
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="id" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </DefaultCard>
  );
}
